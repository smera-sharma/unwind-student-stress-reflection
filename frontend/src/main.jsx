// Intercept localStorage to namespace keys per logged-in user to prevent overlaps
(() => {
  const originalGetItem = window.localStorage.getItem.bind(window.localStorage);
  const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  const userSpecificKeys = [
    'theme',
    'aiReflectionCache',
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
    'chat_',
    'habitTracker_'
  ];

  const getCurrentEmailSuffix = () => {
    const token = originalGetItem('token');
    if (token && token.startsWith("mock_jwt_token_payload_for_")) {
      const email = token.replace("mock_jwt_token_payload_for_", "");
      return `_${email}`;
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
  window.localStorage.setItem = (key, value) => originalSetItem(getNamespacedKey(key), value);
  window.localStorage.removeItem = (key) => originalRemoveItem(getNamespacedKey(key));
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
