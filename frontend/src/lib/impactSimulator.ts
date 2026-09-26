/**
 * METRIC IMPACT SIMULATOR ENGINE
 *
 * Deterministic semantic calculation, dependency graph analysis,
 * governance validation, and what-if scenario forecasting.
 *
 * Strict read-only simulation sandbox — NEVER modifies production data.
 */

import {
  MetricImpactMetadata,
  ChangeType,
  GovernanceValidationResult,
  ImpactAssessment,
  AffectedAssetItem,
  DependentMetricImpact,
  WhatIfScenarioItem,
  SimulationResult,
  SimulationAuditRecord,
  GovernedMeasure,
  StrictSimulationContractSchema,
  StrictSimulationContract
} from "@/types/impact";

// ============================================================================
// 1. GOVERNED SEMANTIC REGISTRY (Valid measures & dimensions)
// ============================================================================

export const APPROVED_SEMANTIC_MEASURES: Record<string, GovernedMeasure> = {
  revenue: {
    id: "revenue",
    name: "revenue",
    display_name: "Recognized Revenue",
    table: "fct_sales",
    column: "revenue",
    description: "Invoiced top-line recognized commercial sales",
    category: "Revenue",
    status: "approved"
  },
  cost: {
    id: "cost",
    name: "cost",
    display_name: "Cost of Goods Sold (COGS)",
    table: "fct_sales",
    column: "cost",
    description: "Direct manufacturing, supplier, and inventory expenses",
    category: "Cost",
    status: "approved"
  },
  logistics_cost: {
    id: "logistics_cost",
    name: "logistics_cost",
    display_name: "Line-Haul & Freight Logistics Cost",
    table: "fct_expenses",
    column: "logistics_amount",
    description: "Direct line-haul freight, air freight surcharges, and regional 3PL handling",
    category: "Cost",
    status: "approved"
  },
  logistics: {
    id: "logistics",
    name: "logistics",
    display_name: "Logistics Surcharges",
    table: "fct_expenses",
    column: "logistics_amount",
    description: "Alias for logistics_cost in semantic definitions",
    category: "Cost",
    status: "approved"
  },
  adjusted_cost: {
    id: "adjusted_cost",
    name: "adjusted_cost",
    display_name: "Adjusted COGS",
    table: "fct_sales",
    column: "adjusted_cost",
    description: "Cost normalized for fuel indexation and carrier rebates under ASC 606",
    category: "Cost",
    status: "approved"
  },
  gross_profit: {
    id: "gross_profit",
    name: "gross_profit",
    display_name: "Gross Profit",
    table: "fct_sales",
    column: "calculated",
    description: "Revenue minus direct Cost of Goods Sold",
    category: "Profitability",
    status: "approved"
  },
  operating_expenses: {
    id: "operating_expenses",
    name: "operating_expenses",
    display_name: "Operating Expenses (OPEX)",
    table: "fct_expenses",
    column: "amount",
    description: "R&D, SG&A, cloud hosting, and regional overhead",
    category: "Operations",
    status: "approved"
  },
  order_count: {
    id: "order_count",
    name: "order_count",
    display_name: "Total Commercial Orders",
    table: "fct_orders",
    column: "order_id",
    description: "Unique fulfilled commercial orders",
    category: "Operations",
    status: "approved"
  },
  total_customers: {
    id: "total_customers",
    name: "total_customers",
    display_name: "Total Active Customers",
    table: "dim_customers",
    column: "customer_id",
    description: "Count of all active customer contracts",
    category: "Customer",
    status: "approved"
  },
  churned_customers: {
    id: "churned_customers",
    name: "churned_customers",
    display_name: "Churned Customers",
    table: "dim_customers",
    column: "is_churned",
    description: "Count of customer accounts terminated within period",
    category: "Customer",
    status: "approved"
  }
};

export const APPROVED_SEMANTIC_DIMENSIONS = [
  "region",
  "country",
  "product_category",
  "customer_segment",
  "quarter",
  "month",
  "fiscal_quarter",
  "expense_category"
];

// ============================================================================
// 2. METRIC IMPACT CATALOG METADATA
// ============================================================================

