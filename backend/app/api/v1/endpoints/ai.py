from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import urllib.request
import json
import os
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

class ReflectionRequest(BaseModel):
    journal: str
    mood: str

def heuristic_fallback(journal: str, mood: str):
    text = journal.lower()
    
    # 1. Summary
    has_academic = any(w in text for w in ['exam', 'assignment', 'deadline', 'college', 'class', 'study'])
    has_stress = any(w in text for w in ['stress', 'anxious', 'tired', 'overwhelmed', 'sad'])
    has_positive = any(w in text for w in ['happy', 'excited', 'grateful', 'thankful'])

    if has_academic and has_stress:
        summary = "Today's reflection focused mostly on academics and feeling slightly overwhelmed."
    elif has_academic and has_positive:
        summary = "Today's reflection highlighted academic tasks but also featured positive energy."
    elif has_stress and has_positive:
        summary = "Your thoughts carried some emotional weight alongside moments of gratitude."
    elif has_academic:
        summary = "Today's entry centered on coursework, priorities, and study schedules."
    elif has_stress:
        summary = "Today's thoughts centered on stress factors and managing daily pressure."
    elif has_positive:
        summary = "Today's reflection focused on moments of appreciation and lightheartedness."
    else:
        summary = "Today's thoughts covered personal daily events and quiet reflections."
        if not journal.strip():
            summary = "I'm here whenever you're ready. Even a few sentences can help you reflect."

    # 2. Themes
    themes = []
    check_map = [
        ("📚 College", ['exam', 'assignment', 'deadline', 'college', 'class', 'study']),
        ("😰 Stress", ['stress', 'anxious', 'tired', 'overwhelmed', 'sad']),
        ("🙏 Gratitude", ['thankful', 'grateful']),
        ("😊 Happiness", ['happy', 'excited', 'glad', 'smile']),
        ("👨‍‍👧 Family", ['family', 'parent', 'mom', 'dad', 'sibling']),
        ("👥 Friends", ['friend', 'group', 'peer', 'classmate']),
        ("😴 Sleep", ['sleep', 'bed', 'rest', 'night']),
        ("🎯 Goals", ['goal', 'habit', 'plan', 'priority']),
        ("🌱 Self Growth", ['grow', 'improve', 'build', 'step'])
    ]
    for tag, keywords in check_map:
        if any(w in text for w in keywords):
            themes.append(tag)

    # 3. Insight/Reflection
    reflection = "You've taken a meaningful step by putting your thoughts into words today."
    if any(w in text for w in ['stress', 'sad', 'anxious', 'overwhelmed', 'tired']):
        reflection = "You've been honest about difficult emotions today, and that's an important step."
    elif any(w in text for w in ['exam', 'assignment', 'deadline', 'college', 'class', 'study']):
        reflection = "It sounds like academics took up a lot of your mental space today."
    elif any(w in text for w in ['happy', 'excited', 'grateful', 'thankful']):
        reflection = "You mentioned several positive moments worth celebrating."

    # 4. Suggestions
    sug1 = "🌿 Drink some water"
    sug2 = "🚶 Take a short walk"
    sug3 = "📖 Write one positive memory"

    if any(w in text for w in ['sleep', 'tired']):
        sug3 = "😴 Sleep a little earlier tonight"
    if any(w in text for w in ['stress', 'anxious', 'overwhelmed']):
        sug2 = "🎵 Listen to calming music"
    if any(w in text for w in ['study', 'exam', 'desk', 'class']):
        sug1 = "☀️ Spend five minutes outside"

    return {
        "summary": summary,
        "themes": themes,
        "reflection": reflection,
        "suggestions": [sug1, sug2, sug3],
        "is_fallback": True
    }

@router.post("/reflection")
def generate_ai_reflection(data: ReflectionRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "mock_api_key_placeholder":
        logger.warning("GEMINI_API_KEY environment variable is missing or placeholder. Running fallback.")
        return heuristic_fallback(data.journal, data.mood)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    prompt = f"""You are an AI wellness companion. Analyze the student's journal entry and mood.
Journal entry: "{data.journal}"
Mood: "{data.mood}"

Return a JSON object containing:
- "summary": A brief, comforting 1-2 sentence summary of their day.
- "themes": A list of up to 4 detected wellness themes from: 📚 College, 😰 Stress, 🙏 Gratitude, 😊 Happiness, 👨‍‍👧 Family, 👥 Friends, 😴 Sleep, 🎯 Goals, 🌱 Self Growth.
- "reflection": A supportive, non-clinical, and encouraging observation. Do not diagnose, give medical advice, or claim to be a therapist.
- "suggestions": Exactly three practical, healthy actions to take.

JSON Format:
{{
  "summary": "...",
  "themes": ["theme1", "theme2"],
  "reflection": "...",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}}
"""

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = response.read().decode('utf-8')
            res_json = json.loads(res_data)
            content = res_json['candidates'][0]['content']['parts'][0]['text']
            parsed = json.loads(content)
            
            if all(k in parsed for k in ["summary", "themes", "reflection", "suggestions"]):
                return {
                    "summary": parsed["summary"],
                    "themes": parsed["themes"],
                    "reflection": parsed["reflection"],
                    "suggestions": parsed["suggestions"],
                    "is_fallback": False
                }
    except Exception as e:
        logger.error(f"Gemini API call failed: {e}. Falling back to heuristics.")

    return heuristic_fallback(data.journal, data.mood)
