import React from 'react';
import Card from '../ui/Card';

const WeeklyMoodChart = () => {
  // Mock data heights representing mood scores (e.g. out of 100%)
  const chartData = [
    { day: 'Mon', value: 75 },
    { day: 'Tue', value: 50 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 40 },
    { day: 'Fri', value: 65 },
    { day: 'Sat', value: 85 },
    { day: 'Sun', value: 70 },
  ];

  return (
    <Card className="p-8 flex flex-col text-left space-y-6" hoverEffect={false}>
      <div>
        <span className="text-xs font-semibold text-unwind-secondary-dark tracking-wide uppercase block">Analytics</span>
        <h3 className="text-lg font-bold text-unwind-text-primary mt-1">Weekly Progress</h3>
      </div>

      {/* Custom Bar Chart Canvas */}
      <div className="h-44 flex items-end justify-between gap-2 px-2 pt-4 border-b border-[#E5E7EB]">
        {chartData.map((data, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
            {/* The vertical bar */}
            <div 
              style={{ height: `${data.value}%` }} 
              className="w-full max-w-[28px] bg-[#6B8E7A]/60 hover:bg-[#6B8E7A] rounded-t-lg transition-all duration-500 ease-out shadow-soft relative"
            >
              {/* Simple hover tooltip showing mock score */}
              <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-unwind-text-primary text-white text-[10px] px-2 py-0.5 rounded transition-opacity duration-300 pointer-events-none select-none font-sans">
                {data.value}%
              </span>
            </div>
            {/* Label below the bar */}
            <span className="text-xs text-unwind-text-secondary select-none font-medium mt-1">
              {data.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyMoodChart;
