from fastapi import APIRouter
from app.data.database import db
import json

router = APIRouter(prefix="/api/query-history", tags=["Query History"])

@router.get("")
async def get_query_history():
    sql = "SELECT * FROM query_history ORDER BY created_at DESC LIMIT 50"
    rows = db.execute_query(sql)
    for r in rows:
        try:
            r["dimensions"] = json.loads(r["dimensions"]) if r.get("dimensions") else []
            r["filters"] = json.loads(r["filters"]) if r.get("filters") else {}
        except Exception:
            pass
    return rows
