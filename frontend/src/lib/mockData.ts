import {
  MetricDefinition,
  ExecutiveOverviewData,
  MetricMindChatResponse,
  LineageGraphData,
  AuditLog,
  SavedInsight,
  QueryHistoryItem
} from "@/types";

export const GOVERNED_METRIC_CATALOG: MetricDefinition[] = [
  {
    id: "revenue",
    display_name: "Gross Revenue",
    description: "Total recognized top-line enterprise billings prior to contractual discounts and allowances.",
    category: "Revenue",
    formula: "SUM(fct_sales.revenue)",
    formula_sql: "SELECT SUM(revenue) FROM marts.finance.fct_sales",
    unit: "currency_inr",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    supported_dimensions: ["region", "country", "product_category", "customer_segment", "quarter", "month"],
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    last_updated: "2026-09-20",
    version: "2.4.0",
    status: "Verified",
    usage_count: 1420
  },
  {
    id: "cost",
    display_name: "Cost of Goods Sold (COGS)",
    description: "Direct manufacturing, logistics, software delivery, and cloud infrastructure expenses.",
    category: "Profitability",
    formula: "SUM(fct_sales.cost) + SUM(fct_expenses.allocated_delivery_cost)",
    formula_sql: "SELECT SUM(cost) FROM marts.finance.fct_sales",
    unit: "currency_inr",
    data_source: "fct_sales, fct_expenses",
    dbt_model: "marts.finance.fct_sales",
    supported_dimensions: ["region", "country", "expense_category", "quarter", "month"],
    owner: "Marcus Vance",
    owner_role: "Principal Data Architect",
    last_updated: "2026-09-18",
    version: "2.1.0",
    status: "Verified",
    usage_count: 890
  },
  {
    id: "gross_profit",
    display_name: "Gross Profit",
    description: "Net operational earnings after deducting total direct cost of goods sold from gross revenue.",
    category: "Profitability",
    formula: "Gross Revenue - Cost of Goods Sold",
    formula_sql: "SELECT SUM(revenue) - SUM(cost) FROM marts.finance.fct_sales",
    unit: "currency_inr",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    supported_dimensions: ["region", "country", "product_category", "quarter"],
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    last_updated: "2026-09-21",
    version: "3.0.0",
    status: "Verified",
    usage_count: 1104
  },
  {
    id: "gross_margin",
    display_name: "Gross Margin %",
    description: "Percentage of top-line revenue retained after incurring direct costs of delivering products and services.",
    category: "Profitability",
    formula: "((Gross Revenue - Cost of Goods Sold) / Gross Revenue) * 100",
    formula_sql: "SELECT ((SUM(revenue) - SUM(cost)) * 1.0 / NULLIF(SUM(revenue), 0)) * 100 FROM marts.finance.fct_sales",
    unit: "percentage",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    supported_dimensions: ["region", "country", "product_category", "customer_segment", "quarter", "month"],
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    last_updated: "2026-09-22",
    version: "3.1.2",
    status: "Verified",
    usage_count: 2840
  },
  {
    id: "net_profit",
    display_name: "Net Profit",
    description: "Bottom-line organizational profitability after subtracting OPEX, SG&A, and depreciation.",
    category: "Profitability",
    formula: "Gross Profit - Operating Expenses",
    formula_sql: "SELECT (SUM(s.revenue) - SUM(s.cost)) - COALESCE(SUM(e.amount), 0) FROM marts.finance.fct_sales s LEFT JOIN marts.finance.fct_expenses e",
    unit: "currency_inr",
    data_source: "fct_sales, fct_expenses",
    dbt_model: "marts.finance.fct_financial_statement",
    supported_dimensions: ["region", "quarter", "fiscal_year"],
    owner: "Devon Clark",
    owner_role: "Lead Financial Analyst",
    last_updated: "2026-09-15",
    version: "1.9.4",
    status: "Verified",
    usage_count: 730
  },
  {
    id: "churn_rate",
    display_name: "Customer Churn Rate",
    description: "Proportion of active enterprise accounts that downgraded or terminated contracts within period.",
    category: "Customer",
    formula: "(Churned Customers / Active Beginning Customers) * 100",
    formula_sql: "SELECT (COUNT(CASE WHEN is_churned THEN 1 END) * 100.0 / COUNT(*)) FROM marts.crm.dim_customers",
    unit: "percentage",
    data_source: "dim_customers",
    dbt_model: "marts.crm.dim_customers",
    supported_dimensions: ["region", "customer_segment", "contract_type", "quarter"],
    owner: "Anya Rostova",
    owner_role: "Director Customer Success",
    last_updated: "2026-09-12",
    version: "2.0.1",
    status: "Verified",
    usage_count: 980
  },
  {
    id: "order_count",
    display_name: "Order Count",
    description: "Total count of processed and finalized enterprise transactions.",
    category: "Operations",
    formula: "COUNT(DISTINCT order_id)",
    formula_sql: "SELECT COUNT(DISTINCT order_id) FROM marts.sales.fct_orders",
    unit: "count",
    data_source: "fct_orders",
    dbt_model: "marts.sales.fct_orders",
    supported_dimensions: ["region", "country", "customer_segment", "quarter", "month"],
    owner: "Marcus Vance",
    owner_role: "Principal Data Architect",
    last_updated: "2026-09-10",
    version: "1.5.0",
    status: "Verified",
    usage_count: 650
  },
  {
    id: "average_order_value",
    display_name: "Average Order Value (AOV)",
    description: "Average gross revenue transacted per closed enterprise order.",
    category: "Operations",
    formula: "Gross Revenue / Order Count",
    formula_sql: "SELECT SUM(revenue) / COUNT(DISTINCT order_id) FROM marts.sales.fct_orders",
    unit: "currency_inr",
    data_source: "fct_orders",
    dbt_model: "marts.sales.fct_orders",
    supported_dimensions: ["region", "customer_segment", "quarter"],
    owner: "Devon Clark",
    owner_role: "Lead Financial Analyst",
    last_updated: "2026-09-08",
    version: "1.4.2",
    status: "Verified",
    usage_count: 512
  },
  {
    id: "customer_lifetime_value",
    display_name: "Customer Lifetime Value (CLV)",
    description: "Predictive governed NPV of the net profit attributed to the entire future relationship with a customer.",
    category: "Customer",
    formula: "(Average Order Value * Purchase Frequency) / Churn Rate",
    formula_sql: "SELECT (AVG(aov) * AVG(frequency)) / NULLIF(AVG(churn), 0) FROM marts.analytics.clv_cohorts",
    unit: "currency_inr",
    data_source: "clv_cohorts",
    dbt_model: "marts.analytics.clv_cohorts",
    supported_dimensions: ["customer_segment", "region", "acquisition_channel"],
    owner: "Priya Sharma",
    owner_role: "VP Strategic Finance",
    last_updated: "2026-09-01",
    version: "1.2.0",
    status: "Under Review",
    usage_count: 320
  }
];