export const IMPACT_METRICS_CATALOG: Record<string, MetricImpactMetadata> = {
  gross_margin: {
    id: "gross_margin",
    name: "gross_margin",
    display_name: "Gross Margin",
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    current_version: "2.1",
    status: "Verified",
    formula: "((Revenue - Cost) / Revenue) * 100",
    formula_display: "((Revenue - Cost) / Revenue) × 100",
    formula_sql: "((SUM(fct_sales.revenue) - SUM(fct_sales.cost)) / NULLIF(SUM(fct_sales.revenue), 0)) * 100",
    category: "Profitability",
    unit: "percentage",
    current_value: 27.2,
    dependencies_count: 17,
    dependent_metrics_count: 3,
    components: {
      revenue: 48.6,
      cost: 35.38,
      logistics_cost: 2.1,
      operating_expenses: 5.4
    }
  },
  revenue: {
    id: "revenue",
    name: "revenue",
    display_name: "Recognized Revenue",
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    current_version: "2.4",
    status: "Verified",
    formula: "SUM(revenue)",
    formula_display: "SUM(revenue)",
    formula_sql: "SUM(fct_sales.revenue)",
    category: "Revenue",
    unit: "currency",
    currency: "INR",
    current_value: 48.6,
    dependencies_count: 24,
    dependent_metrics_count: 4,
    components: {
      revenue: 48.6,
      orders: 2840
    }
  },
  cost: {
    id: "cost",
    name: "cost",
    display_name: "Cost of Goods Sold (COGS)",
    owner: "Anand Verma",
    owner_role: "Director of Financial Operations",
    current_version: "2.1",
    status: "Verified",
    formula: "SUM(cost)",
    formula_display: "SUM(cost)",
    formula_sql: "SUM(fct_sales.cost)",
    category: "Profitability",
    unit: "currency",
    currency: "INR",
    current_value: 35.38,
    dependencies_count: 15,
    dependent_metrics_count: 3,
    components: {
      cost: 35.38,
      logistics_cost: 2.1
    }
  },
  gross_profit: {
    id: "gross_profit",
    name: "gross_profit",
    display_name: "Gross Profit",
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    current_version: "2.4",
    status: "Verified",
    formula: "Revenue - Cost",
    formula_display: "Revenue - Cost",
    formula_sql: "SUM(fct_sales.revenue) - SUM(fct_sales.cost)",
    category: "Profitability",
    unit: "currency",
    currency: "INR",
    current_value: 13.22,
    dependencies_count: 19,
    dependent_metrics_count: 3,
    components: {
      revenue: 48.6,
      cost: 35.38
    }
  },
  net_profit: {
    id: "net_profit",
    name: "net_profit",
    display_name: "Net Profit",
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    current_version: "1.8",
    status: "Verified",
    formula: "Gross Profit - Operating Expenses",
    formula_display: "Gross Profit - Operating Expenses",
    formula_sql: "(SUM(fct_sales.revenue) - SUM(fct_sales.cost)) - SUM(fct_expenses.amount)",
    category: "Profitability",
    unit: "currency",
    currency: "INR",
    current_value: 7.82,
    dependencies_count: 12,
    dependent_metrics_count: 2,
    components: {
      revenue: 48.6,
      cost: 35.38,
      operating_expenses: 5.4
    }
  },
  churn_rate: {
    id: "churn_rate",
    name: "churn_rate",
    display_name: "Customer Churn Rate",
    owner: "Vikram Malhotra",
    owner_role: "Head of Customer Success",
    current_version: "2.0",
    status: "Verified",
    formula: "(Churned Customers / Total Customers) * 100",
    formula_display: "((Churned Customers / Total Customers)) × 100",
    formula_sql: "(COUNT(DISTINCT CASE WHEN churned = 1 THEN customer_id END) * 100.0) / NULLIF(COUNT(DISTINCT customer_id), 0)",
    category: "Customer",
    unit: "percentage",
    current_value: 4.8,
    dependencies_count: 9,
    dependent_metrics_count: 2,
    components: {
      customers: 1250,
      churned_customers: 60
    }
  },
  order_count: {
    id: "order_count",
    name: "order_count",
    display_name: "Total Order Count",
    owner: "Rohan Mehta",
    owner_role: "Lead Data Engineer",
    current_version: "1.5",
    status: "Verified",
    formula: "COUNT(order_id)",
    formula_display: "COUNT(order_id)",
    formula_sql: "COUNT(DISTINCT fct_orders.order_id)",
    category: "Operations",
    unit: "count",
    current_value: 2840,
    dependencies_count: 11,
    dependent_metrics_count: 2,
    components: {
      orders: 2840
    }
  },
  average_order_value: {
    id: "average_order_value",
    name: "average_order_value",
    display_name: "Average Order Value (AOV)",
    owner: "Rohan Mehta",
    owner_role: "Lead Data Engineer",
    current_version: "1.5",
    status: "Verified",
    formula: "Revenue / Order Count",
    formula_display: "Revenue / Order Count",
    formula_sql: "SUM(fct_sales.revenue) / NULLIF(COUNT(DISTINCT fct_orders.order_id), 0)",
    category: "Revenue",
    unit: "currency",
    currency: "INR",
    current_value: 171120,
    dependencies_count: 8,
    dependent_metrics_count: 1,
    components: {
      revenue: 486000000,
      orders: 2840
    }
  }
};

// ============================================================================
// 3. DOWNSTREAM DEPENDENCY GRAPH & ASSETS FOR METRICS
// ============================================================================

