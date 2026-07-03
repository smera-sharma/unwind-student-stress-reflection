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
    <div className="h-full">
      <Card className="p-8 flex flex-col h-full text-left justify-between" hoverEffect={false}>
        {/* Title */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Self-Care Actions</span>
          <h3 className="text-xl font-semibold text-[#2F3A3F] mt-1 tracking-tight">Take care of yourself</h3>
        </div>

        {/* Compact buttons layout wrapping nicely */}
        <div className="flex flex-wrap items-center gap-3 flex-grow justify-start py-2">
          {actions.map((act, idx) => {
            const displayName = act.displayName || act.label;
            return (
              <button
                key={idx}
                onClick={() => onActionClick?.(act.label)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#E5E7EB] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] hover:border-[#6B8E7A]/40 hover:shadow-soft transition-all duration-300 font-bold text-xs text-[#2F3A3F] focus:outline-none shadow-soft"
                type="button"
              >
                <span className="text-sm select-none">{act.icon}</span>
                {displayName}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default QuickActions;
