import google.generativeai as genai
from typing import List
from app.config import settings
from app.models import ViralMoment
from app.utils.logger import logger
import json


async def analyze_moments(transcript: dict, target_count: int = 10) -> List[ViralMoment]:
    """
    Analyze transcript to find viral moments using Gemini AI
    
    Args:
        transcript: Dict with 'text' and 'segments'
        target_count: Number of clips to generate
        
    Returns:
        List of ViralMoment objects
    """
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        logger.info(f"Analyzing transcript for {target_count} viral moments")
        
        # Create prompt for Gemini
        prompt = f"""
Analyze this video transcript and identify the TOP {target_count} most viral moments for TikTok/Reels.

TRANSCRIPT:
{transcript['text']}

TRANSCRIPT SEGMENTS (with timestamps):
{json.dumps(transcript['segments'][:50], indent=2)}  # First 50 segments for context

For each viral moment, provide:
1. start_time (in seconds)
2. end_time (in seconds) - max 60 seconds duration
3. transcript (exact text from that moment)
4. viral_score (0-10, how viral this moment is)
5. reason (why this moment is viral)
6. keywords (3-5 relevant keywords)
7. hook_type (question/shock/controversy/emotion/humor/tutorial/story)
8. view_prediction (estimated views: 1000-1000000)

CRITERIA FOR VIRAL MOMENTS:
- Strong hooks (questions, shocking statements, controversy)
- Emotional peaks (excitement, surprise, anger, joy)
- Valuable insights or tips
- Relatable situations
- Cliffhangers or plot twists
- Quotable one-liners
- Visual or audio cues (if mentioned in transcript)

Return ONLY a JSON array of {target_count} moments, ordered by viral_score (highest first).
Format: [{{"start_time": 10.5, "end_time": 45.2, "transcript": "...", "viral_score": 9.5, "reason": "...", "keywords": ["...", "..."], "hook_type": "...", "view_prediction": 50000}}, ...]
"""
        
        response = model.generate_content(prompt)
        
        # Parse JSON response
        response_text = response.text.strip()
        
        # Extract JSON from markdown code blocks if present
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        moments_data = json.loads(response_text)
        
        # Convert to ViralMoment objects
        moments = []
        for i, moment in enumerate(moments_data[:target_count]):
            moments.append(ViralMoment(
                start_time=moment['start_time'],
                end_time=min(moment['end_time'], moment['start_time'] + settings.MAX_CLIP_DURATION),
                transcript=moment['transcript'],
                viral_score=moment['viral_score'],
                reason=moment['reason'],
                keywords=moment['keywords'],
                hook_type=moment['hook_type'],
                view_prediction=moment['view_prediction']
            ))
        
        logger.info(f"Identified {len(moments)} viral moments")
        
        return moments
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Gemini response: {str(e)}")
        logger.error(f"Response text: {response_text}")
        raise Exception("Failed to parse AI response")
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise Exception(f"Failed to analyze moments: {str(e)}")
