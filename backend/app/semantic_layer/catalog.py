from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class DimensionDefinition(BaseModel):
    name: str
    display_name: str
    description: str
    table: str
    column: str
    type: str  # categorical, temporal, geo
    cardinality: Optional[int] = None
    sample_values: List[str] = []

class MetricLineageNode(BaseModel):
    id: str
    label: str
    layer: str  # warehouse, fact_table, dbt_model, semantic_definition, metric, business_query
    description: str
    status: str = "active"

class MetricDefinition(BaseModel):
    id: str
    name: str
    display_name: str
    category: str  # Profitability, Revenue, Customer, Operations
    description: str
    formula: str
    formula_sql: str
    data_source: str
    dbt_model: str
    dimensions: List[str]
    owner: str
    owner_role: str
    last_updated: str
    version: str
    status: str  # Verified, Under Review, Draft, Deprecated
    unit: str  # currency, percentage, count, ratio
    currency: str = "INR"
    is_additive: bool = True
    default_aggregation: str = "SUM"
    lineage_path: List[str] = []

# Governed Dimensions Catalog
GOVERNED_DIMENSIONS: Dict[str, DimensionDefinition] = {
    "region": DimensionDefinition(
        name="region",
        display_name="Region",
        description="Global operating region of the business transaction",
        table="dim_regions",
        column="region_name",
        type="geo",
        cardinality=4,
        sample_values=["Europe", "India", "North America", "APAC"]
    ),
    "country": DimensionDefinition(
        name="country",
        display_name="Country",
        description="Country within the operating sales region",
        table="dim_regions",
        column="country",
        type="geo",
        cardinality=12,
        sample_values=["Spain", "Germany", "France", "Italy", "United Kingdom", "India", "USA", "Singapore"]
    ),
    "product_category": DimensionDefinition(
        name="product_category",
        display_name="Product Category",
        description="High-level product classification",
        table="dim_products",
        column="category",
        type="categorical",
        cardinality=5,
        sample_values=["Enterprise SaaS", "Cloud Infrastructure", "Edge Compute", "Security Suite", "Data Core"]
    ),
    "customer_segment": DimensionDefinition(
        name="customer_segment",
        display_name="Customer Segment",
        description="Customer tier categorization based on contract value",
        table="dim_customers",
        column="segment",
        type="categorical",
        cardinality=3,
        sample_values=["Enterprise", "Mid-Market", "SMB"]
    ),
    "quarter": DimensionDefinition(
        name="quarter",
        display_name="Fiscal Quarter",
        description="Quarterly reporting financial period",
        table="dim_dates",
        column="fiscal_quarter",
        type="temporal",
        cardinality=8,
        sample_values=["Q1 2026", "Q2 2026", "Q3 2025", "Q4 2025"]
    ),
    "month": DimensionDefinition(
        name="month",
        display_name="Month",
        description="Monthly calendar period",
        table="dim_dates",
        column="month",
        type="temporal",
        cardinality=24,
        sample_values=["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"]
    ),
    "expense_category": DimensionDefinition(
        name="expense_category",
        display_name="Expense Category",
        description="Operational cost breakdown category",
        table="fct_expenses",
        column="category",
        type="categorical",
        cardinality=6,
        sample_values=["Logistics", "Raw Materials", "Cloud Hosting", "Sales & Marketing", "R&D", "General Admin"]
    )
}

