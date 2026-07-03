import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../ui/Card';

const AIReflectionCard = () => {
  return (
    <Card className="p-8 flex flex-col text-left space-y-4" hoverEffect={false}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#E2EBE5] flex items-center justify-center text-[#6B8E7A]">
          <Sparkles size={16} />
        </div>
        <h3 className="text-lg font-bold text-unwind-text-primary">AI Reflection</h3>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center border border-dashed border-[#E5E7EB] rounded-2xl p-8 text-center min-h-[160px] bg-[#FAF9F6]/50">
        <Sparkles size={24} className="text-[#89A8B2] opacity-60 mb-3" />
        <p className="text-xs sm:text-sm text-unwind-text-secondary leading-relaxed max-w-xs">
          Your reflections will appear here once you've written your journal.
        </p>
      </div>
    </Card>
  );
};

export default AIReflectionCard;