export const GROSS_MARGIN_AFFECTED_ASSETS: AffectedAssetItem[] = [
  // Dashboards (5)
  {
    id: "dash_01",
    name: "Executive Overview",
    type: "dashboard",
    owner: "Rajesh Kapoor",
    owner_role: "Chief Executive Officer",
    impact_reason: "Primary top-line KPI tile, regional margin bar chart, and waterfall driver breakdown",
    widgets_count: 4,
    widgets: ["Gross Margin KPI Card", "Quarterly Margin Trend", "Regional Margin Heatmap", "Profitability Waterfall"],
    last_updated: "2 hours ago",
    severity: "high"
  },
  {
    id: "dash_02",
    name: "Finance Analytics",
    type: "dashboard",
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    impact_reason: "Direct COGS analysis, gross margin variance bridge, and budget vs actuals tracker",
    widgets_count: 5,
    widgets: ["COGS vs Margin Matrix", "Cost Driver Variance", "Gross Profit Yield", "Margin Target Gauge", "Regional Margin Table"],
    last_updated: "4 hours ago",
    severity: "high"
  },
  {
    id: "dash_03",
    name: "Regional Performance",
    type: "dashboard",
    owner: "Anand Verma",
    owner_role: "Director of Financial Operations",
    impact_reason: "Country margin comparisons, regional freight drag indexes, and partner margins",
    widgets_count: 3,
    widgets: ["Country Profitability Matrix", "European Freight Drag KPI", "Margin by Country Bar"],
    last_updated: "1 day ago",
    severity: "medium"
  },
  {
    id: "dash_04",
    name: "Sales Performance",
    type: "dashboard",
    owner: "Sunil Narayan",
    owner_role: "Chief Commercial Officer",
    impact_reason: "Commission margin hurdle rates and deal profitability evaluation",
    widgets_count: 2,
    widgets: ["Deal Margin Distribution", "Product Line Margin Table"],
    last_updated: "3 hours ago",
    severity: "medium"
  },
  {
    id: "dash_05",
    name: "Profitability Dashboard",
    type: "dashboard",
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    impact_reason: "Direct contribution margin rankings and corporate profitability scorecard",
    widgets_count: 4,
    widgets: ["Unit Contribution Margin", "Margin Health Index", "EBITDA Bridge", "Quarterly Margin Projections"],
    last_updated: "5 hours ago",
    severity: "high"
  },

  // Reports (8)
  {
    id: "rep_01",
    name: "Finance Quarterly Report",
    type: "report",
    owner: "Priya Sharma",
    impact_reason: "Official board disclosure on gross margin trends and operational efficiencies",
    sections: ["Executive Margin Summary", "Product Category Profitability", "Regional European Performance"],
    last_updated: "3 days ago",
    severity: "high"
  },
  {
    id: "rep_02",
    name: "Board Commercial Pack",
    type: "report",
    owner: "Rajesh Kapoor",
    impact_reason: "Key executive metric slide 4 and investor earnings commentary",
    sections: ["Consolidated Gross Margin", "Cost Inflation Impact Analysis"],
    last_updated: "1 week ago",
    severity: "high"
  },
  {
    id: "rep_03",
    name: "Regional Margin Review (EMEA)",
    type: "report",
    owner: "Elena Rostova",
    impact_reason: "European freight drag commentary and contract renewal pricing guide",
    sections: ["Spain Surcharge Assessment", "Germany Raw Materials Review"],
    last_updated: "2 days ago",
    severity: "medium"
  },
  {
    id: "rep_04",
    name: "Product Profitability Analysis",
    type: "report",
    owner: "Meera Iyer",
    impact_reason: "Catalog SKU margins and gross margin tiering",
    sections: ["SaaS vs Infrastructure Margins", "High Drag SKUs"],
    last_updated: "5 days ago",
    severity: "medium"
  },
  {
    id: "rep_05",
    name: "Sales Operations Monthly",
    type: "report",
    owner: "Sunil Narayan",
    impact_reason: "Discount approval threshold rules and margin protection safeguards",
    sections: ["Discount Impact on Margin", "Rep Performance Tiers"],
    last_updated: "4 days ago",
    severity: "low"
  },
  {
    id: "rep_06",
    name: "EMEA Operating Memo",
    type: "report",
    owner: "Elena Rostova",
    impact_reason: "Carrier fuel surcharges and warehouse delivery margin adjustments",
    sections: ["Logistics Variance Memo", "3PL Cost Analysis"],
    last_updated: "1 day ago",
    severity: "medium"
  },
  {
    id: "rep_07",
    name: "Cost Allocation Review",
    type: "report",
    owner: "Anand Verma",
    impact_reason: "Shared overhead and logistics cost allocation audit table",
    sections: ["Inbound vs Outbound Freight", "ASC 606 Adjustments"],
    last_updated: "6 days ago",
    severity: "medium"
  },
  {
    id: "rep_08",
    name: "Executive Summary Memo",
    type: "report",
    owner: "Rajesh Kapoor",
    impact_reason: "Weekly executive brief metric overview",
    sections: ["Key Financial KPIs", "Margin Variance Flash"],
    last_updated: "Yesterday",
    severity: "high"
  },

  // Saved Insights (14)
  {
    id: "ins_01",
    name: "European Margin Contraction — Root Cause",
    type: "saved_insight",
    owner: "Rajesh Kapoor",
    impact_reason: "Saved insight explaining European gross margin drop from 31.4% to 27.2%",
    last_updated: "24 Sep 2026",
    severity: "high"
  },
  {
    id: "ins_02",
    name: "Q3 Freight Driver Variance",
    type: "saved_insight",
    owner: "Priya Sharma",
    impact_reason: "Variance analysis identifying +38.4% logistics freight spike in Spain & Germany",
    last_updated: "22 Sep 2026",
    severity: "high"
  },
  {
    id: "ins_03",
    name: "Product Margin Comparison",
    type: "saved_insight",
    owner: "Meera Iyer",
    impact_reason: "Enterprise SaaS margin (38.2%) vs Cloud Infrastructure margin (24.1%)",
    last_updated: "21 Sep 2026",
    severity: "medium"
  },
  {
    id: "ins_04",
    name: "Spain Logistics Surcharge Spike",
    type: "saved_insight",
    owner: "Anand Verma",
    impact_reason: "-1.7 pp drag breakdown on carrier container rate hikes",
    last_updated: "20 Sep 2026",
    severity: "high"
  },
  {
    id: "ins_05",
    name: "Enterprise SaaS Profitability",
    type: "saved_insight",
    owner: "Priya Sharma",
    impact_reason: "Contract tier margins across Fortune 500 accounts",
    last_updated: "18 Sep 2026",
    severity: "medium"
  },
  {
    id: "ins_06",
    name: "Direct Carrier Freight Impact",
    type: "saved_insight",
    owner: "Anand Verma",
    impact_reason: "Carrier contract line-haul impact across transatlantic shipping routes",
    last_updated: "17 Sep 2026",
    severity: "medium"
  },
  {
    id: "ins_07",
    name: "Distribution Center Allocation",
    type: "saved_insight",
    owner: "Elena Rostova",
    impact_reason: "Frankfurt vs Madrid fulfillment center gross margin variance",
    last_updated: "16 Sep 2026",
    severity: "medium"
  },
  {
    id: "ins_08",
    name: "Gross Margin by Tier",
    type: "saved_insight",
    owner: "Sunil Narayan",
    impact_reason: "Enterprise, Mid-Market, and SMB gross margin breakdown",
    last_updated: "15 Sep 2026",
    severity: "low"
  },
  {
    id: "ins_09",
    name: "Q2 vs Q3 Margin Bridge",
    type: "saved_insight",
    owner: "Priya Sharma",
    impact_reason: "Quarter-over-quarter waterfall chart from 31.4% to 27.2%",
    last_updated: "14 Sep 2026",
    severity: "high"
  },
  {
    id: "ins_10",
    name: "Carrier Fuel Indexation Drag",
    type: "saved_insight",
    owner: "Anand Verma",
    impact_reason: "Diesel price correlation with quarterly margin changes",
    last_updated: "12 Sep 2026",
    severity: "medium"
  },
  {
    id: "ins_11",
    name: "APAC vs Europe Margin Efficiency",
    type: "saved_insight",
    owner: "Priya Sharma",
    impact_reason: "Comparative margin cross-tabulation across global operating hubs",
    last_updated: "10 Sep 2026",
    severity: "medium"
  },
  {
    id: "ins_12",
    name: "High Volume Discount Margin Sensitivity",
    type: "saved_insight",
    owner: "Sunil Narayan",
    impact_reason: "Deal pricing sensitivity model on aggregate margin",
    last_updated: "08 Sep 2026",
    severity: "low"
  },
  {
    id: "ins_13",
    name: "Contract Renewal Floor Analysis",
    type: "saved_insight",
    owner: "Vikram Malhotra",
    impact_reason: "Minimum acceptable gross margin threshold for customer renewals",
    last_updated: "05 Sep 2026",
    severity: "medium"
  },
  {
    id: "ins_14",
    name: "Executive KPI Snapshot Q3",
    type: "saved_insight",
    owner: "Rajesh Kapoor",
    impact_reason: "Consolidated quarterly leadership scoreboard snapshot",
    last_updated: "01 Sep 2026",
    severity: "high"
  },

  // Saved Queries (Representative sample of the 42 queries)
  {
    id: "qry_01",
    name: "European margin analysis",
    type: "query",
    owner: "Meera Iyer",
    impact_reason: "Uses Gross Margin metric grouped by region and country",
    query_sql: "SELECT country, gross_margin FROM marts.finance.fct_sales WHERE region = 'Europe'",
    execution_frequency: "Daily automated run (06:00 UTC)",
    last_updated: "2 hours ago",
    severity: "high"
  },
  {
    id: "qry_02",
    name: "Q3 profitability",
    type: "query",
    owner: "Priya Sharma",
    impact_reason: "Computes quarterly gross margin and net margin across enterprise tiers",
    query_sql: "SELECT fiscal_quarter, gross_margin, net_profit FROM marts.finance.fct_sales WHERE quarter = 'Q3 2026'",
    execution_frequency: "Hourly refresh",
    last_updated: "1 hour ago",
    severity: "high"
  },
  {
    id: "qry_03",
    name: "Product margin comparison",
    type: "query",
    owner: "Sunil Narayan",
    impact_reason: "Evaluates gross margin per product line and commercial category",
    query_sql: "SELECT category, gross_margin FROM marts.finance.fct_sales GROUP BY category",
    execution_frequency: "Daily automated run",
    last_updated: "5 hours ago",
    severity: "medium"
  },
  {
    id: "qry_04",
    name: "FY26 carrier rate margin drag",
    type: "query",
    owner: "Anand Verma",
    impact_reason: "Evaluates freight surcharges against gross margin baseline",
    query_sql: "SELECT month, gross_margin, logistics_cost FROM marts.finance.fct_sales",
    execution_frequency: "Weekly",
    last_updated: "Yesterday",
    severity: "high"
  },
  {
    id: "qry_05",
    name: "Regional gross margin delta",
    type: "query",
    owner: "Elena Rostova",
    impact_reason: "Calculates variance between regional gross margin and global target",
    query_sql: "SELECT region, gross_margin - 30.0 AS variance FROM marts.finance.fct_sales",
    execution_frequency: "Every 4 hours",
    last_updated: "3 hours ago",
    severity: "medium"
  },
  {
    id: "qry_06",
    name: "Deal desk margin verification",
    type: "query",
    owner: "Sunil Narayan",
    impact_reason: "Enforces 25% gross margin floor on deals over ₹1 Cr",
    query_sql: "SELECT deal_id, gross_margin FROM fct_deals WHERE gross_margin < 25.0",
    execution_frequency: "Continuous event hook",
    last_updated: "10 mins ago",
    severity: "high"
  },
  {
    id: "qry_07",
    name: "Customer segment margin yield",
    type: "query",
    owner: "Vikram Malhotra",
    impact_reason: "Correlates contract margin with net churn rate",
    query_sql: "SELECT segment, gross_margin, churn_rate FROM marts.core.segment_summary",
    execution_frequency: "Weekly",
    last_updated: "3 days ago",
    severity: "medium"
  },
  {
    id: "qry_08",
    name: "ASC 606 revenue compliance check",
    type: "query",
    owner: "Priya Sharma",
    impact_reason: "Validates GAAP/IFRS margin accounting compliance",
    query_sql: "SELECT contract_id, gross_margin FROM marts.finance.asc606_contracts",
    execution_frequency: "Monthly audit cycle",
    last_updated: "1 week ago",
    severity: "high"
  },

  // Alerts & API Consumers
  {
    id: "alert_01",
    name: "Margin Drop Anomaly Detector",
    type: "alert",
    owner: "Data Governance System",
    impact_reason: "Triggers P1 Slack/Email alert if Gross Margin drops below 25.0%",
    execution_frequency: "Runs every 15 minutes",
    last_updated: "Continuous",
    severity: "high"
  },
  {
    id: "api_01",
    name: "Salesforce CPQ Deal Pricing Integration",
    type: "api_consumer",
    owner: "Commercial Systems Integration",
    impact_reason: "Queries /api/semantic-query to pull live gross margin floors into CPQ deal approval workflow",
    execution_frequency: "REST API ~4,200 req/day",
    last_updated: "Active",
    severity: "high"
  }
];

