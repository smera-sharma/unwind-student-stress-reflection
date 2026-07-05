import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../ui/Card';

const AIReflectionCard = ({ journal = '', selectedMood = 'Neutral', aiReflectionRef }) => {
  const [reflectionData, setReflectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Local Heuristic Fallback Engine
  const runLocalHeuristics = (textVal, moodVal) => {
    const text = textVal.toLowerCase();
    
    // Summary
    const hasAcademic = ['exam', 'assignment', 'deadline', 'college', 'class', 'study'].some(w => text.includes(w));
    const hasStress = ['stress', 'anxious', 'tired', 'overwhelmed', 'sad'].some(w => text.includes(w));
    const hasPositive = ['happy', 'excited', 'grateful', 'thankful'].some(w => text.includes(w));

    let summary = "Today's thoughts covered personal daily events and quiet reflections.";
    if (hasAcademic && hasStress) {
      summary = "Today's reflection focused mostly on academics and feeling slightly overwhelmed.";
    } else if (hasAcademic && hasPositive) {
      summary = "Today's reflection highlighted academic tasks but also featured positive energy.";
    } else if (hasStress && hasPositive) {
      summary = "Your thoughts carried some emotional weight alongside moments of gratitude.";
    } else if (hasAcademic) {
      summary = "Today's entry centered on coursework, priorities, and study schedules.";
    } else if (hasStress) {
      summary = "Today's thoughts centered on stress factors and managing daily pressure.";
    } else if (hasPositive) {
      summary = "Today's reflection focused on moments of appreciation and lightheartedness.";
    }

    // Themes
    const themes = [];
    const checkMap = [
      { tag: "📚 College", keywords: ['exam', 'assignment', 'deadline', 'college', 'class', 'study'] },
      { tag: "😰 Stress", keywords: ['stress', 'anxious', 'tired', 'overwhelmed', 'sad'] },
      { tag: "🙏 Gratitude", keywords: ['thankful', 'grateful'] },
      { tag: "😊 Happiness", keywords: ['happy', 'excited', 'glad', 'smile'] },
      { tag: "👨‍👩‍👧 Family", keywords: ['family', 'parent', 'mom', 'dad', 'sibling'] },
      { tag: "👥 Friends", keywords: ['friend', 'group', 'peer', 'classmate'] },
      { tag: "😴 Sleep", keywords: ['sleep', 'bed', 'rest', 'night'] },
      { tag: "🎯 Goals", keywords: ['goal', 'habit', 'plan', 'priority'] },
      { tag: "🌱 Self Growth", keywords: ['grow', 'improve', 'build', 'step'] }
    ];
    checkMap.forEach(theme => {
      if (theme.keywords.some(w => text.includes(w))) {
        themes.push(theme.tag);
      }
    });

    // Insight
    let reflection = "You've taken a meaningful step by putting your thoughts into words today.";
    if (hasStress) {
      reflection = "You've been honest about difficult emotions today, and that's an important step.";
    } else if (hasAcademic) {
      reflection = "It sounds like academics took up a lot of your mental space today.";
    } else if (hasPositive) {
      reflection = "You mentioned several positive moments worth celebrating.";
    }

    // Suggestions
    let sug1 = "🌿 Drink some water";
    let sug2 = "🚶 Take a short walk";
    let sug3 = "📖 Write one positive memory";

    if (['sleep', 'tired'].some(w => text.includes(w))) {
      sug3 = "😴 Sleep a little earlier tonight";
    }
    if (['stress', 'anxious', 'overwhelmed'].some(w => text.includes(w))) {
      sug2 = "🎵 Listen to calming music";
    }
    if (['study', 'exam', 'desk', 'class'].some(w => text.includes(w))) {
      sug1 = "☀️ Spend five minutes outside";
    }

    return {
      summary,
      themes,
      reflection,
      suggestions: [sug1, sug2, sug3],
      isFallback: true
    };
  };

  // 2. Fetch AI Reflection from backend API with debounced caching
  useEffect(() => {
    const journalText = journal.trim();
    if (journalText.length === 0) {
      setReflectionData({
        summary: "I'm here whenever you're ready. Even a few sentences can help you reflect.",
        themes: [],
        reflection: null,
        suggestions: ["🌿 Drink some water", "🚶 Take a short walk", "📖 Write one positive memory"],
        isFallback: false
      });
      return;
    }

    const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    const cacheKey = `aiReflection_${todayStr}_${selectedMood}_${journalText}`;

    // Read cache check
    const cached = localStorage.getItem('aiReflectionCache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.key === cacheKey) {
          setReflectionData(parsed.data);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem('aiReflectionCache');
      }
    }

    const fetchReflection = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('/ai/reflection', {
          journal: journalText,
          mood: selectedMood || 'Neutral'
        });
        const responseData = response.data;
        setReflectionData(responseData);
        localStorage.setItem('aiReflectionCache', JSON.stringify({ key: cacheKey, data: responseData }));
      } catch (err) {
        console.warn("AI Reflection API call failed, falling back to heuristics:", err);
        const fallback = runLocalHeuristics(journalText, selectedMood);
        setReflectionData(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReflection();
  }, [journal, selectedMood]);

  return (
    <div ref={aiReflectionRef} className="h-full animate-fade-in">
      <Card className="p-8 flex flex-col h-full text-left justify-between dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
        {/* Header Title */}
        <div>
          <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Reflection</span>
          <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight flex items-center gap-1.5 select-none">
            ✨ Gentle Reflection
          </h3>
        </div>

        {/* Loading Skeletons State */}
        {isLoading ? (
          <div className="flex-grow space-y-6 py-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-1/5" />
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 rounded-full w-16" />
                <div className="h-6 bg-slate-200 rounded-full w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-1/4" />
              <div className="h-10 bg-slate-200 rounded w-full" />
            </div>
          </div>
        ) : journal.trim().length === 0 ? (
          /* Empty State Section */
          <div className="flex-grow flex flex-col items-center justify-center text-center py-6 gap-3.5 select-none">
            <div className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold border border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-2xl bg-[#FAF9F6]/50 dark:bg-slate-900/30 p-6 w-full">
              No insights available yet. Write some thoughts in your journal to generate reflection metrics.
            </div>
            <button
              onClick={() => document.getElementById('journal-input-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-xs bg-[#6B8E7A] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#587665] transition-colors focus:outline-none shadow-soft"
              type="button"
            >
              ✍️ Start Writing
            </button>
          </div>
        ) : reflectionData ? (
          /* Loaded Reflection Content */
          <div className="flex-grow space-y-4 py-3">
            {/* Section 1: Summary */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Today's Summary</span>
              <p className="text-xs sm:text-sm text-[#2F3A3F] dark:text-slate-200 font-semibold leading-relaxed">
                {reflectionData.summary}
              </p>
            </div>

            {/* Section 2: Detected Themes */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Detected Themes</span>
              <div className="flex flex-wrap gap-1.5">
                {reflectionData.themes?.length === 0 ? (
                  <span className="text-xs text-[#6B7280] dark:text-slate-400 font-medium italic">No clear themes detected yet.</span>
                ) : (
                  reflectionData.themes?.map((theme, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-[#FAF7F2] dark:bg-slate-900 border border-[#E8DCC8]/50 dark:border-slate-800 text-[#2F3A3F] dark:text-slate-200 px-2 py-0.5 rounded-full select-none shadow-soft animate-fade-in">
                      {theme}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Section 3: Insight / Reflection */}
            {reflectionData.reflection && (
              <div className="space-y-1.5 p-3.5 bg-[#FAF7F2] dark:bg-slate-900 border border-[#E8DCC8]/40 dark:border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Gentle Insight</span>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium leading-relaxed">
                  {reflectionData.reflection}
                </p>
              </div>
            )}

            {/* Section 4: Small Suggestions */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Today's Suggestions</span>
              <div className="grid grid-cols-1 gap-2.5">
                {reflectionData.suggestions?.map((sug, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-xs font-semibold text-[#2F3A3F] dark:text-slate-300 shadow-soft">
                    {sug}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default AIReflectionCard;
