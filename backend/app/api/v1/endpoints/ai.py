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

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    mood: str
    memory: list[str]

def chat_heuristic_fallback(messages: list[ChatMessage], mood: str):
    last_message = messages[-1].content.lower() if messages else ""
    
    # Check if student is stressed/down
    if mood in ['Stressed', 'Down', '😩', '😔']:
        support_start = "I understand you're feeling really stressed or down today. Please remember to be gentle with yourself. "
    else:
        support_start = ""

    if any(w in last_message for w in ['stress', 'anxious', 'tired', 'overwhelmed', 'sad']):
        return support_start + "It's completely okay to feel overwhelmed by college life. Try to pause, take three deep breaths, and focus on just the next step. You've got this."
    elif any(w in last_message for w in ['study', 'exam', 'class', 'test', 'assignment', 'grade']):
        return "Exams and course deadlines demand a lot of energy. Make sure you schedule small study breaks and reward yourself for your progress."
    elif any(w in last_message for w in ['happy', 'excited', 'glad', 'good']):
        return "That's wonderful to hear! Celebrating these brighter moments is a great way to reinforce positive mental energy."
    elif any(w in last_message for w in ['hello', 'hi', 'hey']):
        return "Hello! 👋 I'm your Unwind wellness companion. I'm here to listen or chat about whatever is on your mind."
    
    return support_start + "Thank you for sharing that with me. I'm always here to listen and help you reflect whenever you need a safe space."

@router.post("/chat")
def chat_with_companion(data: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "mock_api_key_placeholder":
        logger.warning("GEMINI_API_KEY environment variable is missing or placeholder. Running chat fallback.")
        return {"response": chat_heuristic_fallback(data.messages, data.mood)}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    # Compile prompt
    memory_str = "\n".join([f"- {m}" for m in data.memory]) if data.memory else "No recent reflection history."
    
    mood_instruction = "The student's mood today is neutral."
    if data.mood in ['Stressed', 'Down', '😩', '😔']:
        mood_instruction = "The student is feeling stressed, tired, or down today. Maintain a gentle, non-clinical tone focused on helpful organization, structure, and simple study/productivity options. Avoid excessive emotional coddling."
    elif data.mood in ['Amazing', 'Good', '😀', '🙂']:
        mood_instruction = "The student is feeling happy, excited, or good today. Celebrate their positive progress and structure their goals!"
        
    prompt = f"""You are Luna, Unwind's AI Reflection & Productivity Companion. You function as a reflective thinking partner, study companion, organization assistant, productivity helper, and journal summarizer.

CRITICAL HEALTH & SAFETY LIMITS:
- You are NOT a therapist, psychologist, or medical professional.
- Never diagnose symptoms, offer psychiatric counsel, or pretend to replace professional medical care.
- Never claim to feel human emotions or understand them directly like a human.
- Do NOT use phrases like: "I understand exactly how you feel", "I'm always here for you", or "I know this must be difficult".

RESPONSE STYLE DIRECTIVES:
- Focus responses on organizing busy thoughts, identifying common themes, simplifying overwhelming situations, breaking tasks down into structured milestones, and offering study suggestions.
- Keep responses relatively brief (1-3 sentences or a short bullet list).
- Use markdown for lists and bolding where helpful.
- Prefer phrasing like:
  "Based on what you've written..."
  "I noticed a recurring theme..."
  "Here's one possible way to organize this..."
  "It might help to tackle this in smaller steps."

CONTEXT:
Student's recent reflection logs (memory):
{memory_str}

Current State:
{mood_instruction}

Conversation history:
"""
    for msg in data.messages:
        role_label = "Student" if msg.role == "user" else "Companion"
        prompt += f"\n{role_label}: {msg.content}"
        
    prompt += "\nCompanion:"

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
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
            content = res_json['candidates'][0]['content']['parts'][0]['text'].strip()
            return {"response": content}
    except Exception as e:
        logger.error(f"Gemini API call failed for chat: {e}. Falling back to heuristics.")
        
    return {"response": chat_heuristic_fallback(data.messages, data.mood)}
