import React from 'react';
import { BadgeCheck, Upload, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

const DonorVerificationPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Donor Verification & Safety Compliance
            </h1>
            <p className="text-xs text-[#64748B]">
              Manage FSSAI compliance, business food safety certification, and tax exemption eligibility.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
          <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verification Status: Level 1 Verified
          </h2>
          <p className="text-xs text-[#334155]">
            Your establishment is verified for surplus food donations under FoodBridge Safety Guidelines.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Food Safety & Hygiene License (FSSAI)', status: 'Approved', date: 'Exp: Dec 2027' },
              { label: 'Business Registration & Tax ID', status: 'Approved', date: 'Verified' },
              { label: 'Good Samaritan Food Donation Agreement', status: 'Active', date: 'Signed' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[#f7f8fb] border border-[#E7EAF0] text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-[#0F172A]">{item.label}</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Document Box */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
          <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            Upload New Compliance Documents
          </h2>
          <p className="text-xs text-[#334155]">
            Upload renewed licenses or lab safety reports for fast automated AI verification.
          </p>

          <div className="border-2 border-dashed border-[#E7EAF0] rounded-xl p-8 text-center space-y-3 hover:border-emerald-500 transition-colors cursor-pointer bg-[#f7f8fb]/50">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Click or drag & drop files here</p>
              <p className="text-[11px] text-[#64748B]">PDF, JPG or PNG up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorVerificationPage;
