/**
 * AI Hallucination Firewall — Type Definitions
 * Strict types for pre-execution validation, decision objects, audit trails, and dashboard views.
 */

export type FirewallStatus = "APPROVED" | "BLOCKED" | "NEEDS_CLARIFICATION";

export type FirewallStageType =
  | "JSON_PARSER"
  | "SCHEMA_VALIDATION"
  | "SQL_DETECTION"
  | "PROMPT_INJECTION"
  | "METRIC_VALIDATION"
  | "DIMENSION_VALIDATION"
  | "MEASURE_VALIDATION"
  | "TIME_VALIDATION"
  | "FILTER_VALIDATION"
  | "COMPLEXITY_PROTECTION"
  | "FORMULA_VALIDATION"
  | "DATA_SOURCE_VALIDATION"
  | "PERMISSION_VALIDATION"
  | "VERSION_VALIDATION"
  | "SEMANTIC_RULE_VALIDATION"
  | "QUERY_SAFETY";

export interface FirewallStageResult {
  id: string;
  name: string;
  display_name: string;
  status: "PASSED" | "BLOCKED" | "WARNING" | "SKIPPED";
  latency_ms: number;
  details: string;
  error_message?: string;
}

export interface FirewallBlockedCard {
  title: string;
  target: string;
  reason: string;
  explanation: string;
  available_alternatives?: string[];
  cube_status: "NOT SENT" | "SENT";
  validation_stage: string;
}

export interface FirewallDecision {
  request_id: string;
  timestamp: string;
  user_role: string;
  original_question: string;
  status: FirewallStatus;
  reason?: string;
  failed_stage?: string;
  validation_stage?: string;
  cube_request_sent: boolean;
  sql_detected: boolean;
  semantic_valid: boolean;
  user_authorized: boolean;
  resolved_metric?: string;
  resolved_dimensions?: string[];
  stages: FirewallStageResult[];
  blocked_card?: FirewallBlockedCard;
  semantic_json?: any;
  cube_payload?: any;
}

export interface FirewallKPIs {
  requests_today: number;
  approved: number;
  blocked: number;
  sql_attempts_blocked: number;
  unknown_metrics_blocked: number;
  permission_violations: number;
  system_status: "PROTECTED" | "DEGRADED" | "OFFLINE";
  semantic_layer_status: "CONNECTED" | "DISCONNECTED";
  cube_api_status: "CONNECTED" | "DISCONNECTED";
}

export interface FirewallAuditLogEntry {
  request_id: string;
  timestamp: string;
  user: string;
  user_role: string;
  question: string;
  resolved_metric: string;
  resolved_dimensions: string[];
  firewall_status: "PASSED" | "BLOCKED";
  validation_errors: string[];
  sql_detected: "NONE" | "DETECTED";
  permission_check: "PASSED" | "VIOLATION";
  semantic_version: string;
  cube_request_sent: "SENT" | "NOT CALLED";
  failed_stage?: string;
  duration_ms: number;
}

export interface FirewallTestCase {
  id: string;
  test_number: number;
  title: string;
  input: string;
  expected_status: "APPROVED" | "BLOCKED";
  expected_reason?: string;
  category:
    | "Golden Path"
    | "Unknown Metric"
    | "Raw SQL Injection"
    | "Prompt Injection"
    | "RBAC Permission"
    | "Unknown Dimension"
    | "Custom Formula"
    | "Filter Validation";
  description: string;
}
