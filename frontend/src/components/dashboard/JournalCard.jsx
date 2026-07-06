import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';

const JournalCard = ({ journal, setJournal, journalRef }) => {
  const [localText, setLocalText] = useState(journal);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving'
  const [lastSaved, setLastSaved] = useState(null);
  const [showStarter, setShowStarter] = useState(false); // Collapsed by default
  const maxLength = 1000;

  // Prompts list
  const prompts = [
    { category: "Reflection", text: "Describe today using only three words." },
    { category: "Reflection", text: "What emotion stayed with you the longest today?" },
    { category: "Reflection", text: "What is one thing you learned about yourself today?" },
    { category: "Reflection", text: "How did today's energy compare to yesterday?" },
    { category: "Reflection", text: "What was the most peaceful moment of your day?" },
    { category: "Gratitude", text: "What's one small thing you're thankful for today?" },
    { category: "Gratitude", text: "Who made you smile today, and why?" },
    { category: "Gratitude", text: "What is something in your room you are grateful for?" },
    { category: "Gratitude", text: "What was the best thing you ate today?" },
    { category: "Gratitude", text: "Write down three simple pleasures that occurred today." },
    { category: "Growth", text: "What's one small win you're proud of today?" },
    { category: "Growth", text: "How did you handle a difficult situation today?" },
    { category: "Growth", text: "What challenged you today, and what did you learn?" },
    { category: "Growth", text: "In what way did you step out of your comfort zone?" },
    { category: "Growth", text: "What is a mistake you made that you forgive yourself for?" },
    { category: "Self-Care", text: "What did you do to take care of your body today?" },
    { category: "Self-Care", text: "What is one boundary you set or maintained today?" },
    { category: "Self-Care", text: "How did you give your mind a break during classes?" },
    { category: "Self-Care", text: "What gave you energy today?" },
    { category: "Self-Care", text: "What is something kind you said to yourself today?" },
    { category: "Confidence", text: "What is a strength you utilized today?" },
    { category: "Confidence", text: "Write down a compliment you would give yourself." },
    { category: "Confidence", text: "What makes you feel capable and strong?" },
    { category: "Confidence", text: "Recall a moment today when you trusted your instincts." },
    { category: "Confidence", text: "What is something you are proud of accomplishing recently?" },
    { category: "Future", text: "Write a letter to tomorrow's version of yourself." },
    { category: "Future", text: "What is one thing you hope to focus on tomorrow?" },
    { category: "Future", text: "What would you tell your younger self about today?" },
    { category: "Future", text: "What are you looking forward to later this week?" },
    { category: "Future", text: "What is one seed you planted today that will grow tomorrow?" }
  ];

  const starterPrompts = [
    "What made you smile today?",
    "What challenged you today?",
    "What's something you're grateful for?",
    "If today had a title...",
    "What's something you wish someone asked you today?"
  ];

  const [activePrompt, setActivePrompt] = useState(null);
  const [promptFade, setPromptFade] = useState(false);

  // Sync state initially
  useEffect(() => {
    setLocalText(journal);
  }, [journal]);

  // Debounced autosave effect
  useEffect(() => {
    if (localText === journal) return;

    setSaveStatus('saving');

    const saveTimeout = setTimeout(() => {
      setJournal(localText);
      localStorage.setItem('todayJournal', localText);
      
      const now = new Date().toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setLastSaved(now);
      setSaveStatus('saved');
    }, 500);

    return () => clearTimeout(saveTimeout);
  }, [localText, journal, setJournal]);

  const handleInspire = () => {
    setPromptFade(true);
    setTimeout(() => {
      let rolled = prompts[Math.floor(Math.random() * prompts.length)];
      if (activePrompt) {
        while (rolled.text === activePrompt.text) {
          rolled = prompts[Math.floor(Math.random() * prompts.length)];
        }
      }
      setActivePrompt(rolled);
      setPromptFade(false);
    }, 200);
  };

  const wordCount = localText.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const getCategoryEmoji = (cat) => {
    switch(cat) {
      case 'Gratitude': return '🌿';
      case 'Reflection': return '📓';
      case 'Growth': return '🌱';
      case 'Self-Care': return '🌸';
      case 'Confidence': return '✨';
      case 'Future': return '🔮';
      default: return '🌼';
    }
  };

  return (
    <div ref={journalRef} className="h-full">
      <Card className="p-8 flex flex-col h-full text-left justify-between" hoverEffect={false}>
        <div className="space-y-5 flex-grow flex flex-col">
          {/* Title */}
          <div>
            <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Journal</span>
            <h3 className="text-xl font-semibold text-[#2F3A3F] mt-1 tracking-tight">Your thoughts are welcome here.</h3>
          </div>

          {/* Collapsible starter prompts inside accordion (collapsed by default) */}
          {localText.length === 0 && (
            <div className="border border-[#E5E7EB] dark:border-slate-700 rounded-2xl bg-[#FAF9F6]/60 dark:bg-slate-800 overflow-hidden transition-all duration-300">
              <button
                type="button"
                onClick={() => setShowStarter(!showStarter)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[#2F3A3F] dark:text-slate-100 hover:bg-[#FAF7F2] dark:hover:bg-slate-700 bg-[#FAF9F6]/60 dark:bg-slate-800 transition-colors focus:outline-none"
              >
                <span className="flex items-center gap-1.5">❓ Need help getting started?</span>
                <span className="text-[#6B7280] dark:text-slate-400">
                  {showStarter ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>
              {showStarter && (
                <ul className="px-4 pb-4 pt-1 text-xs text-[#6B7280] dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed border-t border-[#E5E7EB]/50 dark:border-slate-700 font-medium bg-[#FAF9F6]/60 dark:bg-slate-800">
                  {starterPrompts.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Active inspire prompt */}
          {activePrompt && (
            <div className={`p-4 bg-[#E2EBE5] rounded-2xl text-left border border-[#6B8E7A]/20 transition-opacity duration-300 ${promptFade ? 'opacity-0' : 'opacity-100'}`}>
              <span className="inline-block text-[10px] font-bold bg-white text-[#587665] border border-[#6B8E7A]/25 px-2.5 py-1 rounded-full shadow-soft select-none mb-1">
                {getCategoryEmoji(activePrompt.category)} {activePrompt.category}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#2F3A3F] mt-1">
                {activePrompt.text}
              </p>
            </div>
          )}

          {/* Textarea with slightly expanded height */}
          <textarea
            className="w-full flex-grow min-h-[280px] bg-white border border-[#E5E7EB] rounded-2xl p-4 text-sm text-[#2F3A3F] focus:outline-none focus:border-[#6B8E7A]/60 focus:ring-1 focus:ring-[#6B8E7A]/60 transition-all duration-300 resize-none leading-relaxed"
            placeholder="Write freely without pressure. How was your day? What is on your mind?"
            maxLength={maxLength}
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
          />
        </div>

        {/* Footer info and action layout */}
        <div className="space-y-4 mt-6 pt-4 border-t border-[#E5E7EB]/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Statistics row */}
            <div className="flex items-center gap-4 text-xs text-[#6B7280] font-medium select-none">
              <span>{wordCount} words</span>
              <span>≈ {readTime} minute reflection</span>
            </div>

            {/* Save status */}
            <div className="text-xs flex items-center gap-1 select-none font-semibold">
              {saveStatus === 'saving' ? (
                <span className="animate-pulse text-[#89A8B2]">🌿 Saving your thoughts...</span>
              ) : lastSaved ? (
                <span className="flex items-center gap-1 text-[#6BAA75]">
                  <Check size={14} /> ✓ Reflection safely saved (Last saved {lastSaved})
                </span>
              ) : (
                <span className="text-[#6B7280]">✓ Saved</span>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleInspire}
              className="!px-4 !py-2 text-xs flex items-center gap-1 bg-white border border-[#E5E7EB] text-[#2F3A3F] hover:bg-slate-50"
            >
              ✨ Inspire Me
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JournalCard;
