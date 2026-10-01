import { ApiCallInfo, SqlExecutionInfo, GovernanceAuditRecord } from "@/types";

export interface PipelineStepTrace {
  step: string;
  status: "passed" | "blocked" | "completed" | "skipped";
  detail: string;
  timestamp: string;
}

export interface TransparencyReport {
  userQuestion: string;
  resolvedIntent: string;
  semanticJson: any;
  firewallStatus: "PASSED" | "BLOCKED";
  firewallStagesCount: number;
  costGovernanceStatus: "APPROVED" | "BLOCKED";
  queryComplexity: "Low" | "Medium" | "High";
  queryBudget: { count: number; limit: number; remaining: number };
  apiCall: ApiCallInfo;
  sqlInfo: SqlExecutionInfo;
  rawResponseSummary: {
    recordCount: number;
    signature: string;
    source: string;
  };
  normalizedResult: any;
  visualizationType: string;
  pipelineTrace: PipelineStepTrace[];
  cached?: boolean;
}

export class TransparencyService {
  public buildReport(params: {
    userQuestion: string;
    resolvedIntent: string;
    semanticJson: any;
    firewallStatus: "PASSED" | "BLOCKED";
    firewallStagesCount?: number;
    costGovernanceStatus: "APPROVED" | "BLOCKED";
    queryComplexity: "Low" | "Medium" | "High";
    queryBudget: { count: number; limit: number; remaining: number };
    apiCall: ApiCallInfo;
    sqlInfo: SqlExecutionInfo;
    normalizedResult: any;
    visualizationType: string;
    cached?: boolean;
  }): TransparencyReport {
    const now = new Date().toISOString();
    const pipelineTrace: PipelineStepTrace[] = [
      {
        step: "User Question",
        status: "completed",
        detail: `Received question: "${params.userQuestion.slice(0, 70)}"`,
        timestamp: now
      },
      {
        step: "Resolved Intent",
        status: "completed",
        detail: params.resolvedIntent,
        timestamp: now
      },
      {
        step: "AI Hallucination Firewall",
        status: params.firewallStatus === "PASSED" ? "passed" : "blocked",
        detail:
          params.firewallStatus === "PASSED"
            ? `Verified allowlist & schema constraints across ${params.firewallStagesCount || 16} checks`
            : "Blocked before Cube query execution",
        timestamp: now
      },
      {
        step: "Cost Governance & Budget",
        status: params.costGovernanceStatus === "APPROVED" ? "passed" : "blocked",
        detail: `Complexity: ${params.queryComplexity} | Budget: ${params.queryBudget.count}/${params.queryBudget.limit}`,
        timestamp: now
      },
      {
        step: "Semantic JSON Contract",
        status: "completed",
        detail: `Measures: [${(params.semanticJson?.measures || []).join(", ")}]`,
        timestamp: now
      },
      {
        step: "Cube REST API Request",
        status: params.apiCall.status_code === 200 ? "completed" : "blocked",
        detail: `${params.apiCall.endpoint} (${params.apiCall.execution_time_ms}ms, ${params.apiCall.result_rows} rows)`,
        timestamp: now
      },
      {
        step: "SQL / Provider Query",
        status: params.sqlInfo.available ? "completed" : "skipped",
        detail: params.sqlInfo.message || "SQL executed inside semantic layer engine",
        timestamp: now
      },
      {
        step: "Dynamic Visualization",
        status: "completed",
        detail: `Selected '${params.visualizationType}' chart based on dimensional grain`,
        timestamp: now
      }
    ];

    return {
      userQuestion: params.userQuestion,
      resolvedIntent: params.resolvedIntent,
      semanticJson: params.semanticJson,
      firewallStatus: params.firewallStatus,
      firewallStagesCount: params.firewallStagesCount || 16,
      costGovernanceStatus: params.costGovernanceStatus,
      queryComplexity: params.queryComplexity,
      queryBudget: params.queryBudget,
      apiCall: params.apiCall,
      sqlInfo: params.sqlInfo,
      rawResponseSummary: {
        recordCount: params.apiCall.result_rows,
        signature: `SIG-SEMANTIC-${Date.now().toString(36).toUpperCase()}`,
        source: "Cube Semantic Layer"
      },
      normalizedResult: params.normalizedResult,
      visualizationType: params.visualizationType,
      pipelineTrace,
      cached: params.cached
    };
  }
}

export const transparencyService = new TransparencyService();
