import httpx
import os
import re
import subprocess
from pathlib import Path
from app.config import settings
from app.utils.logger import logger

# Browser-like headers to bypass 403 restrictions on googlevideo.com
DOWNLOAD_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "identity;q=1, *;q=0",
    "Referer": "https://www.youtube.com/",
    "Origin": "https://www.youtube.com",
    "Sec-Fetch-Dest": "video",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
}


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError(f"Could not extract video ID from URL: {url}")


async def download_with_rapidapi(video_id: str, video_path: str, audio_path: str) -> dict:
    """
    Download video using YTStream RapidAPI
    Returns video metadata (title, duration)
    """
    api_key = getattr(settings, 'RAPIDAPI_KEY', None)
    if not api_key:
        raise ValueError("RAPIDAPI_KEY not configured")
    
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com"
    }
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        # Get video info and download URLs
        logger.info(f"Fetching video info from YTStream API for: {video_id}")
        response = await client.get(
            f"https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id={video_id}",
            headers=headers
        )
        
        if response.status_code != 200:
            raise Exception(f"YTStream API error: {response.status_code} - {response.text}")
        
        data = response.json()
        
        if data.get('status') != 'OK':
            raise Exception(f"YTStream API returned error: {data}")
        
        # Get video title and duration
        title = data.get('title', 'Unknown')
        duration = data.get('duration', 0)
        
        # Parse duration string to seconds (format: "MM:SS" or "HH:MM:SS")
        if isinstance(duration, str):
            parts = duration.split(':')
            if len(parts) == 2:
                duration = int(parts[0]) * 60 + int(parts[1])
            elif len(parts) == 3:
                duration = int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
            else:
                duration = 0
        
        logger.info(f"Video info: {title} ({duration}s)")
        
        # Check duration limit
        max_duration = getattr(settings, 'MAX_VIDEO_DURATION', 3600)
        if duration > max_duration:
            raise ValueError(f"Video too long: {duration}s (max: {max_duration}s)")
        
        # Find best video format (prefer 720p mp4)
        formats = data.get('formats', [])
        video_url = None
        audio_url = None
        
        # Look for video with audio combined
        for fmt in formats:
            if fmt.get('mimeType', '').startswith('video/mp4'):
                quality = fmt.get('qualityLabel', '')
                if '720p' in quality or '480p' in quality or '360p' in quality:
                    video_url = fmt.get('url')
                    break
        
        # Fallback to any video format
        if not video_url:
            for fmt in formats:
                if fmt.get('mimeType', '').startswith('video/'):
                    video_url = fmt.get('url')
                    break
        
        # Look for audio format
        adaptive_formats = data.get('adaptiveFormats', [])
        for fmt in adaptive_formats:
            if fmt.get('mimeType', '').startswith('audio/'):
                audio_url = fmt.get('url')
                break
        
        if not video_url:
            raise Exception("No suitable video format found")
        
        # Download video file with browser headers to bypass 403
        logger.info(f"Downloading video from: {video_url[:100]}...")
        async with httpx.AsyncClient(timeout=300.0, headers=DOWNLOAD_HEADERS) as download_client:
            async with download_client.stream('GET', video_url, follow_redirects=True) as video_response:
                if video_response.status_code == 200:
                    with open(video_path, 'wb') as f:
                        async for chunk in video_response.aiter_bytes(chunk_size=8192):
                            f.write(chunk)
                    logger.info(f"Video downloaded to: {video_path}")
                else:
                    raise Exception(f"Failed to download video: {video_response.status_code}")
        
        # Download or extract audio
        if audio_url:
            logger.info(f"Downloading audio from: {audio_url[:100]}...")
            async with httpx.AsyncClient(timeout=300.0, headers=DOWNLOAD_HEADERS) as download_client:
                async with download_client.stream('GET', audio_url, follow_redirects=True) as audio_response:
                    if audio_response.status_code == 200:
                        temp_audio = audio_path.replace('.mp3', '.m4a')
                        with open(temp_audio, 'wb') as f:
                            async for chunk in audio_response.aiter_bytes(chunk_size=8192):
                                f.write(chunk)
                
                # Convert to MP3 using ffmpeg
                subprocess.run([
                    'ffmpeg', '-i', temp_audio, '-vn', '-acodec', 'libmp3lame',
                    '-q:a', '2', audio_path, '-y'
                ], capture_output=True)
                
                # Cleanup temp file
                if os.path.exists(temp_audio):
                    os.remove(temp_audio)
        else:
            # Extract audio from video using ffmpeg
            logger.info("Extracting audio from video...")
            subprocess.run([
                'ffmpeg', '-i', video_path, '-vn', '-acodec', 'libmp3lame',
                '-q:a', '2', audio_path, '-y'
            ], capture_output=True)
        
        logger.info(f"Audio saved to: {audio_path}")
        
        return {
            'title': title,
            'duration': duration
        }


async def download_video(video_url: str, job_id: str) -> tuple[str, str]:
    """
    Download video from YouTube using RapidAPI (YTStream)
    Falls back to direct download for non-YouTube URLs
    
    Returns:
        tuple: (video_path, audio_path)
    """
    # Create temp directory
    temp_dir = Path(settings.TEMP_DIR) / job_id
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    video_path = str(temp_dir / "video.mp4")
    audio_path = str(temp_dir / "audio.mp3")
    
    try:
        # Check if it's a YouTube URL
        if 'youtube.com' in video_url or 'youtu.be' in video_url:
            video_id = extract_video_id(video_url)
            logger.info(f"Detected YouTube video: {video_id}")
            
            # Use RapidAPI YTStream
            metadata = await download_with_rapidapi(video_id, video_path, audio_path)
            logger.info(f"Downloaded via RapidAPI: {metadata['title']}")
            
        else:
            # Direct URL - use httpx to download
            logger.info(f"Downloading direct URL: {video_url}")
            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.get(video_url, follow_redirects=True)
                if response.status_code == 200:
                    Path(video_path).write_bytes(response.content)
                    
                    # Extract audio using ffmpeg
                    subprocess.run([
                        'ffmpeg', '-i', video_path, '-vn', '-acodec', 'libmp3lame',
                        '-q:a', '2', audio_path, '-y'
                    ], capture_output=True)
                else:
                    raise Exception(f"Failed to download: {response.status_code}")
        
        # Verify files exist
        if not os.path.exists(video_path):
            raise Exception("Video file was not created")
        if not os.path.exists(audio_path):
            raise Exception("Audio file was not created")
        
        return video_path, audio_path
        
    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise Exception(f"Failed to download video: {str(e)}")
