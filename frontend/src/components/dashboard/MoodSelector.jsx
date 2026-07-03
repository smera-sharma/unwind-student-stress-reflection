import React from 'react';
import Card from '../ui/Card';

const MoodSelector = ({ selectedMood, onMoodChange }) => {
  const moods = [
    { emoji: '😀', label: 'Amazing' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Down' },
    { emoji: '😩', label: 'Stressed' },
  ];

  const getComfortMessage = (mood) => {
    switch (mood) {
      case 'Amazing':
      case 'Good':
        return "🌼 Glad you're having a good day.";
      case 'Neutral':
        return "🌱 One small step at a time.";
      case 'Down':
      case 'Stressed':
        return "💙 Thank you for checking in today.";
      default:
        return null;
    }
  };

  const responseText = getComfortMessage(selectedMood);

  return (
    <Card className="p-8 text-center space-y-6" hoverEffect={false}>
      <h2 className="text-lg font-bold text-[#2F3A3F]">
        How are you feeling today?
      </h2>
      <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap">
        {moods.map((mood, idx) => {
          const isSelected = selectedMood === mood.label;
          return (
            <button
              key={idx}
              onClick={() => onMoodChange?.(mood.label)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 hover:scale-[1.1] active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 ${
                isSelected 
                  ? 'bg-[#6B8E7A] text-white border-2 border-[#587665] scale-[1.08] shadow-soft' 
                  : 'bg-[#FAF9F6] border border-[#E5E7EB] hover:border-[#6B8E7A]/40 hover:bg-[#E2EBE5]'
              }`}
              title={mood.label}
              type="button"
            >
              {mood.emoji}
            </button>
          );
        })}
      </div>

      {/* Dynamic Comforting Response Card */}
      {responseText && (
        <div className="animate-fade-in transition-opacity duration-500 mt-4 text-left">
          <Card className="p-4 bg-[#FAF7F2] border border-[#E8DCC8]/50 text-center rounded-2xl select-none" hoverEffect={false}>
            <p className="text-sm font-semibold text-[#2F3A3F] leading-normal">
              {responseText}
            </p>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default MoodSelector;
