from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid
import json
from app.data.database import db

router = APIRouter(prefix="/api/saved-insights", tags=["Saved Insights"])

class SaveInsightRequest(BaseModel):
    title: str
    question: str
    metric_id: str
    executive_summary: str
    chart_type: str
    chart_data: Any
    drivers: Any
    filters: Dict[str, Any] = {}
    semantic_definition: str
    created_by: str = "Rajesh Kapoor"

@router.get("")
async def get_saved_insights():
    sql = "SELECT * FROM saved_insights ORDER BY created_at DESC LIMIT 50"
    rows = db.execute_query(sql)
    for r in rows:
        try:
            r["chart_data"] = json.loads(r["chart_data"]) if r.get("chart_data") else []
            r["drivers"] = json.loads(r["drivers"]) if r.get("drivers") else []
            r["filters"] = json.loads(r["filters"]) if r.get("filters") else {}
        except Exception:
            pass
    return rows

@router.post("")
async def save_new_insight(req: SaveInsightRequest):
    new_id = f"INS_{uuid.uuid4().hex[:6].upper()}"
    db.save_insight(
        id=new_id,
        title=req.title,
        question=req.question,
        metric_id=req.metric_id,
        summary=req.executive_summary,
        chart_type=req.chart_type,
        chart_data=req.chart_data,
        drivers=req.drivers,
        filters=req.filters,
        definition=req.semantic_definition,
        user=req.created_by
    )
    return {"status": "success", "id": new_id, "message": "Insight saved to executive knowledge repository."}

@router.delete("/{insight_id}")
async def delete_saved_insight(insight_id: str):
    cursor = db.conn.cursor()
    cursor.execute("DELETE FROM saved_insights WHERE id = ?", (insight_id,))
    db.conn.commit()
    return {"status": "success", "message": "Insight deleted."}
