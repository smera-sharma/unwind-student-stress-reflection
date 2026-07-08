import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { safeStorage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  
  // Profile & settings local states
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    displayName: '',
    email: '',
    bio: '',
    profilePicture: '',
    preferredPronouns: ''
  });

  const [settingsForm, setSettingsForm] = useState({
    theme: 'system',
    dailyReminder: false,
    reminderTime: '20:00',
    timezone: 'UTC',
    notificationsEnabled: true,
    weeklyReminders: true,
    motivationalMessages: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'appearance', 'notifications', 'privacy', 'about'
  const [toast, setToast] = useState(null);

  // 1. Fetch Profile and Settings on mount
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const [profData, settData] = await Promise.all([
          apiService.profile.getProfile(),
          apiService.profile.getSettings()
        ]);
        
        setProfileForm({
          fullName: profData.full_name || '',
          displayName: profData.display_name || '',
          email: profData.email || '',
          bio: profData.bio || '',
          profilePicture: profData.profile_picture || '🌱',
          preferredPronouns: profData.preferred_pronouns || ''
        });

        const localNotifSettings = safeStorage.getItem('notificationSettings') || {};

        setSettingsForm({
          theme: settData.theme || 'system',
          dailyReminder: settData.daily_reminder || false,
          reminderTime: settData.reminder_time || '20:00',
          timezone: settData.timezone || 'UTC',
          notificationsEnabled: settData.notifications_enabled !== false,
          weeklyReminders: localNotifSettings.weeklyReminders !== false,
          motivationalMessages: localNotifSettings.motivationalMessages !== false,
          quietHoursEnabled: !!localNotifSettings.quietHoursEnabled,
          quietHoursStart: localNotifSettings.quietHoursStart || '22:00',
          quietHoursEnd: localNotifSettings.quietHoursEnd || '08:00'
        });
      } catch (err) {
        console.warn("Failed loading profile from backend. Using local context fallback.", err);
        const localNotifSettings = safeStorage.getItem('notificationSettings') || {};
        const email = user?.email || 'user@unwind.com';
        const emailPrefix = email.split('@')[0];
        const defaultName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        
        setProfileForm({
          fullName: user?.fullName || defaultName,
          displayName: user?.displayName || defaultName,
          email: email,
          bio: user?.bio || '',
          profilePicture: user?.profilePicture || '🌱',
          preferredPronouns: user?.preferredPronouns || ''
        });
        setSettingsForm(prev => ({
          ...prev,
          weeklyReminders: localNotifSettings.weeklyReminders !== false,
          motivationalMessages: localNotifSettings.motivationalMessages !== false,
          quietHoursEnabled: !!localNotifSettings.quietHoursEnabled,
          quietHoursStart: localNotifSettings.quietHoursStart || '22:00',
          quietHoursEnd: localNotifSettings.quietHoursEnd || '08:00'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // 2. Immediate live theme preview
  const handleThemePreview = (newTheme) => {
    setSettingsForm(prev => ({ ...prev, theme: newTheme }));
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const data = await apiService.profile.updateProfile({
        full_name: profileForm.fullName,
        display_name: profileForm.displayName,
        bio: profileForm.bio,
        profile_picture: profileForm.profilePicture,
        preferred_pronouns: profileForm.preferredPronouns
      });
      
      setProfileForm({
        fullName: data.full_name || '',
        displayName: data.display_name || '',
        email: data.email || '',
        bio: data.bio || '',
        profilePicture: data.profile_picture || '🌱',
        preferredPronouns: data.preferred_pronouns || ''
      });

      await refreshUser();
      showToast('✓ Profile Updated', 'Profile updated successfully.');
    } catch (err) {
      console.error("Profile save failed:", err);
      const backendMsg = err.response?.data?.message || err.message || 'Failed to update profile.';
      showToast(`❌ Save Failed`, backendMsg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const data = await apiService.profile.updateSettings({
        theme: settingsForm.theme,
        daily_reminder: settingsForm.dailyReminder,
        reminder_time: settingsForm.reminderTime,
        timezone: settingsForm.timezone,
        notifications_enabled: settingsForm.notificationsEnabled
      });

      const extSettings = {
        weeklyReminders: settingsForm.weeklyReminders,
        motivationalMessages: settingsForm.motivationalMessages,
        quietHoursEnabled: settingsForm.quietHoursEnabled,
        quietHoursStart: settingsForm.quietHoursStart,
        quietHoursEnd: settingsForm.quietHoursEnd
      };
      safeStorage.setItem('notificationSettings', extSettings);
      safeStorage.setItem('reminderTime', settingsForm.reminderTime);

      setSettingsForm({
        theme: data.theme || 'system',
        dailyReminder: data.daily_reminder || false,
        reminderTime: data.reminder_time || '20:00',
        timezone: data.timezone || 'UTC',
        notificationsEnabled: data.notifications_enabled !== false,
        weeklyReminders: settingsForm.weeklyReminders,
        motivationalMessages: settingsForm.motivationalMessages,
        quietHoursEnabled: settingsForm.quietHoursEnabled,
        quietHoursStart: settingsForm.quietHoursStart,
        quietHoursEnd: settingsForm.quietHoursEnd
      });

      safeStorage.setItem('theme', data.theme || 'system');
      await refreshUser();
      showToast('✓ Settings Saved', 'Preferences updated successfully.');
    } catch (err) {
      console.error("Settings save failed:", err);
      const backendMsg = err.response?.data?.message || err.message || 'Failed to update settings.';
      showToast(`❌ Save Failed`, backendMsg);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Privacy Actions
  const handleExportJournal = () => {
    const reflections = safeStorage.getItem('reflectionHistory', []);
    const blob = new Blob([JSON.stringify(reflections, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'unwind_journal_reflections.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('💾 Export Successful', 'Reflections downloaded as JSON.');
  };

  const handleDownloadAllData = () => {
    const allData = {
      profile: profileForm,
      settings: settingsForm,
      history: safeStorage.getItem('reflectionHistory', []),
      streak: safeStorage.getItem('reflectionStreak', '4'),
      todayMood: safeStorage.getItem('todayMood', '')
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'unwind_user_profile_data.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('💾 Data Exported', 'All local statistics successfully compiled.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action is permanent.")) {
      if (user && user.email) {
        const suffix = `_${user.email}`;
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.endsWith(suffix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      localStorage.removeItem('token');
      logout();
      showToast('🗑 Account Deleted', 'Redirecting you...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  const showToast = (title, msg) => {
    setToast({ title, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { id: 'profile', name: '👤 Profile' },
    { id: 'appearance', name: '🎨 Appearance' },
    { id: 'notifications', name: '🔔 Notifications' },
    { id: 'privacy', name: '🔒 Privacy' },
    { id: 'about', name: 'ℹ️ About' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#6B8E7A] animate-spin" />
          <span className="text-xs text-[#6B7280] font-medium animate-pulse">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 w-full animate-fade-in">
      {/* Title */}
      <div className="text-left mb-8">
        <h1 className="text-3xl font-semibold text-[#2F3A3F] dark:text-slate-100 tracking-tight">Settings & Customization</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-medium">Manage your display name, preferred theme, notifications, and backups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs (Left col) */}
        <div className="md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-2 md:pb-0 border-b md:border-b-0 border-[#E5E7EB]/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap text-left transition-all duration-300 w-full focus:outline-none ${
                activeTab === tab.id
                  ? 'bg-[#E2EBE5] text-[#587665] dark:bg-emerald-950/40 dark:text-emerald-400 shadow-soft'
                  : 'text-[#6B7280] dark:text-slate-400 hover:bg-[#FAF9F6] dark:hover:bg-slate-900'
              }`}
              type="button"
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Configurations pane (Right col) */}
        <div className="md:col-span-9">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <Card className="p-8 text-left space-y-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">User Profile</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium mt-0.5">Customize your personal greeting identifiers.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Profile Pic avatar select */}
                <div className="flex items-center gap-4 py-2 select-none">
                  <div className="w-16 h-16 rounded-full bg-[#E2EBE5] dark:bg-slate-900 border border-[#6B8E7A]/20 flex items-center justify-center text-3xl shadow-soft">
                    {profileForm.profilePicture || '🌱'}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#89A8B2] uppercase block">Choose Avatar</span>
                    <div className="flex gap-2">
                      {['🌱', '🌞', '🐈', '🚀', '🧠', '🌸'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setProfileForm(prev => ({ ...prev, profilePicture: emoji }))}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-sm focus:outline-none ${
                            profileForm.profilePicture === emoji
                              ? 'bg-white border-[#6B8E7A] dark:bg-slate-900 dark:border-emerald-400'
                              : 'bg-[#FAF9F6] border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-800'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preferred Pronouns */}
                <div className="space-y-1">
                  <label htmlFor="pronouns" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Preferred Pronouns</label>
                  <input
                    id="pronouns"
                    type="text"
                    className="w-full bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold"
                    placeholder="e.g. she/her, he/him, they/them"
                    value={profileForm.preferredPronouns}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, preferredPronouns: e.target.value }))}
                  />
                </div>

                {/* Display name */}
                <div className="space-y-1">
                  <label htmlFor="display_name" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Display Name</label>
                  <input
                    id="display_name"
                    type="text"
                    className="w-full bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold"
                    placeholder="Eshniie"
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                    required
                  />
                </div>

                {/* Full name */}
                <div className="space-y-1">
                  <label htmlFor="full_name" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Full Name</label>
                  <input
                    id="full_name"
                    type="text"
                    className="w-full bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Email Address (Read-Only)</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full bg-[#FAF9F6]/60 dark:bg-slate-900/50 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#6B7280] dark:text-slate-400 cursor-not-allowed font-semibold"
                    value={profileForm.email}
                    disabled
                    readOnly
                  />
                </div>

                {/* Bio text */}
                <div className="space-y-1">
                  <label htmlFor="bio" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Short Bio</label>
                  <textarea
                    id="bio"
                    className="w-full bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all min-h-[90px] resize-none font-semibold"
                    placeholder="A short description of yourself..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" className="!px-6" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Tab 2: Appearance */}
          {activeTab === 'appearance' && (
            <Card className="p-8 text-left space-y-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">Appearance Settings</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium mt-0.5">Toggle and preview color theme preferences.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#89A8B2] uppercase block">Theme Select</span>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleThemePreview(t)}
                        className={`py-6 rounded-2xl border text-center font-bold text-xs uppercase transition-all select-none shadow-soft focus:outline-none ${
                          settingsForm.theme === t
                            ? 'bg-[#E2EBE5] border-[#6B8E7A] text-[#587665] dark:bg-emerald-950/40 dark:border-emerald-400 dark:text-emerald-400'
                            : 'bg-[#FAF9F6] border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-800 text-[#2F3A3F] dark:text-slate-300 hover:border-[#6B8E7A]/40'
                        }`}
                      >
                        <span className="block text-xl mb-1.5">
                          {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}
                        </span>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" className="!px-6" disabled={isSavingSettings}>
                    {isSavingSettings ? 'Saving...' : 'Save Theme'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === 'notifications' && (
            <Card className="p-8 text-left space-y-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">Notifications & Quiet Hours</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium mt-0.5">Control daily reminder times, quiet hours, and alerts.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* Daily Reminders Checkbox */}
                <div className="flex items-center justify-between p-4 bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-soft select-none">
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Daily Journal Reminders</h4>
                    <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-medium">Receive alerts to complete your reflection log.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.dailyReminder}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, dailyReminder: e.target.checked }))}
                    className="w-4.5 h-4.5 accent-[#6B8E7A] rounded cursor-pointer"
                  />
                </div>

                {/* Daily Reminder Time Picker */}
                {settingsForm.dailyReminder && (
                  <div className="space-y-1 animate-fade-in text-left">
                    <label htmlFor="time" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Daily Reminder Time</label>
                    <input
                      id="time"
                      type="time"
                      className="w-full max-w-xs bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold"
                      value={settingsForm.reminderTime}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, reminderTime: e.target.value }))}
                    />
                  </div>
                )}

                {/* Weekly Reminders Checkbox */}
                <div className="flex items-center justify-between p-4 bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-soft select-none">
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Weekly Reflection Reminders</h4>
                    <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-medium">Receive weekly logs summary notifications.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.weeklyReminders}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, weeklyReminders: e.target.checked }))}
                    className="w-4.5 h-4.5 accent-[#6B8E7A] rounded cursor-pointer"
                  />
                </div>

                {/* Motivational Messages Checkbox */}
                <div className="flex items-center justify-between p-4 bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-soft select-none">
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Motivational Messages</h4>
                    <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-medium">Receive proactive encouraging insights.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.motivationalMessages}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, motivationalMessages: e.target.checked }))}
                    className="w-4.5 h-4.5 accent-[#6B8E7A] rounded cursor-pointer"
                  />
                </div>

                {/* Quiet Hours Checkbox */}
                <div className="flex items-center justify-between p-4 bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-soft select-none">
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Enable Quiet Hours</h4>
                    <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-medium">Mute notifications during designated sleep/quiet windows.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.quietHoursEnabled}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                    className="w-4.5 h-4.5 accent-[#6B8E7A] rounded cursor-pointer"
                  />
                </div>

                {/* Quiet Hours Range Picker */}
                {settingsForm.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4 animate-fade-in text-left">
                    <div className="space-y-1">
                      <label htmlFor="quiet-start" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Quiet Hours Start</label>
                      <input
                        id="quiet-start"
                        type="time"
                        className="w-full bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold"
                        value={settingsForm.quietHoursStart}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="quiet-end" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Quiet Hours End</label>
                      <input
                        id="quiet-end"
                        type="time"
                        className="w-full bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold"
                        value={settingsForm.quietHoursEnd}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {/* Timezone */}
                <div className="space-y-1 text-left">
                  <label htmlFor="timezone" className="text-[10px] font-bold text-[#89A8B2] uppercase block">Timezone</label>
                  <select
                    id="timezone"
                    className="w-full bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#2F3A3F] dark:text-slate-200 focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold cursor-pointer"
                    value={settingsForm.timezone}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, timezone: e.target.value }))}
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="IST">IST (Indian Standard Time)</option>
                    <option value="GMT">GMT (Greenwich Mean Time)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" className="!px-6" disabled={isSavingSettings}>
                    {isSavingSettings ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Tab 4: Privacy */}
          {activeTab === 'privacy' && (
            <Card className="p-8 text-left space-y-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">Privacy & Security</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium mt-0.5">Control data backups, exports, or account deletion.</p>
              </div>

              <div className="space-y-4">
                {/* Export My Journal */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Export Reflections</h4>
                    <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-medium">Backup your journal reflections locally in JSON.</p>
                  </div>
                  <Button onClick={handleExportJournal} variant="outline" className="text-xs whitespace-nowrap dark:border-slate-800 dark:text-slate-300">
                    💾 Export JSON
                  </Button>
                </div>

                {/* Download My Data */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Download My Data</h4>
                    <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-medium">Download a backup containing all profile parameters and history.</p>
                  </div>
                  <Button onClick={handleDownloadAllData} variant="outline" className="text-xs whitespace-nowrap dark:border-slate-800 dark:text-slate-300">
                    💾 Download Data
                  </Button>
                </div>

                {/* Delete My Account */}
                <div className="p-4 bg-red-50/20 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Delete Account</h4>
                    <p className="text-[10px] text-red-500/80 dark:text-red-400/80 font-medium">Permanently wipe all journal history and user keys.</p>
                  </div>
                  <Button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white text-xs border-none select-none">
                    🗑 Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Tab 5: About */}
          {activeTab === 'about' && (
            <Card className="p-8 text-left space-y-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">About Unwind</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium mt-0.5">App info and release metadata details.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl space-y-2 select-none shadow-soft text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#6B7280]">Application Version</span>
                    <span className="font-bold text-[#2F3A3F] dark:text-slate-200">v1.2.0 (Milestone 5)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#6B7280]">Developer Credits</span>
                    <span className="font-bold text-[#2F3A3F] dark:text-slate-200">Antigravity Coding Assistant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#6B7280]">Architecture</span>
                    <span className="font-bold text-[#2F3A3F] dark:text-slate-200">React + FastAPI + SQLite</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#6B8E7A] hover:text-[#587665] transition-colors"
                  >
                    🐙 Star on GitHub
                  </a>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Toast Notification Box */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[200] bg-[#2F3A3F] text-white px-5 py-3.5 rounded-2xl shadow-premium text-sm font-semibold flex flex-col gap-1 border border-slate-700/50 min-w-[280px] text-left animate-fade-in transition-all duration-300">
          <div className="flex items-center gap-1.5 text-white font-bold">
            {toast.title}
          </div>
          <div className="text-xs text-[#FAF9F6]/80 font-medium leading-normal">
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
