import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Insights = () => {
  const reportRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(4);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);

  // Load centralized localStorage states
  useEffect(() => {
    // 1. Get reflection history
    const savedHistory = localStorage.getItem('reflectionHistory');
    const historyList = savedHistory ? JSON.parse(savedHistory) : [
      { date: 'Thursday, July 2', mood: 'Good', text: 'Finished the research paper outline today. Felt good to get that milestone out of the way.' },
      { date: 'Wednesday, July 1', mood: 'Stressed', text: 'Midterm exam prep is taking up all my energy. I feel stressed and tired.' },
      { date: 'Tuesday, June 30', mood: 'Neutral', text: 'A normal day. Attended lectures, read at the library, and walked around the park.' },
      { date: 'Monday, June 29', mood: 'Amazing', text: 'Had a wonderful lunch with college friends. We talked about summer break plans and laughed a lot.' }
    ];
    setHistory(historyList);

    // 2. Get streak
    const savedStreak = parseInt(localStorage.getItem('reflectionStreak') || '4', 10);
    setStreak(savedStreak);
  }, []);

  // 3. Caching monthly review (API / fallback) with a 7-day cache expiration
  useEffect(() => {
    if (history.length === 0) return;

    const cacheKey = 'monthlySummaryCache';
    const cachedData = localStorage.getItem(cacheKey);
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (now - parsed.timestamp < sevenDaysInMs) {
          setSummary(parsed.summary);
          return;
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    // Trigger API call to generate new summary
    const fetchMonthlySummary = async () => {
      setIsLoading(true);
      try {
        // Send reflections list formatted to backend schema
        const reflectionsPayload = history.map(item => ({
          date: item.date,
          mood: item.mood,
          journal: item.text
        }));

        const response = await api.post('/ai/monthly-summary', {
          reflections: reflectionsPayload
        });
        
        const reviewText = response.data.summary;
        setSummary(reviewText);
        
        // Cache the newly fetched summary
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: now,
          summary: reviewText
        }));
      } catch (err) {
        console.warn("Failed fetching monthly review. Emulating locally.");
        const fallbackText = "This month you've shown remarkable consistency. Early reflections focused on deadlines and stress, while later entries included more gratitude and confidence. Your journaling habit has become more regular.";
        setSummary(fallbackText);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlySummary();
  }, [history]);

  // Statistics calculation helpers
  const getAverageMood = () => {
    if (history.length === 0) return 'N/A';
    const scores = { Amazing: 5, Good: 4, Neutral: 3, Down: 2, Stressed: 1 };
    const total = history.reduce((sum, item) => sum + (scores[item.mood] || 3), 0);
    const avg = total / history.length;
    return `${(Math.round(avg * 10) / 10)}/5`;
  };

  const getAIEntriesCount = () => {
    // Treat any entry containing text as AI-supported reflections count
    return history.filter(item => item.text.length > 20).length;
  };

  // SVG Recharts Trend Data formatter
  const getTrendData = () => {
    const scores = { Amazing: 5, Good: 4, Neutral: 3, Down: 2, Stressed: 1 };
    return [...history]
      .slice(0, 30)
      .reverse()
      .map(item => ({
        date: new Date(item.date + `, ${new Date().getFullYear()}`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        Score: scores[item.mood] || 3
      }));
  };

  // Pie chart Distribution Data formatter
  const getDistributionData = () => {
    const counts = { Amazing: 0, Good: 0, Neutral: 0, Down: 0, Stressed: 0 };
    history.forEach(item => {
      if (counts[item.mood] !== undefined) {
        counts[item.mood]++;
      }
    });

    const colors = {
      Amazing: '#6B8E7A',
      Good: '#89A8B2',
      Neutral: '#C8BBA5',
      Down: '#B4C5CB',
      Stressed: '#DC6B6B'
    };

    const emojis = { Amazing: '😀', Good: '🙂', Neutral: '😐', Down: '😔', Stressed: '😩' };

    return Object.entries(counts)
      .filter(entry => entry[1] > 0)
      .map(entry => ({
        name: `${emojis[entry[0]]} ${entry[0]}`,
        value: entry[1],
        color: colors[entry[0]]
      }));
  };

  // Contribution calendar heatmap data logic (GitHub style)
  const getHeatmapWeeks = () => {
    const days = [];
    const dateMap = {};

    history.forEach(item => {
      try {
        const parsed = new Date(item.date + `, ${new Date().getFullYear()}`);
        if (!isNaN(parsed)) {
          const key = parsed.toDateString();
          dateMap[key] = (dateMap[key] || 0) + 1;
        }
      } catch (e) {}
    });

    const now = new Date();
    const startDate = new Date();
    // Align backwards to 12 weeks for compact dashboard layout
    startDate.setDate(now.getDate() - 83);
    const startDay = startDate.getDay();
    const shift = startDay === 0 ? 6 : startDay - 1;
    startDate.setDate(startDate.getDate() - shift);

    for (let i = 0; i < 91; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const key = current.toDateString();
      days.push({
        date: current,
        count: dateMap[key] || 0
      });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  // Theme occurrences parser
  const getTopThemes = () => {
    const textCounts = {};
    const checkMap = [
      { tag: "College", keywords: ['exam', 'assignment', 'deadline', 'college', 'class', 'study'] },
      { tag: "Stress", keywords: ['stress', 'anxious', 'tired', 'overwhelmed', 'sad'] },
      { tag: "Gratitude", keywords: ['thankful', 'grateful'] },
      { tag: "Sleep", keywords: ['sleep', 'bed', 'rest', 'night'] },
      { tag: "Friends", keywords: ['friend', 'group', 'peer', 'classmate'] },
      { tag: "Goals", keywords: ['goal', 'habit', 'plan', 'priority'] },
      { tag: "Family", keywords: ['family', 'parent', 'mom', 'dad', 'sibling'] },
      { tag: "Growth", keywords: ['grow', 'improve', 'build', 'step'] }
    ];

    history.forEach(item => {
      const text = (item.text || '').toLowerCase();
      checkMap.forEach(theme => {
        if (theme.keywords.some(w => text.includes(w))) {
          textCounts[theme.tag] = (textCounts[theme.tag] || 0) + 1;
        }
      });
    });

    return Object.entries(textCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => ({ tag: entry[0], count: entry[1] }));
  };

  const getMilestones = () => {
    return [
      { label: "🌱 First Reflection", date: history[history.length - 1]?.date || 'Pending', unlocked: history.length >= 1 },
      { label: "📖 Five Reflections", date: history[history.length - 5]?.date || 'Pending', unlocked: history.length >= 5 },
      { label: "😊 Ten Mood Check-ins", date: 'June 30', unlocked: history.length >= 10 },
      { label: "🔥 Seven Day Streak", date: 'June 29', unlocked: streak >= 7 },
      { label: "🌟 One Month of Journaling", date: 'June 15', unlocked: history.length >= 30 }
    ];
  };

  // jsPDF + html2canvas professional wellness PDF report downloader
  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    
    setIsExporting(true);
    showToast('💾 Preparing PDF', 'Generating high-fidelity analytics document...');

    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#FAF9F6'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('Wellness_Report.pdf');
      showToast('✓ PDF Saved', 'Wellness report successfully exported.');
    } catch (e) {
      console.error(e);
      showToast('❌ Export Failed', 'Could not compile pdf document.');
    } finally {
      setIsExporting(false);
    }
  };

  const showToast = (title, msg) => {
    setToast({ title, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const trendData = getTrendData();
  const distributionData = getDistributionData();
  const heatmapWeeks = getHeatmapWeeks();
  const topThemes = getTopThemes();
  const milestones = getMilestones();

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 w-full space-y-8 animate-fade-in relative">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left select-none">
        <div>
          <h1 className="text-3xl font-semibold text-[#2F3A3F] dark:text-slate-100 tracking-tight">Wellness Insights</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-medium">Trace check-ins, calendar heatmaps, and summaries.</p>
        </div>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isExporting} 
          variant="primary" 
          className="!px-5 !py-2.5 text-xs flex items-center gap-1.5 shadow-soft shrink-0"
        >
          {isExporting ? 'Generating Report...' : '💾 Export Wellness Report'}
        </Button>
      </div>

      {/* Main Report Container captured by html2canvas */}
      <div ref={reportRef} className="space-y-8 p-4 rounded-3xl transition-colors duration-300">
        
        {/* Section 1: Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Average Mood', value: getAverageMood(), icon: '😊' },
            { label: 'Total Reflections', value: history.length, icon: '📖' },
            { label: 'Current Streak', value: `${streak} days`, icon: '🔥' },
            { label: 'AI Reflections', value: getAIEntriesCount(), icon: '✨' }
          ].map((card, idx) => (
            <Card key={idx} className="p-6 text-left flex items-center justify-between dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">{card.label}</span>
                <span className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100 font-sans">{card.value}</span>
              </div>
              <div className="text-3xl select-none">{card.icon}</div>
            </Card>
          ))}
        </div>

        {/* Section 2: Mood Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8">
            <Card className="p-8 text-left space-y-6 h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Mood Analytics</span>
                <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Mood Trends (Last 30 check-ins)</h3>
              </div>

              <div className="h-64 w-full">
                {trendData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-[#6B7280] italic">No trend data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--chart-axis)' }} stroke="var(--chart-axis)" />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 9, fill: 'var(--chart-axis)' }} stroke="var(--chart-axis)" />
                      <Tooltip 
                        contentStyle={{ 
                          fontSize: '11px', 
                          borderRadius: '12px', 
                          backgroundColor: 'var(--chart-tooltip-bg)',
                          borderColor: 'var(--chart-tooltip-border)',
                          color: 'var(--chart-axis)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Score" 
                        stroke="var(--chart-line)" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: 'var(--chart-line)' }} 
                        activeDot={{ r: 5 }} 
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>

          {/* Section 3: Mood Distribution */}
          <div className="lg:col-span-4">
            <Card className="p-8 text-left space-y-6 h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Frequencies</span>
                <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Mood Distribution</h3>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                {distributionData.length === 0 ? (
                  <div className="text-xs text-[#6B7280] italic">No logs checked.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                        animationDuration={1200}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Legend row */}
              <div className="flex flex-wrap gap-2.5 justify-center py-1">
                {distributionData.map((d, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-full text-[#2F3A3F] shadow-soft dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Section 4: Calendar Heatmap Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8">
            <Card className="p-8 text-left space-y-6 h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Consistency</span>
                <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Reflection Activity</h3>
              </div>

              {/* Custom heat calendar grid (Mon-Sun) */}
              <div className="flex gap-4 items-start select-none py-2">
                <div className="grid grid-rows-7 gap-[3px] text-[8px] font-bold text-[#6B7280] pr-1 pt-[2px]">
                  <span>Mon</span>
                  <span className="invisible">Tue</span>
                  <span>Wed</span>
                  <span className="invisible">Thu</span>
                  <span>Fri</span>
                  <span className="invisible">Sat</span>
                  <span>Sun</span>
                </div>

                <div className="flex gap-[3px] overflow-x-auto pb-2 flex-grow">
                  {heatmapWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                      {week.map((day, dIdx) => {
                        const count = day.count;
                        let color = 'bg-slate-100 dark:bg-slate-900';
                        if (count > 0) color = 'bg-[#6B8E7A]/35';
                        if (count > 1) color = 'bg-[#6B8E7A]/65';
                        if (count > 2) color = 'bg-[#6B8E7A]';
                        
                        return (
                          <div
                            key={dIdx}
                            className={`w-[11px] h-[11px] rounded-[2.5px] transition-colors ${color}`}
                            title={`${day.date.toDateString()}: ${count} reflections`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Section 5: Top Themes */}
          <div className="lg:col-span-4">
            <Card className="p-8 text-left space-y-6 h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
              <div>
                <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Word Frequencies</span>
                <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Top Themes</h3>
              </div>

              <div className="space-y-3 flex-grow flex flex-col justify-center">
                {topThemes.length === 0 ? (
                  <div className="text-xs text-[#6B7280] italic">Write more to detect themes.</div>
                ) : (
                  topThemes.slice(0, 5).map((theme, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-soft">
                      <span className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">🌿 {theme.tag}</span>
                      <span className="text-[10px] font-bold bg-[#E2EBE5] text-[#587665] px-2.5 py-0.5 rounded-full select-none">
                        {theme.count} times
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Section 6: Monthly AI Summary Card */}
        <Card className="p-8 text-left space-y-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
          <div>
            <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Monthly Analytics</span>
            <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight flex items-center gap-1.5 select-none">
              ✨ Month in Review
            </h3>
          </div>

          {isLoadingSummary ? (
            <div className="space-y-3 py-2 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed p-4 bg-[#FAF7F2] dark:bg-slate-900 border border-[#E8DCC8]/40 dark:border-slate-800 rounded-2xl italic">
              "{summary || 'Generating summary...'}"
            </p>
          )}
        </Card>

        {/* Section 7: Achievements Timeline */}
        <Card className="p-8 text-left space-y-6 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
          <div>
            <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Progress Timeline</span>
            <h3 className="text-xl font-semibold text-[#2F3A3F] dark:text-slate-100 mt-1 tracking-tight">Achievements Timeline</h3>
          </div>

          {/* Chronological unlocked view */}
          <div className="relative pl-6 border-l-2 border-[#E5E7EB] dark:border-slate-800 space-y-6 py-2 select-none">
            {milestones.map((mil, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node */}
                <div className={`absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                  mil.unlocked ? 'border-[#6B8E7A] bg-[#E2EBE5]' : 'border-slate-200 bg-slate-100'
                }`} />
                
                <div className={`space-y-0.5 ${mil.unlocked ? 'opacity-100' : 'opacity-40 filter grayscale'}`}>
                  <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">{mil.label}</h4>
                  <span className="text-[9px] font-semibold text-[#6B7280]">{mil.unlocked ? `Unlocked on ${mil.date}` : 'Locked'}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
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

export default Insights;