# Governed Metrics Catalog
GOVERNED_METRICS: Dict[str, MetricDefinition] = {
    "revenue": MetricDefinition(
        id="revenue",
        name="revenue",
        display_name="Revenue",
        category="Revenue",
        description="Total top-line recognized invoiced sales across all client contracts and orders",
        formula="SUM(revenue)",
        formula_sql="SUM(fct_sales.revenue)",
        data_source="fct_sales",
        dbt_model="marts.finance.fct_sales",
        dimensions=["region", "country", "product_category", "customer_segment", "quarter", "month"],
        owner="Priya Sharma",
        owner_role="VP of Strategic Finance",
        last_updated="2026-09-15",
        version="2.4.0",
        status="Verified",
        unit="currency",
        currency="INR",
        is_additive=True,
        default_aggregation="SUM",
        lineage_path=["Snowflake Data Warehouse", "fct_sales", "dbt marts.finance", "Semantic Definition: Revenue", "Executive KPI Engine"]
    ),
    "cost": MetricDefinition(
        id="cost",
        name="cost",
        display_name="Cost of Goods Sold (COGS)",
        category="Profitability",
        description="Direct manufacturing, logistics, supplier, and delivery expenses incurred",
        formula="SUM(cost)",
        formula_sql="SUM(fct_sales.cost)",
        data_source="fct_sales",
        dbt_model="marts.finance.fct_sales",
        dimensions=["region", "country", "product_category", "quarter", "month", "expense_category"],
        owner="Anand Verma",
        owner_role="Director of Financial Operations",
        last_updated="2026-09-12",
        version="2.1.0",
        status="Verified",
        unit="currency",
        currency="INR",
        is_additive=True,
        default_aggregation="SUM",
        lineage_path=["Snowflake Data Warehouse", "fct_sales", "dbt marts.finance", "Semantic Definition: Cost", "Executive KPI Engine"]
    ),
    "gross_profit": MetricDefinition(
        id="gross_profit",
        name="gross_profit",
        display_name="Gross Profit",
        category="Profitability",
        description="Total revenue remaining after subtracting direct cost of sales",
        formula="Revenue - Cost",
        formula_sql="SUM(fct_sales.revenue) - SUM(fct_sales.cost)",
        data_source="fct_sales",
        dbt_model="marts.finance.fct_sales",
        dimensions=["region", "country", "product_category", "customer_segment", "quarter", "month"],
        owner="Priya Sharma",
        owner_role="VP of Strategic Finance",
        last_updated="2026-09-15",
        version="2.4.0",
        status="Verified",
        unit="currency",
        currency="INR",
        is_additive=False,
        default_aggregation="CALCULATED",
        lineage_path=["Snowflake Data Warehouse", "fct_sales", "dbt marts.finance", "Semantic Definition: Gross Profit", "Executive KPI Engine"]
    ),
    "gross_margin": MetricDefinition(
        id="gross_margin",
        name="gross_margin",
        display_name="Gross Margin",
        category="Profitability",
        description="Gross Profit expressed as a percentage of Total Revenue. Indicates operational profitability efficiency.",
        formula="((Revenue - Cost) / Revenue) * 100",
        formula_sql="((SUM(fct_sales.revenue) - SUM(fct_sales.cost)) / NULLIF(SUM(fct_sales.revenue), 0)) * 100",
        data_source="fct_sales",
        dbt_model="marts.finance.fct_sales",
        dimensions=["region", "country", "product_category", "customer_segment", "quarter", "month"],
        owner="Priya Sharma",
        owner_role="VP of Strategic Finance",
        last_updated="2026-09-18",
        version="3.0.1",
        status="Verified",
        unit="percentage",
        currency="INR",
        is_additive=False,
        default_aggregation="RATIO",
        lineage_path=["Snowflake Data Warehouse", "fct_sales", "dbt marts.finance", "Semantic Definition: Gross Margin", "Executive Variance & Driver Engine"]
    ),
    "net_profit": MetricDefinition(
        id="net_profit",
        name="net_profit",
        display_name="Net Profit",
        category="Profitability",
        description="Total net earnings after all direct COGS, regional operating expenses, and corporate overhead",
        formula="Gross Profit - Total Expenses",
        formula_sql="(SUM(fct_sales.revenue) - SUM(fct_sales.cost)) - SUM(fct_expenses.amount)",
        data_source="fct_sales, fct_expenses",
        dbt_model="marts.finance.fct_income_statement",
        dimensions=["region", "country", "quarter", "month"],
        owner="Priya Sharma",
        owner_role="VP of Strategic Finance",
        last_updated="2026-09-10",
        version="1.8.0",
        status="Verified",
        unit="currency",
        currency="INR",
        is_additive=False,
        default_aggregation="CALCULATED",
        lineage_path=["Snowflake Data Warehouse", "fct_sales & fct_expenses", "dbt marts.finance", "Semantic Definition: Net Profit", "Executive KPI Engine"]
    ),
    "churn_rate": MetricDefinition(
        id="churn_rate",
        name="churn_rate",
        display_name="Customer Churn Rate",
        category="Customer",
        description="Percentage of active accounts that cancelled or failed to renew contracts over the specified reporting period",
        formula="(Churned Customers / Total Customers) * 100",
        formula_sql="(COUNT(DISTINCT CASE WHEN churned = 1 THEN customer_id END) * 100.0) / NULLIF(COUNT(DISTINCT customer_id), 0)",
        data_source="dim_customers",
        dbt_model="marts.core.dim_customers",
        dimensions=["region", "country", "customer_segment", "quarter"],
        owner="Vikram Malhotra",
        owner_role="Head of Customer Success",
        last_updated="2026-09-08",
        version="2.0.0",
        status="Verified",
        unit="percentage",
        currency="INR",
        is_additive=False,
        default_aggregation="RATIO",
        lineage_path=["Snowflake Data Warehouse", "dim_customers", "dbt marts.core", "Semantic Definition: Churn Rate", "Customer Health Dashboard"]
    ),
    "order_count": MetricDefinition(
        id="order_count",
        name="order_count",
        display_name="Total Order Count",
        category="Operations",
        description="Total count of unique commercial sales orders processed and fulfilled",
        formula="COUNT(order_id)",
        formula_sql="COUNT(DISTINCT fct_orders.order_id)",
        data_source="fct_orders",
        dbt_model="marts.sales.fct_orders",
        dimensions=["region", "country", "product_category", "customer_segment", "quarter", "month"],
        owner="Rohan Mehta",
        owner_role="Lead Data Engineer",
        last_updated="2026-08-30",
        version="1.5.0",
        status="Verified",
        unit="count",
        currency="INR",
        is_additive=True,
        default_aggregation="COUNT_DISTINCT",
        lineage_path=["Snowflake Data Warehouse", "fct_orders", "dbt marts.sales", "Semantic Definition: Order Count", "Operations Center"]
    ),
    "average_order_value": MetricDefinition(
        id="average_order_value",
        name="average_order_value",
        display_name="Average Order Value (AOV)",
        category="Revenue",
        description="Average monetary value per commercial sales order fulfilled",
        formula="Revenue / Order Count",
        formula_sql="SUM(fct_sales.revenue) / NULLIF(COUNT(DISTINCT fct_orders.order_id), 0)",
        data_source="fct_sales, fct_orders",
        dbt_model="marts.sales.fct_orders",
        dimensions=["region", "country", "product_category", "customer_segment", "quarter"],
        owner="Rohan Mehta",
        owner_role="Lead Data Engineer",
        last_updated="2026-08-30",
        version="1.5.0",
        status="Verified",
        unit="currency",
        currency="INR",
        is_additive=False,
        default_aggregation="RATIO",
        lineage_path=["Snowflake Data Warehouse", "fct_sales & fct_orders", "dbt marts.sales", "Semantic Definition: AOV", "Commercial Performance Engine"]
    ),
    "customer_lifetime_value": MetricDefinition(
        id="customer_lifetime_value",
        name="customer_lifetime_value",
        display_name="Customer Lifetime Value (CLV)",
        category="Customer",
        description="Projected net commercial revenue contribution of a customer over the full relationship lifespan",
        formula="(Average Order Value * Purchase Frequency) / (Churn Rate / 100)",
        formula_sql="((SUM(fct_sales.revenue) / NULLIF(COUNT(DISTINCT fct_orders.order_id), 0)) * (COUNT(fct_orders.order_id) / COUNT(DISTINCT dim_customers.customer_id))) / (NULLIF(churn_rate, 0) / 100.0)",
        data_source="dim_customers, fct_sales, fct_orders",
        dbt_model="marts.growth.clv_models",
        dimensions=["region", "customer_segment", "quarter"],
        owner="Vikram Malhotra",
        owner_role="Head of Customer Success",
        last_updated="2026-09-02",
        version="1.2.0",
        status="Under Review",
        unit="currency",
        currency="INR",
        is_additive=False,
        default_aggregation="CALCULATED",
        lineage_path=["Snowflake Data Warehouse", "dim_customers, fct_sales", "dbt marts.growth", "Semantic Definition: CLV", "Growth Forecasting Suite"]
    )
}

def get_metric(metric_id: str) -> Optional[MetricDefinition]:
    return GOVERNED_METRICS.get(metric_id.lower().strip())

def list_metrics(category: Optional[str] = None, status: Optional[str] = None) -> List[MetricDefinition]:
    metrics = list(GOVERNED_METRICS.values())
    if category:
        metrics = [m for m in metrics if m.category.lower() == category.lower()]
    if status:
        metrics = [m for m in metrics if m.status.lower() == status.lower()]
    return metrics

def list_dimensions() -> List[DimensionDefinition]:
    return list(GOVERNED_DIMENSIONS.values())
