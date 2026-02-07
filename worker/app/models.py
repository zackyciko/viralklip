from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime


class ProcessRequest(BaseModel):
    """Request model for video processing"""
    video_url: str
    project_id: str
    user_id: str
    target_count: Optional[int] = 10
    aspect_ratios: Optional[List[str]] = ["9:16", "16:9", "1:1"]


class JobResponse(BaseModel):
    """Response model for job creation"""
    job_id: str
    status: str
    message: str


class ClipResult(BaseModel):
    """Model for a generated clip"""
    clip_number: int
    start_time: float
    end_time: float
    duration: float
    transcript_snippet: str
    viral_score: float
    viral_reason: str
    keywords: List[str]
    aspect_ratio: str
    video_url: str
    thumbnail_url: str
    subtitle_file_url: Optional[str] = None
    caption_text: Optional[str] = None
    view_prediction: Optional[int] = None


class JobStatus(BaseModel):
    """Model for job status"""
    id: str
    status: str  # pending, downloading, transcribing, analyzing, clipping, uploading, completed, failed
    progress: int  # 0-100
    project_id: str
    user_id: str
    created_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ViralMoment(BaseModel):
    """Model for a detected viral moment"""
    start_time: float
    end_time: float
    transcript: str
    viral_score: float
    reason: str
    keywords: List[str]
    hook_type: str  # question, shock, controversy, emotion, etc.
    view_prediction: int
