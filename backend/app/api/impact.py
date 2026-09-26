from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import uuid

router = APIRouter(prefix="/api/impact", tags=["Metric Impact Simulator"])

# Pydantic Schemas for Strict JSON Contract (Section 20 & 26)
class DefinitionPayload(BaseModel):
    formula: str

class ProposedChangePayload(BaseModel):
    type: str = "formula_change"  # formula_change, filter_change, dimension_change, data_source_change, etc.
    formula: Optional[str] = None
    filters: Optional[str] = None
    dimension: Optional[str] = None
    data_source: Optional[str] = None

class SimulationScopePayload(BaseModel):
    region: Optional[str] = "Europe"
    period: Optional[str] = "Q3 2026"

class SimulationRequest(BaseModel):
    metric: str = "gross_margin"
    current_version: Optional[str] = "2.1"
    proposed_change: Optional[ProposedChangePayload] = None
    # Support alternate naming matching strict contract
    change_type: Optional[str] = None
    current_definition: Optional[DefinitionPayload] = None
    proposed_definition: Optional[DefinitionPayload] = None
    scope: Optional[SimulationScopePayload] = None
    simulation_scope: Optional[SimulationScopePayload] = None
    user_name: Optional[str] = "Rajesh Kapoor"

class ScenarioRequest(BaseModel):
    metric: Optional[str] = "gross_margin"
    formula: Optional[str] = "((Revenue - Cost - Logistics Cost) / Revenue) * 100"

# Approved semantic measures for governance checks (Section 18)
APPROVED_MEASURES = {
    "revenue", "cost", "logistics_cost", "logistics", "adjusted_cost",
    "gross_profit", "operating_expenses", "expenses", "order_count",
    "orders", "total_customers", "customers", "churned_customers"
}

# Catalog of metrics supported for simulation
METRICS_IMPACT_CATALOG = {
    "gross_margin": {
        "id": "gross_margin",
        "name": "gross_margin",
        "display_name": "Gross Margin",
        "owner": "Priya Sharma",
        "owner_role": "VP Strategic Finance",
        "current_version": "2.1",
        "status": "Verified",
        "formula": "((Revenue - Cost) / Revenue) * 100",
        "unit": "percentage",
        "current_value": 27.20,
        "dependencies_count": 17,
        "dependent_metrics_count": 3
    },
    "revenue": {
        "id": "revenue",
        "name": "revenue",
        "display_name": "Recognized Revenue",
        "owner": "Priya Sharma",
        "owner_role": "VP Strategic Finance",
        "current_version": "2.4",
        "status": "Verified",
        "formula": "SUM(revenue)",
        "unit": "currency",
        "current_value": 48.60,
        "dependencies_count": 24,
        "dependent_metrics_count": 4
    },
    "cost": {
        "id": "cost",
        "name": "cost",
        "display_name": "Cost of Goods Sold (COGS)",
        "owner": "Anand Verma",
        "owner_role": "Director of Financial Operations",
        "current_version": "2.1",
        "status": "Verified",
        "formula": "SUM(cost)",
        "unit": "currency",
        "current_value": 35.38,
        "dependencies_count": 15,
        "dependent_metrics_count": 3
    },
    "churn_rate": {
        "id": "churn_rate",
        "name": "churn_rate",
        "display_name": "Customer Churn Rate",
        "owner": "Vikram Malhotra",
        "owner_role": "Head of Customer Success",
        "current_version": "2.0",
        "status": "Verified",
        "formula": "(Churned Customers / Total Customers) * 100",
        "unit": "percentage",
        "current_value": 4.80,
        "dependencies_count": 9,
        "dependent_metrics_count": 2
    }
}

IN_MEMORY_SIMULATIONS = {
    "SIM-2026-00981": {
        "simulation_id": "SIM-2026-00981",
        "metric": "gross_margin",
        "current_version": "v2.1",
        "proposed_version": "Draft",
        "user": "Rajesh Kapoor",
        "current_formula": "((Revenue - Cost) / Revenue) * 100",
        "proposed_formula": "((Revenue - Cost - Logistics Cost) / Revenue) * 100",
        "current_value": 27.20,
        "simulated_value": 22.88,
        "difference": -4.32,
        "affected_assets": 17,
        "status": "Simulation Only"
    }
}

