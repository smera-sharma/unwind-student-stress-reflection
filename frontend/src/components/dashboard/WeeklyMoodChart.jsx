import React from 'react';
import Card from '../ui/Card';

const WeeklyMoodChart = ({ weeklyMood = [4, 5, 3, 2, 5, 4, 3], streak = 4 }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Count active mood check-in days
  const checkedInCount = weeklyMood.filter(val => val > 0).length;

  // Calculate average score
  const completedDays = weeklyMood.filter(val => val > 0);
  const averageScore = completedDays.length > 0
    ? completedDays.reduce((acc, curr) => acc + curr, 0) / completedDays.length
    : 0;

  // Find best day of week
  const getBestDay = () => {
    if (completedDays.length === 0) return 'None';
    let maxScore = -1;
    let maxIdx = -1;
    weeklyMood.forEach((score, idx) => {
      if (score > maxScore) {
        maxScore = score;
        maxIdx = idx;
      }
    });
    return days[maxIdx];
  };

  const bestDay = getBestDay();

  return (
    <div className="h-full">
      <Card className="p-8 flex flex-col h-full text-left justify-between" hoverEffect={false}>
        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Analytics</span>
            <span className="text-xs font-semibold text-[#6B8E7A] bg-[#E2EBE5] px-2.5 py-1 rounded-full shadow-soft select-none">
              🌿 check-ins: {checkedInCount}/7
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-[#2F3A3F] tracking-tight">
              You've checked in {checkedInCount} {checkedInCount === 1 ? 'day' : 'days'} this week 🌿
            </h3>
            <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
              Consistency matters more than perfection.
            </p>
          </div>

          {/* 4 Compact statistic badges in a single compact row of small pills */}
          <div className="flex flex-wrap items-center gap-2 select-none pt-1">
            <div className="px-3 py-1 bg-[#FAF9F6] border border-[#E5E7EB] rounded-full text-center shadow-soft text-[10px] font-semibold text-[#2F3A3F]">
              Avg Mood: <span className="font-bold text-[#6B8E7A]">{averageScore > 0 ? `${(Math.round(averageScore * 10) / 10)}/5` : 'N/A'}</span>
            </div>
            <div className="px-3 py-1 bg-[#FAF9F6] border border-[#E5E7EB] rounded-full text-center shadow-soft text-[10px] font-semibold text-[#2F3A3F]">
              Streak: <span className="font-bold text-[#6B8E7A]">🔥 {streak} days</span>
            </div>
            <div className="px-3 py-1 bg-[#FAF9F6] border border-[#E5E7EB] rounded-full text-center shadow-soft text-[10px] font-semibold text-[#2F3A3F]">
              Check-ins: <span className="font-bold text-[#6B8E7A]">🌿 {checkedInCount}/7</span>
            </div>
            <div className="px-3 py-1 bg-[#FAF9F6] border border-[#E5E7EB] rounded-full text-center shadow-soft text-[10px] font-semibold text-[#2F3A3F]">
              Best Day: <span className="font-bold text-[#6B8E7A]">{bestDay}</span>
            </div>
          </div>
        </div>

        {/* Custom Bar Chart Canvas centered */}
        <div className="h-44 flex items-end justify-between gap-3 px-6 pt-8 border-b border-[#E5E7EB] max-w-md mx-auto w-full flex-grow">
          {days.map((day, idx) => {
            const score = weeklyMood[idx] || 0; // Default to empty
            const percentage = score > 0 ? (score / 5) * 100 : 0;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                <div 
                  style={{ height: `${score > 0 ? percentage : 8}%` }} 
                  className={`w-full max-w-[24px] rounded-t-lg transition-all duration-300 ease-out relative hover:scale-x-105 hover:scale-y-105 origin-bottom ${
                    score > 0 
                      ? 'bg-[#6B8E7A]/60 hover:bg-[#6B8E7A] shadow-soft' 
                      : 'bg-slate-100 border border-dashed border-slate-200'
                  }`}
                >
                  {/* Tooltip on hover */}
                  {score > 0 && (
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-unwind-text-primary text-white text-[10px] px-2 py-0.5 rounded transition-opacity duration-300 pointer-events-none select-none font-sans whitespace-nowrap z-20">
                      Mood: {score}/5
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#6B7280] select-none font-medium mt-1 font-sans">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default WeeklyMoodChart;
