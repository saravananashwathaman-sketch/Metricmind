import { z } from "zod";

/**
 * Governed Metric Definitions in MetricMind Semantic Layer
 */
export interface GovernedMeasure {
  name: string;
  technical_name: string;
  display_name: string;
  description: string;
  formula: string;
  aggregation: "sum" | "count_distinct" | "calculated" | "ratio";
  unit: "currency" | "percentage" | "count";
  data_source: string;
  dbt_model: string;
  available_dimensions: string[];
  time_dimensions: string[];
  owner: string;
  status: "Verified" | "Draft" | "Under Review";
  version: string;
  last_updated: string;
}

export interface GovernedDimension {
  name: string;
  display_name: string;
  cube: string;
  type: "categorical" | "temporal" | "geo";
  description: string;
  sample_values: string[];
}

export const APPROVED_MEASURES: GovernedMeasure[] = [
  {
    name: "revenue",
    technical_name: "Sales.revenue",
    display_name: "Revenue",
    description: "Total recognized sales revenue across all completed commercial transactions",
    formula: "SUM(revenue)",
    aggregation: "sum",
    unit: "currency",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    available_dimensions: ["region", "country", "city", "product", "product_category", "customer_segment", "sales_channel"],
    time_dimensions: ["date", "month", "quarter", "year", "fiscal_quarter"],
    owner: "Priya Sharma (VP Strategic Finance)",
    status: "Verified",
    version: "2.4.0",
    last_updated: "2026-09-15"
  },
  {
    name: "cost",
    technical_name: "Sales.cost",
    display_name: "Cost (COGS)",
    description: "Total Cost of Goods Sold including direct manufacturing, logistics, and data infrastructure delivery",
    formula: "SUM(cost)",
    aggregation: "sum",
    unit: "currency",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    available_dimensions: ["region", "country", "city", "product", "product_category", "customer_segment", "sales_channel"],
    time_dimensions: ["date", "month", "quarter", "year", "fiscal_quarter"],
    owner: "Anand Verma (Director Financial Ops)",
    status: "Verified",
    version: "2.1.0",
    last_updated: "2026-09-12"
  },
  {
    name: "gross_profit",
    technical_name: "Sales.gross_profit",
    display_name: "Gross Profit",
    description: "Total recognized sales revenue minus direct Cost of Goods Sold",
    formula: "Revenue - Cost",
    aggregation: "calculated",
    unit: "currency",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    available_dimensions: ["region", "country", "product_category", "customer_segment"],
    time_dimensions: ["date", "month", "quarter", "year", "fiscal_quarter"],
    owner: "Priya Sharma (VP Strategic Finance)",
    status: "Verified",
    version: "2.4.0",
    last_updated: "2026-09-15"
  },
  {
    name: "gross_margin",
    technical_name: "Sales.gross_margin",
    display_name: "Gross Margin %",
    description: "Gross Profit expressed as a percentage of Total Revenue: ((Revenue - Cost) / Revenue) * 100",
    formula: "((Revenue - Cost) / Revenue) * 100",
    aggregation: "ratio",
    unit: "percentage",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    available_dimensions: ["region", "country", "city", "product", "product_category", "customer_segment"],
    time_dimensions: ["date", "month", "quarter", "year", "fiscal_quarter"],
    owner: "Priya Sharma (VP Strategic Finance)",
    status: "Verified",
    version: "3.0.1",
    last_updated: "2026-09-18"
  },
  {
    name: "order_count",
    technical_name: "Sales.order_count",
    display_name: "Order Count",
    description: "Total count of unique fulfilled commercial orders",
    formula: "COUNT(order_id)",
    aggregation: "count_distinct",
    unit: "count",
    data_source: "fct_orders",
    dbt_model: "marts.sales.fct_orders",
    available_dimensions: ["region", "country", "customer_segment", "product_category"],
    time_dimensions: ["date", "month", "quarter", "year"],
    owner: "Rohan Mehta (Lead Data Engineer)",
    status: "Verified",
    version: "1.5.0",
    last_updated: "2026-08-30"
  },
  {
    name: "average_order_value",
    technical_name: "Sales.average_order_value",
    display_name: "Average Order Value (AOV)",
    description: "Average invoiced monetary value per commercial customer order fulfilled",
    formula: "Revenue / Order Count",
    aggregation: "ratio",
    unit: "currency",
    data_source: "fct_sales, fct_orders",
    dbt_model: "marts.sales.fct_orders",
    available_dimensions: ["region", "country", "product_category", "customer_segment"],
    time_dimensions: ["date", "month", "quarter", "year"],
    owner: "Rohan Mehta (Lead Data Engineer)",
    status: "Verified",
    version: "1.5.0",
    last_updated: "2026-08-30"
  }
];