@router.get("/metrics")
async def get_impact_metrics():
    return {
        "status": "success",
        "count": len(METRICS_IMPACT_CATALOG),
        "metrics": list(METRICS_IMPACT_CATALOG.values())
    }

@router.get("/metric/{metric_id}/dependencies")
async def get_metric_dependencies(metric_id: str):
    metric = METRICS_IMPACT_CATALOG.get(metric_id)
    if not metric:
        raise HTTPException(status_code=404, detail=f"Metric '{metric_id}' not found in governed catalog.")
    
    return {
        "status": "success",
        "metric_id": metric["id"],
        "metric_name": metric["display_name"],
        "current_version": metric["current_version"],
        "affected_assets_count": 17,
        "dependent_metrics_count": 3,
        "dashboards_count": 5,
        "reports_count": 8,
        "saved_insights_count": 14,
        "saved_queries_count": 42
    }

@router.post("/simulate")
async def simulate_metric_impact(req: SimulationRequest):
    metric_id = req.metric.lower().strip()
    if metric_id not in METRICS_IMPACT_CATALOG:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unknown metric '{metric_id}'. Simulation blocked."
        )

    # Determine proposed formula
    proposed_formula = ""
    if req.proposed_change and req.proposed_change.formula:
        proposed_formula = req.proposed_change.formula
    elif req.proposed_definition and req.proposed_definition.formula:
        proposed_formula = req.proposed_definition.formula
    else:
        proposed_formula = "((Revenue - Cost - Logistics Cost) / Revenue) * 100"

    # Governance Check: Unknown measure check (Section 18)
    # Check if unknown measure like 'shipping_cost_v2' is used
    raw_tokens = proposed_formula.replace("(", " ").replace(")", " ").replace("+", " ").replace("-", " ").replace("*", " ").replace("/", " ").split()
    for token in raw_tokens:
        clean = token.strip().lower()
        if clean in ["sum", "count", "avg", "nullif", "100", "0", "1"]:
            continue
        if clean.isdigit():
            continue
        # If token has alphabetic chars and is not approved
        if clean.isalpha() and clean not in APPROVED_MEASURES and not any(m in clean for m in APPROVED_MEASURES):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Simulation Blocked. Unknown measure: '{clean}'. This measure is not registered in the Semantic Layer."
            )

    # Deterministic simulation computation
    current_value = 27.20
    simulated_value = 22.88
    if "logistics" in proposed_formula.lower():
        simulated_value = 22.88
    elif "adjusted" in proposed_formula.lower():
        simulated_value = 26.20
    else:
        simulated_value = 24.80

    difference = round(simulated_value - current_value, 2)
    sim_id = f"SIM-2026-{uuid.uuid4().hex[:5].upper()}"

    res = {
        "status": "success",
        "simulation_id": sim_id,
        "metric": metric_id,
        "current_value": current_value,
        "simulated_value": simulated_value,
        "difference": difference,
        "affected_assets": 17,
        "dependent_metrics": 3,
        "simulation_only": True,
        "is_demo_mode": True,
        "governance_status": "PASSED"
    }

    IN_MEMORY_SIMULATIONS[sim_id] = res
    return res

@router.get("/simulation/{simulation_id}")
async def get_simulation_by_id(simulation_id: str):
    if simulation_id not in IN_MEMORY_SIMULATIONS:
        raise HTTPException(status_code=404, detail=f"Simulation '{simulation_id}' not found.")
    return IN_MEMORY_SIMULATIONS[simulation_id]

@router.post("/scenarios")
async def get_what_if_scenarios(req: ScenarioRequest):
    return {
        "status": "success",
        "metric": req.metric,
        "scenarios": [
            {"id": "curr", "name": "Current Definition", "value": 27.2, "diff": 0.0},
            {"id": "a", "name": "Logistics Cost +5%", "value": 26.8, "diff": -0.4},
            {"id": "b", "name": "Logistics Cost +10%", "value": 26.3, "diff": -0.9},
            {"id": "c", "name": "Logistics Cost +20%", "value": 25.4, "diff": -1.8},
            {"id": "prop", "name": "Full Surcharge Deduction", "value": 22.88, "diff": -4.32}
        ]
    }

@router.get("/assets")
async def get_impact_assets(type: Optional[str] = Query(None)):
    return {
        "status": "success",
        "metric": "gross_margin",
        "dashboards_count": 5,
        "reports_count": 8,
        "saved_insights_count": 14,
        "queries_count": 42
    }
