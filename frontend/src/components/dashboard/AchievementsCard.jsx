import React from 'react';
import Card from '../ui/Card';

const AchievementsCard = ({ history = [], streak = 0, checkInCount = 0 }) => {
  const milestones = [
    { id: 'first', label: "First Reflection", icon: "🌱", desc: "Write your first entry.", unlocked: history.length >= 1 },
    { id: 'five', label: "Five Reflections", icon: "📖", desc: "Write five reflections.", unlocked: history.length >= 5 },
    { id: 'ten', label: "Ten Mood Check-ins", icon: "😊", desc: "Check in your mood ten times.", unlocked: checkInCount >= 10 },
    { id: 'seven', label: "Seven Day Streak", icon: "🔥", desc: "Reflect seven days in a row.", unlocked: streak >= 7 },
  ];

  return (
    <Card className="p-8 flex flex-col text-left justify-between h-full" hoverEffect={false}>
      {/* Title */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Milestones</span>
        <h3 className="text-xl font-semibold text-[#2F3A3F] mt-1 tracking-tight">Achievements</h3>
      </div>

      {/* Grid of achievements */}
      <div className="space-y-3.5 flex-grow flex flex-col justify-center">
        {milestones.map((mil, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 select-none ${
              mil.unlocked
                ? 'bg-white dark:bg-[#243244] border-[#6B8E7A]/25 dark:border-white/10 shadow-soft opacity-100'
                : 'bg-slate-50/50 dark:bg-slate-800/30 border-[#E5E7EB] dark:border-white/5 opacity-50 filter grayscale'
            }`}
          >
            <div className="text-xl shrink-0">{mil.icon}</div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[#2F3A3F]">{mil.label}</h4>
              <p className="text-[10px] text-[#6B7280] font-medium leading-none">{mil.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AchievementsCard;
