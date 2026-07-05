import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { checkNotificationPermission, requestNotificationPermission } from '../../services/notificationService';
import { Bell, Sparkles } from 'lucide-react';

const WellnessCompanion = ({ history, streak, selectedMood, journal }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [companionMsg, setCompanionMsg] = useState('');

  // Rotation messages list
  const messages = [
    "🌼 Welcome back.",
    "🌿 You're building a beautiful habit.",
    "☀️ Even a few words today can make a difference.",
    "🌙 Progress isn't perfection."
  ];

  useEffect(() => {
    // 1. Pick a random companion message avoiding consecutive repetitions
    const lastMsg = localStorage.getItem('lastCompanionMessage');
    const available = messages.filter(m => m !== lastMsg);
    const chosen = available[Math.floor(Math.random() * available.length)] || messages[0];
    setCompanionMsg(chosen);
    localStorage.setItem('lastCompanionMessage', chosen);

    // 2. Check if we need to show the browser notification permission request banner
    const perm = checkNotificationPermission();
    if (perm === 'default') {
      setShowBanner(true);
    }
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted' || res === 'denied') {
      setShowBanner(false);
    }
  };

  const handleScrollToMood = () => {
    document.getElementById('mood-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScrollToJournal = () => {
    document.getElementById('journal-input-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Smart encouragement calculation helpers
  const getEncouragement = () => {
    const scores = { Amazing: 5, Good: 4, Neutral: 3, Down: 2, Stressed: 1 };
    
    // Check if mood improved or declined
    if (history && history.length >= 2) {
      const latestScore = scores[history[0].mood] || 3;
      const prevScore = scores[history[1].mood] || 3;
      if (latestScore > prevScore) {
        return { text: "😊 It's wonderful seeing brighter days.", icon: '☀️' };
      } else if (latestScore < prevScore) {
        return { text: "💚 Be gentle with yourself today.", icon: '🌿' };
      }
    }

    // Check streak status
    if (streak > 0) {
      return { text: "🔥 Amazing consistency!", icon: '⚡' };
    } else if (history && history.length > 0) {
      return { text: "🌿 Every day is a fresh start.", icon: '🌱' };
    }

    return null;
  };

  // Weekly Celebration (every 7th reflection)
  const isWeeklyCelebration = history && history.length > 0 && history.length % 7 === 0;

  const encouragement = getEncouragement();

  return (
    <div className="space-y-4 text-left w-full select-none">
      {/* 1. Notification Permission Banner */}
      {showBanner && (
        <Card className="p-4 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft" hoverEffect={false}>
          <div className="flex items-start gap-2.5">
            <Bell className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">Daily Reminders Disabled</h4>
              <p className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold leading-normal">
                Enable browser notifications to remind you to check in and record reflections.
              </p>
            </div>
          </div>
          <Button onClick={handleRequestPermission} variant="outline" className="!px-3.5 !py-1.5 text-[10px] border-amber-300 text-amber-900 dark:border-amber-700 dark:text-amber-300 hover:bg-amber-100/50 shrink-0">
            🔔 Enable Notifications
          </Button>
        </Card>
      )}

      {/* 2. Wellness Companion Widget Card */}
      <Card className="p-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-grow">
            <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Wellness Companion</span>
            <p className="text-sm font-semibold text-[#2F3A3F] dark:text-slate-200 italic">
              "{companionMsg}"
            </p>
          </div>

          {/* Missed Check-ins and Encouragements Column */}
          <div className="flex flex-col gap-2.5 sm:items-end shrink-0 text-left sm:text-right">
            {/* Mood Missed Check-in */}
            {!selectedMood && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>We haven't heard from you today.</span>
                <button onClick={handleScrollToMood} className="text-[#6B8E7A] hover:underline font-bold text-xs select-none">
                  Check In
                </button>
              </div>
            )}

            {/* Journal Missed Check-in */}
            {selectedMood && !journal.trim() && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Your journal is waiting whenever you're ready.</span>
                <button onClick={handleScrollToJournal} className="text-[#6B8E7A] hover:underline font-bold text-xs select-none">
                  Write
                </button>
              </div>
            )}

            {/* Smart Encouragement Label */}
            {encouragement && (
              <span className="text-[10px] font-bold text-[#6B7280] dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-1 rounded-full w-fit">
                {encouragement.icon} {encouragement.text}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Weekly Celebration Card */}
      {isWeeklyCelebration && (
        <Card className="p-5 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/60 text-left relative overflow-hidden" hoverEffect={false}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-700">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">🎉 One week completed!</h4>
              <p className="text-[10px] text-emerald-850 dark:text-emerald-400 font-semibold leading-normal mt-0.5">
                🌱 You're growing one reflection at a time. Keep dedicating time for self-reflection.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WellnessCompanion;
