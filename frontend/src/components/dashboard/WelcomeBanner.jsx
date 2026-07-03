import React from 'react';
import Card from '../ui/Card';

const WelcomeBanner = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card variant="shaded" className="p-8 text-left border-none shadow-none" hoverEffect={false}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-unwind-secondary-dark tracking-wide uppercase">
            {formattedDate}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-unwind-text-primary mt-1">
            {getGreeting()}, {user?.fullName || user?.email || 'Student'}
          </h1>
          <p className="text-sm text-unwind-text-secondary mt-2">
            Take a deep breath. Let's check in with yourself.
          </p>
        </div>
        <div className="hidden sm:block text-5xl opacity-80 select-none">
          🌿
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
