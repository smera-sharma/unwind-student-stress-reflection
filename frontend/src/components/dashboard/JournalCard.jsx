import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const JournalCard = () => {
  const [text, setText] = useState('');
  const maxLength = 1000;

  return (
    <Card className="p-8 flex flex-col text-left space-y-4" hoverEffect={false}>
      <div>
        <span className="text-xs font-semibold text-unwind-secondary-dark tracking-wide uppercase block">Journal</span>
        <h3 className="text-lg font-bold text-unwind-text-primary mt-1">Today's Reflection</h3>
      </div>

      <textarea
        className="w-full min-h-[160px] bg-white border border-[#E5E7EB] rounded-2xl p-4 text-sm text-unwind-text-primary focus:outline-none focus:border-[#6B8E7A]/60 focus:ring-1 focus:ring-[#6B8E7A]/60 transition-all duration-300 resize-none"
        placeholder="Write freely without pressure. How was your day? What is on your mind?"
        maxLength={maxLength}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-unwind-text-secondary">
          {text.length} / {maxLength} characters
        </span>
        <Button variant="primary" disabled={true} className="!px-5 !py-2 text-sm">
          Save Reflection
        </Button>
      </div>
    </Card>
  );
};

export default JournalCard;
