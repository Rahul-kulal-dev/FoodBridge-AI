import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

const OfflineIndicator = ({ isOnline }) => {
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowBackOnline(true);
      const timer = setTimeout(() => {
        setShowBackOnline(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showBackOnline) {
    return null;
  }

  return (
    <div className="w-full mb-4">
      {!isOnline ? (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-950 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-700">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-amber-900">You are currently offline</p>
              <p className="text-xs text-amber-800/90">
                Viewing cached food donations. Actions will automatically sync once connection is restored.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-200/60 hover:bg-amber-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-700">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-emerald-900">Connection Restored</p>
            <p className="text-xs text-emerald-800/90">Your internet connection is back. Re-syncing live data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;