export const DEFAULT_OVERVIEW_DATA: ExecutiveOverviewData = {
  period: "Q2 2026",
  region: "Global",
  greeting: "Good morning, Executive",
  subtitle: "Here's what is happening across your business with governed metric integrity.",
  kpis: [
    {
      id: "revenue",
      name: "Revenue",
      current_value: "₹48.6 Cr",
      raw_value: 486000000,
      previous_value: "₹43.2 Cr",
      change_pct: "+12.4%",
      change_type: "positive",
      subtext: "vs previous quarter (Q1 2026)",
      sparkline: [38.4, 41.2, 43.2, 48.6],
      governed_formula: "SUM(fct_sales.revenue)",
      status: "Verified"
    },
    {
      id: "gross_margin",
      name: "Gross Margin",
      current_value: "27.2%",
      raw_value: 27.2,
      previous_value: "31.4%",
      change_pct: "-4.2 pp",
      change_type: "negative",
      subtext: "vs previous quarter (EU logistics drag)",
      sparkline: [30.1, 30.8, 31.4, 27.2],
      governed_formula: "((Revenue - Cost) / Revenue) * 100",
      status: "Verified"
    },
    {
      id: "net_profit",
      name: "Net Profit",
      current_value: "₹6.8 Cr",
      raw_value: 68000000,
      previous_value: "₹6.3 Cr",
      change_pct: "+8.1%",
      change_type: "positive",
      subtext: "vs previous quarter",
      sparkline: [4.9, 5.7, 6.3, 6.8],
      governed_formula: "Gross Profit - Operating Expenses",
      status: "Verified"
    },
    {
      id: "churn_rate",
      name: "Customer Churn",
      current_value: "4.8%",
      raw_value: 4.8,
      previous_value: "5.1%",
      change_pct: "-0.3 pp",
      change_type: "positive",
      subtext: "Enterprise retention steady at 98.8%",
      sparkline: [5.6, 5.3, 5.1, 4.8],
      governed_formula: "(Churned / Total Customers) * 100",
      status: "Verified"
    },
    {
      id: "order_count",
      name: "Total Orders",
      current_value: "338",
      raw_value: 338,
      previous_value: "296",
      change_pct: "+14.2%",
      change_type: "positive",
      subtext: "Quarterly enterprise order volume",
      sparkline: [260, 280, 296, 338],
      governed_formula: "COUNT(DISTINCT fct_orders.order_id)",
      status: "Verified"
    },
    {
      id: "average_order_value",
      name: "Average Order Value",
      current_value: "₹14.38 L",
      raw_value: 1438000,
      previous_value: "₹14.61 L",
      change_pct: "-1.6%",
      change_type: "neutral",
      subtext: "Slight mid-market mix skew",
      sparkline: [14.7, 14.7, 14.6, 14.4],
      governed_formula: "Revenue / Order Count",
      status: "Verified"
    }
  ],
  regional_distribution: [
    { region: "Europe", revenue: 158000000, revenue_formatted: "₹15.8 Cr", margin: 27.2, orders: 110, change: "-4.2 pp" },
    { region: "North America", revenue: 142000000, revenue_formatted: "₹14.2 Cr", margin: 34.1, orders: 98, change: "+1.1 pp" },
    { region: "India", revenue: 124000000, revenue_formatted: "₹12.4 Cr", margin: 38.2, orders: 85, change: "+3.4 pp" },
    { region: "APAC", revenue: 62000000, revenue_formatted: "₹6.2 Cr", margin: 32.5, orders: 45, change: "+0.8 pp" }
  ],
  revenue_trend: [
    { quarter: "Q3 2025", Europe: 12.2, "North America": 11.5, India: 8.9, APAC: 4.8, Total: 37.4 },
    { quarter: "Q4 2025", Europe: 13.5, "North America": 12.8, India: 10.2, APAC: 5.4, Total: 41.9 },
    { quarter: "Q1 2026", Europe: 14.2, "North America": 13.4, India: 10.8, APAC: 4.8, Total: 43.2 },
    { quarter: "Q2 2026", Europe: 15.8, "North America": 14.2, India: 12.4, APAC: 6.2, Total: 48.6 }
  ],
  margin_trend: [
    { quarter: "Q3 2025", Europe: 30.1, "North America": 33.2, India: 35.8, APAC: 31.0, Global: 32.5 },
    { quarter: "Q4 2025", Europe: 30.8, "North America": 33.8, India: 36.4, APAC: 31.8, Global: 33.2 },
    { quarter: "Q1 2026", Europe: 31.4, "North America": 33.0, India: 34.8, APAC: 31.7, Global: 32.7 },
    { quarter: "Q2 2026", Europe: 27.2, "North America": 34.1, India: 38.2, APAC: 32.5, Global: 33.0 }
  ],
  top_products: [
    { name: "Apex Cloud Core Suite", category: "Cloud Infrastructure", revenue: "₹16.4 Cr", margin: "36.2%", growth: "+18.2%" },
    { name: "MetricMind Enterprise Analytics", category: "Enterprise SaaS", revenue: "₹14.8 Cr", margin: "47.1%", growth: "+26.5%" },
    { name: "Sentinels AI Security Guard", category: "Security Suite", revenue: "₹8.2 Cr", margin: "39.1%", growth: "+12.0%" },
    { name: "EdgeCompute IoT Gateway", category: "Edge Compute", revenue: "₹5.6 Cr", margin: "32.6%", growth: "+4.1%" },
    { name: "OmniStream Data Fabric", category: "Data Core", revenue: "₹3.6 Cr", margin: "44.1%", growth: "+9.8%" }
  ],
  governed_signature: "METRICMIND-GOVERNED-ANALYTICS-2026-A89F"
};