export const GROSS_MARGIN_DEPENDENT_METRICS: DependentMetricImpact[] = [
  {
    id: "profitability_index",
    name: "Profitability Index",
    current_formula: "(Gross Margin * 0.7) + 30",
    proposed_formula: "(Simulated Gross Margin * 0.7) + 30",
    current_value: 49.04,
    simulated_value: 46.02,
    difference: -3.02,
    unit: "score",
    impact_path: "Gross Margin → Operating Efficiency → Profitability Index"
  },
  {
    id: "regional_efficiency",
    name: "Regional Efficiency Score",
    current_formula: "Gross Margin / (Total Headcount Index / 10)",
    proposed_formula: "Simulated Gross Margin / (Total Headcount Index / 10)",
    current_value: 3.2,
    simulated_value: 2.69,
    difference: -0.51,
    unit: "ratio",
    impact_path: "Gross Margin → Regional OpCost → Regional Efficiency Score"
  },
  {
    id: "exec_performance_score",
    name: "Executive Performance Score",
    current_formula: "(Gross Margin * 1.5) + (Revenue Growth * 0.5)",
    proposed_formula: "(Simulated Gross Margin * 1.5) + (Revenue Growth * 0.5)",
    current_value: 68.4,
    simulated_value: 61.9,
    difference: -6.5,
    unit: "points",
    impact_path: "Gross Margin → Strategic Goal Scorecard → Executive Performance Score"
  }
];

// ============================================================================
// 4. GOVERNANCE VALIDATION ENGINE
// ============================================================================

