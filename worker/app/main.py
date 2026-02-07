from fastapi import FastAPI, HTTPException, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
import os

from app.config import settings
from app.services.youtube import download_video
from app.services.transcription import transcribe_audio
from app.services.analysis import analyze_moments
from app.services.video import generate_clips
from app.services.storage import upload_to_r2
from app.utils.logger import logger
from app.models import ProcessRequest, JobStatus, JobResponse

app = FastAPI(
    title="ViralKlip Worker API",
    description="Video processing worker for ViralKlip",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job storage (use Redis in production)
jobs = {}


def verify_api_key(x_api_key: str = Header(...)):
    """Verify API key from request header"""
    if x_api_key != settings.WORKER_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key


async def process_video_job(job_id: str, request: ProcessRequest):
    """Background task to process video"""
    try:
        jobs[job_id]["status"] = "downloading"
        logger.info(f"Job {job_id}: Starting download from {request.video_url}")
        
        # Step 1: Download video
        video_path, audio_path = await download_video(request.video_url, job_id)
        jobs[job_id]["progress"] = 20
        
        # Step 2: Transcribe audio
        jobs[job_id]["status"] = "transcribing"
        logger.info(f"Job {job_id}: Transcribing audio")
        transcript = await transcribe_audio(audio_path)
        jobs[job_id]["progress"] = 40
        
        # Step 3: Analyze viral moments
        jobs[job_id]["status"] = "analyzing"
        logger.info(f"Job {job_id}: Analyzing viral moments")
        moments = await analyze_moments(transcript, request.target_count or 10)
        jobs[job_id]["progress"] = 60
        
        # Step 4: Generate clips
        jobs[job_id]["status"] = "clipping"
        logger.info(f"Job {job_id}: Generating clips")
        clips = await generate_clips(
            video_path,
            moments,
            request.aspect_ratios or ["9:16", "16:9", "1:1"]
        )
        jobs[job_id]["progress"] = 80
        
        # Step 5: Upload to R2
        jobs[job_id]["status"] = "uploading"
        logger.info(f"Job {job_id}: Uploading to R2")
        uploaded_clips = await upload_to_r2(clips, job_id)
        jobs[job_id]["progress"] = 100
        
        # Update job status
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = {
            "transcript": transcript,
            "clips": uploaded_clips,
            "total_clips": len(uploaded_clips)
        }
        
        logger.info(f"Job {job_id}: Completed successfully")
        
    except Exception as e:
        logger.error(f"Job {job_id}: Failed with error: {str(e)}")
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ViralKlip Worker",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Render.com"""
    return {"status": "healthy"}


@app.post("/process", response_model=JobResponse)
async def process_video(
    request: ProcessRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Header(..., alias="X-API-Key")
):
    """
    Start video processing job
    
    - **video_url**: YouTube URL or direct video URL
    - **project_id**: Supabase project ID
    - **user_id**: User ID for tracking
    - **target_count**: Number of clips to generate (default: 10)
    - **aspect_ratios**: List of aspect ratios (default: ["9:16", "16:9", "1:1"])
    """
    verify_api_key(api_key)
    
    job_id = str(uuid.uuid4())
    
    # Initialize job
    jobs[job_id] = {
        "id": job_id,
        "status": "pending",
        "progress": 0,
        "project_id": request.project_id,
        "user_id": request.user_id,
        "created_at": None,
        "result": None,
        "error": None
    }
    
    # Start background processing
    background_tasks.add_task(process_video_job, job_id, request)
    
    logger.info(f"Created job {job_id} for project {request.project_id}")
    
    return JobResponse(
        job_id=job_id,
        status="pending",
        message="Job created successfully"
    )


@app.get("/status/{job_id}", response_model=JobStatus)
async def get_job_status(
    job_id: str,
    api_key: str = Header(..., alias="X-API-Key")
):
    """Get job status and progress"""
    verify_api_key(api_key)
    
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatus(**jobs[job_id])


@app.post("/webhook/supabase")
async def supabase_webhook(
    payload: dict,
    api_key: str = Header(..., alias="X-API-Key")
):
    """
    Webhook endpoint for Supabase triggers
    Can be used to trigger processing when new projects are created
    """
    verify_api_key(api_key)
    
    logger.info(f"Received Supabase webhook: {payload}")
    
    # Handle webhook payload
    # This is a placeholder - implement based on your needs
    
    return {"status": "received"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
