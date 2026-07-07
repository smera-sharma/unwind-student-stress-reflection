import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
    };
    window.addEventListener('unwind-toast', handleToast);
    return () => window.removeEventListener('unwind-toast', handleToast);
  }, []);

  // Clear toast after timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const applyTheme = (t) => {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (t === 'light') {
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
    
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = localStorage.getItem('theme') || 'system';
      if (current === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  return (
    <GlobalErrorBoundary>
      {isOffline && (
        <div className="bg-rose-500 dark:bg-rose-600 text-white text-xs font-bold text-center py-2 px-4 select-none flex items-center justify-center gap-2 z-[9999] relative transition-all duration-300">
          <span>⚠️</span> You appear to be offline. Network requests are disabled until you reconnect.
        </div>
      )}
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[9999] bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-premium text-sm font-semibold flex flex-col gap-1 border border-slate-700/50 min-w-[280px] text-left animate-fade-in transition-all duration-300">
          <div className="flex items-center gap-1.5 text-white font-bold">
            {toast.title}
          </div>
          <div className="text-xs text-slate-300 font-medium leading-normal">
            {toast.message}
          </div>
        </div>
      )}
    </GlobalErrorBoundary>
  );
}

export default App;
