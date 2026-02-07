import boto3
from botocore.client import Config
from pathlib import Path
from typing import List
from app.config import settings
from app.models import ClipResult
from app.utils.logger import logger


# Initialize R2 client (S3-compatible)
s3_client = boto3.client(
    's3',
    endpoint_url=f'https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    config=Config(signature_version='s3v4'),
    region_name='auto'
)


async def upload_to_r2(clips: List[dict], job_id: str) -> List[ClipResult]:
    """
    Upload clips to Cloudflare R2 storage
    
    Args:
        clips: List of clip dictionaries with paths
        job_id: Job ID for organizing files
        
    Returns:
        List of ClipResult objects with CDN URLs
    """
    uploaded_clips = []
    
    logger.info(f"Uploading {len(clips)} clips to R2")
    
    for clip in clips:
        try:
            clip_number = clip['clip_number']
            aspect_ratio = clip['aspect_ratio']
            moment = clip['moment']
            
            # Upload video
            video_key = f"{job_id}/clip_{clip_number:02d}_{aspect_ratio.replace(':', 'x')}.mp4"
            video_url = await upload_file(clip['video_path'], video_key, 'video/mp4')
            
            # Upload thumbnail
            thumb_key = f"{job_id}/clip_{clip_number:02d}_{aspect_ratio.replace(':', 'x')}_thumb.jpg"
            thumbnail_url = await upload_file(clip['thumbnail_path'], thumb_key, 'image/jpeg')
            
            # Upload subtitle
            subtitle_key = f"{job_id}/clip_{clip_number:02d}_{aspect_ratio.replace(':', 'x')}.srt"
            subtitle_url = await upload_file(clip['subtitle_path'], subtitle_key, 'text/plain')
            
            # Generate caption
            from app.services.video import generate_caption
            caption_text = await generate_caption(moment)
            
            # Create ClipResult
            clip_result = ClipResult(
                clip_number=clip_number,
                start_time=moment.start_time,
                end_time=moment.end_time,
                duration=moment.end_time - moment.start_time,
                transcript_snippet=moment.transcript,
                viral_score=moment.viral_score,
                viral_reason=moment.reason,
                keywords=moment.keywords,
                aspect_ratio=aspect_ratio,
                video_url=video_url,
                thumbnail_url=thumbnail_url,
                subtitle_file_url=subtitle_url,
                caption_text=caption_text,
                view_prediction=moment.view_prediction
            )
            
            uploaded_clips.append(clip_result)
            
            logger.info(f"Uploaded clip {clip_number} ({aspect_ratio})")
            
        except Exception as e:
            logger.error(f"Failed to upload clip {clip_number}: {str(e)}")
            raise
    
    logger.info(f"All clips uploaded successfully")
    return uploaded_clips


async def upload_file(file_path: str, key: str, content_type: str) -> str:
    """
    Upload a single file to R2
    
    Returns:
        Public CDN URL
    """
    try:
        with open(file_path, 'rb') as f:
            s3_client.upload_fileobj(
                f,
                settings.R2_BUCKET_NAME,
                key,
                ExtraArgs={
                    'ContentType': content_type,
                    'CacheControl': 'public, max-age=31536000',  # 1 year
                }
            )
        
        # Return public URL
        public_url = f"{settings.R2_PUBLIC_URL}/{key}"
        
        return public_url
        
    except Exception as e:
        logger.error(f"Upload failed for {key}: {str(e)}")
        raise Exception(f"Failed to upload file: {str(e)}")


async def delete_temp_files(job_id: str):
    """Delete temporary files after upload"""
    try:
        temp_dir = Path(settings.TEMP_DIR) / job_id
        if temp_dir.exists():
            import shutil
            shutil.rmtree(temp_dir)
            logger.info(f"Deleted temp files for job {job_id}")
    except Exception as e:
        logger.warning(f"Failed to delete temp files: {str(e)}")
