import React from 'react';
import Card from '../ui/Card';

const DailyTipCard = () => {
  const tips = [
    "Drink a glass of water right now to rehydrate.",
    "Stretch your arms and shoulders for two minutes.",
    "Take five slow, deep breaths to reset your mind.",
    "Message a class friend just to say hello or check in.",
    "Stand up and walk around your room for a few moments.",
    "Step outside or look out the window for some natural light.",
    "Write down one priority task today, and focus only on that.",
    "Tidy up one small area of your desk to clear your workspace.",
    "Listen to a calming song before starting your study session.",
    "Rest your eyes from screens for 5 minutes.",
    "Eat a nutritious snack to sustain your energy levels.",
    "Write a kind note or thank someone who helped you recently.",
    "Do a quick 3-minute physical stretch to release tension.",
    "Acknowledge one thing you did well yesterday, however small.",
    "Organize your bag or desktop files for a clear mindset.",
    "Declare your workspace a distraction-free zone for the next hour.",
    "Take a quick walk around the campus or block for fresh air.",
    "Journal one thought that has been circling in your mind.",
    "Limit social media scrolling during study breaks.",
    "Set a timer for 25 minutes of focused work, then take a break.",
    "Remember: it is okay to ask for help when workload stacks.",
    "Close your eyes and breathe slowly for 60 seconds.",
    "Write a quick journal entry about something that brought a smile today.",
    "Keep a water bottle on your desk as a reminder to hydrate.",
    "Remind yourself that your worth is not tied to a single test score.",
    "Give yourself permission to log off early tonight.",
    "Enjoy a warm cup of tea or water to relax.",
    "Unclench your jaw and drop your shoulders right now.",
    "Plan a small treat or reward for finishing today's tasks.",
    "Write down three things you are grateful for this morning.",
    "Give yourself a high five for showing up today.",
    "Take a moment to listen to the ambient sounds around you.",
    "Remember: rest is a necessary part of productivity.",
    "Organize your calendar for the week to reduce sudden stress.",
    "Avoid multitasking; focus on one task at a time.",
    "Spend five minutes sitting quietly without doing anything.",
    "Eat away from your desk or computer screens today.",
    "Write down a positive affirmation and put it on your wall.",
    "Celebrate today's small progress; every bit counts.",
    "Take a screen break 30 minutes before going to sleep.",
    "Breathe in calm, breathe out tension.",
    "Be kind to yourself on slow days; energy fluctuates.",
    "Enjoy the process of learning, not just the grade output.",
    "Spend a few minutes reflecting on what went well this week.",
    "Keep your study goals small, realistic, and achievable.",
    "Take a deep breath and let go of what you cannot change today.",
    "Connect with a family member or friend for a quick chat.",
    "Remind yourself of your capacity to handle challenges.",
    "Start your study session with a clean, organized desk.",
    "Celebrate showing up for yourself today."
  ];

  const today = new Date();
  const seed = (today.getFullYear() + today.getMonth() + today.getDate()) % tips.length;
  const tip = tips[seed];

  return (
    <Card className="p-6 text-left border-[#E5E7EB] shadow-soft animate-fade-in transition-opacity duration-500" hoverEffect={false}>
      <div className="flex items-start gap-3">
        <div className="text-xl select-none pt-0.5">💡</div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#89A8B2] tracking-wider uppercase block">Daily Wellness Tip</span>
          <p className="text-sm font-medium text-[#2F3A3F] leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DailyTipCard;
