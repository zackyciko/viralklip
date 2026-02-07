from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # API Security
    WORKER_API_KEY: str = "change-this-in-production"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001", "https://viralklip.vercel.app"]
    
    # Supabase (accept both SUPABASE_KEY and SUPABASE_SERVICE_KEY)
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None  # Alias for SUPABASE_SERVICE_KEY
    
    @property
    def supabase_key(self) -> str:
        """Get Supabase service key from either variable"""
        return self.SUPABASE_SERVICE_KEY or self.SUPABASE_KEY or ""
    
    # AI Services
    GROQ_API_KEY: str
    GEMINI_API_KEY: str
    
    # Storage (Cloudflare R2) - Optional until configured
    R2_ACCOUNT_ID: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_NAME: str = "viralklip-videos"
    R2_PUBLIC_URL: Optional[str] = None
    
    @property
    def r2_configured(self) -> bool:
        """Check if R2 storage is properly configured"""
        return bool(self.R2_ACCOUNT_ID and self.R2_ACCESS_KEY_ID and self.R2_SECRET_ACCESS_KEY)
    
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
