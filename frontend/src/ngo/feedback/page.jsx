import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Building2,
  UserCheck,
  Send,
  ThumbsUp,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * NGO Feedback & Rating Page (/ngo/feedback)
 * Connects directly to MongoDB database for rating donors, volunteers, and displaying history.
 */
const NgoFeedbackPage = () => {
  const { token } = useAuth();

  const [donorRating, setDonorRating] = useState(5);
  const [donorReview, setDonorReview] = useState('');
  const [selectedDonorId, setSelectedDonorId] = useState('');

  const [volunteerRating, setVolunteerRating] = useState(5);
  const [volunteerReview, setVolunteerReview] = useState('');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');

  const [donorsList, setDonorsList] = useState([]);
  const [volunteersList, setVolunteersList] = useState([]);
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [historyRes, feedbackRes] = await Promise.all([
        fetch(getApiUrl('/api/ngo/donations/history'), { headers }),
        fetch(getApiUrl('/api/feedback'), { headers }),
      ]);

      const historyData = await historyRes.json();
      const feedbackData = await feedbackRes.json();

      if (historyRes.ok && historyData.donations) {
        const uniqueDonors = [];
        const uniqueVolunteers = [];
        const donorIds = new Set();
        const volIds = new Set();

        historyData.donations.forEach((item) => {
          if (item.donorId && !donorIds.has(item.donorId._id)) {
            donorIds.add(item.donorId._id);
            uniqueDonors.push(item.donorId);
          }
          if (item.volunteerId && !volIds.has(item.volunteerId._id)) {
            volIds.add(item.volunteerId._id);
            uniqueVolunteers.push(item.volunteerId);
          }
        });

        setDonorsList(uniqueDonors);
        setVolunteersList(uniqueVolunteers);

        if (uniqueDonors.length > 0) setSelectedDonorId(uniqueDonors[0]._id);
        if (uniqueVolunteers.length > 0) setSelectedVolunteerId(uniqueVolunteers[0]._id);
      }

      if (feedbackRes.ok && feedbackData.feedbacks) {
        setSubmittedFeedback(feedbackData.feedbacks);
      } else {
        setSubmittedFeedback([]);
      }
    } catch (err) {
      console.warn('Error fetching feedback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [token]);

  const handleSubmitDonorFeedback = async (e) => {
    e.preventDefault();
    if (!donorReview.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/feedback'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetId: selectedDonorId || undefined,
          targetType: 'Donor',
          rating: donorRating,
          comment: donorReview,
        }),
      });

      if (res.ok) {
        setDonorReview('');
        setShowSuccess(true);
        fetchFeedbackData();
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitVolunteerFeedback = async (e) => {
    e.preventDefault();
    if (!volunteerReview.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/feedback'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetId: selectedVolunteerId || undefined,
          targetType: 'Volunteer',
          rating: volunteerRating,
          comment: volunteerReview,
        }),
      });

      if (res.ok) {
        setVolunteerReview('');
        setShowSuccess(true);
        fetchFeedbackData();
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Donor & Volunteer Feedback
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Rate donors on food freshness and packaging, and rate volunteer couriers directly in MongoDB
          </p>
        </div>

        {showSuccess && (
          <div className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2 animate-scale-up">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rating Saved to Database!</span>
          </div>
        )}
      </div>

      {/* Split Rating Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Rate Donor */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Rate Food Donor</h2>
              <p className="text-xs text-[#64748B]">Evaluate food quality and packaging</p>
            </div>
          </div>

          <form onSubmit={handleSubmitDonorFeedback} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Select Donor</label>
              <select
                value={selectedDonorId}
                onChange={(e) => setSelectedDonorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
              >
                {donorsList.length === 0 ? (
                  <option value="">General Food Donor</option>
                ) : (
                  donorsList.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.organizationName || d.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Rating Score</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setDonorRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= donorRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-amber-600 ml-2">{donorRating} / 5</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Review Comments</label>
              <textarea
                rows="3"
                placeholder="Comment on food quality, temperature control, and packaging cleanliness..."
                value={donorReview}
                onChange={(e) => setDonorReview(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E7EAF0] text-xs focus:outline-emerald-500 bg-[#f7f8fb]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Donor Review</span>
            </button>
          </form>
        </div>

        {/* Section 2: Rate Volunteer */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Rate Volunteer Courier</h2>
              <p className="text-xs text-[#64748B]">Evaluate transit speed and handling</p>
            </div>
          </div>

          <form onSubmit={handleSubmitVolunteerFeedback} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Select Volunteer</label>
              <select
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
              >
                {volunteersList.length === 0 ? (
                  <option value="">General Volunteer Courier</option>
                ) : (
                  volunteersList.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name} ({v.phone || 'Courier'})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Rating Score</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setVolunteerRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= volunteerRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-amber-600 ml-2">{volunteerRating} / 5</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Review Comments</label>
              <textarea
                rows="3"
                placeholder="Comment on courier professionalism, punctuality, and handling..."
                value={volunteerReview}
                onChange={(e) => setVolunteerReview(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E7EAF0] text-xs focus:outline-emerald-500 bg-[#f7f8fb]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Volunteer Review</span>
            </button>
          </form>
        </div>
      </div>

      {/* Previous Ratings History Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <h2 className="text-base font-extrabold text-[#0F172A]">Submitted Feedback History</h2>

        {loading ? (
          <div className="p-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading feedback history from database...</p>
          </div>
        ) : submittedFeedback.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium">
            No feedback history found in database. Submit your first review above!
          </div>
        ) : (
          <div className="divide-y divide-[#E7EAF0]">
            {submittedFeedback.map((fb) => (
              <div key={fb._id} className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        fb.targetType === 'Donor'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {fb.targetType || 'Service'} Review
                    </span>
                    <h3 className="text-xs font-extrabold text-[#0F172A]">
                      {fb.targetId?.name || fb.targetId?.organizationName || 'Partner'}
                    </h3>
                  </div>

                  <p className="text-xs text-[#334155] font-medium">{fb.comment}</p>
                  <span className="text-[10px] text-[#64748B] block pt-0.5">
                    {fb.createdAt ? new Date(fb.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-extrabold text-amber-700">{fb.rating} / 5</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoFeedbackPage;
