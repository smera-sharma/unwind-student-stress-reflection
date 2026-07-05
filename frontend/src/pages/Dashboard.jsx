import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { X } from 'lucide-react';
import { startNotificationScheduler } from '../services/notificationService';


// Import all modular subcomponents
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import WellnessCompanion from '../components/dashboard/WellnessCompanion';
import MoodSelector from '../components/dashboard/MoodSelector';
import JournalCard from '../components/dashboard/JournalCard';
import AIReflectionCard from '../components/dashboard/AIReflectionCard';
import EmotionalInsightsCard from '../components/dashboard/EmotionalInsightsCard';
import WeeklyMoodChart from '../components/dashboard/WeeklyMoodChart';
import QuickActions from '../components/dashboard/QuickActions';
import ReflectionHistory from '../components/dashboard/ReflectionHistory';
import WellnessScoreCard from '../components/dashboard/WellnessScoreCard';
import AchievementsCard from '../components/dashboard/AchievementsCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showLunaIntro, setShowLunaIntro] = useState(() => {
    return !localStorage.getItem('luna_intro_dismissed');
  });

  const handleDismissLunaIntro = () => {
    localStorage.setItem('luna_intro_dismissed', 'true');
    setShowLunaIntro(false);
  };
  
  // 1. Centralized States persistent in LocalStorage
  const [selectedMood, setSelectedMood] = useState(() => {
    return localStorage.getItem('todayMood') || '';
  });

  const [journal, setJournal] = useState(() => {
    return localStorage.getItem('todayJournal') || '';
  });

  const [weeklyMood, setWeeklyMood] = useState(() => {
    const saved = localStorage.getItem('weeklyMood');
    return saved ? JSON.parse(saved) : [4, 5, 3, 2, 5, 4, 3];
  });

  const [checkInCount, setCheckInCount] = useState(() => {
    return parseInt(localStorage.getItem('checkInCount') || '4', 10);
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('reflectionStreak') || '4', 10);
  });

  // Load and seed Reflection History if empty on load
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('reflectionHistory');
    if (saved) return JSON.parse(saved);

    const mockHistory = [
      { date: 'Thursday, July 2', mood: 'Good', text: 'Finished the research paper outline today. Felt good to get that milestone out of the way.' },
      { date: 'Wednesday, July 1', mood: 'Stressed', text: 'Midterm exam prep is taking up all my energy. I feel stressed and tired.' },
      { date: 'Tuesday, June 30', mood: 'Neutral', text: 'A normal day. Attended lectures, read at the library, and walked around the park.' },
      { date: 'Monday, June 29', mood: 'Amazing', text: 'Had a wonderful lunch with college friends. We talked about summer break plans and laughed a lot.' }
    ];
    localStorage.setItem('reflectionHistory', JSON.stringify(mockHistory));
    return mockHistory;
  });

  const [toast, setToast] = useState(null);

  // Scroll targets refs (Idiomatic React layout targets)
  const journalRef = useRef(null);
  const aiReflectionRef = useRef(null);
  const prevJournalVal = useRef(journal);

  // Mood scores translation map
  const moodScores = { Amazing: 5, Good: 4, Neutral: 3, Down: 2, Stressed: 1 };

  // Calculate day index (Mon is 0, Sun is 6)
  const getTodayIndex = () => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleMoodChange = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('todayMood', mood);

    // Dynamically update today's index score on the weekly progress chart
    const score = moodScores[mood] || 3;
    const updatedWeeklyMood = [...weeklyMood];
    updatedWeeklyMood[getTodayIndex()] = score;
    setWeeklyMood(updatedWeeklyMood);
    localStorage.setItem('weeklyMood', JSON.stringify(updatedWeeklyMood));

    // Increment check-in count
    setCheckInCount(prev => {
      const newVal = prev + 1;
      localStorage.setItem('checkInCount', newVal.toString());
      return newVal;
    });

    // Celebration Toast: Mood Saved
    showToast('🌼 Mood saved', 'Thank you for checking in with yourself today.');

    // Celebration Toast: 7-day streak milestone if all 7 days have values
    const checkInDays = updatedWeeklyMood.filter(val => val > 0).length;
    if (checkInDays === 7) {
      setTimeout(() => {
        showToast('🔥 Amazing!', "You've reflected for seven days in a row.");
      }, 3500);
    }
  };

  // Sync journal updates to reflectionHistory in localStorage on save boundaries
  useEffect(() => {
    if (journal.trim() === '') return;

    const todayStr = new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    setHistory(prev => {
      const updated = [...prev];
      const todayIdx = updated.findIndex(item => item.date === todayStr);
      if (todayIdx > -1) {
        updated[todayIdx] = { date: todayStr, mood: selectedMood || 'Neutral', text: journal };
      } else {
        updated.unshift({ date: todayStr, mood: selectedMood || 'Neutral', text: journal });
      }
      localStorage.setItem('reflectionHistory', JSON.stringify(updated));
      return updated;
    });

    // Handle first reflection toast if prev journal was empty
    if (prevJournalVal.current.trim() === '' && journal.trim() !== '') {
      showToast('🎉 Reflection saved', 'Your thoughts have found a safe place.');
    }
    prevJournalVal.current = journal;
  }, [journal, selectedMood]);

  useEffect(() => {
    const cleanup = startNotificationScheduler();
    return () => cleanup();
  }, []);

  // Dynamic Streak display calculation
  const displayStreak = journal.trim().length >= 50 ? streak + 1 : streak;

  const handleActionClick = (action) => {
    if (action === 'Journal') {
      journalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'AI Reflection') {
      aiReflectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'Breathing Exercise') {
      navigate('/resources#breathing');
    } else if (action === 'Resources') {
      navigate('/resources');
    }
  };

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex-grow space-y-12 py-8 max-w-7xl mx-auto px-6 sm:px-8 relative animate-fade-in transition-opacity duration-700">
      {/* Top Section - Merged Welcome Banner, Thought, and Daily Tip */}
      <div className="space-y-6">
        <WelcomeBanner user={user} streak={displayStreak} />
        
        {showLunaIntro && (
          <Card className="p-6 border-[#6B8E7A]/20 bg-[#FAF7F2] dark:bg-slate-900 dark:border-slate-800 text-left space-y-4 relative" hoverEffect={false}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#2F3A3F] dark:text-slate-100 flex items-center gap-1.5 select-none">
                  🌙 Meet Luna
                </h3>
                <p className="text-xs text-[#89A8B2] font-semibold mt-0.5">Your Reflection & Productivity Companion</p>
              </div>
              <button 
                onClick={handleDismissLunaIntro} 
                className="p-1 hover:bg-slate-200/50 text-[#6B7280] dark:text-slate-400 rounded-full transition-colors focus:outline-none" 
                aria-label="Dismiss Introduction"
                type="button"
              >
                <X size={14} />
              </button>
            </div>
            
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-semibold">
              Luna helps you organize your thoughts, summarize reflections, identify patterns, break overwhelming problems into manageable steps, and support your daily productivity.
              <span className="block mt-2 font-bold text-slate-500 dark:text-slate-350">
                Luna is not a therapist and does not provide medical, psychological, or crisis advice.
              </span>
            </p>

            <div className="flex flex-wrap gap-2 pt-1 select-none">
              {["✨ Summarize", "📊 Spot Patterns", "🎯 Break Down Goals", "📅 Plan Your Week"].map(chip => (
                <span key={chip} className="text-[10px] font-bold bg-white dark:bg-slate-950 border border-[#E5E7EB] dark:border-slate-800 text-[#2F3A3F] dark:text-slate-300 px-3 py-1.5 rounded-full shadow-soft">
                  {chip}
                </span>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={handleDismissLunaIntro} 
                className="px-5 py-2 text-[10px] font-extrabold text-white bg-[#6B8E7A] hover:bg-[#587665] rounded-xl transition-all uppercase tracking-wider focus:outline-none shadow-soft"
                type="button"
              >
                Got it
              </button>
            </div>
          </Card>
        )}

        <WellnessCompanion history={history} streak={displayStreak} selectedMood={selectedMood} journal={journal} />
        <div id="mood-selector-container">
          <MoodSelector selectedMood={selectedMood} onMoodChange={handleMoodChange} />
        </div>
      </div>

      {/* Row 1: 12-column layout grid (Journal vs Reflection & Insights) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7" id="journal-input-container">
          <JournalCard journal={journal} setJournal={setJournal} journalRef={journalRef} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex-1">
            <AIReflectionCard journal={journal} selectedMood={selectedMood} aiReflectionRef={aiReflectionRef} />
          </div>
          <div className="flex-1">
            <EmotionalInsightsCard journal={journal} />
          </div>
        </div>
      </div>

      {/* Row 2: 12-column layout grid (Analytics vs Actions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7">
          <WeeklyMoodChart weeklyMood={weeklyMood} streak={displayStreak} />
        </div>
        <div className="lg:col-span-5">
          <QuickActions onActionClick={handleActionClick} />
        </div>
      </div>

      {/* Row 3: 12-column layout grid (History vs Score & Achievements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7">
          <ReflectionHistory history={history} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex-1">
            <WellnessScoreCard selectedMood={selectedMood} journal={journal} streak={displayStreak} weeklyMood={weeklyMood} />
          </div>
          <div className="flex-1">
            <AchievementsCard history={history} streak={displayStreak} checkInCount={checkInCount} />
          </div>
        </div>
      </div>



      {/* Floating Toast Notification Box */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[200] bg-[#2F3A3F] text-white px-5 py-3.5 rounded-2xl shadow-premium text-sm font-semibold flex flex-col gap-1 border border-slate-700/50 min-w-[280px] text-left animate-fade-in transition-all duration-300">
          <div className="flex items-center gap-1.5 text-white font-bold">
            {toast.title}
          </div>
          <div className="text-xs text-[#FAF9F6]/80 font-medium leading-normal">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
