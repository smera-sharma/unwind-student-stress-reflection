import React from 'react';
import Card from '../ui/Card';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { label: 'Journal', icon: '📖' },
    { label: 'Breathing Exercise', icon: '🫁', displayName: 'Breathe' },
    { label: 'AI Reflection', icon: '✨', displayName: 'Reflection' },
    { label: 'Resources', icon: '🆘' },
  ];

  return (
    <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
      <div className="text-left select-none">
        <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Self-Care Tools</span>
        <h3 className="text-sm font-extrabold text-[#2F3A3F] dark:text-slate-100 mt-0.5">Quick Actions</h3>
      </div>

      <div className="flex flex-wrap items-center gap-3 select-none">
        {actions.map((act, idx) => {
          const displayName = act.displayName || act.label;
          return (
            <button
              key={idx}
              onClick={() => onActionClick?.(act.label)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] hover:border-[#6B8E7A]/40 hover:shadow-soft transition-all duration-300 font-extrabold text-xs text-[#2F3A3F] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 focus:outline-none shadow-soft min-h-[44px] min-w-[44px] cursor-pointer"
              type="button"
            >
              <span className="text-sm select-none">{act.icon}</span>
              <span>{displayName}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
