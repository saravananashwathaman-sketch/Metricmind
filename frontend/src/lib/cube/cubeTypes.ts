/**
 * Cube.dev Semantic Layer Integration Types
 * Defines the strict, governed schema for queries, responses, and validation.
 */

export interface CubeTimeDimension {
  dimension: string;
  granularity?: "second" | "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year";
  dateRange?: string | [string, string];
}

export interface CubeFilter {
  member: string;
  operator:
    | "equals"
    | "notEquals"
    | "contains"
    | "notContains"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "set"
    | "notSet"
    | "inDateRange"
    | "beforeDate"
    | "afterDate";
  values: (string | number)[];
}

export type CubeOrderDirection = "asc" | "desc";

export interface CubeQueryPayload {
  measures: string[];
  dimensions?: string[];
  timeDimensions?: CubeTimeDimension[];
  filters?: CubeFilter[];
  segments?: string[];
  order?: Record<string, CubeOrderDirection> | Array<[string, CubeOrderDirection]>;
  limit?: number;
  offset?: number;
  renewQuery?: boolean;
}

export interface CubeApiResponse<T = any> {
  query?: CubeQueryPayload;
  data: T[];
  lastRefreshTime?: string;
  annotation?: {
    measures?: Record<string, { title: string; type: string; format?: string }>;
    dimensions?: Record<string, { title: string; type: string }>;
    segments?: Record<string, { title: string }>;
    timeDimensions?: Record<string, { title: string; type: string }>;
  };
  slowQuery?: boolean;
}

export interface CubeExecutionMetadata {
  source: "Cube.dev Live REST API" | "Cube Semantic Layer (Governed Adapter)" | "Cube connection not configured";
  status: "EXECUTED" | "BLOCKED" | "FAILED";
  endpoint: string;
  execution_time_ms: number;
  result_rows: number;
  governed_model: string;
  governed_signature: string;
  timestamp: string;
  sql_generated_by_llm: "NONE (Governed in Semantic Layer)";
  sql_source?: string;
  sanitized_payload: CubeQueryPayload;
}

export interface CubeNormalizedResult<T = any> {
  success: boolean;
  metric: string;
  dimensions: string[];
  filters: Record<string, any>;
  data: T[];
  metadata: CubeExecutionMetadata;
  error?: string;
}

export interface CubeValidationResult {
  valid: boolean;
  error?: string;
  firewall_status: "PASSED" | "BLOCKED";
  validated_measures: string[];
  validated_dimensions: string[];
  validated_filters: string[];
  violation_stage?: "MEASURE_FIREWALL" | "DIMENSION_FIREWALL" | "OPERATOR_FIREWALL" | "STRUCTURE_VALIDATION";
}

export interface CubeConnectionStatus {
  connected: boolean;
  mode: "cube_live" | "development_adapter";
  url: string;
  hasToken: boolean;
  statusText: string;
  message: string;
}

export interface MetricMindSemanticQueryResponse {
  question: string;
  intent: string;
  metric: string;
  metricDisplayName: string;
  dimensions: string[];
  timeRange?: string;
  semanticQuery: CubeQueryPayload;
  validation: {
    valid: boolean;
    error?: string;
    firewall: "passed" | "blocked";
    governed_signature: string;
  };
  source: string;
  data: any[];
  explanation: string;
  execution_time_ms: number;
  governance: {
    firewall: "passed" | "blocked";
    semantic_validation: "passed" | "blocked";
    source: string;
    status: string;
  };
}
