import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  PackageCheck,
  Building2,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

/**
 * Update Delivery Status Page (/volunteer/delivery-status)
 */
const UpdateDeliveryStatusPage = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // 0: Assigned, 1: Picked Up, 2: On the Way, 3: Delivered
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    { title: 'Assigned', time: '2:30 PM', desc: 'Order dispatched to volunteer courier' },
    { title: 'Picked Up', time: '3:00 PM', desc: 'Package collected from Grand Palace Hotel' },
    { title: 'On the Way', time: '3:15 PM', desc: 'Transit to Hope Community Kitchen' },
    { title: 'Delivered', time: 'Estimated 3:27 PM', desc: 'Handed over to NGO recipient' },
  ];

  const handleAdvanceStatus = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      if (nextIndex === steps.length - 1) {
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Live Delivery Status Tracker
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Update real-time delivery status for order <span className="font-bold text-[#0F172A]">ASN-701</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-extrabold text-emerald-700">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Status: {steps[currentStepIndex].title}</span>
        </div>
      </div>

      {/* Progress Timeline Interactive Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#0F172A]">Delivery Stage Progress</h2>
          <span className="text-xs text-[#64748B] font-bold">Step {currentStepIndex + 1} of 4</span>
        </div>

        {/* Horizontal Step Indicator Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : isCompleted
                    ? 'bg-slate-50 border-emerald-200 text-[#0F172A]'
                    : 'bg-[#f7f8fb] border-[#E7EAF0] text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B]">{step.time}</span>
                </div>
                <h3 className="text-xs font-extrabold text-[#0F172A]">{step.title}</h3>
                <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[#E7EAF0] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#64748B] block">Current Active Stage</span>
            <span className="text-sm font-extrabold text-[#0F172A]">{steps[currentStepIndex].title}</span>
          </div>

          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={handleAdvanceStatus}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-emerald-btn transition-all flex items-center gap-2 cursor-pointer ${
              currentStepIndex === steps.length - 1
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <span>
              {currentStepIndex === steps.length - 1
                ? 'Delivery Completed'
                : `Update Status to "${steps[currentStepIndex + 1].title}"`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-2xl max-w-md w-full p-6 animate-scale-up text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#0F172A]">Delivery Complete!</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Order <span className="font-bold text-[#0F172A]">ASN-701</span> has been successfully handed over to Hope Community Kitchen.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold">
              +150 Volunteer Impact Points Added to Profile
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-emerald-btn transition-all cursor-pointer"
            >
              Done & Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateDeliveryStatusPage;
