// One-time localStorage reset check to clean development state
if (!window.localStorage.getItem('unwind_reset_v1')) {
  window.localStorage.clear();
  window.localStorage.setItem('unwind_reset_v1', 'true');
}

// Intercept localStorage to namespace keys per logged-in user to prevent overlaps
(() => {
  const originalGetItem = window.localStorage.getItem.bind(window.localStorage);
  const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  const userSpecificKeys = [
    'theme',
    'aiReflectionCache',
    'monthlySummaryCache',
    'todayJournal',
    'lastCompanionMessage',
    'reflectionHistory',
    'reflectionStreak',
    'weeklyMood',
    'checkInCount',
    'notificationSettings',
    'reminderTime',
    'luna_intro_dismissed',
    'todayMood',
    'lastNotificationTriggerDate',
    'continue_reading_article_id',
    'unwind_chats',
    'unwind_bookmarks',
    'chat_',
    'habitTracker_'
  ];

  const runCacheMigration = (currentEmail) => {
    if (!currentEmail) return;
    const currentSuffix = `_${currentEmail}`;
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const matchesUserSpecific = userSpecificKeys.some(k => key === k || key.startsWith(k));
      if (matchesUserSpecific) {
        const match = key.match(/_([^@]+@[^@]+)$/);
        if (match) {
          const suffix = `_${match[1]}`;
          if (suffix !== currentSuffix) {
            keysToRemove.push(key);
          }
        }
      }
    }
    
    keysToRemove.forEach(k => {
      originalRemoveItem(k);
    });
  };

  const getCurrentEmailSuffix = () => {
    const token = originalGetItem('token');
    if (!token) return '';
    
    // Decode real JWT token to get email namespace
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadDecoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const parsed = JSON.parse(payloadDecoded);
        if (parsed.sub) {
          return `_${parsed.sub}`;
        }
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    return '';
  };

  const getNamespacedKey = (key) => {
    const isUserSpecific = userSpecificKeys.some(k => key === k || key.startsWith(k));
    if (isUserSpecific) {
      const suffix = getCurrentEmailSuffix();
      return suffix ? `${key}${suffix}` : key;
    }
    return key;
  };

  window.localStorage.getItem = (key) => originalGetItem(getNamespacedKey(key));
  window.localStorage.setItem = (key, value) => {
    if (key === 'token' && value && value !== 'null' && value !== 'undefined') {
      try {
        const parts = value.split('.');
        if (parts.length === 3) {
          const payloadDecoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
          const parsed = JSON.parse(payloadDecoded);
          if (parsed.sub) {
            runCacheMigration(parsed.sub);
          }
        }
      } catch (e) {
        // Ignore
      }
    }
    originalSetItem(getNamespacedKey(key), value);
  };
  window.localStorage.removeItem = (key) => originalRemoveItem(getNamespacedKey(key));

  // Run startup migration if token is preset
  const initialToken = originalGetItem('token');
  if (initialToken && initialToken !== 'null' && initialToken !== 'undefined') {
    try {
      const parts = initialToken.split('.');
      if (parts.length === 3) {
        const payloadDecoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const parsed = JSON.parse(payloadDecoded);
        if (parsed.sub) {
          runCacheMigration(parsed.sub);
        }
      }
    } catch (e) {
      // Ignore
    }
  }
})();

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
