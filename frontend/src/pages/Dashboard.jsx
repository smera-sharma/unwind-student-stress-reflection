import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import newly created modular dashboard subcomponents
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import MoodSelector from '../components/dashboard/MoodSelector';
import JournalCard from '../components/dashboard/JournalCard';
import AIReflectionCard from '../components/dashboard/AIReflectionCard';
import WeeklyMoodChart from '../components/dashboard/WeeklyMoodChart';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex-grow space-y-8 py-6 max-w-5xl mx-auto">
      {/* 1. Welcome Banner */}
      <WelcomeBanner user={user} />

      {/* 2. Mood Selector */}
      <MoodSelector />

      {/* 3. Mid Section - Two Column Grid (Journal & AI Reflection) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <JournalCard />
        <AIReflectionCard />
      </div>

      {/* 4. Lower Section - Two Column Grid (Mood Progress Chart & Quick Shortcuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeeklyMoodChart />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
