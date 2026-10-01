import { GovernanceAuditRecord, QueryBudgetInfo } from "@/types";

/**
 * Cost Governance Configuration
 * Configurable via environment variables with safe defaults.
 */
export const GOVERNANCE_CONFIG = {
  MAX_AGENT_STEPS: parseInt(process.env.MAX_AGENT_STEPS || "5", 10),
  MAX_QUERIES_PER_REQUEST: parseInt(process.env.MAX_QUERIES_PER_REQUEST || "5", 10),
  DEFAULT_RESULT_LIMIT: 100,
  MAX_RESULT_ROWS: parseInt(process.env.MAX_RESULT_ROWS || "1000", 10),
  MAX_DIMENSIONS: parseInt(process.env.MAX_DIMENSIONS || "5", 10),
  MAX_MEASURES: parseInt(process.env.MAX_MEASURES || "10", 10),
  MAX_FILTERS: parseInt(process.env.MAX_FILTERS || "10", 10),
  MAX_TIME_RANGE_DAYS: parseInt(process.env.MAX_TIME_RANGE_DAYS || "1095", 10), // 3 years
  MAX_QUERY_TIMEOUT_MS: parseInt(process.env.MAX_QUERY_TIMEOUT_MS || "10000", 10) // 10 seconds
};

export interface QueryComplexityCheck {
  allowed: boolean;
  reason?: string;
  complexityScore: number;
  complexityLabel: "Low" | "Medium" | "High";
}

/**
 * Evaluates whether a semantic query is within safe computational bounds.
 * Prevents runaway exploratory queries, Cartesian products, and unbounded raw table scans.
 */
export function validateQueryComplexity(query: {
  measures?: string[];
  dimensions?: string[];
  filters?: any[];
  limit?: number;
  time_range?: string;
  question?: string;
}): QueryComplexityCheck {
  const measuresCount = query.measures?.length || 0;
  const dimensionsCount = query.dimensions?.length || 0;
  const filtersCount = query.filters?.length || 0;
  const requestedLimit = query.limit || GOVERNANCE_CONFIG.DEFAULT_RESULT_LIMIT;
  const qLower = (query.question || "").toLowerCase();

  // 1. Check for raw transaction dump request
  const isRawDumpRequest =
    (qLower.includes("every transaction") ||
      qLower.includes("all transactions") ||
      qLower.includes("raw transactions") ||
      qLower.includes("all order items") ||
      qLower.includes("every record")) &&
    (qLower.includes("year") || qLower.includes("20") || qLower.includes("history") || qLower.includes("all time"));

  if (isRawDumpRequest) {
    return {
      allowed: false,
      reason:
        "That request exceeds the permitted analytical range. Please narrow the time period or use an aggregated metric.",
      complexityScore: 100,
      complexityLabel: "High"
    };
  }

  // 2. Check Result Limit override
  if (requestedLimit > GOVERNANCE_CONFIG.MAX_RESULT_ROWS) {
    return {
      allowed: false,
      reason: `Requested query exceeds the maximum allowed result size (${GOVERNANCE_CONFIG.MAX_RESULT_ROWS} rows).`,
      complexityScore: 85,
      complexityLabel: "High"
    };
  }

  // 3. Check Measures Limit
  if (measuresCount > GOVERNANCE_CONFIG.MAX_MEASURES) {
    return {
      allowed: false,
      reason: `Query requested ${measuresCount} measures, which exceeds the governed limit of ${GOVERNANCE_CONFIG.MAX_MEASURES}.`,
      complexityScore: 90,
      complexityLabel: "High"
    };
  }

  // 4. Check Dimensions Limit
  if (dimensionsCount > GOVERNANCE_CONFIG.MAX_DIMENSIONS) {
    return {
      allowed: false,
      reason: `Query requested ${dimensionsCount} dimensions, which exceeds the governed limit of ${GOVERNANCE_CONFIG.MAX_DIMENSIONS}.`,
      complexityScore: 80,
      complexityLabel: "High"
    };
  }

  // 5. Check Filters Limit
  if (filtersCount > GOVERNANCE_CONFIG.MAX_FILTERS) {
    return {
      allowed: false,
      reason: `Query contains ${filtersCount} filter conditions, exceeding the limit of ${GOVERNANCE_CONFIG.MAX_FILTERS}.`,
      complexityScore: 75,
      complexityLabel: "Medium"
    };
  }

  // 6. Check Time Range Span (e.g. 10 years, 20 years, 2010 to 2026)
  if (
    qLower.includes("last 20 years") ||
    qLower.includes("past 20 years") ||
    qLower.includes("last 10 years") ||
    qLower.includes("past 10 years") ||
    (qLower.includes("2010") && qLower.includes("2026"))
  ) {
    return {
      allowed: false,
      reason:
        "That request exceeds the permitted analytical range. Please narrow the time period or use an aggregated metric.",
      complexityScore: 95,
      complexityLabel: "High"
    };
  }

  // Compute Complexity Score
  const score = measuresCount * 4 + dimensionsCount * 8 + filtersCount * 2 + (requestedLimit > 500 ? 20 : 5);
  const label: "Low" | "Medium" | "High" = score > 45 ? "High" : score > 20 ? "Medium" : "Low";

  return {
    allowed: true,
    complexityScore: score,
    complexityLabel: label
  };
}

