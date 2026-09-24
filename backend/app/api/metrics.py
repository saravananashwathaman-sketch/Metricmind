from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.semantic_layer.catalog import list_metrics, get_metric, list_dimensions, GOVERNED_METRICS, GOVERNED_DIMENSIONS, MetricDefinition
from app.data.database import db

router = APIRouter(prefix="/api/metrics", tags=["Semantic Metric Catalog"])

@router.get("", response_model=List[MetricDefinition])
async def get_all_metrics(
    category: Optional[str] = Query(None, description="Filter by category (Profitability, Revenue, Customer, Operations)"),
    status: Optional[str] = Query(None, description="Filter by status (Verified, Under Review, Draft, Deprecated)")
):
    return list_metrics(category=category, status=status)

@router.get("/{metric_id}", response_model=MetricDefinition)
async def get_single_metric(metric_id: str):
    metric = get_metric(metric_id)
    if not metric:
        raise HTTPException(status_code=404, detail=f"Metric '{metric_id}' not found in governed catalog.")
    return metric

@router.get("/dimensions/catalog")
async def get_dimensions_catalog():
    return list_dimensions()

@router.post("/verify/{metric_id}")
async def verify_metric(metric_id: str, approver: str = "Priya Sharma", role: str = "VP Strategic Finance"):
    metric = get_metric(metric_id)
    if not metric:
        raise HTTPException(status_code=404, detail=f"Metric '{metric_id}' not found.")
    
    metric.status = "Verified"
    metric.owner = approver
    metric.owner_role = role
    
    # Audit log
    import uuid
    db.conn.cursor().execute("""
        INSERT INTO governance_audit_logs (id, action, target_type, target_id, performed_by, role, details, compliance_status)
        VALUES (?, 'METRIC_VERIFIED', 'METRIC', ?, ?, ?, 'Manually verified via Semantic Catalog Governance UI', 'COMPLIANT')
    """, (f"AUD_{uuid.uuid4().hex[:6].upper()}", metric_id, approver, role))
    db.conn.commit()

    return {"status": "success", "message": f"Metric {metric.display_name} verified successfully."}
