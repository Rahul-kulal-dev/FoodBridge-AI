import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Building2, CheckCircle2, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Donor Feedback & Ratings Page (/donor/feedback)
 * Displays rating metrics evaluated by NGOs:
 * - Food Quality
 * - Packaging
 * - Freshness
 * - Hygiene
 * Fetches real database records from GET /api/feedback/donor
 */
const DonorFeedbackPage = () => {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [averages, setAverages] = useState({
    foodQuality: 5,
    packaging: 5,
    freshness: 5,
    hygiene: 5,
    overall: 5,
  });
  const [loading, setLoading] = useState(true);

  const fetchDonorFeedback = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/feedback/donor'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.feedbacks) {
        setFeedbacks(data.feedbacks);
        if (data.averages) {
          setAverages(data.averages);
        }
      }
    } catch (err) {
      console.warn('Error fetching donor feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorFeedback();
  }, [token]);

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-[-0.04em]">
              Recipient Feedback & Donor Quality Ratings
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Verified food quality ratings and reviews submitted by partner NGOs after donation delivery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black text-emerald-800">
            MongoDB Verified Feedback Logs
          </span>
        </div>
      </div>

      {/* Category Score Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            OVERALL RATING
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-[#0F172A]">{averages.overall}</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            FOOD QUALITY
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-emerald-700">{averages.foodQuality}</span>
            <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            PACKAGING
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-emerald-700">{averages.packaging}</span>
            <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            FRESHNESS
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-emerald-700">{averages.freshness}</span>
            <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            HYGIENE
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-emerald-700">{averages.hygiene}</span>
            <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading recipient feedback from database...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-2 shadow-soft-card">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-extrabold text-[#0F172A]">No NGO Feedback Reviews Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Once recipient NGOs inspect and complete delivery of your surplus food donations, their feedback ratings will display here.
            </p>
          </div>
        ) : (
          feedbacks.map((fb) => {
            const ngoObj = fb.ngoId || { name: 'Partner NGO', organizationName: 'Verified NGO' };
            const donationObj = fb.donationId || { title: 'Food Donation' };
            const dRatings = fb.donorRatings || {
              foodQuality: fb.rating || 5,
              packaging: fb.rating || 5,
              freshness: fb.rating || 5,
              hygiene: fb.rating || 5,
              overall: fb.rating || 5,
            };

            return (
              <div
                key={fb._id}
                className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7EAF0] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F172A]">
                        {ngoObj.organizationName || ngoObj.name}
                      </h3>
                      <span className="text-[11px] text-[#64748B]">
                        Donation: <strong className="text-[#0F172A]">{donationObj.title}</strong> • {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shrink-0">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-black text-amber-800">
                      Overall Score: {dRatings.overall || 5} / 5.0
                    </span>
                  </div>
                </div>

                {/* Rating Categories Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-[#E7EAF0]">
                  <div>Food Quality: <span className="text-emerald-700 font-extrabold">{dRatings.foodQuality} ★</span></div>
                  <div>Packaging: <span className="text-emerald-700 font-extrabold">{dRatings.packaging} ★</span></div>
                  <div>Freshness: <span className="text-emerald-700 font-extrabold">{dRatings.freshness} ★</span></div>
                  <div>Hygiene: <span className="text-emerald-700 font-extrabold">{dRatings.hygiene} ★</span></div>
                </div>

                {(fb.donorComment || fb.comment) && (
                  <p className="text-xs text-[#334155] italic bg-[#f8fafc] p-3 rounded-xl border border-[#E7EAF0]">
                    "{fb.donorComment || fb.comment}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DonorFeedbackPage;

