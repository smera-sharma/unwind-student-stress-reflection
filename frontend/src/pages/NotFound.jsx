import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-16 text-center relative font-sans select-none">
      {/* Soft background glow circles */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#6B8E7A]/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#89A8B2]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-10 max-w-md w-full shadow-premium relative space-y-6">
        {/* Help Circle Header Icon */}
        <div className="flex justify-center select-none">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 text-[#6B8E7A] rounded-2xl animate-float">
            <HelpCircle size={32} />
          </div>
        </div>

        {/* 404 Header Title */}
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-slate-350 dark:text-slate-600 font-sans tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100">Page Not Found</h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed px-2">
            The page you are looking for doesn't exist, has been moved, or hasn't been implemented yet.
          </p>
        </div>

        {/* Go Home Action */}
        <div className="pt-2 select-none">
          <Link to="/" className="w-full">
            <Button variant="primary" className="w-full uppercase tracking-wider font-extrabold text-xs py-3.5 shadow-soft">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Simple branding footer */}
      <div className="flex items-center gap-1.5 mt-8 text-xs text-[#6B7280] dark:text-slate-500 font-semibold select-none">
        <Wind size={13} />
        <span>Unwind Router</span>
      </div>
    </div>
  );
};

export default NotFound;
