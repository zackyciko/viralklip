import subprocess
import os
from pathlib import Path
from typing import List
from app.config import settings
from app.models import ViralMoment, ClipResult
from app.utils.logger import logger


async def generate_clips(
    video_path: str,
    moments: List[ViralMoment],
    aspect_ratios: List[str]
) -> List[dict]:
    """
    Generate video clips from viral moments in multiple aspect ratios
    
    Args:
        video_path: Path to source video
        moments: List of viral moments to clip
        aspect_ratios: List of aspect ratios (e.g., ["9:16", "16:9", "1:1"])
        
    Returns:
        List of clip file paths with metadata
    """
    clips = []
    job_id = Path(video_path).parent.name
    output_dir = Path(video_path).parent / "clips"
    output_dir.mkdir(exist_ok=True)
    
    logger.info(f"Generating {len(moments)} clips in {len(aspect_ratios)} aspect ratios")
    
    for i, moment in enumerate(moments, 1):
        for ratio in aspect_ratios:
            try:
                clip_filename = f"clip_{i:02d}_{ratio.replace(':', 'x')}.mp4"
                clip_path = str(output_dir / clip_filename)
                thumbnail_path = str(output_dir / f"clip_{i:02d}_{ratio.replace(':', 'x')}_thumb.jpg")
                subtitle_path = str(output_dir / f"clip_{i:02d}_{ratio.replace(':', 'x')}.srt")
                
                # Calculate crop/scale parameters
                crop_filter = get_crop_filter(ratio)
                
                # FFmpeg command to extract clip with crop
                duration = moment.end_time - moment.start_time
                
                ffmpeg_cmd = [
                    'ffmpeg',
                    '-i', video_path,
                    '-ss', str(moment.start_time),
                    '-t', str(duration),
                    '-vf', crop_filter,
                    '-c:v', 'libx264',
                    '-preset', 'medium',
                    '-crf', '23',
                    '-c:a', 'aac',
                    '-b:a', '128k',
                    '-movflags', '+faststart',
                    '-y',
                    clip_path
                ]
                
                logger.info(f"Creating clip {i}/{len(moments)} ({ratio}): {moment.start_time:.1f}s - {moment.end_time:.1f}s")
                
                # Run FFmpeg
                result = subprocess.run(
                    ffmpeg_cmd,
                    capture_output=True,
                    text=True,
                    check=True
                )
                
                # Generate thumbnail
                thumbnail_cmd = [
                    'ffmpeg',
                    '-i', clip_path,
                    '-ss', '00:00:01',
                    '-vframes', '1',
                    '-vf', 'scale=480:-1',
                    '-y',
                    thumbnail_path
                ]
                
                subprocess.run(thumbnail_cmd, capture_output=True, check=True)
                
                # Generate subtitle file (SRT format)
                create_subtitle_file(subtitle_path, moment.transcript, duration)
                
                clips.append({
                    'clip_number': i,
                    'aspect_ratio': ratio,
                    'video_path': clip_path,
                    'thumbnail_path': thumbnail_path,
                    'subtitle_path': subtitle_path,
                    'moment': moment
                })
                
                logger.info(f"Clip created: {clip_filename}")
                
            except subprocess.CalledProcessError as e:
                logger.error(f"FFmpeg error for clip {i} ({ratio}): {e.stderr}")
                raise Exception(f"Failed to create clip: {str(e)}")
    
    logger.info(f"Generated {len(clips)} total clips")
    return clips


def get_crop_filter(aspect_ratio: str) -> str:
    """
    Get FFmpeg crop filter for aspect ratio
    
    Supports: 9:16 (TikTok/Reels), 16:9 (YouTube), 1:1 (Instagram), 4:5 (Instagram)
    """
    filters = {
        "9:16": "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
        "16:9": "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
        "1:1": "scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080",
        "4:5": "scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350",
    }
    
    return filters.get(aspect_ratio, filters["9:16"])


def create_subtitle_file(subtitle_path: str, text: str, duration: float):
    """Create SRT subtitle file"""
    with open(subtitle_path, 'w', encoding='utf-8') as f:
        f.write("1\n")
        f.write("00:00:00,000 --> ")
        
        # Format end time
        hours = int(duration // 3600)
        minutes = int((duration % 3600) // 60)
        seconds = int(duration % 60)
        milliseconds = int((duration % 1) * 1000)
        
        f.write(f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}\n")
        f.write(f"{text}\n")


async def generate_caption(moment: ViralMoment) -> str:
    """
    Generate engaging caption for social media
    Uses the viral moment data to create a compelling caption
    """
    caption_templates = [
        f"🔥 {moment.transcript[:100]}...\n\n#{' #'.join(moment.keywords)}",
        f"💡 {moment.reason}\n\n{moment.transcript[:150]}...\n\n#{' #'.join(moment.keywords)}",
        f"⚡ Viral Score: {moment.viral_score}/10\n\n{moment.transcript[:120]}...\n\n#{' #'.join(moment.keywords)}"
    ]
    
    # Choose template based on hook type
    if moment.hook_type == "question":
        return f"❓ {moment.transcript}\n\n#{' #'.join(moment.keywords)}"
    elif moment.hook_type == "shock":
        return f"😱 {moment.transcript[:150]}...\n\n#{' #'.join(moment.keywords)}"
    else:
        return caption_templates[0]
