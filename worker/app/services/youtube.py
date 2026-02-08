import yt_dlp
import os
from pathlib import Path
from app.config import settings
from app.utils.logger import logger


async def download_video(video_url: str, job_id: str) -> tuple[str, str]:
    """
    Download video from YouTube or direct URL
    
    Returns:
        tuple: (video_path, audio_path)
    """
    # Create temp directory
    temp_dir = Path(settings.TEMP_DIR) / job_id
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    video_path = str(temp_dir / "video.mp4")
    audio_path = str(temp_dir / "audio.mp3")
    
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': video_path,
        'quiet': False,
        'no_warnings': False,
        'extract_audio': False,
        # Bypass bot detection options
        'extractor_args': {
            'youtube': {
                'player_client': ['ios', 'web'],  # Use iOS client which doesn't require sign-in
            }
        },
        'http_headers': {
            'User-Agent': 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
            'Accept-Language': 'en-US,en;q=0.9',
        },
        'sleep_interval': 1,  # Add delay between requests
        'max_sleep_interval': 3,
        'socket_timeout': 30,
        'retries': 10,
        'fragment_retries': 10,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    
    try:
        logger.info(f"Downloading video from: {video_url}")
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Download video
            info = ydl.extract_info(video_url, download=True)
            
            # Get video metadata
            duration = info.get('duration', 0)
            title = info.get('title', 'Unknown')
            
            logger.info(f"Downloaded: {title} ({duration}s)")
            
            # Check duration limit
            if duration > settings.MAX_VIDEO_DURATION:
                raise ValueError(f"Video too long: {duration}s (max: {settings.MAX_VIDEO_DURATION}s)")
        
        # Extract audio separately for transcription
        audio_opts = {
            'format': 'bestaudio/best',
            'outtmpl': audio_path,
            # Same bot detection bypass options
            'extractor_args': {
                'youtube': {
                    'player_client': ['ios', 'web'],
                }
            },
            'http_headers': {
                'User-Agent': 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            'sleep_interval': 1,
            'max_sleep_interval': 3,
            'retries': 10,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
            }],
        }
        
        with yt_dlp.YoutubeDL(audio_opts) as ydl:
            ydl.download([video_url])
        
        logger.info(f"Audio extracted to: {audio_path}")
        
        return video_path, audio_path
        
    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise Exception(f"Failed to download video: {str(e)}")
