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
        'format': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best',
        'outtmpl': video_path,
        'quiet': False,
        'no_warnings': False,
        'extract_audio': False,
        'nocheckcertificate': True,
        # Bypass bot detection - use mweb/android clients which bypass restrictions
        'extractor_args': {
            'youtube': {
                'player_client': ['mweb', 'android_creator', 'android', 'tv'],
                'player_skip': ['webpage'],
            }
        },
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        },
        'sleep_interval': 3,
        'max_sleep_interval': 10,
        'sleep_interval_requests': 2,
        'socket_timeout': 120,
        'retries': 15,
        'fragment_retries': 15,
        'file_access_retries': 5,
        'skip_download': False,
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
            'nocheckcertificate': True,
            # Same bot detection bypass options
            'extractor_args': {
                'youtube': {
                    'player_client': ['mweb', 'android_creator', 'android', 'tv'],
                    'player_skip': ['webpage'],
                }
            },
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            'sleep_interval': 3,
            'max_sleep_interval': 10,
            'retries': 15,
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
