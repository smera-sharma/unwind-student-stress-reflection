export const checkNotificationPermission = () => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  const permission = await Notification.requestPermission();
  return permission;
};

export const triggerNotification = (title, options = {}) => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  // Check Quiet Hours
  const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
  if (settings.quietHoursEnabled) {
    const now = new Date();
    const curTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const start = settings.quietHoursStart || '22:00';
    const end = settings.quietHoursEnd || '08:00';
    
    // Check if current time is within quiet range
    if (start <= end) {
      if (curTimeStr >= start && curTimeStr <= end) return;
    } else {
      // quiet range wraps around midnight (e.g. 22:00 to 08:00)
      if (curTimeStr >= start || curTimeStr <= end) return;
    }
  }

  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  } catch (e) {
    console.warn("Could not display browser notification:", e);
  }
};

export const startNotificationScheduler = () => {
  const checkAndTrigger = () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Only notify logged-in sessions
    
    const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    if (settings.dailyReminders === false) return; // Reminders turned off
    
    const savedTime = localStorage.getItem('reminderTime') || '20:00';
    
    const now = new Date();
    const curHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (curHourMin === savedTime) {
      const todayKey = now.toDateString();
      const lastTriggered = localStorage.getItem('lastNotificationTriggerDate');
      
      if (lastTriggered !== todayKey) {
        localStorage.setItem('lastNotificationTriggerDate', todayKey);
        
        const todayMood = localStorage.getItem('todayMood');
        const todayJournal = localStorage.getItem('todayJournal');
        
        if (!todayMood) {
          triggerNotification('🌿 Unwind: Daily Check-in', {
            body: "We haven't heard from you today. Take a moment to log your mood.",
          });
        } else if (!todayJournal) {
          triggerNotification('📖 Unwind: Write Reflection', {
            body: "Your journal is waiting whenever you're ready to reflect.",
          });
        }
      }
    }
  };

  // Run immediately on load and then check every 60 seconds
  checkAndTrigger();
  const intervalId = setInterval(checkAndTrigger, 60000);
  return () => clearInterval(intervalId);
};
