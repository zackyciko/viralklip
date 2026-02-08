from groq import Groq
import google.generativeai as genai
from typing import List
from app.config import settings
from app.models import ViralMoment
from app.utils.logger import logger
import json


def get_analysis_prompt(transcript: dict, target_count: int) -> str:
    """Generate the prompt for viral moment analysis"""
    return f"""Analyze this video transcript and identify the TOP {target_count} most viral moments for TikTok/Reels.

TRANSCRIPT:
{transcript['text']}

TRANSCRIPT SEGMENTS (with timestamps):
{json.dumps(transcript['segments'][:50], indent=2)}

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

Return ONLY a JSON array of {target_count} moments, ordered by viral_score (highest first).
Format: [{{"start_time": 10.5, "end_time": 45.2, "transcript": "...", "viral_score": 9.5, "reason": "...", "keywords": ["...", "..."], "hook_type": "...", "view_prediction": 50000}}, ...]"""


async def analyze_with_groq(prompt: str) -> str:
    """Use Groq LLaMA for analysis - faster and no rate limits"""
    logger.info("Using Groq LLaMA for viral moment analysis")
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are an expert at identifying viral TikTok/Reels moments. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=4096,
    )
    
    return response.choices[0].message.content


async def analyze_with_gemini(prompt: str) -> str:
    """Use Gemini for analysis - fallback option"""
    logger.info("Using Gemini for viral moment analysis")
    
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    response = model.generate_content(prompt)
    return response.text


def parse_response(response_text: str) -> list:
    """Parse JSON response from AI"""
    response_text = response_text.strip()
    
    # Extract JSON from markdown code blocks if present
    if "```json" in response_text:
        response_text = response_text.split("```json")[1].split("```")[0].strip()
    elif "```" in response_text:
        response_text = response_text.split("```")[1].split("```")[0].strip()
    
    return json.loads(response_text)


async def analyze_moments(transcript: dict, target_count: int = 10) -> List[ViralMoment]:
    """
    Analyze transcript to find viral moments
    Uses Groq LLaMA as primary (faster, no rate limits)
    Falls back to Gemini if Groq fails
    
    Args:
        transcript: Dict with 'text' and 'segments'
        target_count: Number of clips to generate
        
    Returns:
        List of ViralMoment objects
    """
    logger.info(f"Analyzing transcript for {target_count} viral moments")
    
    prompt = get_analysis_prompt(transcript, target_count)
    response_text = None
    
    # Try Groq first (no rate limits)
    try:
        response_text = await analyze_with_groq(prompt)
        moments_data = parse_response(response_text)
        logger.info("Groq analysis successful")
        
    except Exception as groq_error:
        logger.warning(f"Groq failed: {str(groq_error)}, trying Gemini fallback")
        
        # Fallback to Gemini
        try:
            response_text = await analyze_with_gemini(prompt)
            moments_data = parse_response(response_text)
            logger.info("Gemini fallback successful")
            
        except Exception as gemini_error:
            logger.error(f"Both AI providers failed. Groq: {groq_error}, Gemini: {gemini_error}")
            raise Exception(f"AI analysis failed: {str(gemini_error)}")
    
    # Convert to ViralMoment objects
    moments = []
    for moment in moments_data[:target_count]:
        try:
            moments.append(ViralMoment(
                start_time=float(moment.get('start_time', 0)),
                end_time=min(float(moment.get('end_time', 60)), float(moment.get('start_time', 0)) + settings.MAX_CLIP_DURATION),
                transcript=moment.get('transcript', ''),
                viral_score=float(moment.get('viral_score', 5)),
                reason=moment.get('reason', ''),
                keywords=moment.get('keywords', []),
                hook_type=moment.get('hook_type', 'story'),
                view_prediction=int(moment.get('view_prediction', 10000))
            ))
        except Exception as e:
            logger.warning(f"Skipping malformed moment: {e}")
            continue
    
    logger.info(f"Identified {len(moments)} viral moments")
    
    return moments
