import React, { Component } from 'react';
import { Wind, AlertTriangle, RefreshCw, Home } from 'lucide-react';

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary caught a fatal runtime error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-50 via-unwind-bg to-unwind-blue-light/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 text-center select-none font-sans">
          {/* Decorative background blur shapes */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-rose-200/10 dark:bg-rose-950/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-200/10 dark:bg-amber-950/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-10 max-w-lg w-full shadow-premium relative space-y-6">
            {/* Mascot Icon Header */}
            <div className="flex justify-center select-none">
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 rounded-2xl animate-pulse">
                <AlertTriangle size={32} />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2.5">
              <h1 className="text-2xl font-bold text-[#2F3A3F] dark:text-slate-100">Something went wrong</h1>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed">
                Unwind encountered an unexpected runtime error. We've logged the incident and are ready to help you recover your session.
              </p>
            </div>

            {/* Recovery actions row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 select-none">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#6B8E7A] hover:bg-[#587665] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-soft hover:scale-[1.02] active:scale-[0.98] focus:outline-none cursor-pointer"
                type="button"
              >
                <RefreshCw size={13} /> Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#2F3A3F] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-soft hover:scale-[1.02] active:scale-[0.98] focus:outline-none cursor-pointer"
                type="button"
              >
                <Home size={13} /> Go Home
              </button>
            </div>
          </div>

          {/* Simple branding footer */}
          <div className="flex items-center gap-1.5 mt-8 text-xs text-[#6B7280] dark:text-slate-500 font-semibold select-none">
            <Wind size={13} />
            <span>Unwind Client Engine</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
