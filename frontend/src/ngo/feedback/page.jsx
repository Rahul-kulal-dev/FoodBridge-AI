import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Building2,
  UserCheck,
  Send,
  ThumbsUp
} from 'lucide-react';

/**
 * NGO Feedback & Rating Page (/ngo/feedback)
 */
const NgoFeedbackPage = () => {
  const [donorRating, setDonorRating] = useState(5);
  const [donorReview, setDonorReview] = useState('');
  const [selectedDonor, setSelectedDonor] = useState('Grand Palace Hotel');

  const [volunteerRating, setVolunteerRating] = useState(5);
  const [volunteerReview, setVolunteerReview] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('Rahul Verma');

  const [submittedFeedback, setSubmittedFeedback] = useState([
    {
      id: 'FB-101',
      targetType: 'Donor',
      targetName: 'Daily Harvest Bakery',
      rating: 5,
      comment: 'Excellent packaging and high-temp food safety protocol observed. Bread was fresh!',
      date: 'Yesterday at 4:30 PM',
    },
    {
      id: 'FB-102',
      targetType: 'Volunteer',
      targetName: 'Suresh Patel (EV Van)',
      rating: 5,
      comment: 'Arrived 10 minutes ahead of ETA in clean temperature-controlled van.',
      date: '2 Days ago',
    },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitDonorFeedback = (e) => {
    e.preventDefault();
    if (!donorReview.trim()) return;

    setSubmittedFeedback((prev) => [
      {
        id: `FB-${Date.now()}`,
        targetType: 'Donor',
        targetName: selectedDonor,
        rating: donorRating,
        comment: donorReview,
        date: 'Just now',
      },
      ...prev,
    ]);

    setDonorReview('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubmitVolunteerFeedback = (e) => {
    e.preventDefault();
    if (!volunteerReview.trim()) return;

    setSubmittedFeedback((prev) => [
      {
        id: `FB-${Date.now()}`,
        targetType: 'Volunteer',
        targetName: selectedVolunteer,
        rating: volunteerRating,
        comment: volunteerReview,
        date: 'Just now',
      },
      ...prev,
    ]);

    setVolunteerReview('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
            Rate donors on food freshness and packaging, and rate volunteer couriers on delivery timeliness
          </p>
        </div>

        {showSuccess && (
          <div className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2 animate-scale-up">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rating Submitted Successfully!</span>
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
                value={selectedDonor}
                onChange={(e) => setSelectedDonor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
              >
                <option value="Grand Palace Hotel">Grand Palace Hotel & Catering</option>
                <option value="Daily Harvest Bakery">Daily Harvest Bakery</option>
                <option value="GreenHarvest Market">GreenHarvest Market</option>
                <option value="Metro Supermarket">Metro Supermarket</option>
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
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
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
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
              >
                <option value="Rahul Verma">Rahul Verma (Refrigerated EV Van)</option>
                <option value="Amit Kumar">Amit Kumar (Eco Cargo Bike)</option>
                <option value="Suresh Patel">Suresh Patel (Express Van)</option>
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
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Volunteer Review</span>
            </button>
          </form>
        </div>
      </div>

      {/* Previous Ratings History Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <h2 className="text-base font-extrabold text-[#0F172A]">Submitted Feedback History</h2>

        <div className="divide-y divide-[#E7EAF0]">
          {submittedFeedback.map((fb) => (
            <div key={fb.id} className="py-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      fb.targetType === 'Donor'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {fb.targetType} Review
                  </span>
                  <h3 className="text-xs font-extrabold text-[#0F172A]">{fb.targetName}</h3>
                </div>

                <p className="text-xs text-[#334155] font-medium">{fb.comment}</p>
                <span className="text-[10px] text-[#64748B] block pt-0.5">{fb.date}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-extrabold text-amber-700">{fb.rating} / 5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NgoFeedbackPage;
