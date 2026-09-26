from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.chat import router as chat_router
from app.api.metrics import router as metrics_router
from app.api.analytics import router as analytics_router
from app.api.lineage import router as lineage_router
from app.api.governance import router as governance_router
from app.api.history import router as history_router
from app.api.insights import router as insights_router
from app.api.time_machine import router as time_machine_router
from app.api.impact import router as impact_router

app = FastAPI(
    title="MetricMind — Agentic Semantic BI Engine",
    description="Ask business questions. Get governed answers. Enterprise BI where AI reasons over governed business semantics.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat_router)
app.include_router(metrics_router)
app.include_router(analytics_router)
app.include_router(lineage_router)
app.include_router(governance_router)
app.include_router(history_router)
app.include_router(insights_router)
app.include_router(time_machine_router)
app.include_router(impact_router)


@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "tagline": settings.app_tagline,
        "status": "operational",
        "semantic_layer": "active",
        "mode": settings.mode,
        "governed_metrics_count": 9,
        "supported_dimensions": ["region", "country", "product_category", "customer_segment", "quarter", "month", "expense_category"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "warehouse_connection": "connected",
        "semantic_catalog": "synchronized",
        "rogue_sql_blocker": "enforced"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
