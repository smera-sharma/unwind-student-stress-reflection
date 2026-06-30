import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-12 text-center">
      {/* Decorative gradient blur backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-unwind-blue-light to-unwind-lavender-light rounded-full blur-[120px] opacity-40 pointer-events-none -z-10" />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-unwind-mint-light border border-unwind-mint/30 text-unwind-mint-dark text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in shadow-premium">
        ✨ Sprint 1 Foundation Complete
      </div>

      {/* Main Headlines */}
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-800 max-w-3xl leading-[1.15] mb-6">
        Find your academic rhythm with{' '}
        <span className="bg-gradient-to-r from-unwind-blue-dark via-unwind-lavender-dark to-unwind-mint-dark bg-clip-text text-transparent">
          Unwind
        </span>
      </h1>

      <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
        A clean, production-grade foundation scaffolding React + Vite, Tailwind CSS, FastAPI, and SQLAlchemy. Explore structural auth paths and mock integrations.
      </p>

      {/* Hero Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          to="/register"
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-unwind-blue to-unwind-lavender text-slate-800 font-semibold rounded-xl border border-white/50 shadow-glass hover-lift hover:opacity-95"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-premium hover-lift hover:bg-slate-50"
        >
          Sign In
        </Link>
      </div>

      {/* Architecture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-20">
        <div className="glass-panel p-6 rounded-2xl text-left border border-white/40 shadow-premium hover-lift">
          <div className="w-10 h-10 rounded-lg bg-unwind-blue-light/50 flex items-center justify-center text-unwind-blue-dark text-lg font-bold mb-4">
            ⚛️
          </div>
          <h3 className="font-bold text-slate-700 text-lg mb-2">React 19 & Vite</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ultra-fast hot modules replacement, React Router v6 layouts, and environment-driven Axios configuration.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl text-left border border-white/40 shadow-premium hover-lift">
          <div className="w-10 h-10 rounded-lg bg-unwind-lavender-light/50 flex items-center justify-center text-unwind-lavender-dark text-lg font-bold mb-4">
            ⚡
          </div>
          <h3 className="font-bold text-slate-700 text-lg mb-2">FastAPI Backend</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Python-based high performance API framework. Formatted routes, dependency injection, and SQLite ORM models.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl text-left border border-white/40 shadow-premium hover-lift">
          <div className="w-10 h-10 rounded-lg bg-unwind-mint-light/50 flex items-center justify-center text-unwind-mint-dark text-lg font-bold mb-4">
            🔒
          </div>
          <h3 className="font-bold text-slate-700 text-lg mb-2">JWT-Ready Auth</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ready-to-integrate token flow context and protected routes skeleton, facilitating secure scaling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
