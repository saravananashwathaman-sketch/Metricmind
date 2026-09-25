/**
 * METRICMIND TIME MACHINE — TYPE DEFINITIONS
 * "Never lose the history behind a number."
 */

export interface MetricVersion {
  version: string;
  effective_date: string;
  deprecated_date?: string;
  formula: string;
  formula_display: string;
  formula_sql: string;
  owner: string;
  owner_role: string;
  status: "Verified" | "Under Review" | "Deprecated";
  change_reason: string;
  impact_summary: string;
  impact_pp?: number;
  previous_version?: string;
  affected_dashboards: number;
  affected_reports: number;
  affected_saved_insights: number;
}

export interface CalculationComponent {
  name: string;
  key: string;
  value: number;
  formatted_value: string;
  unit: string;
  source_table: string;
  description: string;
}

export interface CalculationStep {
  step_number: number;
  title: string;
  operation: string; // e.g. "Revenue - Cost = Gross Profit"
  left_operand: string;
  left_val: string;
  operator: "-" | "+" | "/" | "*" | "=";
  right_operand?: string;
  right_val?: string;
  result_name: string;
  result_val: string;
  explanation: string;
}

export interface DataSnapshotMetadata {
  id: string; // e.g. "SNAP-2026-Q3-EU-001"
  data_version: string; // "2026.09"
  period: string; // "Q3 2026"
  region: string; // "Europe"
  countries: string[];
  rows_included: number;
  last_updated: string;
  warehouse_source: string;
  is_demo_mode: boolean;
  table_partitions: string[];
  checksum: string;
}

export interface DimensionBreakdownItem {
  name: string;
  value: number;
  formatted_value: string;
  percentage_of_total: number;
  change_pp?: number;
  children?: DimensionBreakdownItem[];
}

export interface TimeMachineLineageNode {
  id: string;
  label: string;
  category: "kpi" | "semantic" | "cube" | "dbt" | "table" | "warehouse" | "snapshot";
  description: string;
  meta: Record<string, string | number>;
  status: "verified" | "synchronized" | "immutable";
}

export interface TimeMachineLineageEdge {
  from: string;
  to: string;
  label: string;
}

export interface MetricDependencyNode {
  id: string;
  name: string;
  type: "metric" | "component" | "subcomponent";
  value?: string;
  formula?: string;
  dependencies: string[];
}

export interface TimeMachineNumberExplanation {
  metric: {
    id: string;
    name: string;
    version: string;
    formula: string;
    description: string;
    owner: string;
    status: string;
    effective_from: string;
  };
  value: {
    current: number;
    formatted: string;
    unit: string;
    formatted_display: string;
  };
  period: {
    quarter: string;
    year: number;
    label: string;
  };
  region: string;
  filters: Record<string, string>;
  components: Record<string, number>;
  formatted_components: Record<string, string>;
  calculation_flow: CalculationStep[];
  snapshot: DataSnapshotMetadata;
  governance: {
    status: "verified" | "under_review";
    sql_generated_by_llm: false;
    semantic_validation: "PASSED";
    calculation_validation: "PASSED";
    query_id: string;
    executed_at: string;
    source: string;
    fingerprint: string; // Number Hash: MM-GM-V21-Q3-EU-7A82F
  };
  counterfactual: {
    previous_version: string;
    previous_formula: string;
    previous_value: number;
    previous_formatted: string;
    difference_pp: number;
    difference_label: string;
    explanation: string;
  };
  dimension_breakdown: {
    dimension: string;
    items: DimensionBreakdownItem[];
  };
  lineage: {
    nodes: TimeMachineLineageNode[];
    edges: TimeMachineLineageEdge[];
  };
  dependency_graph: MetricDependencyNode[];
  ai_explanation: {
    summary: string;
    narrative: string;
    trust_boundary_notice: string;
    verified_inputs: string[];
  };
  audit_trail: {
    query_id: string;
    snapshot_id: string;
    executed_at: string;
    execution_status: string;
    source: string;
    sql_by_llm: "NONE";
    semantic_validation: "PASSED";
    calculation_validation: "PASSED";
    fingerprint: string;
  };
  timeline_versions: MetricVersion[];
}

export interface TimeMachineCompareResponse {
  metric_id: string;
  metric_name: string;
  period_a: {
    period: string;
    value: number;
    formatted: string;
    version: string;
    formula: string;
    snapshot_id: string;
    filters: Record<string, string>;
    components: Record<string, number>;
  };
  period_b: {
    period: string;
    value: number;
    formatted: string;
    version: string;
    formula: string;
    snapshot_id: string;
    filters: Record<string, string>;
    components: Record<string, number>;
  };
  delta: {
    value_difference: number;
    value_difference_formatted: string;
    percentage_change: string;
  };
  definition_changed: boolean;
  definition_difference?: {
    version_a: string;
    version_b: string;
    formula_a: string;
    formula_b: string;
    explanation: string;
    impact_warning: string;
  };
  data_difference: {
    rows_difference: number;
    key_drivers: { name: string; impact: string }[];
  };
  filter_difference: {
    added: Record<string, string>;
    removed: Record<string, string>;
    identical: Record<string, string>;
  };
  normalized_comparison?: {
    value_a_normalized: number;
    value_b_under_current_formula: number;
    pure_performance_change: string;
    formula_used: string;
  };
}

export interface ReproductionResponse {
  metric_id: string;
  metric_name: string;
  original_value: number;
  original_formatted: string;
  reproduced_value: number;
  reproduced_formatted: string;
  difference_pp: number;
  status: "✓ REPRODUCED EXACTLY" | "MISMATCH";
  snapshot_id: string;
  fingerprint: string;
  execution_ms: number;
  reproduced_at: string;
  deterministic_guarantee: string;
}
