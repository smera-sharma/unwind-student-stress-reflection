import React from 'react';
import Card from '../ui/Card';

const EmotionalInsightsCard = ({ journal = '' }) => {
  const getInsight = () => {
    const text = journal.toLowerCase();

    // 1. Heavy emotions check
    const heavyWords = ['stress', 'sad', 'anxious', 'overwhelmed', 'tired'];
    if (heavyWords.some(w => text.includes(w))) {
      return {
        icon: "☁️",
        observation: "Today sounded emotionally demanding.",
        suggestion: "Be gentle with your expectations today. Taking a few moments to rest is a form of progress."
      };
    }

    // 2. Academic check
    const academicWords = ['exam', 'assignment', 'deadline', 'college', 'project'];
    if (academicWords.some(w => text.includes(w))) {
      return {
        icon: "🌿",
        observation: "You talked a lot about academics today.",
        suggestion: "Your academic goals are important, but your mental space is too. Make sure to schedule a screen-free break tonight."
      };
    }

    // 3. Positive check
    const positiveWords = ['happy', 'excited', 'grateful'];
    if (positiveWords.some(w => text.includes(w))) {
      return {
        icon: "💙",
        observation: "Gratitude appeared several times today.",
        suggestion: "Hold onto these bright spots. Re-reading happy reflections on slow days can bring comfort."
      };
    }

    // Default neutral empty state
    return {
      icon: "🌱",
      observation: "Writing is a way of checking in with yourself.",
      suggestion: "Start jotting down thoughts to see patterns and supportive insights develop."
    };
  };

  const { icon, observation, suggestion } = getInsight();

  return (
    <Card className="p-8 flex flex-col text-left justify-between h-full" hoverEffect={false}>
      {/* Title */}
      <div>
        <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Heuristics</span>
        <h3 className="text-xl font-semibold text-[#2F3A3F] mt-1 tracking-tight">Emotional Insights</h3>
      </div>

      {/* Observation and suggestions */}
      <div className="flex-grow flex flex-col justify-center py-4 space-y-4">
        <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#E8DCC8]/50 p-4 rounded-2xl">
          <span className="text-2xl shrink-0 select-none">{icon}</span>
          <p className="text-sm font-semibold text-[#2F3A3F] leading-normal">
            {observation}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Suggestion</span>
          <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
            {suggestion}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmotionalInsightsCard;
