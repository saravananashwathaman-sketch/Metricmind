from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.data.database import db
from app.semantic_layer.catalog import GOVERNED_METRICS

router = APIRouter(prefix="/api/governance", tags=["Enterprise Governance & Compliance"])

class RogueQuerySimulationRequest(BaseModel):
    attempted_sql: str
    user_role: str = "Finance Analyst"

class RogueQuerySimulationResponse(BaseModel):
    status: str  # BLOCKED / ROUTED_TO_SEMANTIC
    decision: str
    risk_level: str
    explanation: str
    remediated_semantic_metric: str
    governance_rule_triggered: str

@router.get("/audit-logs")
async def get_audit_logs():
    sql = "SELECT * FROM governance_audit_logs ORDER BY created_at DESC LIMIT 50"
    logs = db.execute_query(sql)
    return logs

@router.get("/permissions")
async def get_role_permissions():
    return {
        "roles": [
            {
                "role": "Admin",
                "can_ask_questions": True,
                "can_view_analytics": True,
                "can_edit_metrics": True,
                "can_approve_metrics": True,
                "can_view_audit_logs": True,
                "allowed_dimensions": ["All"],
                "data_masking": "None"
            },
            {
                "role": "Executive",
                "can_ask_questions": True,
                "can_view_analytics": True,
                "can_edit_metrics": False,
                "can_approve_metrics": False,
                "can_view_audit_logs": True,
                "allowed_dimensions": ["All"],
                "data_masking": "None"
            },
            {
                "role": "Finance Analyst",
                "can_ask_questions": True,
                "can_view_analytics": True,
                "can_edit_metrics": True,
                "can_approve_metrics": False,
                "can_view_audit_logs": False,
                "allowed_dimensions": ["Financial Dimensions", "Regions", "Products"],
                "data_masking": "PII Masked"
            },
            {
                "role": "Sales Analyst",
                "can_ask_questions": True,
                "can_view_analytics": True,
                "can_edit_metrics": False,
                "can_approve_metrics": False,
                "can_view_audit_logs": False,
                "allowed_dimensions": ["Regions", "Customer Segments", "Products"],
                "data_masking": "Financial Margin Masked"
            }
        ]
    }

@router.post("/simulate-rogue-blocker", response_model=RogueQuerySimulationResponse)
async def simulate_rogue_query_blocker(req: RogueQuerySimulationRequest):
    """
    Demonstrates MetricMind's core security guarantee:
    Arbitrary text-to-SQL or raw table queries are intercepted and strictly rejected/rerouted.
    """
    return RogueQuerySimulationResponse(
        status="BLOCKED_BY_GOVERNANCE_GATEWAY",
        decision="Rogue direct SQL blocked. Enforced semantic routing.",
        risk_level="HIGH_PREVENTED",
        explanation="MetricMind governance gateway intercepted a raw table query. Direct SQL generation against warehouse tables is prohibited to prevent hallucinated formulas and business metric drift.",
        remediated_semantic_metric="gross_margin (Governed definition: ((Revenue - Cost)/Revenue)*100)",
        governance_rule_triggered="RULE-GOV-001: Zero Direct SQL in Conversational BI"
    )
