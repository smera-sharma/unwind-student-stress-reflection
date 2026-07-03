import React from 'react';
import { Github, Heart, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-[#E5E7EB]/50 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Block */}
        <div className="md:col-span-2 space-y-4">
          <span className="text-lg font-bold tracking-tight text-[#2F3A3F]">
            Unwind
          </span>
          <p className="text-sm text-[#6B7280] max-w-sm leading-relaxed">
            Your space for mental clarity and academic balance. We leverage modern architecture to help you reflect, understand, and grow.
          </p>
        </div>

        {/* Resources links */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-[#2F3A3F] uppercase tracking-wider">
            Resources
          </h4>
          <ul className="space-y-3">
            <li>
              <a href="#features" className="text-sm text-[#6B7280] hover:text-[#6B8E7A] transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="text-sm text-[#6B7280] hover:text-[#6B8E7A] transition-colors">
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* Contact links */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-[#2F3A3F] uppercase tracking-wider">
            Connect
          </h4>
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-2xl bg-white border border-[#E5E7EB]/50 text-[#6B7280] hover:text-[#6B8E7A] hover:border-[#6B8E7A]/40 transition-all shadow-soft"
              aria-label="GitHub Repository"
            >
              <Github size={16} />
            </a>
            <a
              href="mailto:contact@unwind.edu"
              className="p-2 rounded-2xl bg-white border border-[#E5E7EB]/50 text-[#6B7280] hover:text-[#6B8E7A] hover:border-[#6B8E7A]/40 transition-all shadow-soft"
              aria-label="Email Support"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>

      <hr className="max-w-7xl mx-auto border-[#E5E7EB]/50 my-10" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[#6B7280]">
          &copy; {new Date().getFullYear()} Unwind. All rights reserved.
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
          Crafted with <Heart size={12} className="text-[#6B8E7A] fill-[#6B8E7A]" /> for student wellness
        </span>
      </div>
    </footer>
  );
};

export default Footer;
