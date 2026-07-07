from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import urllib.request
import json
import os
import logging
from app.api.v1.endpoints.ai import call_gemini_api

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

class ReflectionItem(BaseModel):
    date: str
    mood: str
    journal: str

class MonthlySummaryRequest(BaseModel):
    reflections: List[ReflectionItem]

def monthly_heuristic_summary(reflections: List[Dict]) -> str:
    if not reflections:
        return "You haven't logged any reflections this month yet. Regular journaling can help you track study patterns and build consistency."
    
    count = len(reflections)
    # Scrape keywords in list entries
    journals = [r.get('journal', '').lower() for r in reflections]
    has_academic = any('exam' in j or 'study' in j or 'assignment' in j or 'class' in j for j in journals)
    has_stress = any('stress' in j or 'overwhelmed' in j or 'anxious' in j or 'tired' in j for j in journals)
    has_positive = any('grateful' in j or 'happy' in j or 'excited' in j for j in journals)

    themes = []
    if has_academic: themes.append("coursework studies")
    if has_stress: themes.append("managing stress and tiredness")
    if has_positive: themes.append("moments of gratitude")
    
    themes_str = ", ".join(themes) if themes else "daily personal routines"
    
    summary = f"This month, you completed {count} wellness reflections. Your entries focused on {themes_str}. "
    if has_stress:
        summary += "You've been honest about managing daily pressures and coursework deadlines, which is a key step in emotional growth. "
    else:
        summary += "You have maintained a balanced emotional state throughout the month. "
        
    summary += "Keep writing, taking screen-free breaks, and prioritizing your mental space."
    return summary

@router.post("/monthly-summary")
def generate_monthly_summary(data: MonthlySummaryRequest):
    reflections_list = [item.dict() for item in data.reflections]
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "mock_api_key_placeholder":
        logger.warning("GEMINI_API_KEY is missing or placeholder. Running monthly fallback.")
        fallback = monthly_heuristic_summary(reflections_list)
        return {
            "success": True,
            "message": "Monthly summary generated via fallback heuristics.",
            "data": {
                "summary": fallback,
                "is_fallback": True
            }
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    # Format the journal logs chronologically for the prompt
    formatted_entries = ""
    for idx, r in enumerate(reflections_list[:30]):
        formatted_entries += f"Log {idx+1} ({r.get('date', 'N/A')} - Mood: {r.get('mood', 'Neutral')}):\n{r.get('journal', '')}\n\n"
        
    prompt = f"""You are an AI wellness companion. Generate a supportive, monthly summary of the student's journal history over the last 30 entries.
Journal history:
{formatted_entries}

Instructions:
- Write a short, single paragraph summarizing their month in review.
- Outline: recurring themes, emotional growth, study/work patterns, and positive moments.
- Provide warm encouragement.
- Never diagnose, provide therapy, or provide medical advice. Keep it entirely supportive and non-clinical.
"""

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    try:
        res_json = call_gemini_api(url, payload, timeout=15, max_attempts=2)
        content = res_json['candidates'][0]['content']['parts'][0]['text']
        return {
            "success": True,
            "message": "Monthly summary generated successfully.",
            "data": {
                "summary": content.strip(),
                "is_fallback": False
            }
        }
    except Exception as e:
        logger.error(f"Gemini monthly summary failed: {e}. Falling back to heuristics.")

    fallback = monthly_heuristic_summary(reflections_list)
    return {
        "success": True,
        "message": "Monthly summary generated via fallback heuristics.",
        "data": {
            "summary": fallback,
            "is_fallback": True
        }
    }
