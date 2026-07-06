import React from 'react';
import { Wind } from 'lucide-react';

const PageLoaderSkeleton = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-center select-none font-sans space-y-6">
      {/* Premium pulsing mascot ring */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-[#6B8E7A]/25 animate-ping duration-1000" />
        <div className="relative w-12 h-12 rounded-full bg-[#6B8E7A] flex items-center justify-center text-white shadow-soft animate-spin duration-700">
          <Wind size={20} />
        </div>
      </div>

      {/* Loading copy details */}
      <div className="space-y-1.5 animate-pulse">
        <h4 className="text-sm font-bold text-[#2F3A3F] dark:text-slate-200">Loading wellness workspace...</h4>
        <span className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold tracking-wider uppercase">Please wait</span>
      </div>
    </div>
  );
};

export default PageLoaderSkeleton;
