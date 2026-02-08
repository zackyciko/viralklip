import httpx
import os
import re
import subprocess
from pathlib import Path
from app.config import settings
from app.utils.logger import logger

# List of public Invidious instances - these proxy YouTube requests
INVIDIOUS_INSTANCES = [
    "https://inv.nadeko.net",
    "https://yt.artemislena.eu", 
    "https://invidious.nerdvpn.de",
    "https://invidious.jing.rocks",
    "https://iv.nboez.cc",
    "https://invidious.einfachzocken.eu",
    "https://inv.vern.cc",
]

# Browser-like headers
DOWNLOAD_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.youtube.com/",
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


async def download_with_invidious(video_id: str, video_path: str, audio_path: str) -> dict:
    """
    Download video using Invidious API (free, open-source YouTube proxy)
    Tries multiple instances until one works
    """
    last_error = None
    
    async with httpx.AsyncClient(timeout=120.0, headers=DOWNLOAD_HEADERS) as client:
        for instance in INVIDIOUS_INSTANCES:
            try:
                logger.info(f"Trying Invidious instance: {instance}")
                
                # Get video info with local=true for direct stream URLs
                response = await client.get(
                    f"{instance}/api/v1/videos/{video_id}?local=true",
                    follow_redirects=True
                )
                
                if response.status_code != 200:
                    logger.warning(f"{instance} returned {response.status_code}")
                    continue
                
                data = response.json()
                
                # Get video metadata
                title = data.get('title', 'Unknown')
                duration = data.get('lengthSeconds', 0)
                
                logger.info(f"Video info: {title} ({duration}s)")
                
                # Check duration limit
                max_duration = getattr(settings, 'MAX_VIDEO_DURATION', 3600)
                if duration > max_duration:
                    raise ValueError(f"Video too long: {duration}s (max: {max_duration}s)")
                
                # Get format streams (combined video+audio)
                format_streams = data.get('formatStreams', [])
                adaptive_formats = data.get('adaptiveFormats', [])
                
                video_url = None
                audio_url = None
                
                # Look for best combined format (720p or lower)
                for fmt in format_streams:
                    quality = fmt.get('qualityLabel', '')
                    if '720p' in quality or '480p' in quality or '360p' in quality:
                        video_url = fmt.get('url')
                        break
                
                # Fallback to any format stream
                if not video_url and format_streams:
                    video_url = format_streams[0].get('url')
                
                # Look for audio in adaptive formats
                for fmt in adaptive_formats:
                    mime = fmt.get('type', '')
                    if 'audio' in mime:
                        audio_url = fmt.get('url')
                        break
                
                if not video_url:
                    logger.warning(f"{instance} - no video URL found")
                    continue
                
                # Download video
                logger.info(f"Downloading video from: {video_url[:100]}...")
                async with client.stream('GET', video_url, follow_redirects=True) as video_resp:
                    if video_resp.status_code != 200:
                        logger.warning(f"Video download failed: {video_resp.status_code}")
                        continue
                    
                    with open(video_path, 'wb') as f:
                        async for chunk in video_resp.aiter_bytes(chunk_size=16384):
                            f.write(chunk)
                
                logger.info(f"Video downloaded to: {video_path}")
                
                # Download or extract audio
                if audio_url:
                    logger.info(f"Downloading audio from: {audio_url[:100]}...")
                    async with client.stream('GET', audio_url, follow_redirects=True) as audio_resp:
                        if audio_resp.status_code == 200:
                            temp_audio = audio_path.replace('.mp3', '.m4a')
                            with open(temp_audio, 'wb') as f:
                                async for chunk in audio_resp.aiter_bytes(chunk_size=16384):
                                    f.write(chunk)
                            
                            # Convert to MP3
                            subprocess.run([
                                'ffmpeg', '-i', temp_audio, '-vn', '-acodec', 'libmp3lame',
                                '-q:a', '2', audio_path, '-y'
                            ], capture_output=True)
                            
                            if os.path.exists(temp_audio):
                                os.remove(temp_audio)
                        else:
                            # Extract from video
                            logger.info("Extracting audio from video...")
                            subprocess.run([
                                'ffmpeg', '-i', video_path, '-vn', '-acodec', 'libmp3lame',
                                '-q:a', '2', audio_path, '-y'
                            ], capture_output=True)
                else:
                    # Extract audio from video
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
                
            except Exception as e:
                logger.warning(f"{instance} failed: {str(e)}")
                last_error = e
                continue
    
    raise Exception(f"All Invidious instances failed. Last error: {last_error}")