/**
 * Budget Tracker for Query Allocation per Request
 */
export class QueryBudgetTracker {
  private count = 0;
  private limit: number;

  constructor(customLimit?: number) {
    this.limit = customLimit || GOVERNANCE_CONFIG.MAX_QUERIES_PER_REQUEST;
  }

  public getBudgetInfo(): QueryBudgetInfo {
    const remaining = Math.max(0, this.limit - this.count);
    return {
      count: this.count,
      limit: this.limit,
      remaining,
      status: this.count <= this.limit ? "approved" : "exceeded"
    };
  }

  public canExecuteQuery(): boolean {
    return this.count < this.limit;
  }

  public recordQuery(): number {
    if (this.count >= this.limit) {
      throw new Error(`QUERY BUDGET EXCEEDED: Maximum allowed queries per request (${this.limit}) reached.`);
    }
    this.count += 1;
    return this.count;
  }

  public get executedCount(): number {
    return this.count;
  }
}

/**
 * In-Memory Query Cache with Normalized Hashes
 */
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export function generateNormalizedQueryHash(query: any): string {
  const normalized = {
    measures: [...(query.measures || [])].sort(),
    dimensions: [...(query.dimensions || [])].sort(),
    filters: [...(query.filters || [])].sort((a, b) =>
      String(a.member || a.dimension).localeCompare(String(b.member || b.dimension))
    ),
    time_dimension: query.time_dimension || query.timeDimensions?.[0]?.dimension || null,
    time_range: query.time_range || query.timeDimensions?.[0]?.dateRange || null
  };
  const jsonStr = JSON.stringify(normalized);
  let hash = 0;
  for (let i = 0; i < jsonStr.length; i++) {
    hash = (hash << 5) - hash + jsonStr.charCodeAt(i);
    hash |= 0;
  }
  return `QHASH_${Math.abs(hash).toString(16).toUpperCase()}`;
}

export function getCachedQueryResult(hash: string): any | null {
  const item = queryCache.get(hash);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    queryCache.delete(hash);
    return null;
  }
  return item.data;
}

export function setCachedQueryResult(hash: string, data: any): void {
  queryCache.set(hash, { data, timestamp: Date.now() });
}

/**
 * Audit Trail Log In-Memory Store
 */
const auditLogs: GovernanceAuditRecord[] = [];

export function recordGovernanceAudit(record: GovernanceAuditRecord): void {
  auditLogs.unshift(record);
  if (auditLogs.length > 100) {
    auditLogs.pop();
  }
}

export function getGovernanceAuditLogs(): GovernanceAuditRecord[] {
  return [...auditLogs];
}
