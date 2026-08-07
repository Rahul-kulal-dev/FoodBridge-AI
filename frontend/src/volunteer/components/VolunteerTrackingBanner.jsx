import React, { useState, useEffect } from 'react';
import { Navigation, ShieldAlert, RefreshCw, Radio, CheckCircle2 } from 'lucide-react';
import volunteerLocationTracker from '../../services/volunteerLocationTracker';

/**
 * Live GPS Volunteer Tracking Banner
 * Displays non-intrusive tracking status, accuracy, and permission retry options for volunteers during active deliveries.
 */
const VolunteerTrackingBanner = () => {
  const [trackerState, setTrackerState] = useState({
    status: 'idle',
    position: null,
    errorMessage: '',
  });

  useEffect(() => {
    // Subscribe to status updates from tracker service
    const handleStatusUpdate = (status, data) => {
      setTrackerState({
        status,
        position: data.position || null,
        errorMessage: data.errorMessage || '',
      });
    };

    volunteerLocationTracker.statusCallback = handleStatusUpdate;
    setTrackerState({
      status: volunteerLocationTracker.currentStatus,
      position: volunteerLocationTracker.lastPosition,
      errorMessage: volunteerLocationTracker.errorMessage,
    });

    return () => {
      if (volunteerLocationTracker.statusCallback === handleStatusUpdate) {
        volunteerLocationTracker.statusCallback = null;
      }
    };
  }, []);

  if (trackerState.status === 'idle') {
    return null;
  }

  if (trackerState.status === 'permission_denied' || trackerState.status === 'error') {
    return (
      <div className="hidden bg-amber-50 border border-amber-200 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-soft-card animate-scale-up">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-[#0F172A]">Live GPS Signal Searching</h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Profile Location Fallback Mode Active
              </span>
            </div>
            <p className="text-[#64748B] text-[11px] font-medium mt-0.5">
              Live GPS unavailable. Routing is actively using your saved volunteer operating location coordinates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => volunteerLocationTracker.retryTracking()}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry GPS Access</span>
        </button>
      </div>
    );
  }

  if (trackerState.status === 'tracking') {
    return (
      <div className="hidden bg-emerald-50/80 border border-emerald-200 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-soft-card">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <span className="font-extrabold text-emerald-800 text-xs flex items-center gap-1">
              Live GPS Dispatch Active
            </span>
            {trackerState.position && (
              <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                Accuracy: ±{Math.round(trackerState.position.accuracy)}m • Updating backend every 5s
              </p>
            )}
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
          Tracking Active
        </span>
      </div>
    );
  }

  return null;
};

export default VolunteerTrackingBanner;
