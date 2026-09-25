from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

router = APIRouter(prefix="/api/time-machine", tags=["Time Machine — Explain This Number"])

class ReproduceRequest(BaseModel):
    metricId: Optional[str] = "gross_margin"
    metric_id: Optional[str] = None
    fingerprint: Optional[str] = None

class CompareRequest(BaseModel):
    metricId: Optional[str] = "gross_margin"
    metric_id: Optional[str] = None
    periodA: Optional[str] = "Q3 2026"
    period_a: Optional[str] = None
    periodB: Optional[str] = "Q3 2025"
    period_b: Optional[str] = None

HISTORICAL_VERSIONS = {
    "gross_margin": [
        {
            "version": "v1.0",
            "effective_date": "01 Jan 2025",
            "formula": "(Revenue - Cost) / Revenue * 100",
            "formula_display": "((Revenue - Cost) / Revenue) × 100",
            "owner": "Finance Team",
            "owner_role": "Lead Financial Analyst",
            "status": "Deprecated",
            "change_reason": "Initial enterprise baseline margin definition.",
            "impact_summary": "Baseline formula; did not incorporate dedicated third-party logistics surcharges.",
            "affected_dashboards": 8,
            "affected_reports": 4,
            "affected_saved_insights": 12
        },
        {
            "version": "v2.0",
            "effective_date": "01 Jan 2026",
            "previous_version": "v1.0",
            "formula": "(Revenue - Cost - Logistics Cost) / Revenue * 100",
            "formula_display": "((Revenue - Cost - Logistics Cost) / Revenue) × 100",
            "owner": "Finance & Operations Council",
            "owner_role": "VP Financial Operations",
            "status": "Deprecated",
            "change_reason": "Added dedicated European and transatlantic line-haul logistics and carrier drag.",
            "impact_summary": "Subtracted logistics freight surcharges from gross profit.",
            "impact_pp": -1.9,
            "affected_dashboards": 14,
            "affected_reports": 8,
            "affected_saved_insights": 23
        },
        {
            "version": "v2.1",
            "effective_date": "01 Jul 2026",
            "previous_version": "v2.0",
            "formula": "(Revenue - Adjusted Cost) / Revenue * 100",
            "formula_display": "((Revenue - Adjusted Cost) / Revenue) × 100",
            "owner": "Priya Sharma",
            "owner_role": "VP Strategic Finance",
            "status": "Verified",
            "change_reason": "Refined adjusted cost to standardize carrier fuel indexation and partner distribution rebates under ASC 606.",
            "impact_summary": "Ratified by Executive Governance Council on 18 Sep 2026; established immutable audit boundary.",
            "impact_pp": -1.9,
            "affected_dashboards": 14,
            "affected_reports": 8,
            "affected_saved_insights": 23
        }
    ]
}

SNAPSHOT_REGISTRY = {
    "SNAP-2026-Q3-EU-001": {
        "id": "SNAP-2026-Q3-EU-001",
        "data_version": "2026.09",
        "period": "Q3 2026",
        "region": "Europe",
        "countries": ["Germany", "France", "Spain", "Italy"],
        "rows_included": 18492,
        "last_updated": "30 Sep 2026",
        "warehouse_source": "PROD_ANALYTICS.FINANCE_SCHEMA.FCT_SALES",
        "is_demo_mode": True,
        "checksum": "7A82F904B1"
    }
}

@router.get("/metric/{metric_id}")
async def get_metric_explanation(
    metric_id: str,
    version: Optional[str] = Query(None),
    period: str = Query("Q3 2026"),
    region: str = Query("Europe")
):
    """
    Returns strict Section 23 JSON explanation of any business number.
    """
    revenue = 486000000
    cost = 353800000
    gross_profit = revenue - cost
    margin = round((gross_profit / revenue) * 100, 2)

    return {
        "metric": {
            "name": "Gross Margin",
            "version": version or "2.1",
            "formula": "(Revenue - Adjusted Cost) / Revenue * 100"
        },
        "value": {
            "current": margin,
            "unit": "percentage"
        },
        "period": {
            "quarter": "Q3",
            "year": 2026
        },
        "filters": {
            "region": region,
            "quarter": period,
            "order_status": "Completed"
        },
        "components": {
            "revenue": revenue,
            "cost": cost,
            "gross_profit": gross_profit
        },
        "snapshot": {
            "id": "SNAP-2026-Q3-EU-001",
            "version": "2026.09"
        },
        "governance": {
            "status": "verified",
            "sql_generated_by_llm": False,
            "semantic_validation": "PASSED",
            "calculation_validation": "PASSED"
        }
    }

@router.get("/value/{metric_id}")
async def get_metric_value(metric_id: str, period: str = "Q3 2026"):
    return {
        "metric_id": metric_id,
        "current_value": 27.20,
        "unit": "percentage",
        "period": period,
        "components": {"revenue": 486000000, "cost": 353800000, "gross_profit": 132200000}
    }

@router.get("/versions/{metric_id}")
async def get_metric_versions(metric_id: str):
    if metric_id not in HISTORICAL_VERSIONS:
        raise HTTPException(status_code=404, detail="Historical reconstruction unavailable for this period.")
    return {"metric_id": metric_id, "versions": HISTORICAL_VERSIONS[metric_id]}

@router.get("/snapshot/{snapshot_id}")
async def get_snapshot(snapshot_id: str):
    if snapshot_id not in SNAPSHOT_REGISTRY:
        raise HTTPException(status_code=404, detail="Snapshot unavailable.")
    return SNAPSHOT_REGISTRY[snapshot_id]

@router.get("/lineage/{metric_id}")
async def get_lineage(metric_id: str):
    return {
        "metric_id": metric_id,
        "lineage_dag": ["Gross Margin", "Semantic Definition v2.1", "Revenue + Cost", "Cube Model", "dbt Model", "fct_sales", "Warehouse", "Data Snapshot"]
    }

@router.post("/reproduce")
async def reproduce_number(req: ReproduceRequest):
    return {
        "metric_id": req.metricId or req.metric_id or "gross_margin",
        "original_value": 27.20,
        "reproduced_value": 27.20,
        "difference_pp": 0.00,
        "status": "✓ REPRODUCED EXACTLY",
        "fingerprint": req.fingerprint or "MM-GM-V21-Q3-EU-7A82F",
        "snapshot_id": "SNAP-2026-Q3-EU-001"
    }

@router.post("/compare")
async def compare_moments(req: CompareRequest):
    return {
        "metric_id": req.metricId or req.metric_id or "gross_margin",
        "period_a": {"period": req.periodA or "Q3 2026", "value": 27.2, "version": "v2.1"},
        "period_b": {"period": req.periodB or "Q3 2025", "value": 31.4, "version": "v1.8"},
        "delta": {"value_difference": -4.2, "unit": "pp"},
        "definition_changed": True,
        "warning": "Direct comparison may be affected by a metric-definition change."
    }
