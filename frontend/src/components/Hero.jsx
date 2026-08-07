import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  ShieldCheck,
  ChevronRight,
  Apple,
  Salad,
  Download,
  Smartphone
} from 'lucide-react';
import usePwaStatus from '../ngo/hooks/usePwaStatus';

export default function Hero({ onOpenDonateModal }) {
  const { isInstallable, isInstalled, triggerInstallPrompt } = usePwaStatus();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Background Slate Grid + Soft Radial Wash */}
      <div className="absolute inset-0 bg-grid-slate opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-50/70 via-emerald-50/20 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Background Accent Elements */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-10 hidden lg:block opacity-20 text-emerald-600 pointer-events-none"
      >
        <Salad className="w-16 h-16" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-20 right-12 hidden lg:block opacity-20 text-amber-500 pointer-events-none"
      >
        <Apple className="w-16 h-16" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column - Hero Content */}
          <div className="lg:col-span-6 space-y-7 text-left">

            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 border border-[#E7EAF0] shadow-soft-card text-xs sm:text-sm font-semibold text-[#0F172A]"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
                <ShieldCheck className="w-3 h-3 text-white" />
              </span>
              <span>AI-Powered Smart Food Redistribution</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-[-0.04em] leading-[1.05]"
            >
              Transform Surplus Food into <span className="highlight-green-swipe text-emerald-600">Hope.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-xl font-normal"
            >
              FoodBridge AI connects restaurants, NGOs, volunteers, and communities through AI-powered surplus food redistribution reducing food waste while feeding those in need.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-2"
            >
              <button
                onClick={() => onOpenDonateModal('donor')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-emerald-btn transition-all duration-200 flex items-center justify-center gap-2.5 text-base cursor-pointer active:scale-95"
              >
                <span>Start Donating</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {!isInstalled && (
                <button
                  onClick={triggerInstallPrompt}
                  className="bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 text-base cursor-pointer active:scale-95 border border-emerald-400/30"
                >
                  <Smartphone className="w-5 h-5 text-emerald-200" />
                  <span>Install PWA App</span>
                </button>
              )}

              <a
                href="#how-it-works"
                className="bg-white hover:bg-slate-50 border border-[#E7EAF0] text-[#0F172A] font-semibold px-6 py-3.5 rounded-xl shadow-soft-card transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <Play className="w-4 h-4 fill-slate-700 text-slate-700" />
                <span>Explore Platform</span>
              </a>
            </motion.div>

            {/* Social Proof / Trust metrics */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 border-t border-[#E7EAF0] flex flex-wrap items-center gap-6 text-sm text-[#64748B]"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">FB</div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">NG</div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">RT</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">VL</div>
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <span>★★★★★</span>
                    <span className="text-[#0F172A] font-semibold">4.9/5</span>
                  </div>
                  <span className="text-[#64748B]">Trusted by 500+ Partner NGOs</span>
                </div>
              </div>

              <div className="h-6 w-px bg-[#E7EAF0] hidden sm:block" />

              <div className="flex items-center gap-2 text-xs text-[#334155] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Quality Check</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column - Hero Platform Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#E7EAF0] shadow-soft-hover group bg-slate-50">
              <img
                src="/hero.png"
                alt="FoodBridge AI Surplus Food Redistribution Platform"
                className="w-full h-auto object-cover rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
