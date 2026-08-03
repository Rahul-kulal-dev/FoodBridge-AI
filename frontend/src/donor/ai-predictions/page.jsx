import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

const AIPredictionsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              AI Food Surplus Forecast & Demand Matching
            </h1>
            <p className="text-xs text-[#64748B]">
              Machine learning models analyze historical sales patterns, weather, and logistics to predict surplus before it occurs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase">
            <span>Predicted Surplus Risk</span>
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-[-0.04em]">High (86%)</div>
          <p className="text-xs text-[#64748B]">
            120 kg Dairy & Fruits predicted overstock by 8:00 PM tonight due to morning shipment overlap.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase">
            <span>Optimal Pickup Window</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-[-0.04em]">6:30 PM - 7:45 PM</div>
          <p className="text-xs text-[#64748B]">
            Guarantees 100% vehicle dispatch availability across 4 nearby registered shelters.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase">
            <span>Tax Credit Estimator</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-[-0.04em]">$3,420</div>
          <p className="text-xs text-[#64748B]">
            Estimated Section 170(e)(3) corporate tax deduction accumulated this quarter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionsPage;
