from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # API Security
    WORKER_API_KEY: str = "change-this-in-production"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    
    # AI Services
    GROQ_API_KEY: str
    GEMINI_API_KEY: str
    
    # Storage (Cloudflare R2)
    R2_ACCOUNT_ID: str
    R2_ACCESS_KEY_ID: str
    R2_SECRET_ACCESS_KEY: str
    R2_BUCKET_NAME: str = "viralklip-videos"
    R2_PUBLIC_URL: str
    
    # Processing Settings
    MAX_VIDEO_DURATION: int = 3600  # 1 hour in seconds
    MAX_CLIP_DURATION: int = 60  # 1 minute
    DEFAULT_CLIP_COUNT: int = 10
    
    # Paths
    TEMP_DIR: str = "/tmp/viralklip"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
