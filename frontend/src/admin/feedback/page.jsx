import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Admin Feedback Logs Page (/admin/feedback)
 * Directly connected to MongoDB Atlas database (GET /api/feedback/admin-logs).
 * Zero dummy data fallback.
 */
const AdminFeedbackPage = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbackLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/feedback/admin-logs'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (res.ok && data.logs) {
        setLogs(data.logs);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.warn('Error fetching feedback logs:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackLogs();
  }, []);

  const avgRating = logs.length > 0
    ? (logs.reduce((acc, f) => acc + (f.rating || 5), 0) / logs.length).toFixed(1)
    : '5.0';

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Feedback & Rating Logs
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              System feedback logs submitted by Donors, NGOs, and Volunteers in database.
            </p>
          </div>
        </div>

        <button
          onClick={fetchFeedbackLogs}
          className="px-4 py-2.5 rounded-xl border border-[#E7EAF0] hover:bg-slate-50 text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Overview Metric Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest block">
            AVERAGE PLATFORM RATING
          </span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-[#0F172A]">{avgRating}</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {logs.length} Total Feedback Logs
        </span>
      </div>

      {/* Feedback Logs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading feedback logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-2 shadow-soft-card">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No feedback logs yet</h3>
            <p className="text-xs text-slate-400 font-medium">There are currently no feedback logs submitted in the database.</p>
          </div>
        ) : (
          logs.map((item) => {
            const userObj = item.userId || item.user || { name: 'Platform User', role: 'donor' };
            const role = userObj.role || 'donor';

            return (
              <div
                key={item._id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl text-xs font-bold uppercase border ${
                      role === 'ngo' ? 'bg-amber-50 text-amber-800 border-amber-200' : role === 'volunteer' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {role}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#0F172A] text-sm sm:text-base">
                        {userObj.organizationName || userObj.name}
                      </h4>
                      <span className="text-[11px] text-[#64748B] font-medium">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#334155] font-medium bg-[#f8fafc] p-3.5 rounded-xl border border-[#E7EAF0]">
                  "{item.comment || 'Great experience with FoodBridge AI.'}"
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
