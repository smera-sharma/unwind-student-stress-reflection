import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wind, Menu, X, User, LogOut } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleGlobalKeydown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setIsOpen(false);
      }
    };
    if (dropdownOpen || isOpen) {
      window.addEventListener('keydown', handleGlobalKeydown);
    }
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [dropdownOpen, isOpen]);

  const isActive = (item) => {
    if (item.isAnchor) {
      return pathname === '/' && hash === item.target;
    }
    return pathname === item.path;
  };

  const linkClass = (item) => {
    const active = isActive(item);
    return `text-xs transition-all duration-300 px-3.5 py-1.5 rounded-full font-bold select-none cursor-pointer inline-block ${
      active
        ? 'bg-[#E2EBE5] dark:bg-[#A7C4A0]/10 text-[#587665] dark:text-[#A7C4A0]'
        : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#2F3A3F] dark:hover:text-[#F8FAFC]'
    }`;
  };

  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/#features', isAnchor: true, target: '#features' },
    { label: 'About', path: '/#about', isAnchor: true, target: '#about' },
  ];

  const privateLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Insights', path: '/insights' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Resources', path: '/resources' },
    { label: 'Luna', path: '/luna' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAF9F6]/80 dark:bg-[#1E293B]/80 border-b border-[#E5E7EB]/50 dark:border-white/10 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8.5 h-8.5 rounded-xl bg-[#6B8E7A] flex items-center justify-center text-white shadow-soft transition-transform duration-300 group-hover:scale-[1.05]">
            <Wind size={16} />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#2F3A3F] dark:text-[#F8FAFC]">
            Unwind
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {publicLinks.map((item, index) => (
            item.isAnchor ? (
              <a key={index} href={item.target} className={linkClass(item)}>
                {item.label}
              </a>
            ) : (
              <Link key={index} to={item.path} className={linkClass(item)}>
                {item.label}
              </Link>
            )
          ))}
          {isAuthenticated && (
            <>
              {privateLinks.map((item, index) => (
                <Link key={index} to={item.path} className={linkClass(item)}>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 relative">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="User navigation menu"
                className="inline-flex items-center gap-1.5 text-xs bg-white border border-[#E5E7EB] text-[#2F3A3F] px-3.5 py-1.5 rounded-xl font-bold transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-soft"
                type="button"
              >
                {user?.profilePicture ? (
                  <span className="text-sm select-none mr-0.5">{user.profilePicture}</span>
                ) : (
                  <User size={12} className="text-[#6B8E7A]" />
                )}
                {user?.displayName || user?.fullName || user?.email}
              </button>
              
              {dropdownOpen && (
                <div 
                  role="menu"
                  aria-label="User links"
                  className="absolute right-0 top-10 w-48 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-premium py-2.5 z-50 text-left animate-fade-in select-none"
                >
                  <Link 
                    to="/dashboard" 
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#2F3A3F] dark:text-slate-200 hover:bg-[#FAF9F6] dark:hover:bg-[#243244] font-bold transition-colors"
                  >
                    🏠 Dashboard
                  </Link>
                  <Link 
                    to="/insights" 
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#2F3A3F] dark:text-slate-200 hover:bg-[#FAF9F6] dark:hover:bg-[#243244] font-bold transition-colors"
                  >
                    📊 Insights
                  </Link>
                  <Link 
                    to="/calendar" 
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#2F3A3F] dark:text-slate-200 hover:bg-[#FAF9F6] dark:hover:bg-[#243244] font-bold transition-colors"
                  >
                    📅 Calendar
                  </Link>
                  <Link 
                    to="/profile" 
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#2F3A3F] dark:text-slate-200 hover:bg-[#FAF9F6] dark:hover:bg-[#243244] font-bold transition-colors"
                  >
                    👤 Profile & Settings
                  </Link>
                  <hr className="border-[#E5E7EB] dark:border-white/10 my-1" />
                  <button 
                    onClick={handleLogout}
                    role="menuitem"
                    className="w-full text-left block px-4 py-2 text-xs text-[#DC6B6B] hover:bg-[#FAF9F6] dark:hover:bg-[#243244] font-bold transition-colors"
                    type="button"
                  >
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="!px-4 !py-2">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="!px-4 !py-2">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
          className="md:hidden p-1.5 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-900 text-[#2F3A3F] dark:text-slate-200 transition-colors focus:outline-none"
          type="button"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-[#FAF9F6] dark:bg-[#0F172A] border-b border-[#E5E7EB]/50 dark:border-white/10 px-6 py-6 shadow-soft flex flex-col gap-3 select-none transition-colors duration-300 text-left">
          {publicLinks.map((item, index) => (
            item.isAnchor ? (
              <a
                key={index}
                href={item.target}
                onClick={() => setIsOpen(false)}
                className={linkClass(item)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={linkClass(item)}
              >
                {item.label}
              </Link>
            )
          ))}
          {isAuthenticated && (
            <>
              {privateLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={linkClass(item)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={linkClass({ path: '/profile' })}
              >
                Profile & Settings
              </Link>
            </>
          )}

          <hr className="border-[#E5E7EB]/50 dark:border-white/10 my-2" />

          <div className="flex flex-col gap-3 pt-1">
            {isAuthenticated ? (
              <>
                <div className="text-sm font-bold text-[#2F3A3F] dark:text-slate-200 px-2 flex items-center gap-2">
                  <User size={14} className="text-[#6B8E7A]" />
                  {user?.displayName || user?.fullName || user?.email}
                </div>
                <Button onClick={handleLogout} variant="outline" className="w-full justify-center gap-2">
                  <LogOut size={14} />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
