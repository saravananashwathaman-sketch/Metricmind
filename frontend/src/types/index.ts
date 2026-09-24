export type Role = "Admin" | "Executive" | "Finance Analyst" | "Sales Analyst";

export interface AgentStep {
  step_number: number;
  title: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  detail: string;
  timestamp_ms: number;
}

export interface GovernedMetricInfo {
  id: string;
  name: string;
  formula: string;
  data_source: string;
  dbt_model: string;
  owner: string;
  version: string;
  status: "Verified" | "Under Review" | "Draft" | "Deprecated";
}

export interface AnalyticalEvidence {
  headers: string[];
  rows: (string | number)[][];
  total_records: number;
  governed_signature: string;
}

export interface CalculationDetails {
  metric_name: string;
  governed_formula: string;
  sql_equivalent: string;
  source_model: string;
  fact_table: string;
  dimensions_evaluated: string[];
  applied_filters: Record<string, string>;
  reporting_period: string;
  verified_by: string;
  version: string;
  governance_status: string;
}

export interface CostDriver {
  driver: string;
  category: string;
  current_amount: number;
  baseline_amount: number;
  change_pct: string;
  impact_pp: number;
}

export interface DimensionalContribution {
  dimension: string;
  value_name: string;
  current_value: number;
  previous_value: number;
  delta: number;
  weighted_impact_pp: number;
  revenue: number;
}

export interface WaterfallStep {
  name: string;
  value: number;
  is_total?: boolean;
}

export interface KPIComparison {
  metric_id: string;
  metric_name: string;
  current_period: string;
  baseline_period: string;
  current_value: number | string;
  baseline_value: number | string;
  difference: number;
  percentage_change: string;
  unit: string;
  is_positive: boolean;
}

export interface MetricMindChatResponse {
  conversation_id: string;
  question: string;
  status: "success" | "error";
  processing_time_ms: number;
  reasoning_steps: AgentStep[];
  executive_summary: string;
  kpi_comparison: KPIComparison;
  governed_metric: GovernedMetricInfo;
  drivers: CostDriver[];
  regional_breakdown: DimensionalContribution[];
  primary_chart_type: "waterfall" | "bar" | "line" | "area" | "pie";
  primary_chart_data: any;
  secondary_chart_type?: string;
  secondary_chart_data?: any;
  evidence: AnalyticalEvidence;
  calculation_details: CalculationDetails;
  suggested_followups: string[];
  _trace?: any;
}

export interface MetricDefinition {
  id: string;
  display_name: string;
  description: string;
  category: "Profitability" | "Revenue" | "Customer" | "Operations";
  formula: string;
  formula_sql: string;
  unit: "percentage" | "currency_inr" | "count" | "ratio";
  data_source: string;
  dbt_model: string;
  supported_dimensions: string[];
  owner: string;
  owner_role: string;
  last_updated: string;
  version: string;
  status: "Verified" | "Under Review" | "Draft" | "Deprecated";
  usage_count: number;
}

export interface KPICardData {
  id: string;
  name: string;
  current_value: string;
  raw_value: number;
  previous_value: string;
  change_pct: string;
  change_type: "positive" | "negative" | "neutral";
  subtext: string;
  sparkline: number[];
  governed_formula: string;
  status: string;
}

export interface ExecutiveOverviewData {
  period: string;
  region: string;
  greeting: string;
  subtitle: string;
  kpis: KPICardData[];
  regional_distribution: {
    region: string;
    revenue: number;
    revenue_formatted: string;
    margin: number;
    orders: number;
    change: string;
  }[];
  revenue_trend: {
    quarter: string;
    Europe: number;
    "North America": number;
    India: number;
    APAC: number;
    Total: number;
  }[];
  margin_trend: {
    quarter: string;
    Europe: number;
    "North America": number;
    India: number;
    APAC: number;
    Global: number;
  }[];
  top_products: {
    name: string;
    category: string;
    revenue: string;
    margin: string;
    growth: string;
  }[];
  governed_signature: string;
}

export interface LineageNode {
  id: string;
  layer: string;
  title: string;
  detail: string;
  status: string;
  type: "question" | "metric" | "semantic" | "dbt" | "table" | "warehouse";
}

export interface LineageEdge {
  from: string;
  to: string;
  label: string;
}

export interface LineageGraphData {
  metric_id: string;
  nodes: LineageNode[];
  edges: LineageEdge[];
  layer_descriptions: Record<string, string>;
  governed_compliance: string;
}

export interface AuditLog {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  performed_by: string;
  role: string;
  details: string;
  compliance_status: string;
  created_at: string;
}

export interface QueryHistoryItem {
  id: string;
  question: string;
  user_role: string;
  user_name: string;
  metric_used: string;
  dimensions: string[] | string;
  filters: Record<string, any> | string;
  executive_summary: string;
  execution_ms: number;
  status: string;
  created_at: string;
}

export interface SavedInsight {
  id: string;
  title: string;
  question: string;
  metric_id: string;
  executive_summary: string;
  chart_type: string;
  chart_data: any;
  drivers: any;
  filters: Record<string, any>;
  semantic_definition: string;
  created_by: string;
  created_at: string;
}

export interface RogueSimulationResult {
  status: string;
  decision: string;
  risk_level: string;
  explanation: string;
  remediated_semantic_metric: string;
  governance_rule_triggered: string;
}
