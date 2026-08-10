import React, { useState } from 'react';
import { Download, X, Smartphone, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

const PwaInstallBanner = ({ isInstallable, isInstalled, triggerInstallPrompt, title = "Install FoodBridge AI App" }) => {
  const [dismissed, setDismissed] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('foodbridge_pwa_dismissed') === 'true';
  });
  const [showInstructions, setShowInstructions] = useState(false);

  const isAlreadyInstalled =
    isInstalled ||
    (typeof window !== 'undefined' && localStorage.getItem('foodbridge_pwa_installed') === 'true');

  if (isAlreadyInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('foodbridge_pwa_dismissed', 'true');
    }
  };

  const handleInstall = async () => {
    if (isInstallable && triggerInstallPrompt) {
      const success = await triggerInstallPrompt();
      if (success) {
        handleDismiss();
        if (typeof window !== 'undefined') {
          localStorage.setItem('foodbridge_pwa_installed', 'true');
        }
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-xl relative overflow-hidden border border-emerald-400/30">
        {/* Background visual elements */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-24 h-24 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <Smartphone className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-white text-base sm:text-lg tracking-tight">{title}</h4>
                <span className="text-[10px] bg-emerald-400/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-300/40 flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-200" /> PWA Standalone Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Install FoodBridge AI to your home screen or desktop for 1-tap access, offline surplus food tracking, and instant alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstall}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Install PWA App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-emerald-200 hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
              title="Dismiss prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Installation Instructions Modal (for iOS or fallback browsers) */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Info className="w-5 h-5" />
                <span>How to Install FoodBridge App</span>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-slate-600 text-sm">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                <p>On Chrome/Edge Desktop or Android: Click the <strong>Install</strong> icon in your browser URL address bar or menu.</p>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                <p>On iOS Safari: Tap the <strong>Share</strong> button <span className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">⎋</span> at the bottom of Safari, then select <strong>Add to Home Screen (+)</strong>.</p>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallBanner;
