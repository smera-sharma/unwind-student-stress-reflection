import React from 'react';
import Card from '../ui/Card';

const WellnessScoreCard = ({ selectedMood = '', journal = '', streak = 4, weeklyMood = [] }) => {
  // Score mapping parameters (100% total)
  const moodScores = { Amazing: 30, Good: 24, Neutral: 18, Down: 12, Stressed: 6 };
  const moodVal = moodScores[selectedMood] || 15; // Midpoint default if not selected yet

  const journalVal = Math.min(30, Math.floor(journal.length / 10)); // max 30% (300 chars)

  const streakVal = Math.min(20, streak * 4); // max 20% (5 day streak)

  const checkInCount = weeklyMood.filter(val => val > 0).length;
  const consistencyVal = Math.min(20, checkInCount * 3); // max 20%

  const totalScore = Math.min(100, moodVal + journalVal + streakVal + consistencyVal);

  // SVG Ring coordinates
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  const getScoreLabel = (score) => {
    if (score >= 85) return "Wellness Champion";
    if (score >= 70) return "Great Consistency";
    return "Building Healthy Habits";
  };

  return (
    <Card className="p-8 flex flex-col text-left justify-between h-full" hoverEffect={false}>
      {/* Title */}
      <div>
        <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Wellness Score</span>
        <h3 className="text-xl font-semibold text-[#2F3A3F] mt-1 tracking-tight">Your Habits</h3>
      </div>

      {/* SVG progress canvas */}
      <div className="flex flex-col items-center justify-center py-4 space-y-4 flex-grow">
        <div className="relative w-32 h-32 flex items-center justify-center select-none">
          <svg className="w-full h-full transform -rotate-90">
            {/* BG Ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="text-[#E5E7EB]"
              strokeWidth="6.5"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress fill */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="text-[#6B8E7A] transition-all duration-500 ease-out"
              strokeWidth="6.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#2F3A3F] font-sans">{totalScore}%</span>
            <span className="text-[10px] text-[#6B7280] font-bold tracking-wider uppercase">Score</span>
          </div>
        </div>

        {/* Dynamic score header tag */}
        <div className="text-center">
          <span className="inline-block text-xs font-semibold bg-[#E2EBE5] text-[#587665] px-3.5 py-1.5 rounded-full shadow-soft select-none">
            🌿 {getScoreLabel(totalScore)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default WellnessScoreCard;
