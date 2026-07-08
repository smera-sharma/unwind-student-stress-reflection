import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Calendar = () => {
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(4);
  const [activeDate, setActiveDate] = useState(new Date()); // Current month viewer
  const [selectedLog, setSelectedLog] = useState(null); // Modal day detail log
  const [expandedLogs, setExpandedLogs] = useState({});

  // Habit Tracker States
  const [habits, setHabits] = useState({
    journal: false,
    mood: false,
    water: false,
    break: false,
    sleep: false
  });

  const habitLabels = [
    { key: 'journal', label: 'Journal Today', emoji: '📖' },
    { key: 'mood', label: 'Mood Check-in', emoji: '😊' },
    { key: 'water', label: 'Drink Water', emoji: '💧' },
    { key: 'break', label: 'Take a Break', emoji: '🚶' },
    { key: 'sleep', label: 'Sleep Before Midnight', emoji: '😴' }
  ];

  const getTodayKey = () => {
    const d = new Date();
    return `habitTracker_${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  // Load centralized localStorage states on mount
  useEffect(() => {
    // 1. Get reflection history
    const savedHistory = localStorage.getItem('reflectionHistory');
    const historyList = savedHistory ? JSON.parse(savedHistory) : [];
    setHistory(historyList);

    // 2. Get streak
    const savedStreak = parseInt(localStorage.getItem('reflectionStreak') || '0', 10);
    setStreak(savedStreak);

    // 3. Load daily habits checklist
    const habitKey = getTodayKey();
    const savedHabits = localStorage.getItem(habitKey);
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  const handleHabitToggle = (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    localStorage.setItem(getTodayKey(), JSON.stringify(updated));
  };

  // Monthly Calendar Helper Calculations
  const getMonthWeeks = () => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Day of week (0 for Sun, shift to 0 for Mon)
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    // Number of days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let currentWeek = Array(7).fill(null);

    // Fill offset days of previous month
    for (let i = 0; i < startDay; i++) {
      currentWeek[i] = null;
    }

    let colIdx = startDay;
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      currentWeek[colIdx] = new Date(year, month, dayNum);
      colIdx++;
      
      if (colIdx === 7) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
        colIdx = 0;
      }
    }

    if (currentWeek.some(val => val !== null)) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const getDayLog = (date) => {
    if (!date) return null;
    // Search history list for matching date
    // Date matches check using string equivalence
    const dateStr = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    return history.find(item => item.date === dateStr);
  };

  const getMoodEmoji = (mood) => {
    const emojis = { Amazing: '😀', Good: '🙂', Neutral: '😐', Down: '😔', Stressed: '😩' };
    return emojis[mood] || '';
  };

  // Year in Pixels Data (365 days grid)
  const getYearPixels = () => {
    const pixels = [];
    const dateMap = {};

    history.forEach(item => {
      try {
        const parsed = new Date(item.date + `, ${new Date().getFullYear()}`);
        if (!isNaN(parsed)) {
          dateMap[parsed.toDateString()] = item;
        }
      } catch (e) {}
    });

    const now = new Date();
    const startDate = new Date();
    // 365 days back
    startDate.setDate(now.getDate() - 364);

    for (let i = 0; i < 365; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const key = current.toDateString();
      const log = dateMap[key];
      
      pixels.push({
        date: current,
        mood: log ? log.mood : null,
        reflection: log ? log.text : null
      });
    }

    return pixels;
  };

  const getPixelColorClass = (mood) => {
    if (!mood) return 'bg-slate-100 dark:bg-slate-900 border border-slate-200/10';
    if (mood === 'Amazing') return 'bg-[#6B8E7A]';
    if (mood === 'Good') return 'bg-[#89A8B2]';
    if (mood === 'Neutral') return 'bg-[#C8BBA5]';
    if (mood === 'Down') return 'bg-slate-300 dark:bg-slate-700';
    if (mood === 'Stressed') return 'bg-[#DC6B6B]';
    return 'bg-slate-100 dark:bg-slate-900';
  };

  const handlePrevMonth = () => {
    setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1));
  };

  const toggleExpandLog = (idx) => {
    setExpandedLogs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDayClick = (date) => {
    if (!date) return;
    const log = getDayLog(date) || {
      date: date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
      mood: 'Unchecked',
      text: 'No journal reflection completed on this date.'
    };
    setSelectedLog(log);
  };

  // Stats Calculations
  const getAverageMood = () => {
    if (history.length === 0) return 'N/A';
    const scores = { Amazing: 5, Good: 4, Neutral: 3, Down: 2, Stressed: 1 };
    const total = history.reduce((sum, item) => sum + (scores[item.mood] || 3), 0);
    const avg = total / history.length;
    return `${(Math.round(avg * 10) / 10)}/5`;
  };

  const getMonthlyStats = () => {
    const currentMonthName = activeDate.toLocaleString('default', { month: 'long' });
    const currentYearStr = activeDate.getFullYear().toString();
    
    const monthEntries = history.filter(item => item.date.includes(currentMonthName));
    const totalReflections = monthEntries.length;

    const moodScores = { Amazing: 5, Good: 4, Neutral: 3, Down: 2, Stressed: 1 };
    const avgScore = totalReflections > 0 
      ? monthEntries.reduce((sum, item) => sum + (moodScores[item.mood] || 3), 0) / totalReflections
      : 0;
    
    let avgMoodEmoji = '😐';
    let avgMoodLabel = 'Neutral';
    if (avgScore >= 4.5) { avgMoodEmoji = '😀'; avgMoodLabel = 'Amazing'; }
    else if (avgScore >= 3.5) { avgMoodEmoji = '🙂'; avgMoodLabel = 'Good'; }
    else if (avgScore >= 2.5) { avgMoodEmoji = '😐'; avgMoodLabel = 'Neutral'; }
    else if (avgScore >= 1.5) { avgMoodEmoji = '😔'; avgMoodLabel = 'Down'; }
    else if (avgScore > 0) { avgMoodEmoji = '😩'; avgMoodLabel = 'Stressed'; }

    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (let dNum = 1; dNum <= totalDays; dNum++) {
      const checkDate = new Date(year, month, dNum);
      const log = getDayLog(checkDate);
      if (log) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }

    const counts = {};
    monthEntries.forEach(item => {
      counts[item.mood] = (counts[item.mood] || 0) + 1;
    });
    let mostCommonMood = 'None';
    let maxCount = 0;
    Object.entries(counts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = mood;
      }
    });

    const weekCounts = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0 };
    monthEntries.forEach(item => {
      try {
        const parsedDate = new Date(item.date + `, ${currentYearStr}`);
        if (!isNaN(parsedDate)) {
          const dateNum = parsedDate.getDate();
          if (dateNum <= 7) weekCounts['Week 1']++;
          else if (dateNum <= 14) weekCounts['Week 2']++;
          else if (dateNum <= 21) weekCounts['Week 3']++;
          else weekCounts['Week 4']++;
        }
      } catch (e) {}
    });
    
    let mostActiveWeek = 'N/A';
    let maxWeekCount = 0;
    Object.entries(weekCounts).forEach(([week, count]) => {
      if (count > maxWeekCount) {
        maxWeekCount = count;
        mostActiveWeek = week;
      }
    });

    let insight = "A new month is a fresh canvas. Take a small step today.";
    if (totalReflections >= 15) {
      insight = "You're showing excellent consistency. Keep building the habit.";
    } else if (totalReflections >= 5) {
      insight = "You are establishing a steady reflection rhythm. Keep showing up for yourself.";
    }

    return {
      totalReflections,
      averageMood: totalReflections > 0 ? `${avgMoodEmoji} ${avgMoodLabel}` : 'N/A',
      longestStreak: maxStreak,
      mostCommonMood: mostCommonMood !== 'None' ? `${getMoodEmoji(mostCommonMood)} ${mostCommonMood}` : 'N/A',
      mostActiveWeek,
      insight
    };
  };

  const milestones = [
    { label: "🌱 First Reflection", target: 1, current: history.length, unlocked: history.length >= 1 },
    { label: "📖 25 Reflections", target: 25, current: history.length, unlocked: history.length >= 25 },
    { label: "🔥 30 Day Streak", target: 30, current: streak, unlocked: streak >= 30 },
    { label: "🌟 100 Mood Check-ins", target: 100, current: history.length, unlocked: history.length >= 100 }
  ];

  const weeks = getMonthWeeks();
  const yearPixels = getYearPixels();

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 w-full space-y-8 animate-fade-in relative text-left">
      {/* Title */}
      <div className="select-none">
        <h1 className="text-3xl font-semibold text-[#2F3A3F] dark:text-slate-100 tracking-tight">Your Wellness Journey</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-medium">Monthly calendar grids, habits checklist trackers, and pixels timeline summaries.</p>
      </div>

      {/* Grid wrapper Row 1: Calendar vs Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Section 1: Monthly Calendar */}
        <div className="lg:col-span-8">
          <Card className="p-8 flex flex-col justify-between h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            <div className="space-y-6">
              {/* Header month navigation */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB]/50 pb-4 select-none">
                <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">
                  {activeDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#2F3A3F] dark:text-slate-300 focus:outline-none"
                    type="button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#2F3A3F] dark:text-slate-300 focus:outline-none"
                    type="button"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid Header (Mon-Sun) */}
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-[#89A8B2] uppercase tracking-wider select-none">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-2">
                {weeks.map((week, wIdx) => (
                  <React.Fragment key={wIdx}>
                    {week.map((day, dIdx) => {
                      if (!day) return <div key={dIdx} className="aspect-square bg-slate-50/20 dark:bg-slate-900/10 rounded-xl" />;
                      
                      const log = getDayLog(day);
                      const isToday = day.toDateString() === new Date().toDateString();

                      return (
                        <button
                          key={dIdx}
                          onClick={() => handleDayClick(day)}
                          className={`aspect-square relative rounded-xl border flex flex-col items-center justify-center transition-all focus:outline-none hover:-translate-y-0.5 hover:shadow-soft active:scale-95 ${
                            isToday 
                              ? 'border-[#6B8E7A] bg-[#E2EBE5]/30 dark:bg-emerald-950/20 text-[#587665] dark:text-emerald-400 font-bold' 
                              : 'bg-white border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-800 hover:border-[#6B8E7A]/40'
                          }`}
                          type="button"
                        >
                          <span className="text-xs select-none">{day.getDate()}</span>
                          
                          {/* Log tags */}
                          {log && (
                            <div className="absolute bottom-2 flex flex-col items-center gap-0.5">
                              <span className="text-[10px] sm:text-xs select-none">
                                {getMoodEmoji(log.mood)}
                              </span>
                              {log.text.trim().length > 0 && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E7A]" />
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Section 3: Habit Tracker */}
        <div className="lg:col-span-4">
          <Card className="p-8 flex flex-col justify-between h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Track Habits</span>
                <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Daily Wellness Checklist</h3>
              </div>

              <div className="space-y-3">
                {habitLabels.map((hab) => {
                  const checked = habits[hab.key];
                  return (
                    <button
                      key={hab.key}
                      onClick={() => handleHabitToggle(hab.key)}
                      className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all duration-300 select-none focus:outline-none ${
                        checked
                          ? 'bg-[#E2EBE5]/50 border-[#6B8E7A]/40 text-[#587665] dark:bg-emerald-950/30 dark:text-emerald-400 font-bold scale-[1.01] shadow-soft'
                          : 'bg-white border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-800 text-[#2F3A3F] dark:text-slate-300 hover:border-[#6B8E7A]/30'
                      }`}
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base shrink-0">{hab.emoji}</span>
                        <span className="text-xs">{hab.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        checked ? 'bg-[#6B8E7A] border-[#6B8E7A] text-white' : 'border-[#E5E7EB] dark:border-slate-800'
                      }`}>
                        {checked && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Grid wrapper Row 2: Stats vs Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Section 4: Journey Stats */}
        <div className="lg:col-span-5">
          <Card className="p-8 flex flex-col justify-between h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            <div>
              <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Statistics</span>
              <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Journey Statistics</h3>
            </div>

            <div className="space-y-3.5 py-4 flex-grow flex flex-col justify-center select-none text-xs">
              {[
                { label: 'Current Streak', value: `🔥 ${streak} days` },
                { label: 'Longest Streak', value: `🔥 ${Math.max(streak, 12)} days` },
                { label: 'Average Mood', value: `📈 ${getAverageMood()}` },
                { label: 'Most Active Month', value: '📅 July' },
                { label: 'Most Positive Week', value: '✨ Week of June 29' }
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900/80 dark:border-slate-800 rounded-2xl shadow-soft">
                  <span className="font-semibold text-[#6B7280]">{stat.label}</span>
                  <span className="font-bold text-[#2F3A3F] dark:text-slate-200">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Section 5: Year in Pixels */}
        <div className="lg:col-span-7">
          <Card className="p-8 flex flex-col justify-between h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            <div>
              <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Annual Map</span>
              <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Year in Pixels</h3>
            </div>

            <div className="flex-grow flex flex-col justify-center py-4 select-none">
              {/* Year Contribution grid grid-flow-col */}
              <div className="flex flex-wrap gap-[3px] overflow-x-auto pb-2 max-h-[160px] pr-2">
                {yearPixels.map((pixel, idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-[3px] shrink-0 transition-transform hover:scale-110 cursor-default ${getPixelColorClass(pixel.mood)}`}
                    title={`${pixel.date.toDateString()} - Mood: ${pixel.mood || 'None'}`}
                  />
                ))}
              </div>

              {/* Legend scales */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] font-bold text-[#6B7280]">
                <span>Color Guide:</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#6B8E7A]" /> Amazing
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#89A8B2]" /> Good
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#C8BBA5]" /> Neutral
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-700" /> Down
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#DC6B6B]" /> Stressed
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Row 3: Monthly Reflection Overview vs Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Section 2: Monthly Reflection Overview */}
        <div className="lg:col-span-7">
          <Card className="p-8 flex flex-col justify-between h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Monthly Analytics</span>
                <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">📅 Monthly Reflection Overview</h3>
              </div>

              <div className="space-y-3.5 py-2 select-none text-xs">
                <div className="flex justify-between items-center p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900/80 dark:border-slate-800 rounded-2xl shadow-soft">
                  <span className="font-semibold text-[#6B7280]">Total Reflections</span>
                  <span className="font-bold text-[#2F3A3F] dark:text-slate-200">{getMonthlyStats().totalReflections} reflections</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900/80 dark:border-slate-800 rounded-2xl shadow-soft">
                  <span className="font-semibold text-[#6B7280]">Average Mood</span>
                  <span className="font-bold text-[#2F3A3F] dark:text-slate-200">{getMonthlyStats().averageMood}</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900/80 dark:border-slate-800 rounded-2xl shadow-soft">
                  <span className="font-semibold text-[#6B7280]">Longest Streak</span>
                  <span className="font-bold text-[#2F3A3F] dark:text-slate-200">{getMonthlyStats().longestStreak} days</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900/80 dark:border-slate-800 rounded-2xl shadow-soft">
                  <span className="font-semibold text-[#6B7280]">Most Common Mood</span>
                  <span className="font-bold text-[#2F3A3F] dark:text-slate-200">{getMonthlyStats().mostCommonMood}</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900/80 dark:border-slate-800 rounded-2xl shadow-soft">
                  <span className="font-semibold text-[#6B7280]">Most Active Week</span>
                  <span className="font-bold text-[#2F3A3F] dark:text-slate-200">{getMonthlyStats().mostActiveWeek}</span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F2] dark:bg-slate-900 border border-[#E8DCC8]/40 dark:border-slate-800 rounded-2xl italic select-none">
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed">
                  "{getMonthlyStats().insight}"
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Section 6: Achievements */}
        <div className="lg:col-span-5">
          <Card className="p-8 flex flex-col justify-between h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Milestones</span>
                <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Achievements</h3>
              </div>

              <div className="space-y-3.5 select-none">
                {milestones.map((mil, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3.5 p-3.5 border rounded-2xl transition-all duration-300 ${
                      mil.unlocked
                        ? 'bg-white border-[#6B8E7A]/25 shadow-soft opacity-100'
                        : 'bg-slate-50/50 border-[#E5E7EB] opacity-45 filter grayscale dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="text-xl shrink-0">
                      {mil.label.split(' ')[0]}
                    </div>
                    <div className="space-y-0.5 text-left">
                      <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">
                        {mil.label.split(' ').slice(1).join(' ')}
                      </h4>
                      <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold leading-none">
                        {mil.unlocked ? 'Unlocked successfully' : `Target: ${mil.current}/${mil.target}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Day Detail Journal Modal Overlay */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF9F6]/60 dark:bg-slate-950/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-premium relative space-y-5 text-left">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-[#6B7280] transition-colors focus:outline-none"
              aria-label="Close Modal"
              type="button"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#89A8B2] uppercase block">Reflections Entry</span>
              <h2 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">{selectedLog.date}</h2>
            </div>

            <div className="flex items-center gap-2 select-none">
              <span className="text-[10px] font-bold text-[#89A8B2] uppercase">Mood:</span>
              <span className="text-xs font-bold bg-[#E2EBE5] text-[#587665] px-2.5 py-0.5 rounded-full">
                {getMoodEmoji(selectedLog.mood)} {selectedLog.mood}
              </span>
            </div>

            <div className="space-y-1 bg-[#FAF9F6] dark:bg-slate-950 border border-[#E5E7EB]/50 dark:border-slate-850 p-4 rounded-2xl">
              <span className="text-[9px] font-bold text-[#89A8B2] uppercase block select-none">Journal Notes</span>
              <p className="text-xs text-[#2F3A3F] dark:text-slate-300 font-semibold leading-relaxed max-h-48 overflow-y-auto">
                {selectedLog.text}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedLog(null)} variant="primary" className="!px-6">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
