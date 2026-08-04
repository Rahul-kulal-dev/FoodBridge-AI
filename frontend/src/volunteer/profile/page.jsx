import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Calendar,
  BadgeCheck,
  Star,
  CheckCircle2,
  Save,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import volunteerData from '../data/volunteerData.json';

/**
 * Volunteer Profile Page (/volunteer/profile)
 */
const VolunteerProfilePage = () => {
  const [profile, setProfile] = useState({ ...volunteerData.profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const { token } = useAuth ? useAuth() : { token: null };
  const [feedbacks, setFeedbacks] = useState([]);
  const [averages, setAverages] = useState({
    punctuality: 5,
    foodHandling: 5,
    professionalism: 5,
    overall: 5,
  });

  useEffect(() => {
    const fetchVolunteerFeedback = async () => {
      try {
        const authToken = token || localStorage.getItem('token');
        if (!authToken) return;

        const res = await fetch(getApiUrl('/api/feedback/volunteer'), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (res.ok && data.feedbacks) {
          setFeedbacks(data.feedbacks);
          if (data.averages) {
            setAverages(data.averages);
          }
        }
      } catch (err) {
        console.warn('Error fetching volunteer ratings:', err);
      }
    };
    fetchVolunteerFeedback();
  }, [token]);

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                {profile.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Courier Partner since <span className="font-bold text-[#0F172A]">{profile.joinedDate}</span>
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2 animate-scale-up">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-extrabold shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase">Total Deliveries</span>
            <p className="text-lg sm:text-xl font-black text-[#0F172A]">{profile.totalDeliveries}</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-extrabold shrink-0">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase">Average Courier Rating</span>
            <p className="text-lg sm:text-xl font-black text-[#0F172A]">{averages.overall} / 5.0</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-extrabold shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase">Compliance Status</span>
            <p className="text-xs font-black text-emerald-700">Level 1 Verified Partner</p>
          </div>
        </div>
      </div>

      {/* Volunteer Ratings Breakdown (Evaluated by NGOs) */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7EAF0] pb-3">
          <div>
            <h2 className="text-base font-extrabold text-[#0F172A]">NGO Courier Performance Ratings</h2>
            <p className="text-xs text-[#64748B]">Rated by recipient NGOs upon successful donation delivery</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            {feedbacks.length} Delivered Reviews
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E7EAF0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Punctuality</span>
            <span className="text-lg font-black text-blue-700">{averages.punctuality} ★</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E7EAF0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Food Handling</span>
            <span className="text-lg font-black text-blue-700">{averages.foodHandling} ★</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E7EAF0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Professionalism</span>
            <span className="text-lg font-black text-blue-700">{averages.professionalism} ★</span>
          </div>
        </div>

        {feedbacks.length > 0 && (
          <div className="space-y-3 pt-2">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="p-3.5 rounded-xl border border-[#E7EAF0] bg-[#f8fafc] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-[#0F172A]">
                  <span>NGO: {fb.ngoId?.organizationName || fb.ngoId?.name || 'Recipient NGO'}</span>
                  <span className="text-amber-600">{fb.volunteerRatings?.overall || 5} / 5.0 ★</span>
                </div>
                {fb.volunteerComment && (
                  <p className="text-[#334155] italic">"{fb.volunteerComment}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Editable Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4 sm:space-y-6">
        <div className="pb-3.5 sm:pb-4 border-b border-[#E7EAF0]">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">Courier Credentials & Logistics</h2>
          <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
            Update vehicle details, preferred delivery radius, and emergency contact numbers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Emergency Contact</label>
            <input
              type="text"
              name="emergencyContact"
              value={profile.emergencyContact}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Vehicle Type</label>
            <input
              type="text"
              name="vehicleType"
              value={profile.vehicleType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Vehicle Registration Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={profile.vehicleNumber}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Preferred Delivery Radius</label>
            <input
              type="text"
              name="deliveryRadius"
              value={profile.deliveryRadius}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Availability Schedule</label>
            <input
              type="text"
              name="availability"
              value={profile.availability}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#E7EAF0] flex items-center justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerProfilePage;