export const DEFAULT_EUROPE_MARGIN_RESPONSE: MetricMindChatResponse = {
  conversation_id: "CONV_EUR_MARGIN_01",
  question: "Why did our European margins drop last quarter?",
  status: "success",
  processing_time_ms: 342.5,
  reasoning_steps: [
    { step_number: 1, title: "Understand User Intent", status: "completed", detail: "Identified analytical pattern: 'variance_driver_analysis'", timestamp_ms: 22.1 },
    { step_number: 2, title: "Identify Governed Metric", status: "completed", detail: "Resolved to governed metric: 'Gross Margin %' (ID: gross_margin)", timestamp_ms: 45.3 },
    { step_number: 3, title: "Identify Target Dimensions", status: "completed", detail: "Selected analytical dimensions: country, region, expense_category", timestamp_ms: 78.4 },
    { step_number: 4, title: "Identify Filters", status: "completed", detail: "Applied governance filters: region = 'Europe'", timestamp_ms: 110.2 },
    { step_number: 5, title: "Identify Time Period", status: "completed", detail: "Target period: Q2 2026 (Baseline: Q1 2026)", timestamp_ms: 145.8 },
    { step_number: 6, title: "Retrieve Semantic Definition", status: "completed", detail: "Formula: ((Revenue - Cost) / Revenue) * 100 | Verified by Priya Sharma", timestamp_ms: 180.4 },
    { step_number: 7, title: "Construct Semantic Query", status: "completed", detail: "Built governed query payload for semantic layer without exposing raw SQL", timestamp_ms: 215.1 },
    { step_number: 8, title: "Execute Semantic Retrieval", status: "completed", detail: "Retrieved 110 governed records with security token MM-SIG-EUR-2026Q2", timestamp_ms: 248.9 },
    { step_number: 9, title: "Perform Analytical Reasoning", status: "completed", detail: "Decomposed variance into 4 dimensional vectors and 4 cost drivers", timestamp_ms: 282.6 },
    { step_number: 10, title: "Synthesize Executive Explanation", status: "completed", detail: "Generated governance-aligned executive summary and driver narrative", timestamp_ms: 305.2 },
    { step_number: 11, title: "Select Visualizations", status: "completed", detail: "Selected primary visualization: 'waterfall' (Driver Waterfall) & secondary: 'bar'", timestamp_ms: 324.0 },
    { step_number: 12, title: "Finalize Governed Response", status: "completed", detail: "Synthesized complete evidence payload in 342.5ms", timestamp_ms: 342.5 }
  ],
  executive_summary: "European gross margin declined from 31.4% to 27.2%, a decline of 4.2 percentage points. The largest contributors were increased logistics costs (+38.4%) and material costs (+24.1%), with Spain contributing the largest regional decline (-1.7 pp), followed by Germany (-1.1 pp), France (-0.8 pp), and Italy (-0.6 pp).",
  kpi_comparison: {
    metric_id: "gross_margin",
    metric_name: "Gross Margin %",
    current_period: "Q2 2026",
    baseline_period: "Q1 2026",
    current_value: 27.2,
    baseline_value: 31.4,
    difference: -4.2,
    percentage_change: "-4.2 pp",
    unit: "percentage",
    is_positive: false
  },
  governed_metric: {
    id: "gross_margin",
    name: "Gross Margin %",
    formula: "((Revenue - Cost) / Revenue) * 100",
    data_source: "fct_sales",
    dbt_model: "marts.finance.fct_sales",
    owner: "Priya Sharma (VP Strategic Finance)",
    version: "3.1.2",
    status: "Verified"
  },
  drivers: [
    { driver: "Logistics & Freight Surge", category: "Logistics", current_amount: 32400000, baseline_amount: 23400000, change_pct: "+38.4%", impact_pp: -2.3 },
    { driver: "Hardware & Component COGS", category: "Raw Materials", current_amount: 51200000, baseline_amount: 41200000, change_pct: "+24.1%", impact_pp: -1.4 },
    { driver: "Cloud Hosting & Bandwidth", category: "Infrastructure", current_amount: 21800000, baseline_amount: 19800000, change_pct: "+10.1%", impact_pp: -0.4 },
    { driver: "Field Support & Delivery", category: "Operations", current_amount: 10400000, baseline_amount: 9900000, change_pct: "+5.1%", impact_pp: -0.1 }
  ],
  regional_breakdown: [
    { dimension: "country", value_name: "Spain", current_value: 23.4, previous_value: 29.8, delta: -6.4, weighted_impact_pp: -1.7, revenue: 38000000 },
    { dimension: "country", value_name: "Germany", current_value: 28.1, previous_value: 32.2, delta: -4.1, weighted_impact_pp: -1.1, revenue: 52000000 },
    { dimension: "country", value_name: "France", current_value: 27.8, previous_value: 30.9, delta: -3.1, weighted_impact_pp: -0.8, revenue: 41000000 },
    { dimension: "country", value_name: "Italy", current_value: 29.2, previous_value: 32.0, delta: -2.8, weighted_impact_pp: -0.6, revenue: 27000000 }
  ],
  primary_chart_type: "waterfall",
  primary_chart_data: [
    { name: "Q1 2026 Baseline", value: 31.4, is_total: true },
    { name: "Spain Drag", value: -1.7 },
    { name: "Germany Drag", value: -1.1 },
    { name: "France Drag", value: -0.8 },
    { name: "Italy Drag", value: -0.6 },
    { name: "Q2 2026 European Margin", value: 27.2, is_total: true }
  ],
  secondary_chart_type: "bar",
  secondary_chart_data: [
    { name: "Logistics & Freight Surge", amount: 32400000, change: "+38.4%", impact: -2.3 },
    { name: "Hardware COGS", amount: 51200000, change: "+24.1%", impact: -1.4 },
    { name: "Cloud Infrastructure", amount: 21800000, change: "+10.1%", impact: -0.4 },
    { name: "Field Support", amount: 10400000, change: "+5.1%", impact: -0.1 }
  ],
  evidence: {
    headers: ["Country", "Baseline (Q1)", "Current (Q2)", "Delta (pp)", "Impact on EU", "Revenue (₹)"],
    rows: [
      ["Spain", "29.8%", "23.4%", "-6.40 pp", "-1.70 pp", "₹3.80 Cr"],
      ["Germany", "32.2%", "28.1%", "-4.10 pp", "-1.10 pp", "₹5.20 Cr"],
      ["France", "30.9%", "27.8%", "-3.10 pp", "-0.80 pp", "₹4.10 Cr"],
      ["Italy", "32.0%", "29.2%", "-2.80 pp", "-0.60 pp", "₹2.70 Cr"]
    ],
    total_records: 4,
    governed_signature: "MM-SIG-GOV-EUR-88A9F"
  },
  calculation_details: {
    metric_name: "Gross Margin %",
    governed_formula: "((Revenue - Cost) / Revenue) * 100",
    sql_equivalent: "SELECT ((SUM(revenue) - SUM(cost)) * 1.0 / NULLIF(SUM(revenue), 0)) * 100 FROM marts.finance.fct_sales WHERE region = 'Europe'",
    source_model: "marts.finance.fct_sales",
    fact_table: "fct_sales",
    dimensions_evaluated: ["country", "region", "quarter"],
    applied_filters: { region: "Europe" },
    reporting_period: "Q2 2026 vs Q1 2026",
    verified_by: "Priya Sharma (VP Strategic Finance)",
    version: "3.1.2",
    governance_status: "Verified"
  },
  suggested_followups: [
    "What specific logistics routes caused Spain's cost surge?",
    "How did Enterprise SaaS product margins perform in Germany?",
    "Compare Europe margins against India and North America.",
    "What actions can restore European gross margin to 31% in Q3?"
  ]
};

