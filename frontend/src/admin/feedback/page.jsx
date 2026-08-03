import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  RefreshCw
} from 'lucide-react';

/**
 * Admin Feedback Logs Page (/admin/feedback)
 * Refactored to match FoodBridge AI design system 1:1
 */
const AdminFeedbackPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultLogs = [
    {
      _id: 'fb-1',
      user: { name: 'Metro City Shelter & Food Bank', role: 'ngo' },
      rating: 5,
      comment: 'Exceptional surplus food redistribution! Delivery was prompt and produce was fresh.',
      createdAt: '2026-08-03T14:20:00Z',
    },
    {
      _id: 'fb-2',
      user: { name: 'GreenHarvest Market', role: 'donor' },
      rating: 5,
      comment: 'Extremely easy to log surplus bakery items. The volunteer picked it up in less than 30 mins!',
      createdAt: '2026-08-02T18:10:00Z',
    },
    {
      _id: 'fb-3',
      user: { name: 'Alex Rivers', role: 'volunteer' },
      rating: 4,
      comment: 'Navigation routes were accurate. Great coordination between donor and shelter.',
      createdAt: '2026-08-01T11:45:00Z',
    },
  ];

  const fetchFeedbackLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/feedback/admin-logs', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (res.ok && data.logs && data.logs.length > 0) {
        setLogs(data.logs);
      } else {
        setLogs(defaultLogs);
      }
    } catch (err) {
      setLogs(defaultLogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackLogs();
  }, []);

  const avgRating = (
    logs.reduce((acc, f) => acc + (f.rating || 5), 0) / (logs.length || 1)
  ).toFixed(1);

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
              System feedback logs submitted by Donors, NGOs, and Volunteers.
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
        {logs.map((item) => {
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
        })}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
