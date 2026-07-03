import React from 'react';
import Card from '../ui/Card';

const MoodSelector = ({ onSelectMood }) => {
  const moods = [
    { emoji: '😀', label: 'Great' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Down' },
    { emoji: '😩', label: 'Stressed' },
  ];

  return (
    <Card className="p-8 text-center space-y-6" hoverEffect={false}>
      <h2 className="text-lg font-bold text-unwind-text-primary">
        How are you feeling today?
      </h2>
      <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap">
        {moods.map((mood, idx) => (
          <button
            key={idx}
            onClick={() => onSelectMood?.(mood.label)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF9F6] border border-[#E5E7EB] flex items-center justify-center text-xl sm:text-2xl hover:scale-[1.1] active:scale-[0.95] hover:border-[#6B8E7A]/40 hover:bg-[#E2EBE5] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40"
            title={mood.label}
            type="button"
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default MoodSelector;
