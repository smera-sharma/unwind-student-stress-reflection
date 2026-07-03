import React from 'react';
import { BookOpen, Wind, Sparkles, Compass } from 'lucide-react';
import Card from '../ui/Card';

const QuickActions = () => {
  const actions = [
    { label: 'Journal', icon: BookOpen, color: 'text-[#6B8E7A] bg-[#E2EBE5]' },
    { label: 'Breathing Exercise', icon: Wind, color: 'text-[#89A8B2] bg-[#E9EFF1]' },
    { label: 'AI Chat', icon: Sparkles, color: 'text-[#6B8E7A] bg-[#E2EBE5]' },
    { label: 'Resources', icon: Compass, color: 'text-unwind-text-primary bg-[#FAF7F2]' },
  ];

  return (
    <Card className="p-8 flex flex-col text-left space-y-6" hoverEffect={false}>
      <div>
        <span className="text-xs font-semibold text-unwind-secondary-dark tracking-wide uppercase block">Navigation</span>
        <h3 className="text-lg font-bold text-unwind-text-primary mt-1">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:scale-[1.02] active:scale-[0.98] hover:border-[#6B8E7A]/30 hover:shadow-soft transition-all duration-300 group focus:outline-none"
              type="button"
            >
              <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-semibold text-unwind-text-primary text-center">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