async def download_with_rapidapi(video_id: str, video_path: str, audio_path: str) -> dict:
    """
    Fallback: Download using RapidAPI YTStream
    Note: This may fail with 403 due to IP restrictions
    """
    api_key = getattr(settings, 'RAPIDAPI_KEY', None)
    if not api_key:
        raise ValueError("RAPIDAPI_KEY not configured")
    
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com"
    }
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        logger.info(f"Fetching video info from YTStream API for: {video_id}")
        response = await client.get(
            f"https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id={video_id}",
            headers=headers
        )
        
        if response.status_code != 200:
            raise Exception(f"YTStream API error: {response.status_code}")
        
        data = response.json()
        
        if data.get('status') != 'OK':
            raise Exception(f"YTStream error: {data}")
        
        title = data.get('title', 'Unknown')
        duration = data.get('duration', 0)
        
        # Parse duration
        if isinstance(duration, str):
            parts = duration.split(':')
            if len(parts) == 2:
                duration = int(parts[0]) * 60 + int(parts[1])
            elif len(parts) == 3:
                duration = int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
            else:
                duration = 0
        
        # Find video URL
        formats = data.get('formats', [])
        video_url = None
        
        for fmt in formats:
            if fmt.get('mimeType', '').startswith('video/mp4'):
                video_url = fmt.get('url')
                break
        
        if not video_url:
            for fmt in formats:
                if fmt.get('mimeType', '').startswith('video/'):
                    video_url = fmt.get('url')
                    break
        
        if not video_url:
            raise Exception("No video format found")
        
        # Download with browser headers
        download_headers = {**DOWNLOAD_HEADERS, "Origin": "https://www.youtube.com"}
        async with httpx.AsyncClient(timeout=300.0, headers=download_headers) as download_client:
            async with download_client.stream('GET', video_url, follow_redirects=True) as resp:
                if resp.status_code != 200:
                    raise Exception(f"Download failed: {resp.status_code}")
                with open(video_path, 'wb') as f:
                    async for chunk in resp.aiter_bytes(chunk_size=16384):
                        f.write(chunk)
        
        # Extract audio
        subprocess.run([
            'ffmpeg', '-i', video_path, '-vn', '-acodec', 'libmp3lame',
            '-q:a', '2', audio_path, '-y'
        ], capture_output=True)
        
        return {'title': title, 'duration': duration}


async def download_video(video_url: str, job_id: str) -> tuple[str, str]:
    """
    Download video from YouTube using Invidious (primary) or RapidAPI (fallback)
    Falls back to direct download for non-YouTube URLs
    
    Returns:
        tuple: (video_path, audio_path)
    """
    temp_dir = Path(settings.TEMP_DIR) / job_id
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    video_path = str(temp_dir / "video.mp4")
    audio_path = str(temp_dir / "audio.mp3")
    
    try:
        # Check if it's a YouTube URL
        if 'youtube.com' in video_url or 'youtu.be' in video_url:
            video_id = extract_video_id(video_url)
            logger.info(f"Detected YouTube video: {video_id}")
            
            # Try Invidious first (free, designed for servers)
            try:
                metadata = await download_with_invidious(video_id, video_path, audio_path)
                logger.info(f"Downloaded via Invidious: {metadata['title']}")
            except Exception as inv_error:
                logger.warning(f"Invidious failed: {inv_error}, trying RapidAPI...")
                
                # Fallback to RapidAPI
                try:
                    metadata = await download_with_rapidapi(video_id, video_path, audio_path)
                    logger.info(f"Downloaded via RapidAPI: {metadata['title']}")
                except Exception as rapid_error:
                    logger.error(f"Both download methods failed: Invidious: {inv_error}, RapidAPI: {rapid_error}")
                    raise Exception(f"YouTube download failed: {rapid_error}")
            
        else:
            # Direct URL - use httpx to download
            logger.info(f"Downloading direct URL: {video_url}")
            async with httpx.AsyncClient(timeout=300.0, headers=DOWNLOAD_HEADERS) as client:
                async with client.stream('GET', video_url, follow_redirects=True) as response:
                    if response.status_code == 200:
                        with open(video_path, 'wb') as f:
                            async for chunk in response.aiter_bytes(chunk_size=16384):
                                f.write(chunk)
                        
                        # Extract audio
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