export const DEFAULT_LINEAGE_DATA: LineageGraphData = {
  metric_id: "gross_margin",
  nodes: [
    {
      id: "node_question",
      layer: "Conversational BI",
      title: "Natural Language Question",
      detail: '"Why did our European margins drop last quarter?"',
      status: "Resolved",
      type: "question"
    },
    {
      id: "node_metric",
      layer: "Governed Metric",
      title: "Gross Margin % (ID: gross_margin)",
      detail: "Unit: % | Category: Profitability | Owner: Priya Sharma",
      status: "Verified",
      type: "metric"
    },
    {
      id: "node_semantic",
      layer: "Semantic Definition",
      title: "Semantic Layer Formula",
      detail: "((Revenue - Cost) / Revenue) * 100",
      status: "Active v3.1.2",
      type: "semantic"
    },
    {
      id: "node_dbt",
      layer: "dbt Transformation Mart",
      title: "marts.finance.fct_sales",
      detail: "Aggregated daily incremental mart with dimensions",
      status: "Fresh (2h ago)",
      type: "dbt"
    },
    {
      id: "node_facts",
      layer: "Staging & Fact Tables",
      title: "raw_crm_orders + raw_erp_expenses",
      detail: "fct_sales, fct_expenses, dim_regions, dim_customers",
      status: "Synchronized",
      type: "table"
    },
    {
      id: "node_warehouse",
      layer: "Enterprise Warehouse",
      title: "Snowflake DW / Cloud Lakehouse",
      detail: "PROD_ANALYTICS.FINANCE_SCHEMA",
      status: "Online",
      type: "warehouse"
    }
  ],
  edges: [
    { from: "node_question", to: "node_metric", label: "Resolves Intent" },
    { from: "node_metric", to: "node_semantic", label: "Governs Logic" },
    { from: "node_semantic", to: "node_dbt", label: "Semantic Query" },
    { from: "node_dbt", to: "node_facts", label: "Model Transformation" },
    { from: "node_facts", to: "node_warehouse", label: "Direct Storage" }
  ],
  layer_descriptions: {
    "Conversational BI": "Interprets executive natural language and maps to governed entities without generating rogue SQL.",
    "Governed Metric": "Single source of truth metric catalog preventing calculation drift across business departments.",
    "Semantic Definition": "Strict mathematical rules that dictate aggregation and dimensional slice-and-dice behavior.",
    "dbt Transformation Mart": "Automated data models with testing, documentation, and data quality assertions.",
    "Staging & Fact Tables": "Normalized dimensional star schema populated from source transactional ERP/CRM systems.",
    "Enterprise Warehouse": "High-performance enterprise analytical storage (Snowflake, BigQuery, Databricks)."
  },
  governed_compliance: "100% Governed (Zero Rogue SQL Leakage)"
};

