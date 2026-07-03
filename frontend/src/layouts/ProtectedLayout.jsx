import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Premium loading screen skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-unwind-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-unwind-blue-light border-t-unwind-blue-dark animate-spin" />
          <span className="text-sm font-medium text-slate-500 animate-pulse">
            Connecting securely...
          </span>
        </div>
      </div>
    );
  }

  // Redirect to Login if not authenticated (JWT-ready route protection)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-50 via-unwind-bg to-unwind-lavender-light/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
        <div className="bg-white/40 border border-white/20 p-2 rounded-xl mb-6 text-xs text-unwind-blue-dark dark:bg-slate-800/40 dark:border-slate-700/40 dark:text-slate-300 flex items-center gap-2">
          <span>🔒</span>
          <span>You are viewing a secure session. JWT headers will automatically attach to requests.</span>
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
