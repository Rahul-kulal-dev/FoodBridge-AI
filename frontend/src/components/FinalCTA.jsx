import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck } from 'lucide-react';

export default function FinalCTA({ onOpenDonateModal }) {
  return (
    <section className="py-20 bg-[#F7F8FB] border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dark Container Card */}
        <div className="relative bg-[#0F172A] rounded-3xl p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl border border-slate-800 text-center">
          
          {/* Ambient Glow Blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            {/* Heading */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Every Meal Saved Creates Another <span className="text-emerald-400">Smile.</span>
            </h2>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect your food business or NGO with FoodBridge AI today. Together, we can redistribute thousands of surplus meals every month.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onOpenDonateModal('register')}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-emerald-btn transition-all duration-200 flex items-center justify-center gap-2.5 text-base cursor-pointer active:scale-95"
              >
                <span>Join FoodBridge AI</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#about"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-xs transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <span>Learn More</span>
              </a>
            </div>

            {/* Fine print */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Onboarding & Integration
              </span>
              <span>•</span>
              <span>No Credit Card Required</span>
              <span>•</span>
              <span>Tax Deductible Receipts Included</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
