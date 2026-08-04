import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Building2,
  UserCheck,
  AlertTriangle,
  Lock,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Admin Feedback Logs Page (/admin/feedback)
 * Trust and Safety Monitoring portal viewing all feedback submitted by NGOs for Donors & Volunteers.
 * Fetches real MongoDB records from GET /api/feedback/admin-logs.
 */
const AdminFeedbackPage = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    avgDonorRating: 5.0,
    avgVolunteerRating: 5.0,
    lowRatingCount: 0,
  });
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
        if (data.stats) {
          setStats(data.stats);
        }
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
              Trust & Safety Feedback Logs
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Monitor read-only feedback submitted by NGOs for Donors and Volunteers in MongoDB
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

      {/* Trust & Safety Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              TOTAL FEEDBACK LOGS
            </span>
            <p className="text-2xl font-black text-[#0F172A]">{stats.totalLogs}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              AVG DONOR RATING
            </span>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#0F172A]">{stats.avgDonorRating}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              AVG VOLUNTEER RATING
            </span>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#0F172A]">{stats.avgVolunteerRating}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              SAFETY ALERTS (&lt;3.0★)
            </span>
            <p className={`text-2xl font-black ${stats.lowRatingCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {stats.lowRatingCount}
            </p>
          </div>
          <div className={`p-3 rounded-xl border ${stats.lowRatingCount > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Detailed Feedback Logs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading Trust & Safety feedback logs from database...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-2 shadow-soft-card">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No feedback logs found</h3>
            <p className="text-xs text-slate-400 font-medium">There are currently no feedback logs submitted in the database.</p>
          </div>
        ) : (
          logs.map((item) => {
            const ngoObj = item.ngoId || item.userId || { name: 'NGO Submitter', organizationName: 'NGO Submitter' };
            const donorObj = item.donorId || { name: 'Donor Target', organizationName: 'Donor Target' };
            const volObj = item.volunteerId || null;
            const donationObj = item.donationId || { title: 'Delivered Donation' };

            const dRatings = item.donorRatings || {
              foodQuality: item.rating || 5,
              packaging: item.rating || 5,
              freshness: item.rating || 5,
              hygiene: item.rating || 5,
              overall: item.rating || 5,
            };

            const vRatings = item.volunteerRatings || null;

            return (
              <div
                key={item._id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7EAF0] pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        Log ID: {item._id.substring(item._id.length - 8)}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Read-Only MongoDB Log
                      </span>
                    </div>
                    <h4 className="font-extrabold text-[#0F172A] text-sm sm:text-base mt-1">
                      Donation: {donationObj.title}
                    </h4>
                    <span className="text-[11px] text-[#64748B]">
                      Submitted by NGO: <strong className="text-[#0F172A]">{ngoObj.organizationName || ngoObj.name}</strong> • {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-amber-800">
                        Donor Score: {dRatings.overall} / 5.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Donor Evaluation */}
                  <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#E7EAF0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        Donor: {donorObj.organizationName || donorObj.name}
                      </span>
                      <span className="text-xs font-black text-amber-600">{dRatings.overall} ★</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                      <div>Food Quality: <span className="text-emerald-700">{dRatings.foodQuality} ★</span></div>
                      <div>Packaging: <span className="text-emerald-700">{dRatings.packaging} ★</span></div>
                      <div>Freshness: <span className="text-emerald-700">{dRatings.freshness} ★</span></div>
                      <div>Hygiene: <span className="text-emerald-700">{dRatings.hygiene} ★</span></div>
                    </div>
                    {item.donorComment && (
                      <p className="text-xs text-[#334155] italic pt-1 border-t border-slate-200">
                        "{item.donorComment}"
                      </p>
                    )}
                  </div>

                  {/* Volunteer Evaluation */}
                  {volObj && vRatings ? (
                    <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#E7EAF0] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          Volunteer: {volObj.name}
                        </span>
                        <span className="text-xs font-black text-amber-600">{vRatings.overall} ★</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                        <div>Punctuality: <span className="text-blue-700">{vRatings.punctuality} ★</span></div>
                        <div>Food Handling: <span className="text-blue-700">{vRatings.foodHandling} ★</span></div>
                        <div>Professionalism: <span className="text-blue-700">{vRatings.professionalism} ★</span></div>
                        <div>Overall: <span className="text-blue-700">{vRatings.overall} ★</span></div>
                      </div>
                      {item.volunteerComment && (
                        <p className="text-xs text-[#334155] italic pt-1 border-t border-slate-200">
                          "{item.volunteerComment}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#E7EAF0] flex items-center justify-center text-xs text-slate-500 font-medium">
                      Direct Pickup by NGO (No Courier Assigned)
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
