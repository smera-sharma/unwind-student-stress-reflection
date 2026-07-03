import React, { useState } from 'react';
import Card from '../ui/Card';

const WelcomeBanner = ({ user, streak = 1 }) => {
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

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', suffix: '☀️' };
    if (hour < 18) return { text: 'Good Afternoon', suffix: '🌤' };
    return { text: 'Good Evening', suffix: '🌙' };
  };

  const { text: greetingText, suffix: greetingSuffix } = getGreetingData();

  const today = new Date();
  const quoteSeed = (today.getFullYear() + today.getMonth() + today.getDate()) % quotes.length;
  const tipSeed = (today.getFullYear() + today.getMonth() + today.getDate()) % tips.length;
  const quote = quotes[quoteSeed];
  const tip = tips[tipSeed];

  return (
    <Card variant="shaded" className="p-8 text-left border-none shadow-none flex flex-col justify-between" hoverEffect={false}>
      <div className="space-y-4">
        {/* Header greeting and streak badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2F3A3F] tracking-tight">
            👋 {greetingText}, {user?.fullName || user?.email || 'Student'} {greetingSuffix}
          </h1>

          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-white border border-[#E5E7EB] text-[#2F3A3F] px-3.5 py-1.5 rounded-full shadow-soft select-none font-semibold w-fit">
            🔥 {streak > 1 ? `${streak} day reflection streak` : `Day ${streak || 1}`}
          </div>
        </div>

        {/* Dynamic quote section */}
        <p className="text-sm font-medium text-[#6B7280] italic leading-relaxed">
          "{quote}"
        </p>

        {/* Merged Daily Tip box styled as secondary info */}
        <div className="p-3 bg-white/60 border border-[#E5E7EB]/50 rounded-xl text-left flex items-start gap-2.5">
          <span className="text-base select-none mt-0.5">💡</span>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Tip of the day</span>
            <p className="text-xs text-[#2F3A3F] font-semibold leading-relaxed">
              {tip}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
