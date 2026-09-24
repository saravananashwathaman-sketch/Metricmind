import os
from pydantic import BaseModel
from typing import List

class Settings(BaseModel):
    app_name: str = "MetricMind"
    app_tagline: str = "Ask business questions. Get governed answers."
    app_version: str = "1.0.0"
    app_env: str = os.getenv("APP_ENV", "development")
    mode: str = os.getenv("METRICMIND_MODE", "demo")  # "demo" or "production"
    
    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # LLM
    llm_provider: str = os.getenv("LLM_PROVIDER", "mock_llama3")
    llm_api_key: str = os.getenv("LLM_API_KEY", "")
    llm_model: str = os.getenv("LLM_MODEL", "llama3-70b-instruct")
    
    # Semantic Layer
    semantic_layer_type: str = os.getenv("SEMANTIC_LAYER_TYPE", "governed_mock")
    cube_api_url: str = os.getenv("CUBE_API_URL", "")
    cube_api_secret: str = os.getenv("CUBE_API_SECRET", "")
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./metricmind_dw.db")

settings = Settings()
