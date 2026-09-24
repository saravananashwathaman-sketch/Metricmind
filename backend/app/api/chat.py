from fastapi import APIRouter, HTTPException
from app.agent.orchestrator import orchestrator, MetricMindChatRequest, MetricMindChatResponse

router = APIRouter(prefix="/api/chat", tags=["Agentic Chat & Semantic BI"])

@router.post("", response_model=MetricMindChatResponse)
async def chat_with_metricmind(request: MetricMindChatRequest):
    try:
        response = orchestrator.process_question(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"MetricMind couldn't complete the analytical reasoning: {str(e)}. Please verify the requested governed metric or filters."
        )
