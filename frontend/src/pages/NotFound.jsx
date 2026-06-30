import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-12 text-center relative">
      {/* Decorative backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-unwind-blue-light to-unwind-mint-light rounded-full blur-[70px] opacity-25 pointer-events-none -z-10" />

      <h1 className="text-9xl font-extrabold text-slate-300 tracking-widest">404</h1>
      <div className="bg-unwind-lavender text-slate-800 px-3 py-1 text-sm rounded-lg font-semibold -rotate-3 -translate-y-6 shadow-premium">
        Page Not Found
      </div>
      <p className="text-slate-500 mt-4 max-w-sm">
        The route you are trying to view does not exist yet. It may be part of a future implementation sprint.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover-lift shadow-premium hover:bg-slate-50"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