export const INITIAL_SAVED_INSIGHTS: SavedInsight[] = [
  {
    id: "INS_EUR_001",
    title: "European Margin Contraction — Q2 2026",
    question: "Why did our European margins drop last quarter?",
    metric_id: "gross_margin",
    executive_summary: "European gross margin declined from 31.4% to 27.2%, a 4.2 pp drop driven by logistics (+38.4%) and raw materials (+24.1%), led by Spain.",
    chart_type: "waterfall",
    chart_data: DEFAULT_EUROPE_MARGIN_RESPONSE.primary_chart_data,
    drivers: DEFAULT_EUROPE_MARGIN_RESPONSE.drivers,
    filters: { region: "Europe" },
    semantic_definition: "((Revenue - Cost) / Revenue) * 100",
    created_by: "Rajesh Kapoor",
    created_at: "2026-09-24 10:15:00"
  },
  {
    id: "INS_REV_002",
    title: "Global Q2 Revenue Expansion (+12.4%)",
    question: "What was our revenue growth this year?",
    metric_id: "revenue",
    executive_summary: "Global revenue reached ₹48.6 Cr in Q2 2026, expanding by +12.4% vs Q1 (₹43.2 Cr), led by Enterprise SaaS in India (+28%) and NA (+15%).",
    chart_type: "bar",
    chart_data: [
      { name: "Europe", value: 158000000, previous: 142000000 },
      { name: "North America", value: 142000000, previous: 134000000 },
      { name: "India", value: 124000000, previous: 108000000 },
      { name: "APAC", value: 62000000, previous: 48000000 }
    ],
    drivers: [],
    filters: {},
    semantic_definition: "SUM(fct_sales.revenue)",
    created_by: "Priya Sharma",
    created_at: "2026-09-23 14:30:00"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "AUD_9012A",
    action: "METRIC_VERIFIED",
    target_type: "METRIC",
    target_id: "gross_margin",
    performed_by: "Priya Sharma",
    role: "VP Strategic Finance",
    details: "Verified version 3.1.2 mathematical formula consistency with corporate finance guidelines.",
    compliance_status: "COMPLIANT",
    created_at: "2026-09-24 09:12:44"
  },
  {
    id: "AUD_8821B",
    action: "ROGUE_SQL_BLOCKED",
    target_type: "QUERY_GATEWAY",
    target_id: "GW_INTERCEPT_77",
    performed_by: "System Gateway",
    role: "Automated Defense",
    details: "Intercepted un-governed raw SQL prompt. Rerouted to semantic layer resolver.",
    compliance_status: "ENFORCED",
    created_at: "2026-09-24 08:45:12"
  },
  {
    id: "AUD_7743C",
    action: "SEMANTIC_SCHEMA_SYNC",
    target_type: "CATALOG",
    target_id: "CUBE_DBT_SYNC",
    performed_by: "Marcus Vance",
    role: "Principal Data Architect",
    details: "Synchronized 9 governed metrics and 7 dimensions with dbt production manifest.",
    compliance_status: "COMPLIANT",
    created_at: "2026-09-23 18:20:00"
  },
  {
    id: "AUD_6619D",
    action: "ROLE_PERMISSION_APPLIED",
    target_type: "SECURITY",
    target_id: "SALES_ANALYST_ROLE",
    performed_by: "Rajesh Kapoor",
    role: "Admin",
    details: "Configured dimensional masking on financial cost breakdowns for Sales Analyst role.",
    compliance_status: "COMPLIANT",
    created_at: "2026-09-22 11:05:18"
  }
];