export const APPROVED_DIMENSIONS: GovernedDimension[] = [
  {
    name: "region",
    display_name: "Region",
    cube: "Geography",
    type: "geo",
    description: "Operating theater (Europe, North America, India, APAC)",
    sample_values: ["Europe", "North America", "India", "APAC"]
  },
  {
    name: "country",
    display_name: "Country",
    cube: "Geography",
    type: "geo",
    description: "Operating nation/jurisdiction",
    sample_values: ["Germany", "United Kingdom", "France", "Spain", "India", "USA", "Singapore"]
  },
  {
    name: "city",
    display_name: "City",
    cube: "Geography",
    type: "geo",
    description: "Metropolitan operating hub",
    sample_values: ["London", "Berlin", "Paris", "Bengaluru", "San Francisco", "Singapore"]
  },
  {
    name: "product",
    display_name: "Product",
    cube: "Sales",
    type: "categorical",
    description: "Product commercial SKU or offering name",
    sample_values: ["Analytics Pro", "Semantic Cloud", "Enterprise BI Hub", "Data Core"]
  },
  {
    name: "product_category",
    display_name: "Product Category",
    cube: "Sales",
    type: "categorical",
    description: "High level taxonomy classification",
    sample_values: ["Enterprise SaaS", "Cloud Infrastructure", "Edge Compute", "Security Suite"]
  },
  {
    name: "customer_segment",
    display_name: "Customer Segment",
    cube: "Customers",
    type: "categorical",
    description: "Customer scale tier based on ARR",
    sample_values: ["Enterprise", "Mid-Market", "SMB"]
  },
  {
    name: "sales_channel",
    display_name: "Sales Channel",
    cube: "Sales",
    type: "categorical",
    description: "Go-to-market distribution channel",
    sample_values: ["Direct Enterprise", "Partner Network", "Self-Serve Digital"]
  }
];

export const APPROVED_TIME_DIMENSIONS = [
  "date",
  "month",
  "quarter",
  "year",
  "fiscal_quarter"
] as const;

export const APPROVED_GRANULARITIES = [
  "day",
  "week",
  "month",
  "quarter",
  "year"
] as const;

/**
 * Strict JSON Contract Schema for AI Agent Queries
 */
export const FilterConditionSchema = z.object({
  member: z.string().min(1, "Filter member must be non-empty"),
  operator: z.enum([
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "gt",
    "gte",
    "lt",
    "lte",
    "set",
    "notSet",
    "inDateRange"
  ]),
  values: z.array(z.union([z.string(), z.number(), z.boolean()]))
});

export const OrderConditionSchema = z.object({
  member: z.string(),
  direction: z.enum(["asc", "desc"]).default("desc")
});

export const SemanticQueryPayloadSchema = z.object({
  measures: z
    .array(z.string())
    .min(1, "At least one governed measure must be selected")
    .refine(
      (mList) => mList.every((m) => APPROVED_MEASURES.some((am) => am.name === m || am.technical_name === m)),
      {
        message: "One or more measures are not in the approved semantic catalog. Never invent metrics."
      }
    ),
  dimensions: z
    .array(z.string())
    .default([])
    .refine(
      (dList) => dList.every((d) => APPROVED_DIMENSIONS.some((ad) => ad.name === d || `${ad.cube}.${ad.name}` === d)),
      {
        message: "One or more dimensions are not in the approved semantic catalog. Never invent dimensions."
      }
    ),
  time_dimension: z.enum(["date", "month", "quarter", "year", "fiscal_quarter", "Date.date", "Date.quarter", "Date.month"]).optional(),
  time_granularity: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
  time_range: z.union([z.string(), z.tuple([z.string(), z.string()])]).optional(),
  filters: z.array(FilterConditionSchema).default([]),
  order: z.array(OrderConditionSchema).default([]),
  limit: z.number().int().positive().max(1000).default(100)
});

export type SemanticQueryPayload = z.infer<typeof SemanticQueryPayloadSchema>;

/**
 * Schema exposed to AI agent via GET /api/semantic/schema
 */
export function getSemanticSchema() {
  return {
    schema_version: "2.5.0",
    engine: "Cube.dev Semantic Layer",
    governance_status: "ENFORCED",
    rules: [
      "The LLM must NEVER directly generate SQL.",
      "The LLM must only select approved measures, dimensions, time dimensions, filters, and granularities.",
      "Never invent metrics or formulas."
    ],
    measures: APPROVED_MEASURES.map((m) => ({
      name: m.name,
      technical_name: m.technical_name,
      display_name: m.display_name,
      description: m.description,
      formula: m.formula,
      unit: m.unit,
      owner: m.owner,
      version: m.version,
      status: m.status
    })),
    dimensions: APPROVED_DIMENSIONS.map((d) => ({
      name: d.name,
      display_name: d.display_name,
      type: d.type,
      description: d.description,
      sample_values: d.sample_values
    })),
    time_dimensions: APPROVED_TIME_DIMENSIONS,
    time_granularities: APPROVED_GRANULARITIES
  };
}

/**
 * SQL Hallucination Detector
 * Checks whether LLM generated raw SQL instead of structured semantic JSON
 */
export function detectSqlHallucination(input: string): {
  isHallucinatingSql: boolean;
  detectedKeywords: string[];
  explanation: string;
} {
  const sqlPatterns = [
    /\bSELECT\b/i,
    /\bFROM\b/i,
    /\bWHERE\b/i,
    /\bJOIN\b/i,
    /\bGROUP\s+BY\b/i,
    /\bORDER\s+BY\b/i,
    /\bINSERT\s+INTO\b/i,
    /\bUPDATE\b/i,
    /\bDELETE\b/i,
    /\bDROP\s+TABLE\b/i,
    /\bUNION\s+ALL\b/i
  ];

  const detected: string[] = [];
  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      detected.push(pattern.source.replace(/\\b|\\s\+/g, " ").trim());
    }
  }

  // If input contains 2 or more major SQL clauses outside of a code comment/metadata
  const isHallucinatingSql = detected.length >= 2;

  return {
    isHallucinatingSql,
    detectedKeywords: detected,
    explanation: isHallucinatingSql
      ? `SQL HALLUCINATION DETECTED: The agent produced raw SQL keywords (${detected.join(", ")}). Direct SQL is prohibited; only strict semantic JSON is permitted.`
      : "SQL BYPASS: PASSED. Zero raw SQL generated by LLM."
  };
}
