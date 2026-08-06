import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Building2,
  UserCheck,
  Send,
  Loader2,
  AlertCircle,
  PackageCheck,
  ShieldCheck,
  Lock,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * NGO Feedback & Rating Page (/ngo/feedback)
 * Enforces NGO Feedback Business Rules:
 * 1. NGO can submit feedback ONLY after donation status is Delivered.
 * 2. NGO rates Donor for: Food Quality, Packaging, Freshness, Hygiene.
 * 3. NGO rates Volunteer for: Punctuality, Food Handling, Professionalism.
 * 4. Only Donor & Volunteer involved in selected delivered donation are target-locked.
 * 5. Only one feedback per completed donation allowed.
 * 6. Submitted feedback becomes read-only and stored in MongoDB Atlas.
 */
const NgoFeedbackPage = () => {
  const { token } = useAuth();

  const [eligibleDonations, setEligibleDonations] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Donor ratings
  const [foodQuality, setFoodQuality] = useState(5);
  const [packaging, setPackaging] = useState(5);
  const [freshness, setFreshness] = useState(5);
  const [hygiene, setHygiene] = useState(5);
  const [donorComment, setDonorComment] = useState('');

  // Volunteer ratings
  const [punctuality, setPunctuality] = useState(5);
  const [foodHandling, setFoodHandling] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [volunteerComment, setVolunteerComment] = useState('');

  const [overallComment, setOverallComment] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchFeedbackData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [eligibleRes, feedbackRes] = await Promise.all([
        fetch(getApiUrl('/api/feedback/eligible-donations'), { headers }),
        fetch(getApiUrl('/api/feedback/ngo'), { headers }),
      ]);

      const eligibleData = await eligibleRes.json();
      const feedbackData = await feedbackRes.json();

      if (eligibleRes.ok && eligibleData.donations) {
        setEligibleDonations(eligibleData.donations);
        if (eligibleData.donations.length > 0) {
          const firstUnsubmitted = eligibleData.donations.find((d) => !d.hasFeedback) || eligibleData.donations[0];
          setSelectedDonationId(firstUnsubmitted._id);
          setSelectedDonation(firstUnsubmitted);
        }
      }

      if (feedbackRes.ok && feedbackData.feedbacks) {
        setSubmittedFeedbacks(feedbackData.feedbacks);
      }
    } catch (err) {
      console.error('Error fetching feedback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [token]);

  const handleDonationChange = (e) => {
    const dId = e.target.value;
    setSelectedDonationId(dId);
    const found = eligibleDonations.find((item) => item._id === dId);
    setSelectedDonation(found || null);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDonationId || !selectedDonation) {
      setErrorMessage('Please select a delivered donation to submit feedback.');
      return;
    }

    if (selectedDonation.hasFeedback) {
      setErrorMessage('Feedback has already been submitted for this completed donation.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      const payload = {
        donationId: selectedDonationId,
        donorRatings: {
          foodQuality,
          packaging,
          freshness,
          hygiene,
        },
        donorComment,
        volunteerRatings: selectedDonation.volunteer
          ? {
            punctuality,
            foodHandling,
            professionalism,
          }
          : undefined,
        volunteerComment,
        overallComment: overallComment || donorComment,
      };

      const res = await fetch(getApiUrl('/api/feedback'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccess(true);
        setDonorComment('');
        setVolunteerComment('');
        setOverallComment('');
        await fetchFeedbackData();
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        setErrorMessage(data.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
      setErrorMessage('A network error occurred while submitting feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = (label, value, onChange) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-[#E7EAF0]">
      <span className="text-xs font-bold text-[#0F172A]">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={selectedDonation?.hasFeedback}
            onClick={() => onChange(star)}
            className="p-1 cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-5 h-5 ${star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
                }`}
            />
          </button>
        ))}
        <span className="text-xs font-extrabold text-amber-600 ml-1 min-w-[28px] text-right">
          {value}.0
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-[-0.03em]">
              NGO Feedback & Quality Rating Portal
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Rate donors and volunteers for completed food deliveries
            </p>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-scale-up shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Feedback saved successfully!</span>
          </div>
        )}
      </div>

      {/* Business Rules Info Strip */}
      <div className="bg-emerald-50/80 text-emerald-950 border border-emerald-200/80 p-3.5 rounded-2xl shadow-soft-card flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-xs font-medium text-emerald-950">
          Feedback is enabled only for <span className="text-emerald-700 font-extrabold">Delivered</span> donations (1 review per delivery).
        </p>
      </div>

      {/* Main Feedback Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-6">
        <div className="border-b border-[#E7EAF0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-600" />
              <span>Select Delivered Donation</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Select a delivered donation to submit feedback
            </p>
          </div>

          {selectedDonation?.hasFeedback && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <Lock className="w-3.5 h-3.5" />
              Feedback Already Submitted (Read-Only)
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl border border-rose-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading eligible delivered donations...</p>
          </div>
        ) : eligibleDonations.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#0F172A]">No Delivered Donations Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No delivered donations available for feedback yet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation Selector */}
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5">
                Delivered Donation Dropdown
              </label>
              <select
                value={selectedDonationId}
                onChange={handleDonationChange}
                className="w-full px-4 py-3 rounded-xl border border-[#E7EAF0] text-xs font-extrabold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 shadow-xs"
              >
                {eligibleDonations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.title} ({d.foodType} - {d.quantity} {d.unit}) • Donor: {d.donor?.organizationName || d.donor?.name || 'Donor'} {d.volunteer ? `| Volunteer: ${d.volunteer.name}` : ''} {d.hasFeedback ? ' [FEEDBACK SUBMITTED]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Locking Details Strip */}
            {selectedDonation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Target Food Donor</span>
                    <p className="text-xs font-black text-[#0F172A]">
                      {selectedDonation.donor?.organizationName || selectedDonation.donor?.name || 'Verified Donor'}
                    </p>
                    <span className="text-[11px] text-[#64748B]">{selectedDonation.donor?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Target Volunteer Courier</span>
                    {selectedDonation.volunteer ? (
                      <>
                        <p className="text-xs font-black text-[#0F172A]">{selectedDonation.volunteer.name}</p>
                        <span className="text-[11px] text-[#64748B]">{selectedDonation.volunteer.phone || selectedDonation.volunteer.email}</span>
                      </>
                    ) : (
                      <p className="text-xs font-bold text-slate-500 italic">Direct NGO Pickup (No Courier Assigned)</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Split Rating Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section 1: Donor Rating Criteria */}
              <div className="p-5 rounded-2xl border border-[#E7EAF0] bg-white space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#E7EAF0]">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A]">Rate Food Donor</h3>
                    <p className="text-[11px] text-[#64748B]">Quality, packaging, freshness & hygiene</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {renderStarSelector('Food Quality', foodQuality, setFoodQuality)}
                  {renderStarSelector('Packaging', packaging, setPackaging)}
                  {renderStarSelector('Freshness', freshness, setFreshness)}
                  {renderStarSelector('Hygiene', hygiene, setHygiene)}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1">Donor Comments</label>
                  <textarea
                    rows="2"
                    disabled={selectedDonation?.hasFeedback}
                    placeholder="Comment on food quality, temperature control, and packaging hygiene..."
                    value={donorComment}
                    onChange={(e) => setDonorComment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E7EAF0] text-xs focus:outline-emerald-500 bg-[#f7f8fb] disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Section 2: Volunteer Rating Criteria */}
              <div className="p-5 rounded-2xl border border-[#E7EAF0] bg-white space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#E7EAF0]">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A]">Rate Volunteer Courier</h3>
                    <p className="text-[11px] text-[#64748B]">Punctuality, food handling & professionalism</p>
                  </div>
                </div>

                {selectedDonation?.volunteer ? (
                  <>
                    <div className="space-y-2.5">
                      {renderStarSelector('Punctuality', punctuality, setPunctuality)}
                      {renderStarSelector('Food Handling', foodHandling, setFoodHandling)}
                      {renderStarSelector('Professionalism', professionalism, setProfessionalism)}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0F172A] block mb-1">Volunteer Comments</label>
                      <textarea
                        rows="2"
                        disabled={selectedDonation?.hasFeedback}
                        placeholder="Comment on transit speed, communication, and food handling care..."
                        value={volunteerComment}
                        onChange={(e) => setVolunteerComment(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[#E7EAF0] text-xs focus:outline-emerald-500 bg-[#f7f8fb] disabled:opacity-60"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 font-medium">
                    No volunteer courier was assigned to this donation. Only Donor rating applies.
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            {!selectedDonation?.hasFeedback && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Submit Read-Only Feedback to Database</span>
              </button>
            )}
          </form>
        )}
      </div>

      {/* Read-Only Submitted Feedback History */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Submitted Read-Only Feedback History</span>
          </h2>
          <span className="text-xs font-bold text-[#64748B]">
            {submittedFeedbacks.length} Feedback Records in Database
          </span>
        </div>

        {submittedFeedbacks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-slate-200">
            No submitted feedback records found in database yet.
          </div>
        ) : (
          <div className="space-y-4">
            {submittedFeedbacks.map((fb) => (
              <div key={fb._id} className="p-4 sm:p-5 rounded-2xl border border-[#E7EAF0] bg-white space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7EAF0] pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Read-Only • Saved to MongoDB
                      </span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                        {fb.donationId?.title || 'Delivered Donation'}
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#64748B] block mt-0.5">
                      Submitted on {new Date(fb.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-amber-700">
                        Donor Score: {fb.donorRatings?.overall || fb.rating || 5} / 5.0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Donor Ratings Breakdown */}
                  <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-[#E7EAF0] space-y-2">
                    <span className="font-extrabold text-[#0F172A] block text-[11px] uppercase tracking-wider text-emerald-800">
                      Donor: {fb.donorId?.organizationName || fb.donorId?.name || 'Donor'}
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700">
                      <div>Food Quality: <strong className="text-emerald-700">{fb.donorRatings?.foodQuality || 5} ★</strong></div>
                      <div>Packaging: <strong className="text-emerald-700">{fb.donorRatings?.packaging || 5} ★</strong></div>
                      <div>Freshness: <strong className="text-emerald-700">{fb.donorRatings?.freshness || 5} ★</strong></div>
                      <div>Hygiene: <strong className="text-emerald-700">{fb.donorRatings?.hygiene || 5} ★</strong></div>
                    </div>
                    {fb.donorComment && (
                      <p className="text-[11px] text-[#334155] italic pt-1 border-t border-slate-200">
                        "{fb.donorComment}"
                      </p>
                    )}
                  </div>

                  {/* Volunteer Ratings Breakdown */}
                  {fb.volunteerId && fb.volunteerRatings ? (
                    <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-[#E7EAF0] space-y-2">
                      <span className="font-extrabold text-[#0F172A] block text-[11px] uppercase tracking-wider text-blue-800">
                        Volunteer: {fb.volunteerId?.name || 'Courier'}
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700">
                        <div>Punctuality: <strong className="text-blue-700">{fb.volunteerRatings?.punctuality || 5} ★</strong></div>
                        <div>Food Handling: <strong className="text-blue-700">{fb.volunteerRatings?.foodHandling || 5} ★</strong></div>
                        <div>Professionalism: <strong className="text-blue-700">{fb.volunteerRatings?.professionalism || 5} ★</strong></div>
                        <div>Overall: <strong className="text-blue-700">{fb.volunteerRatings?.overall || 5} ★</strong></div>
                      </div>
                      {fb.volunteerComment && (
                        <p className="text-[11px] text-[#334155] italic pt-1 border-t border-slate-200">
                          "{fb.volunteerComment}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-[#E7EAF0] flex items-center justify-center text-[11px] text-slate-500 font-medium">
                      Direct Pickup (No Volunteer Courier)
                    </div>
                  )}
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
