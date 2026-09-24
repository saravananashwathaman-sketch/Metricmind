from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter(prefix="/api/lineage", tags=["Data Lineage & Traceability"])

@router.get("")
async def get_lineage_graph(metric_id: str = "gross_margin"):
    """
    Returns end-to-end DAG data lineage nodes and edges from Business Question down to Snowflake Warehouse.
    """
    nodes = [
        {
            "id": "node_question",
            "layer": "Conversational BI",
            "title": "Natural Language Question",
            "detail": '"Why did our European margins drop last quarter?"',
            "status": "Resolved",
            "type": "question"
        },
        {
            "id": "node_metric",
            "layer": "Governed Metric",
            "title": "Gross Margin (ID: gross_margin)",
            "detail": "Unit: % | Category: Profitability | Owner: Priya Sharma",
            "status": "Verified",
            "type": "metric"
        },
        {
            "id": "node_semantic",
            "layer": "Semantic Definition",
            "title": "Semantic Layer Formula",
            "detail": "((Revenue - Cost) / Revenue) * 100",
            "status": "Active v3.0.1",
            "type": "semantic"
        },
        {
            "id": "node_dbt",
            "layer": "dbt Transformation Mart",
            "title": "marts.finance.fct_sales",
            "detail": "Aggregated daily incremental mart with dimensions",
            "status": "Fresh (2h ago)",
            "type": "dbt"
        },
        {
            "id": "node_facts",
            "layer": "Staging & Fact Tables",
            "title": "raw_crm_orders + raw_erp_expenses",
            "detail": "fct_sales, fct_expenses, dim_regions, dim_customers",
            "status": "Synchronized",
            "type": "table"
        },
        {
            "id": "node_warehouse",
            "layer": "Enterprise Warehouse",
            "title": "Snowflake DW / Cloud Lakehouse",
            "detail": "PROD_ANALYTICS.FINANCE_SCHEMA",
            "status": "Online",
            "type": "warehouse"
        }
    ]

    edges = [
        {"from": "node_question", "to": "node_metric", "label": "Resolves Intent"},
        {"from": "node_metric", "to": "node_semantic", "label": "Governs Logic"},
        {"from": "node_semantic", "to": "node_dbt", "label": "Semantic Query"},
        {"from": "node_dbt", "to": "node_facts", "label": "Model Transformation"},
        {"from": "node_facts", "to": "node_warehouse", "label": "Direct Storage"}
    ]

    layer_descriptions = {
        "Conversational BI": "Interprets executive natural language and maps to governed entities.",
        "Governed Metric": "Single source of truth metric catalog preventing calculation drift.",
        "Semantic Definition": "Strict mathematical rules that dictate aggregation across dimensions.",
        "dbt Transformation Mart": "Automated data models with testing and validation assertions.",
        "Staging & Fact Tables": "Normalized dimensional star schema populated from transactional systems.",
        "Enterprise Warehouse": "High-performance enterprise analytical storage."
    }

    return {
        "metric_id": metric_id,
        "nodes": nodes,
        "edges": edges,
        "layer_descriptions": layer_descriptions,
        "governed_compliance": "100% Governed (Zero Rogue SQL Leakage)"
    }
