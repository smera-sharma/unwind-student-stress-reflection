const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/50 bg-slate-50/50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-sm font-semibold text-slate-700">Unwind Project Foundation</span>
          <p className="text-xs text-slate-500 mt-1">A production-ready base project structure.</p>
        </div>
        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Unwind. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
