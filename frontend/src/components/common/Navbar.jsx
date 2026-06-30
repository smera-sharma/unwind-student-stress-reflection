import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 w-full shadow-glass border-b border-white/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold bg-gradient-to-r from-unwind-blue-dark via-unwind-lavender-dark to-unwind-mint-dark bg-clip-text text-transparent">
            Unwind
          </span>
          <div className="w-2 h-2 rounded-full bg-unwind-mint animate-pulse" />
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium hover:text-unwind-blue-dark transition-smooth"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-xs bg-unwind-lavender-light text-unwind-lavender-dark px-3 py-1 rounded-full font-medium border border-unwind-lavender/30">
                👤 {user?.fullName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium bg-white hover:bg-unwind-bg border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg hover-lift"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-unwind-blue-dark px-3 py-1.5 transition-smooth"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-gradient-to-r from-unwind-blue to-unwind-lavender text-slate-800 px-4 py-1.5 rounded-lg border border-white/40 shadow-premium hover-lift"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
