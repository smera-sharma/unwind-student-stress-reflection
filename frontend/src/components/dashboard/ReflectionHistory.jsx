import React, { useState } from 'react';
import Card from '../ui/Card';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const ReflectionHistory = ({ history = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDates, setExpandedDates] = useState({});

  // Filter history entries by text content, mood description, or date string
  const filtered = history.filter(item => {
    const query = searchQuery.toLowerCase();
    const textMatch = item.text?.toLowerCase().includes(query);
    const moodMatch = item.mood?.toLowerCase().includes(query);
    const dateMatch = item.date?.toLowerCase().includes(query);
    return textMatch || moodMatch || dateMatch;
  });

  // Extract ONLY the latest 3 items for compact dashboard display
  const displayHistory = filtered.slice(0, 3);

  const toggleExpand = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const getMoodEmoji = (mood) => {
    const emojis = { Amazing: '😀', Good: '🙂', Neutral: '😐', Down: '😔', Stressed: '😩' };
    return emojis[mood] || '📝';
  };

  const handleScrollToJournal = () => {
    document.getElementById('journal-input-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Card className="p-8 flex flex-col text-left space-y-6 h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
      {/* Header section with inline Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Journal Logs</span>
          <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Reflection History</h3>
        </div>

        {/* Search Field */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2F3A3F] focus:outline-none focus:border-[#6B8E7A]/60 transition-all font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
            placeholder="Search date, mood, text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-[#6B7280]" />
        </div>
      </div>

      {/* History Items list limited to 3 */}
      <div className="space-y-4 flex-grow overflow-y-auto max-h-[360px] pr-2">
        {history.length === 0 ? (
          <div className="text-center py-12 text-[#6B7280] dark:text-slate-400 text-xs font-semibold border border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-2xl bg-[#FAF9F6]/50 dark:bg-slate-900/30 flex flex-col items-center gap-3">
            <span>No reflections yet.</span>
            <button
              onClick={handleScrollToJournal}
              className="text-xs bg-[#6B8E7A] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#587665] transition-colors focus:outline-none shadow-soft"
              type="button"
            >
              ✍️ Write First Reflection
            </button>
          </div>
        ) : displayHistory.length === 0 ? (
          <div className="text-center py-12 text-[#6B7280] dark:text-slate-400 text-xs font-semibold border border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-2xl bg-[#FAF9F6]/50 dark:bg-slate-900/30">
            No reflections found. Try adjusting your search query.
          </div>
        ) : (
          displayHistory.map((item, idx) => {
            const isExpanded = !!expandedDates[item.date];
            const displayEmoji = getMoodEmoji(item.mood);
            const truncatedText = item.text.length > 80 ? `${item.text.slice(0, 80)}...` : item.text;

            return (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-soft space-y-3 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg select-none">{displayEmoji}</span>
                    <span className="text-xs font-semibold text-[#2F3A3F]">{item.date}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#E2EBE5] text-[#587665] px-2.5 py-0.5 rounded-full select-none">
                    {item.mood || 'Reflected'}
                  </span>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
                  {isExpanded ? item.text : truncatedText}
                </p>

                {item.text.length > 80 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleExpand(item.date)}
                      className="text-[11px] font-bold text-[#6B8E7A] hover:text-[#587665] transition-colors flex items-center gap-1 focus:outline-none"
                      type="button"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp size={12} /></>
                      ) : (
                        <>Read More <ChevronDown size={12} /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default ReflectionHistory;
