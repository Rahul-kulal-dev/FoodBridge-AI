import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E7EAF0] text-[#334155] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E7EAF0]">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-1 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <img src="/apple-touch-icon.png" alt="SavorSurplus" className="w-9 h-9 object-contain rounded-xl shadow-xs" />
              <span className="text-lg font-extrabold text-[#0F172A] tracking-tight">
                Savor<span className="text-green-600">Surplus</span>
              </span>
            </a>
            <p className="text-xs text-[#64748B] leading-relaxed">
              AI-powered surplus food redistribution platform connecting restaurants, NGOs, volunteers, and communities to end food waste.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-500">
              <a href="#" aria-label="X Twitter" className="p-2 rounded-lg bg-slate-100 hover:bg-green-50 hover:text-green-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-slate-100 hover:bg-green-50 hover:text-green-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.49 1.49 0 1 0 0 2.97 1.49 1.49 0 0 0 0-2.97z"/></svg>
              </a>
              <a href="#" aria-label="GitHub" className="p-2 rounded-lg bg-slate-100 hover:bg-green-50 hover:text-green-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-lg bg-slate-100 hover:bg-green-50 hover:text-green-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" className="hover:text-green-600 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-green-600 transition-colors">How it Works</a></li>
              <li><a href="#about" className="hover:text-green-600 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-green-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div>
            <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" className="hover:text-green-600 transition-colors">Smart Food Donation</a></li>
              <li><a href="#features" className="hover:text-green-600 transition-colors">Nearby NGO Matching</a></li>
              <li><a href="#how-it-works" className="hover:text-green-600 transition-colors">Volunteer Logistics</a></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#about" className="hover:text-green-600 transition-colors">Food Safety Standards</a></li>
              <li><a href="#about" className="hover:text-green-600 transition-colors">Donation Guide</a></li>
              <li><a href="#contact" className="hover:text-green-600 transition-colors">Support Hub</a></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#about" className="hover:text-green-600 transition-colors">About SavorSurplus</a></li>
              <li><a href="#contact" className="hover:text-green-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 SavorSurplus. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-green-600 transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-green-600 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
