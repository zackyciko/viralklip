from groq import Groq
from app.config import settings
from app.utils.logger import logger


async def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe audio using Groq Whisper API
    
    Args:
        audio_path: Path to audio file
        
    Returns:
        str: Full transcript with timestamps
    """
    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        logger.info(f"Transcribing audio: {audio_path}")
        
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3",
                response_format="verbose_json",
                language="id",  # Indonesian, change as needed
                temperature=0.0
            )
        
        # Extract full text
        full_text = transcription.text
        
        # Extract segments with timestamps
        segments = []
        if hasattr(transcription, 'segments'):
            for segment in transcription.segments:
                segments.append({
                    'start': segment['start'],
                    'end': segment['end'],
                    'text': segment['text']
                })
        
        logger.info(f"Transcription complete: {len(full_text)} characters, {len(segments)} segments")
        
        return {
            'text': full_text,
            'segments': segments
        }
        
    except Exception as e:
        logger.error(f"Transcription failed: {str(e)}")
        raise Exception(f"Failed to transcribe audio: {str(e)}")


def format_timestamp(seconds: float) -> str:
    """Convert seconds to HH:MM:SS format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"
