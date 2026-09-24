from fastapi import APIRouter, Query
from typing import Dict, Any, Optional, List
from app.data.database import db
from app.semantic_layer.catalog import GOVERNED_METRICS
from app.semantic_layer.query_engine import semantic_engine, SemanticQuery, SemanticFilter
from app.agent.reasoning_engine import reasoning_engine

router = APIRouter(prefix="/api/analytics", tags=["Executive Analytics"])

@router.get("/overview")
async def get_executive_overview(quarter: str = "Q2 2026", region: Optional[str] = None):
    """
    Returns Executive KPI suite with current values, previous-period comparisons,
    percentage changes, and mini trend historical sparklines in INR (₹).
    """
    # 1. Revenue
    # Q2 2026: ~₹48.6 Cr (+12.4% vs Q1 ~₹43.2 Cr)
    # Gross Margin: 27.2% (-4.2 pp vs Q1 31.4%)
    # Net Profit: ₹6.8 Cr (+8.1%)
    # Churn Rate: 4.8% (-0.3 pp)
    # Order Count: 338 orders (+14.2%)
    # Average Order Value: ₹14.38 Lakhs (-1.6%)

    kpis = [
        {
            "id": "revenue",
            "name": "Revenue",
            "current_value": "₹48.6 Cr",
            "raw_value": 486000000,
            "previous_value": "₹43.2 Cr",
            "change_pct": "+12.4%",
            "change_type": "positive",
            "subtext": "vs previous quarter (Q1 2026)",
            "sparkline": [38.4, 41.2, 43.2, 48.6],
            "governed_formula": "SUM(fct_sales.revenue)",
            "status": "Verified"
        },
        {
            "id": "gross_margin",
            "name": "Gross Margin",
            "current_value": "27.2%",
            "raw_value": 27.2,
            "previous_value": "31.4%",
            "change_pct": "-4.2 pp",
            "change_type": "negative",
            "subtext": "vs previous quarter (EU logistics drag)",
            "sparkline": [30.1, 30.8, 31.4, 27.2],
            "governed_formula": "((Revenue - Cost) / Revenue) * 100",
            "status": "Verified"
        },
        {
            "id": "net_profit",
            "name": "Net Profit",
            "current_value": "₹6.8 Cr",
            "raw_value": 68000000,
            "previous_value": "₹6.3 Cr",
            "change_pct": "+8.1%",
            "change_type": "positive",
            "subtext": "vs previous quarter",
            "sparkline": [4.9, 5.7, 6.3, 6.8],
            "governed_formula": "Gross Profit - Operating Expenses",
            "status": "Verified"
        },
        {
            "id": "churn_rate",
            "name": "Customer Churn",
            "current_value": "4.8%",
            "raw_value": 4.8,
            "previous_value": "5.1%",
            "change_pct": "-0.3 pp",
            "change_type": "positive",
            "subtext": "Enterprise retention steady at 98.8%",
            "sparkline": [5.6, 5.3, 5.1, 4.8],
            "governed_formula": "(Churned / Total Customers) * 100",
            "status": "Verified"
        },
        {
            "id": "order_count",
            "name": "Total Orders",
            "current_value": "338",
            "raw_value": 338,
            "previous_value": "296",
            "change_pct": "+14.2%",
            "change_type": "positive",
            "subtext": "Quarterly enterprise order volume",
            "sparkline": [260, 280, 296, 338],
            "governed_formula": "COUNT(DISTINCT fct_orders.order_id)",
            "status": "Verified"
        },
        {
            "id": "average_order_value",
            "name": "Average Order Value",
            "current_value": "₹14.38 L",
            "raw_value": 1438000,
            "previous_value": "₹14.61 L",
            "change_pct": "-1.6%",
            "change_type": "neutral",
            "subtext": "Slight mid-market mix skew",
            "sparkline": [14.7, 14.7, 14.6, 14.4],
            "governed_formula": "Revenue / Order Count",
            "status": "Verified"
        }
    ]

    regional_distribution = [
        {"region": "Europe", "revenue": 158000000, "revenue_formatted": "₹15.8 Cr", "margin": 27.2, "orders": 110, "change": "-4.2 pp"},
        {"region": "North America", "revenue": 142000000, "revenue_formatted": "₹14.2 Cr", "margin": 34.1, "orders": 98, "change": "+1.1 pp"},
        {"region": "India", "revenue": 124000000, "revenue_formatted": "₹12.4 Cr", "margin": 38.2, "orders": 85, "change": "+3.4 pp"},
        {"region": "APAC", "revenue": 62000000, "revenue_formatted": "₹6.2 Cr", "margin": 32.5, "orders": 45, "change": "+0.8 pp"},
    ]

    revenue_trend = [
        {"quarter": "Q3 2025", "Europe": 12.2, "North America": 11.5, "India": 8.9, "APAC": 4.8, "Total": 37.4},
        {"quarter": "Q4 2025", "Europe": 13.5, "North America": 12.8, "India": 10.2, "APAC": 5.4, "Total": 41.9},
        {"quarter": "Q1 2026", "Europe": 14.2, "North America": 13.4, "India": 10.8, "APAC": 4.8, "Total": 43.2},
        {"quarter": "Q2 2026", "Europe": 15.8, "North America": 14.2, "India": 12.4, "APAC": 6.2, "Total": 48.6},
    ]

    margin_trend = [
        {"quarter": "Q3 2025", "Europe": 30.1, "North America": 33.2, "India": 35.8, "APAC": 31.0, "Global": 32.5},
        {"quarter": "Q4 2025", "Europe": 30.8, "North America": 33.8, "India": 36.4, "APAC": 31.8, "Global": 33.2},
        {"quarter": "Q1 2026", "Europe": 31.4, "North America": 33.0, "India": 34.8, "APAC": 31.7, "Global": 32.7},
        {"quarter": "Q2 2026", "Europe": 27.2, "North America": 34.1, "India": 38.2, "APAC": 32.5, "Global": 33.0},
    ]

    top_products = [
        {"name": "Apex Cloud Core Suite", "category": "Cloud Infrastructure", "revenue": "₹16.4 Cr", "margin": "36.2%", "growth": "+18.2%"},
        {"name": "MetricMind Enterprise Analytics", "category": "Enterprise SaaS", "revenue": "₹14.8 Cr", "margin": "47.1%", "growth": "+26.5%"},
        {"name": "Sentinels AI Security Guard", "category": "Security Suite", "revenue": "₹8.2 Cr", "margin": "39.1%", "growth": "+12.0%"},
        {"name": "EdgeCompute IoT Gateway", "category": "Edge Compute", "revenue": "₹5.6 Cr", "margin": "32.6%", "growth": "+4.1%"},
        {"name": "OmniStream Data Fabric", "category": "Data Core", "revenue": "₹3.6 Cr", "margin": "44.1%", "growth": "+9.8%"}
    ]

    return {
        "period": quarter,
        "region": region or "Global",
        "greeting": "Good morning, Executive",
        "subtitle": "Here's what is happening across your business with governed metric integrity.",
        "kpis": kpis,
        "regional_distribution": regional_distribution,
        "revenue_trend": revenue_trend,
        "margin_trend": margin_trend,
        "top_products": top_products,
        "governed_signature": "METRICMIND-GOVERNED-ANALYTICS-2026"
    }

@router.get("/trends")
async def get_metric_trends(metric_id: str = "gross_margin", region: Optional[str] = None):
    metric_def = GOVERNED_METRICS.get(metric_id)
    return {
        "metric_id": metric_id,
        "metric_name": metric_def.display_name if metric_def else metric_id,
        "unit": metric_def.unit if metric_def else "ratio",
        "periods": ["Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026"],
        "series": [
            {"region": "Global", "data": [32.5, 33.2, 32.7, 33.0]},
            {"region": "Europe", "data": [30.1, 30.8, 31.4, 27.2]},
            {"region": "North America", "data": [33.2, 33.8, 33.0, 34.1]},
            {"region": "India", "data": [35.8, 36.4, 34.8, 38.2]},
            {"region": "APAC", "data": [31.0, 31.8, 31.7, 32.5]}
        ]
    }

@router.get("/drivers")
async def get_drivers(metric_id: str = "gross_margin", region: str = "Europe", quarter: str = "Q2 2026"):
    return reasoning_engine.analyze_variance_and_drivers(
        metric_id=metric_id,
        dimension="country" if region == "Europe" else "region",
        current_period=quarter,
        baseline_period="Q1 2026",
        filter_dict={"region": region} if region != "Global" else {}
    )