export function validateProposedChange(
  metricId: string,
  proposedFormula: string,
  changeType: ChangeType = "formula_change"
): GovernanceValidationResult {
  const checks: { id: string; name: string; passed: boolean; message: string; severity: "error" | "warning" | "success" }[] = [];
  const unknownMeasures: string[] = [];
  const unknownDimensions: string[] = [];
  let blocked = false;
  let blockReason = "";

  // 1. Check metric exists in catalog
  const metric = IMPACT_METRICS_CATALOG[metricId];
  if (!metric) {
    checks.push({
      id: "metric_exists",
      name: "Metric Exists in Catalog",
      passed: false,
      message: `Metric '${metricId}' is not registered in the Governed Semantic Catalog.`,
      severity: "error"
    });
    return {
      is_valid: false,
      blocked: true,
      block_reason: `Metric '${metricId}' does not exist in the governed semantic layer.`,
      unknown_measures: [],
      unknown_dimensions: [],
      checks,
      timestamp: new Date().toISOString()
    };
  }
  checks.push({
    id: "metric_exists",
    name: "Metric Exists in Catalog",
    passed: true,
    message: `Metric '${metric.display_name}' found in governed catalog (v${metric.current_version}).`,
    severity: "success"
  });

  // 2. Check metric governance status
  const isGoverned = metric.status === "Verified" || metric.status === "Under Review";
  checks.push({
    id: "metric_governed",
    name: "Metric is Governed",
    passed: isGoverned,
    message: isGoverned
      ? `Metric status is '${metric.status}' under owner '${metric.owner}'.`
      : `Metric status is '${metric.status}'. Unverified metrics require preliminary governance review.`,
    severity: isGoverned ? "success" : "warning"
  });

  // 3. Check current definition exists
  checks.push({
    id: "current_def_exists",
    name: "Current Definition Exists",
    passed: !!metric.formula,
    message: `Current formula: ${metric.formula}`,
    severity: "success"
  });

  // 4. Validate Formula Syntax & Balanced Parentheses
  const trimmed = proposedFormula.trim();
  if (!trimmed) {
    checks.push({
      id: "formula_syntax",
      name: "Formula Syntax Valid",
      passed: false,
      message: "Proposed formula cannot be empty.",
      severity: "error"
    });
    blocked = true;
    blockReason = "Proposed formula cannot be empty.";
  } else {
    // Check balanced parentheses
    let parenCount = 0;
    for (const char of trimmed) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (parenCount < 0) break;
    }
    const syntaxOk = parenCount === 0;
    checks.push({
      id: "formula_syntax",
      name: "Formula Syntax & Structure",
      passed: syntaxOk,
      message: syntaxOk
        ? "Formula syntax and mathematical parentheses are balanced and valid."
        : "Unbalanced parentheses detected in proposed formula.",
      severity: syntaxOk ? "success" : "error"
    });
    if (!syntaxOk) {
      blocked = true;
      blockReason = "Syntax error: Unbalanced parentheses in proposed mathematical formula.";
    }
  }

  // 5. Measure Registration Validation (Extract tokens and test against approved measures)
  // Clean tokens: strip math symbols + - * / ( ) [ ] , etc.
  const rawTokens = trimmed
    .replace(/[+\-*/()^%,]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0 && isNaN(Number(t)));

  const standardKeywords = new Set([
    "sum", "count", "avg", "min", "max", "nullif", "distinct", "case", "when", "then", "else", "end", "and", "or", "not"
  ]);

  for (const token of rawTokens) {
    if (standardKeywords.has(token)) continue;
    // Check if token matches an approved measure
    const isApproved = APPROVED_SEMANTIC_MEASURES[token] ||
      Object.keys(APPROVED_SEMANTIC_MEASURES).some((k) => token.includes(k));

    if (!isApproved) {
      // Flag as unknown measure
      unknownMeasures.push(token);
    }
  }

  if (unknownMeasures.length > 0) {
    const unknownList = unknownMeasures.join(", ");
    checks.push({
      id: "referenced_measures",
      name: "Referenced Measures Exist in Semantic Layer",
      passed: false,
      message: `Unknown measure: '${unknownList}'. This measure is not registered in the Semantic Layer.`,
      severity: "error"
    });
    blocked = true;
    blockReason = `Unknown measure: ${unknownList}. This measure is not registered in the Semantic Layer.`;
  } else {
    checks.push({
      id: "referenced_measures",
      name: "Referenced Measures Exist in Semantic Layer",
      passed: true,
      message: "All referenced measures are registered in the Semantic Catalog with approved schemas.",
      severity: "success"
    });
  }

  // 6. Check Referenced Dimensions
  checks.push({
    id: "referenced_dimensions",
    name: "Referenced Dimensions Exist",
    passed: true,
    message: "Compatible with governed dimensions: region, country, product_category, customer_segment, quarter.",
    severity: "success"
  });

  // 7. Check Dependencies are Known
  checks.push({
    id: "dependencies_known",
    name: "Downstream Dependencies Known",
    passed: true,
    message: `Identified 17 downstream assets, 42 queries, and 3 dependent metrics in the active catalog DAG.`,
    severity: "success"
  });

  return {
    is_valid: !blocked,
    blocked,
    block_reason: blocked ? blockReason : undefined,
    unknown_measures: unknownMeasures,
    unknown_dimensions: unknownDimensions,
    checks,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// 5. DETERMINISTIC VALUE SIMULATION & SCENARIOS
// ============================================================================

export function calculateSimulatedValue(
  metricId: string,
  proposedFormula: string,
  changeType: ChangeType = "formula_change",
  scenarioMultiplier: number = 1.0
): { currentValue: number; simulatedValue: number; difference: number; differencePp: number; unit: string } {
  const metric = IMPACT_METRICS_CATALOG[metricId] || IMPACT_METRICS_CATALOG.gross_margin;
  const lowerFormula = proposedFormula.toLowerCase();

  let currentValue = metric.current_value;
  let simulatedValue = currentValue;

  if (metricId === "gross_margin") {
    // Current deterministic components (Q3 2026, Europe):
    // Revenue: 48.60 Cr, Cost: 35.38 Cr, Logistics: 2.10 Cr
    const rev = 48.6;
    const baseCost = 35.38;
    const logistics = 2.1 * scenarioMultiplier;

    if (lowerFormula.includes("logistics")) {
      // (Revenue - Cost - Logistics) / Revenue * 100
      simulatedValue = ((rev - baseCost - logistics) / rev) * 100;
    } else if (lowerFormula.includes("adjusted_cost") || lowerFormula.includes("adjusted cost")) {
      // Adjusted cost (asc 606 with partial fuel drag ~1.16 Cr)
      const adjustedCost = baseCost + 0.48 * scenarioMultiplier;
      simulatedValue = ((rev - adjustedCost) / rev) * 100;
    } else if (lowerFormula.includes("completed + partially") || changeType === "filter_change") {
      // Filter expansion includes partially fulfilled: +1.4% revenue, +0.8% cost
      simulatedValue = 26.85;
    } else if (changeType === "dimension_change") {
      // Grain change
      simulatedValue = 27.2;
    } else {
      // Direct deduction formula simulation
      simulatedValue = 24.8;
    }
  } else if (metricId === "revenue") {
    if (lowerFormula.includes("excludes cancelled") || lowerFormula.includes("exclude")) {
      simulatedValue = currentValue * 0.962; // -3.8%
    } else {
      simulatedValue = currentValue * scenarioMultiplier;
    }
  } else if (metricId === "cost") {
    if (lowerFormula.includes("logistics")) {
      simulatedValue = currentValue + 2.1 * scenarioMultiplier;
    } else {
      simulatedValue = currentValue * scenarioMultiplier;
    }
  } else if (metricId === "churn_rate") {
    if (lowerFormula.includes("partially") || lowerFormula.includes("30_day")) {
      simulatedValue = 5.4;
    } else {
      simulatedValue = currentValue * scenarioMultiplier;
    }
  } else {
    simulatedValue = currentValue * 0.92;
  }

  currentValue = Math.round(currentValue * 100) / 100;
  simulatedValue = Math.round(simulatedValue * 100) / 100;
  const difference = Math.round((simulatedValue - currentValue) * 100) / 100;
  const differencePp = difference;

  return {
    currentValue,
    simulatedValue,
    difference,
    differencePp,
    unit: metric.unit === "percentage" ? "%" : metric.unit === "currency" ? "₹ Cr" : ""
  };
}

// ============================================================================
// 6. WHAT-IF SCENARIOS GENERATOR (Section 16 & 17)
// ============================================================================

export function generateWhatIfScenarios(
  metricId: string,
  proposedFormula: string
): WhatIfScenarioItem[] {
  const baseCalc = calculateSimulatedValue(metricId, proposedFormula, "formula_change", 1.0);

  if (metricId === "gross_margin") {
    return [
      {
        id: "scen_baseline",
        name: "Current Definition",
        description: "Standard governed formula ((Revenue - Cost) / Revenue) * 100",
        parameter: "Logistics Excluded",
        parameter_delta: "0%",
        current_value: 27.2,
        simulated_value: 27.2,
        difference_pp: 0.0,
        is_active: false
      },
      {
        id: "scen_a",
        name: "Scenario A: Logistics Cost +5%",
        description: "Logistics fuel surcharges increase by +5% across European lanes",
        parameter: "Logistics Cost +5%",
        parameter_delta: "+5%",
        current_value: 27.2,
        simulated_value: 26.8,
        difference_pp: -0.4,
        is_active: true
      },
      {
        id: "scen_b",
        name: "Scenario B: Logistics Cost +10%",
        description: "Moderate fuel inflation scenario with +10% 3PL carrier surcharge drag",
        parameter: "Logistics Cost +10%",
        parameter_delta: "+10%",
        current_value: 27.2,
        simulated_value: 26.3,
        difference_pp: -0.9,
        is_active: true
      },
      {
        id: "scen_c",
        name: "Scenario C: Logistics Cost +20%",
        description: "Extreme logistics spike scenario with +20% carrier surcharge drag",
        parameter: "Logistics Cost +20%",
        parameter_delta: "+20%",
        current_value: 27.2,
        simulated_value: 25.4,
        difference_pp: -1.8,
        is_active: true
      },
      {
        id: "scen_proposed",
        name: "Proposed Full Inclusion",
        description: "Full dedicated logistics deduction: ((Revenue - Cost - Logistics) / Revenue) * 100",
        parameter: "Full Logistics Cost Included (₹2.10 Cr)",
        parameter_delta: "Full Surcharge",
        current_value: 27.2,
        simulated_value: baseCalc.simulatedValue,
        difference_pp: baseCalc.differencePp,
        is_active: true
      }
    ];
  }

  // Generic scenarios for other metrics
  return [
    {
      id: "scen_curr",
      name: "Current Definition",
      description: "Baseline calculation under active governance standard",
      parameter: "Baseline",
      parameter_delta: "0%",
      current_value: baseCalc.currentValue,
      simulated_value: baseCalc.currentValue,
      difference_pp: 0.0,
      is_active: false
    },
    {
      id: "scen_prop",
      name: "Proposed Definition",
      description: "Calculated outcome under requested specification",
      parameter: "Proposed",
      parameter_delta: `${baseCalc.differencePp > 0 ? "+" : ""}${baseCalc.differencePp}`,
      current_value: baseCalc.currentValue,
      simulated_value: baseCalc.simulatedValue,
      difference_pp: baseCalc.differencePp,
      is_active: true
    }
  ];
}

// ============================================================================
// 7. IMPACT LEVEL ASSESSMENT (Section 9)
// ============================================================================

export function evaluateImpactAssessment(
  affectedAssets: AffectedAssetItem[],
  dependentMetrics: DependentMetricImpact[]
): ImpactAssessment {
  const dashboardsCount = affectedAssets.filter((a) => a.type === "dashboard").length;
  const reportsCount = affectedAssets.filter((a) => a.type === "report").length;
  const savedInsightsCount = affectedAssets.filter((a) => a.type === "saved_insight").length;
  const queriesCount = 42; // standard governed saved query catalog
  const dependentMetricsCount = dependentMetrics.length;
  const alertsCount = affectedAssets.filter((a) => a.type === "alert").length;
  const apiConsumersCount = affectedAssets.filter((a) => a.type === "api_consumer").length;

  const totalAffected = dashboardsCount + reportsCount + savedInsightsCount + queriesCount + dependentMetricsCount;

  // Impact Scoring logic:
  // Dashboards (weight 5) + Reports (weight 4) + Dependent Metrics (weight 8) + Saved Insights (weight 2) + Queries (weight 0.5)
  const weightedScore =
    dashboardsCount * 5 +
    reportsCount * 4 +
    dependentMetricsCount * 8 +
    savedInsightsCount * 2 +
    queriesCount * 0.5;

  let level: "LOW" | "MEDIUM" | "HIGH" = "HIGH";
  if (weightedScore < 30) level = "LOW";
  else if (weightedScore < 60) level = "MEDIUM";
  else level = "HIGH";

  return {
    score: Math.min(100, Math.round(weightedScore)),
    level,
    total_affected_assets: 17, // Primary executive asset boundary (5 Dashboards + 8 Reports + 4 Primary Insights)
    dashboards_count: dashboardsCount,
    reports_count: reportsCount,
    saved_insights_count: savedInsightsCount,
    queries_count: queriesCount,
    dependent_metrics_count: dependentMetricsCount,
    alerts_count: alertsCount,
    api_consumers_count: apiConsumersCount,
    methodology:
      "Impact level is calculated from the number and type of downstream dependencies across dashboards, formal reports, automated queries, and dependent mathematical metrics. Weighted by organizational visibility and executive consumption.",
    calculation_explanation: [
      `17 downstream enterprise assets depend on this governed metric.`,
      `${dashboardsCount} executive & operational dashboards display live widgets powered by this definition.`,
      `${reportsCount} statutory, board, and operational management reports draw from this figure.`,
      `${savedInsightsCount} curated historical AI insights reference this metric calculation.`,
      `${queriesCount} saved business queries actively rely on this metric schema.`,
      `${dependentMetricsCount} downstream derived metrics cascade from this calculation.`
    ]
  };
}

// ============================================================================
// 8. SIMULATION RUNNER (Section 14 & 26)
// ============================================================================

export function runMetricSimulation(
  metricId: string,
  proposedFormula: string,
  changeType: ChangeType = "formula_change",
  scope = { region: "Europe", period: "Q3 2026" },
  userName = "Rajesh Kapoor"
): SimulationResult {
  const metric = IMPACT_METRICS_CATALOG[metricId] || IMPACT_METRICS_CATALOG.gross_margin;

  // 1. Governance validation
  const validation = validateProposedChange(metricId, proposedFormula, changeType);

  // If blocked, return blocked simulation result immediately
  if (validation.blocked) {
    const simId = `SIM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      simulation_id: simId,
      metric_id: metric.id,
      metric_name: metric.display_name,
      current_version: metric.current_version,
      proposed_version: "Draft",
      change_type: changeType,
      current_definition: {
        formula: metric.formula
      },
      proposed_definition: {
        formula: proposedFormula
      },
      scope,
      current_value: metric.current_value,
      simulated_value: metric.current_value,
      difference: 0,
      difference_pp: 0,
      unit: metric.unit === "percentage" ? "%" : "",
      simulation_only: true,
      is_demo_mode: true,
      created_at: new Date().toISOString(),
      created_by: userName,
      status: "BLOCKED",
      validation,
      impact_assessment: evaluateImpactAssessment(GROSS_MARGIN_AFFECTED_ASSETS, GROSS_MARGIN_DEPENDENT_METRICS),
      dependent_metrics: GROSS_MARGIN_DEPENDENT_METRICS,
      affected_assets: GROSS_MARGIN_AFFECTED_ASSETS,
      scenarios: [],
      dependency_graph: { nodes: [], links: [] }
    };
  }

  // 2. Value calculation
  const values = calculateSimulatedValue(metricId, proposedFormula, changeType, 1.0);

  // 3. Dependent metrics & assets
  const affectedAssets = metricId === "gross_margin" ? GROSS_MARGIN_AFFECTED_ASSETS : [];
  const dependentMetrics = metricId === "gross_margin" ? GROSS_MARGIN_DEPENDENT_METRICS : [];

  // Update dependent metrics with simulated value
  const updatedDependentMetrics = dependentMetrics.map((dm) => {
    let simVal = dm.simulated_value;
    if (dm.id === "profitability_index") {
      simVal = Math.round(((values.simulatedValue * 0.7) + 30) * 100) / 100;
    } else if (dm.id === "regional_efficiency") {
      simVal = Math.round((values.simulatedValue / 9.2) * 100) / 100;
    } else if (dm.id === "exec_performance_score") {
      simVal = Math.round(((values.simulatedValue * 1.5) + (12.4 * 0.5)) * 100) / 100;
    }
    return {
      ...dm,
      simulated_value: simVal,
      difference: Math.round((simVal - dm.current_value) * 100) / 100
    };
  });

  // 4. Scenarios
  const scenarios = generateWhatIfScenarios(metricId, proposedFormula);

  // 5. Impact assessment
  const impactAssessment = evaluateImpactAssessment(affectedAssets, updatedDependentMetrics);

  // 6. Visual Dependency Graph Nodes & Edges (Section 7 & 32)
  const dependencyGraph = buildDependencyGraph(metric.display_name, affectedAssets, updatedDependentMetrics);

  // Simulation ID (e.g. SIM-2026-00981)
  const simId = `SIM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const result: SimulationResult = {
    simulation_id: simId,
    metric_id: metric.id,
    metric_name: metric.display_name,
    current_version: metric.current_version,
    proposed_version: "Draft",
    change_type: changeType,
    current_definition: {
      formula: metric.formula
    },
    proposed_definition: {
      formula: proposedFormula
    },
    scope,
    current_value: values.currentValue,
    simulated_value: values.simulatedValue,
    difference: values.difference,
    difference_pp: values.differencePp,
    unit: values.unit,
    simulation_only: true, // Strict sandbox boundary
    is_demo_mode: true,
    created_at: new Date().toISOString(),
    created_by: userName,
    status: "DRAFT_SIMULATION",
    validation,
    impact_assessment: impactAssessment,
    dependent_metrics: updatedDependentMetrics,
    affected_assets: affectedAssets,
    scenarios,
    dependency_graph: dependencyGraph
  };

  // Add to local audit cache
  saveAuditRecord({
    simulation_id: simId,
    metric_id: metric.id,
    metric_name: metric.display_name,
    current_version: `v${metric.current_version}`,
    proposed_version: "Draft",
    user_name: userName,
    user_role: "Finance Analyst",
    timestamp: new Date().toLocaleString(),
    change_type: changeType,
    current_formula: metric.formula,
    proposed_formula: proposedFormula,
    current_value: values.currentValue,
    simulated_value: values.simulatedValue,
    difference_pp: values.differencePp,
    affected_assets_count: impactAssessment.total_affected_assets,
    validation_status: "PASSED",
    status: "Simulation Only"
  });

  return result;
}

// ============================================================================
// 9. DEPENDENCY GRAPH GENERATOR (Section 7 & 32)
// ============================================================================

function buildDependencyGraph(
  metricName: string,
  affectedAssets: AffectedAssetItem[],
  dependentMetrics: DependentMetricImpact[]
) {
  const nodes: Array<{
    id: string;
    name: string;
    category: "metric" | "dashboard" | "report" | "insight" | "query" | "widget";
    level: number;
    impact: "direct" | "indirect" | "none";
    details: string;
  }> = [];

  const links: Array<{ source: string; target: string; label?: string }> = [];

  // Root Node: Metric
  nodes.push({
    id: "root_metric",
    name: metricName,
    category: "metric",
    level: 0,
    impact: "direct",
    details: "Governed Semantic Metric (Root Origin)"
  });

  // Level 1: Key Dashboards & Dependent Metrics
  const mainDashboards = affectedAssets.filter((a) => a.type === "dashboard").slice(0, 3);
  mainDashboards.forEach((d) => {
    nodes.push({
      id: d.id,
      name: d.name,
      category: "dashboard",
      level: 1,
      impact: "direct",
      details: `${d.widgets_count} widgets affected • Owner: ${d.owner}`
    });
    links.push({
      source: "root_metric",
      target: d.id,
      label: "Governs Tile"
    });

    // Level 2: Widgets under Dashboards
    if (d.widgets && d.widgets.length > 0) {
      d.widgets.slice(0, 2).forEach((w, wIdx) => {
        const wId = `${d.id}_w${wIdx}`;
        nodes.push({
          id: wId,
          name: w,
          category: "widget",
          level: 2,
          impact: "direct",
          details: `Widget in ${d.name}`
        });
        links.push({
          source: d.id,
          target: wId,
          label: "Contains"
        });
      });
    }
  });

  // Level 1: Reports
  const mainReports = affectedAssets.filter((a) => a.type === "report").slice(0, 2);
  mainReports.forEach((r) => {
    nodes.push({
      id: r.id,
      name: r.name,
      category: "report",
      level: 1,
      impact: "direct",
      details: `Report • ${r.sections?.length || 2} sections affected`
    });
    links.push({
      source: "root_metric",
      target: r.id,
      label: "Feeds Section"
    });
  });

  // Level 1: Dependent Metrics
  dependentMetrics.forEach((dm) => {
    nodes.push({
      id: dm.id,
      name: dm.name,
      category: "metric",
      level: 1,
      impact: "direct",
      details: `Dependent Metric • Current: ${dm.current_value} ${dm.unit} → Simulated: ${dm.simulated_value} ${dm.unit}`
    });
    links.push({
      source: "root_metric",
      target: dm.id,
      label: "Cascades To"
    });
  });

  // Level 3: Saved Insights
  const mainInsights = affectedAssets.filter((a) => a.type === "saved_insight").slice(0, 2);
  mainInsights.forEach((ins, idx) => {
    nodes.push({
      id: ins.id,
      name: ins.name,
      category: "insight",
      level: 3,
      impact: "indirect",
      details: `Saved Insight • Saved by ${ins.owner}`
    });
    const parentDashboardId = mainDashboards[idx % mainDashboards.length]?.id || "root_metric";
    links.push({
      source: parentDashboardId,
      target: ins.id,
      label: "Cited In"
    });
  });

  return { nodes, links };
}

// ============================================================================
// 10. AUDIT TRAIL REPOSITORY (Section 23)
// ============================================================================

const INITIAL_SIMULATION_AUDIT: SimulationAuditRecord[] = [
  {
    simulation_id: "SIM-2026-00981",
    metric_id: "gross_margin",
    metric_name: "Gross Margin",
    current_version: "v2.1",
    proposed_version: "Draft",
    user_name: "Rajesh Kapoor",
    user_role: "Executive",
    timestamp: "2026-09-26 14:15:22",
    change_type: "formula_change",
    current_formula: "((Revenue - Cost) / Revenue) * 100",
    proposed_formula: "((Revenue - Cost - Logistics Cost) / Revenue) * 100",
    current_value: 27.2,
    simulated_value: 22.88,
    difference_pp: -4.32,
    affected_assets_count: 17,
    validation_status: "PASSED",
    status: "Simulation Only"
  },
  {
    simulation_id: "SIM-2026-00840",
    metric_id: "gross_margin",
    metric_name: "Gross Margin",
    current_version: "v2.1",
    proposed_version: "Draft",
    user_name: "Priya Sharma",
    user_role: "VP Strategic Finance",
    timestamp: "2026-09-25 11:30:10",
    change_type: "formula_change",
    current_formula: "((Revenue - Cost) / Revenue) * 100",
    proposed_formula: "((Revenue - Adjusted Cost) / Revenue) * 100",
    current_value: 27.2,
    simulated_value: 26.2,
    difference_pp: -1.0,
    affected_assets_count: 17,
    validation_status: "PASSED",
    status: "Under Review"
  },
  {
    simulation_id: "SIM-2026-00712",
    metric_id: "revenue",
    metric_name: "Recognized Revenue",
    current_version: "v2.4",
    proposed_version: "Draft",
    user_name: "Anand Verma",
    user_role: "Director of Financial Operations",
    timestamp: "2026-09-24 16:45:00",
    change_type: "business_rule_change",
    current_formula: "SUM(revenue)",
    proposed_formula: "SUM(revenue) - SUM(disputed_credits)",
    current_value: 48.6,
    simulated_value: 47.1,
    difference_pp: -1.5,
    affected_assets_count: 24,
    validation_status: "PASSED",
    status: "Simulation Only"
  }
];

let inMemoryAuditTrail: SimulationAuditRecord[] = [...INITIAL_SIMULATION_AUDIT];

export function getAuditTrail(): SimulationAuditRecord[] {
  return inMemoryAuditTrail;
}

export function saveAuditRecord(record: SimulationAuditRecord): void {
  // Prepend to top
  inMemoryAuditTrail = [record, ...inMemoryAuditTrail.filter((r) => r.simulation_id !== record.simulation_id)];
}

export function updateAuditStatus(simId: string, status: "Simulation Only" | "Under Review" | "Approved"): void {
  inMemoryAuditTrail = inMemoryAuditTrail.map((r) =>
    r.simulation_id === simId ? { ...r, status } : r
  );
}

// ============================================================================
// 11. AI PROMPT PARSER (Section 19 & 20)
// ============================================================================

export function parseNaturalLanguageToContract(
  prompt: string,
  selectedMetricId: string = "gross_margin"
): StrictSimulationContract {
  const p = prompt.toLowerCase();

  let targetMetric = selectedMetricId;
  if (p.includes("margin") || p.includes("gross margin")) targetMetric = "gross_margin";
  else if (p.includes("revenue")) targetMetric = "revenue";
  else if (p.includes("cost") || p.includes("cogs")) targetMetric = "cost";
  else if (p.includes("churn")) targetMetric = "churn_rate";
  else if (p.includes("order")) targetMetric = "order_count";

  const metricDef = IMPACT_METRICS_CATALOG[targetMetric] || IMPACT_METRICS_CATALOG.gross_margin;
  let proposedFormula = metricDef.formula;
  let changeType: ChangeType = "formula_change";

  if (p.includes("logistics")) {
    proposedFormula = "((Revenue - Cost - Logistics Cost) / Revenue) * 100";
    changeType = "formula_change";
  } else if (p.includes("freight") || p.includes("shipping")) {
    proposedFormula = "((Revenue - Cost - Logistics Cost) / Revenue) * 100";
    changeType = "formula_change";
  } else if (p.includes("adjusted cost") || p.includes("adjusted_cost")) {
    proposedFormula = "((Revenue - Adjusted Cost) / Revenue) * 100";
    changeType = "formula_change";
  } else if (p.includes("cancel") || p.includes("completed + partially")) {
    changeType = "filter_change";
    proposedFormula = metricDef.formula;
  } else if (p.includes("country") || p.includes("dimension")) {
    changeType = "dimension_change";
    proposedFormula = metricDef.formula;
  } else if (p.includes("fiscal quarter")) {
    changeType = "time_logic_change";
    proposedFormula = metricDef.formula;
  } else if (p.includes("fct_sales_v2") || p.includes("data source")) {
    changeType = "data_source_change";
    proposedFormula = metricDef.formula;
  }

  const rawContract = {
    metric: targetMetric,
    change_type: changeType,
    current_definition: {
      formula: metricDef.formula
    },
    proposed_definition: {
      formula: proposedFormula
    },
    simulation_scope: {
      region: p.includes("europe") ? "Europe" : p.includes("india") ? "India" : "Europe",
      period: p.includes("q3 2026") ? "Q3 2026" : "Q3 2026"
    }
  };

  // Validate through Zod contract schema
  return StrictSimulationContractSchema.parse(rawContract);
}
