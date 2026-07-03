import React from 'react';
import Card from '../ui/Card';

const DailyThoughtCard = () => {
  const quotes = [
    "Small steps still move you forward.",
    "Your worth isn't measured by your productivity.",
    "Rest is part of progress.",
    "You don't have to solve everything today.",
    "Every new day is another chance to begin.",
    "Breathe in, breathe out. You are doing fine.",
    "Be gentle with your thoughts today.",
    "One moment at a time, one day at a time.",
    "Progress isn't a straight line.",
    "Give yourself credit for how far you've come.",
    "You are allowed to take a break.",
    "Quiet minds hear the best answers.",
    "Slow down and notice the peace around you.",
    "Self-care is not selfish; it is essential.",
    "Your best is enough, even when it feels small.",
    "Let go of what you cannot control today.",
    "Trust the process of your own growth.",
    "You carry enough light to make your own way.",
    "Peace is a daily practice.",
    "Give yourself space to just breathe.",
    "Your feelings are valid. Honor them.",
    "Growth takes time. Be patient with yourself.",
    "A single kind word can warm three winter months.",
    "Allow yourself to be a beginner.",
    "Focus on the step in front of you, not the whole staircase.",
    "You are stronger than the challenges today.",
    "Choose peace over perfection.",
    "Warm thoughts make for a lighter heart.",
    "In the middle of difficulty lies opportunity.",
    "Keep showing up. You are doing great."
  ];

  // Seed selection deterministically based on date parameters (consistent all day)
  const today = new Date();
  const seed = (today.getFullYear() + today.getMonth() + today.getDate()) % quotes.length;
  const quote = quotes[seed];

  return (
    <Card className="p-6 text-left border-[#E5E7EB] shadow-soft animate-fade-in transition-opacity duration-500" hoverEffect={false}>
      <div className="flex items-start gap-3">
        <div className="text-xl select-none pt-0.5">🌼</div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#89A8B2] tracking-wider uppercase block">Today's Thought</span>
          <p className="text-sm sm:text-base font-medium text-[#2F3A3F] italic leading-relaxed">
            "{quote}"
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DailyThoughtCard;
