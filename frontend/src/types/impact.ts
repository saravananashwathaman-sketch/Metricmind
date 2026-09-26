import { z } from "zod";

export type ChangeType =
  | "formula_change"
  | "filter_change"
  | "dimension_change"
  | "data_source_change"
  | "business_rule_change"
  | "time_logic_change";

export type ImpactLevel = "LOW" | "MEDIUM" | "HIGH";

export type AssetType =
  | "dashboard"
  | "report"
  | "saved_insight"
  | "query"
  | "dependent_metric"
  | "alert"
  | "api_consumer";

export interface GovernedMeasure {
  id: string;
  name: string;
  display_name: string;
  table: string;
  column: string;
  description: string;
  category: string;
  status: "approved" | "deprecated" | "draft";
}

export interface MetricImpactMetadata {
  id: string;
  name: string;
  display_name: string;
  owner: string;
  owner_role: string;
  current_version: string;
  status: "Verified" | "Under Review" | "Draft" | "Deprecated";
  formula: string;
  formula_display: string;
  formula_sql: string;
  category: string;
  unit: "percentage" | "currency" | "count" | "ratio";
  currency?: string;
  current_value: number;
  dependencies_count: number;
  dependent_metrics_count: number;
  components: {
    revenue?: number;
    cost?: number;
    logistics_cost?: number;
    operating_expenses?: number;
    customers?: number;
    churned_customers?: number;
    orders?: number;
  };
}

export interface ValidationCheckItem {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "success";
}

export interface GovernanceValidationResult {
  is_valid: boolean;
  blocked: boolean;
  block_reason?: string;
  unknown_measures: string[];
  unknown_dimensions: string[];
  checks: ValidationCheckItem[];
  timestamp: string;
}

export interface AffectedAssetItem {
  id: string;
  name: string;
  type: AssetType;
  owner: string;
  owner_role?: string;
  impact_reason: string;
  last_updated: string;
  widgets_count?: number;
  widgets?: string[];
  sections?: string[];
  query_sql?: string;
  execution_frequency?: string;
  severity: "high" | "medium" | "low";
}

export interface DependentMetricImpact {
  id: string;
  name: string;
  current_formula: string;
  proposed_formula: string;
  current_value: number;
  simulated_value: number;
  difference: number;
  unit: string;
  impact_path: string;
}

export interface ImpactAssessment {
  score: number; // 0 - 100
  level: ImpactLevel;
  total_affected_assets: number;
  dashboards_count: number;
  reports_count: number;
  saved_insights_count: number;
  queries_count: number;
  dependent_metrics_count: number;
  alerts_count: number;
  api_consumers_count: number;
  methodology: string;
  calculation_explanation: string[];
}

export interface WhatIfScenarioItem {
  id: string;
  name: string;
  description: string;
  parameter: string;
  parameter_delta: string;
  current_value: number;
  simulated_value: number;
  difference_pp: number;
  is_active: boolean;
}

export interface SimulationResult {
  simulation_id: string;
  metric_id: string;
  metric_name: string;
  current_version: string;
  proposed_version: string;
  change_type: ChangeType;
  current_definition: {
    formula: string;
    filters?: string;
    dimension?: string;
    data_source?: string;
  };
  proposed_definition: {
    formula: string;
    filters?: string;
    dimension?: string;
    data_source?: string;
  };
  scope: {
    region: string;
    period: string;
  };
  current_value: number;
  simulated_value: number;
  difference: number;
  difference_pp: number;
  unit: string;
  simulation_only: boolean;
  is_demo_mode: boolean;
  created_at: string;
  created_by: string;
  status: "DRAFT_SIMULATION" | "UNDER_REVIEW" | "APPROVED" | "BLOCKED";
  validation: GovernanceValidationResult;
  impact_assessment: ImpactAssessment;
  dependent_metrics: DependentMetricImpact[];
  affected_assets: AffectedAssetItem[];
  scenarios: WhatIfScenarioItem[];
  dependency_graph: {
    nodes: Array<{
      id: string;
      name: string;
      category: "metric" | "dashboard" | "report" | "insight" | "query" | "widget";
      level: number;
      impact: "direct" | "indirect" | "none";
      details: string;
    }>;
    links: Array<{
      source: string;
      target: string;
      label?: string;
    }>;
  };
}

export interface SimulationAuditRecord {
  simulation_id: string;
  metric_id: string;
  metric_name: string;
  current_version: string;
  proposed_version: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  change_type: ChangeType;
  current_formula: string;
  proposed_formula: string;
  current_value: number;
  simulated_value: number;
  difference_pp: number;
  affected_assets_count: number;
  validation_status: "PASSED" | "FAILED" | "BLOCKED";
  status: "Simulation Only" | "Under Review" | "Approved";
}

// Zod schema for AI Agent strict JSON contract (Section 20)
export const StrictSimulationContractSchema = z.object({
  metric: z.string().min(1, "Metric identifier is required"),
  change_type: z.enum([
    "formula_change",
    "filter_change",
    "dimension_change",
    "data_source_change",
    "business_rule_change",
    "time_logic_change"
  ]),
  current_definition: z.object({
    formula: z.string().min(1, "Current formula is required")
  }),
  proposed_definition: z.object({
    formula: z.string().min(1, "Proposed formula is required")
  }),
  simulation_scope: z
    .object({
      region: z.string().optional(),
      period: z.string().optional()
    })
    .optional()
});

export type StrictSimulationContract = z.infer<typeof StrictSimulationContractSchema>;