export const INITIAL_QUERY_HISTORY: QueryHistoryItem[] = [
  {
    id: "QH_001",
    question: "Why did our European margins drop last quarter?",
    user_role: "Executive",
    user_name: "Rajesh Kapoor",
    metric_used: "gross_margin",
    dimensions: ["country", "region"],
    filters: { region: "Europe" },
    executive_summary: "European gross margin declined from 31.4% to 27.2%, a 4.2 pp decline. The largest contributors were logistics and material costs.",
    execution_ms: 342.5,
    status: "Completed",
    created_at: "2026-09-24 10:14:22"
  },
  {
    id: "QH_002",
    question: "What was our revenue growth this year?",
    user_role: "Executive",
    user_name: "Rajesh Kapoor",
    metric_used: "revenue",
    dimensions: ["region", "quarter"],
    filters: {},
    executive_summary: "Global revenue reached ₹48.6 Cr in Q2 2026, expanding by +12.4% vs Q1 2026.",
    execution_ms: 288.1,
    status: "Completed",
    created_at: "2026-09-24 09:30:11"
  },
  {
    id: "QH_003",
    question: "Which region has the highest margin?",
    user_role: "Finance Analyst",
    user_name: "Devon Clark",
    metric_used: "gross_margin",
    dimensions: ["region"],
    filters: {},
    executive_summary: "India commands the highest gross margin at 38.2% (+3.4 pp), followed by North America (34.1%) and APAC (32.5%).",
    execution_ms: 310.4,
    status: "Completed",
    created_at: "2026-09-23 16:45:00"
  },
  {
    id: "QH_004",
    question: "Which products are driving profit?",
    user_role: "Executive",
    user_name: "Rajesh Kapoor",
    metric_used: "gross_profit",
    dimensions: ["product_category"],
    filters: {},
    executive_summary: "MetricMind Enterprise Analytics and Apex Cloud Core Suite generate 64.2% of all company gross profit with 47.1% and 36.2% margins.",
    execution_ms: 295.7,
    status: "Completed",
    created_at: "2026-09-23 14:12:35"
  }
];
