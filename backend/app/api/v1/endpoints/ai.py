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

def call_gemini_api(url: str, payload: dict, timeout: int = 10, max_attempts: int = 2) -> dict:
    """
    Calls the Gemini API using urllib with retry logic and timeout handling.
    """
    import time
    for attempt in range(1, max_attempts + 1):
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=timeout) as response:
                res_data = response.read().decode('utf-8')
                return json.loads(res_data)
        except Exception as e:
            logger.warning(f"Gemini API attempt {attempt} failed: {e}")
            if attempt == max_attempts:
                raise e
            time.sleep(1)

@router.post("/reflection")
def generate_ai_reflection(data: ReflectionRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "mock_api_key_placeholder":
        logger.warning("GEMINI_API_KEY environment variable is missing or placeholder. Running fallback.")
        fallback = heuristic_fallback(data.journal, data.mood)
        return {
            "success": True,
            "message": "AI reflection generated via fallback heuristics.",
            "data": fallback
        }

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
        res_json = call_gemini_api(url, payload, timeout=10, max_attempts=2)
        content = res_json['candidates'][0]['content']['parts'][0]['text']
        parsed = json.loads(content)
        
        if all(k in parsed for k in ["summary", "themes", "reflection", "suggestions"]):
            return {
                "success": True,
                "message": "AI reflection generated successfully.",
                "data": {
                    "summary": parsed["summary"],
                    "themes": parsed["themes"],
                    "reflection": parsed["reflection"],
                    "suggestions": parsed["suggestions"],
                    "is_fallback": False
                }
            }
    except Exception as e:
        logger.error(f"Gemini API call failed: {e}. Falling back to heuristics.")

    fallback = heuristic_fallback(data.journal, data.mood)
    return {
        "success": True,
        "message": "AI reflection generated via fallback heuristics.",
        "data": fallback
    }

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    mood: str
    memory: list[str]

def chat_heuristic_fallback(messages: list[ChatMessage], mood: str):
    last_message = messages[-1].content.lower() if messages else ""
    
    # Classify the intent based on keywords
    is_planning = any(w in last_message for w in ['plan', 'schedule', 'week', 'calendar', 'organize', 'routine'])
    is_studying = any(w in last_message for w in ['study', 'exam', 'test', 'revision', 'midterm', 'finals', 'homework', 'lecture'])
    is_productivity = any(w in last_message for w in ['procrastinating', 'procrastinate', 'lazy', 'focus', 'distracted', 'slacking', 'stuck'])
    is_decision = any(w in last_message for w in ['choose', 'decide', 'option', 'choice', 'alternative', 'split', 'decision'])
    is_reflection = any(w in last_message for w in ['reflect', 'thinking about', 'pondering', 'mind', 'day', 'entry', 'journal'])
    is_goals = any(w in last_message for w in ['goal', 'target', 'achievement', 'habit', 'aim'])
    is_brainstorm = any(w in last_message for w in ['brainstorm', 'ideas', 'creative', 'thoughts', 'list', 'suggestions'])
    is_emotional = any(w in last_message for w in ['stressed', 'stress', 'anxious', 'anxiety', 'sad', 'lonely', 'family', 'problem', 'cry', 'worry', 'bad', 'rough'])
    
    if is_planning:
        return "Let's organize it together. What are the three most important things you'd like to accomplish this week? Once we have those, we can build a realistic schedule."
    elif is_studying:
        return "Let's tackle your study preparation. Would it help to:\n- Build a study timetable\n- Create a revision planner\n- Organize a priority matrix\n- Set up a Pomodoro plan\n- Arrange a break schedule?"
    elif is_productivity:
        return "Instead of searching for motivation, let's break your task into tiny, manageable steps. What is the very first, 5-minute action you can take right now?"
    elif is_decision:
        return "Making choices can feel heavy. Let's list the pros and cons, use a priority scoring matrix, or compare the long-term vs short-term impact of your options. What decision are you facing today?"
    elif is_reflection:
        return "That sounds like a meaningful point to pause. Looking back on this today, what's one thing you felt in control of, and what's one thing you'd like to let go of?"
    elif is_goals:
        return "Let's define a clear path forward. What is one specific, measurable goal you want to focus on, and how will you track your progress?"
    elif is_brainstorm:
        return "Let's brainstorm. I will list some ideas in structured formats to help you explore different options. What concept or problem are we exploring?"
    elif is_emotional:
        return "I can see this has been weighing on you. Would it help to:\n- Organize your thoughts\n- Prepare for a conversation\n- Make a plan\n- Focus on what you can control today?"
    
    # Fallback to general welcome or open prompt
    return "Hi, I'm Luna. Your wellness and productivity companion. I can help you plan your week, study, reflect, brainstorm, or make decisions. What would you like to work on today?"

@router.post("/chat")
def chat_with_companion(data: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "mock_api_key_placeholder":
        logger.warning("GEMINI_API_KEY environment variable is missing or placeholder. Running chat fallback.")
        fallback_resp = chat_heuristic_fallback(data.messages, data.mood)
        return {
            "success": True,
            "message": "Chat response generated via fallback heuristics.",
            "data": {
                "response": fallback_resp
            }
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    # Compile prompt
    memory_str = "\n".join([f"- {m}" for m in data.memory]) if data.memory else "No recent reflection history."
    
    mood_instruction = "The student's mood today is neutral."
    if data.mood in ['Stressed', 'Down', '😩', '😔']:
        mood_instruction = "The student is feeling stressed, tired, or down today. Maintain a gentle, non-clinical tone focused on helpful organization, structure, and simple study/productivity options. Avoid excessive emotional coddling."
    elif data.mood in ['Amazing', 'Good', '😀', '🙂']:
        mood_instruction = "The student is feeling happy, excited, or good today. Celebrate their positive progress and structure their goals!"
        
    prompt = f"""You are Luna, the AI companion inside Unwind.
Your purpose is to help users organize thoughts, solve problems, reflect, plan, brainstorm, and make decisions.
You are warm, calm, intelligent, and encouraging.
You never claim to be a therapist, counselor, psychologist, or mental health professional.
You never diagnose.
You never provide medical advice.

Before generating your response, classify the user's message into one of these intents:
- Planning
- Productivity
- Studying
- Decision Making
- Reflection
- Goal Setting
- Brainstorming
- Intent-Aware Emotional Check-In
- General Conversation

Generate your response based on the detected intent instead of generic fallback text.
When conversations involve emotional topics, acknowledge them briefly (validate without overdoing it) before guiding the user toward practical next steps. Prefer structured responses, actionable suggestions, and thoughtful questions over generic reassurance.
Completely avoid repetitive generic responses such as "I'm here to listen", "I'm always here for you", "Thank you for sharing", or "I'm glad you told me". Help users feel capable rather than dependent.

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
        res_json = call_gemini_api(url, payload, timeout=10, max_attempts=2)
        content = res_json['candidates'][0]['content']['parts'][0]['text'].strip()
        return {
            "success": True,
            "message": "Chat response generated successfully.",
            "data": {
                "response": content
            }
        }
    except Exception as e:
        logger.error(f"Gemini API call failed for chat: {e}. Falling back to heuristics.")
        
    fallback_resp = chat_heuristic_fallback(data.messages, data.mood)
    return {
        "success": True,
        "message": "Chat response generated via fallback heuristics.",
        "data": {
            "response": fallback_resp
        }
    }
