import React, { useState } from 'react';
import { Download, X, Smartphone, ShieldCheck } from 'lucide-react';

const PwaInstallBanner = ({ isInstallable, isInstalled, triggerInstallPrompt }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await triggerInstallPrompt();
    if (success) {
      setDismissed(true);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 mb-6 shadow-md relative overflow-hidden">
      {/* Background visual element */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white text-base">Install FoodBridge NGO App</h4>
              <span className="text-[10px] bg-emerald-400/30 text-emerald-100 px-2 py-0.5 rounded-full font-medium border border-emerald-300/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> PWA Ready
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Install for instant offline access to surplus food claims & faster pickups on your phone or desktop.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 font-semibold text-xs rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Install App
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Dismiss prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
