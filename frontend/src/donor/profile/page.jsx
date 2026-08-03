import React from 'react';
import { Save, BadgeCheck } from 'lucide-react';

const DonorProfilePage = () => {
  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="GreenHarvest"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.045em]">GreenHarvest Market</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Donor
              </span>
            </div>
            <p className="text-xs text-[#64748B]">Supermarket Chain • Member since 2024</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <h2 className="text-base font-extrabold text-[#0F172A] tracking-[-0.045em]">Organization Profile Settings</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase">Organization Name</label>
            <input type="text" defaultValue="GreenHarvest Market" className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase">Contact Email</label>
            <input type="email" defaultValue="donor@greenharvest.org" className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium" />
          </div>
        </div>

        <button className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center gap-2 cursor-pointer active:scale-98">
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </div>
    </div>
  );
};

export default DonorProfilePage;
