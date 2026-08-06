import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Volunteer Profile Page (/volunteer/profile)
 * Connects to MongoDB database for real volunteer profile information and feedback.
 */
const VolunteerProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    vehicleType: user?.vehicleType || '',
    vehicleNumber: user?.vehicleNumber || '',
    emergencyContact: user?.emergencyContact || '',
    deliveryRadius: user?.deliveryRadius || '',
    availability: user?.availability || '',
    verificationStatus: user?.verificationStatus === 'approved' ? 'Verified Volunteer Courier' : 'Verification Pending',
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
    totalDeliveries: 0,
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [averages, setAverages] = useState({
    punctuality: 5,
    foodHandling: 5,
    professionalism: 5,
    overall: 5,
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        vehicleType: user.vehicleType || '',
        vehicleNumber: user.vehicleNumber || '',
        emergencyContact: user.emergencyContact || '',
        deliveryRadius: user.deliveryRadius || '',
        availability: user.availability || '',
        verificationStatus: user.verificationStatus === 'approved' ? 'Verified Volunteer Courier' : 'Verification Pending',
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchVolunteerFeedback = async () => {
      try {
        const authToken = token || localStorage.getItem('foodbridge_token');
        if (!authToken) return;

        const [feedRes, statsRes] = await Promise.all([
          fetch(getApiUrl('/api/feedback/volunteer'), {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(getApiUrl('/api/volunteer/stats'), {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        const feedData = await feedRes.json();
        const statsData = await statsRes.json();

        if (feedRes.ok && feedData.feedbacks) {
          setFeedbacks(feedData.feedbacks);
          if (feedData.averages) {
            setAverages(feedData.averages);
          }
        }

        if (statsRes.ok && statsData.stats) {
          setProfile((prev) => ({
            ...prev,
            totalDeliveries: statsData.stats.totalDeliveries || 0,
          }));
        }
      } catch (err) {
        console.warn('Error fetching volunteer profile feedback:', err);
      }
    };
    fetchVolunteerFeedback();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage('');

    try {
      const authToken = token || localStorage.getItem('foodbridge_token');
      const res = await fetch(getApiUrl('/api/users/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          vehicleType: profile.vehicleType,
          vehicleNumber: profile.vehicleNumber,
          emergencyContact: profile.emergencyContact,
          deliveryRadius: profile.deliveryRadius,
          availability: profile.availability,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        updateUser(data.user);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setErrorMessage(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 p-2">
            <img src="/imgs/volunteer.png" alt="Volunteer" className="w-full h-full object-contain" />
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
            <p className={`text-lg sm:text-xl font-black text-[#0F172A] transition-all duration-300 ${feedbacks.length === 0 ? 'blur-md select-none opacity-40' : ''}`}>
              {feedbacks.length === 0 ? '0.0 / 5.0' : `${averages.overall} / 5.0`}
            </p>
            {feedbacks.length === 0 && (
              <span className="text-[9px] font-bold text-slate-400 block">No Ratings Yet</span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-extrabold shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Compliance Status</span>
              <p className="text-xs font-black text-emerald-700">{profile.verificationStatus}</p>
            </div>
          </div>
          <Link
            to="/volunteer/doc-verification"
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-all shrink-0"
          >
            Upload Docs
          </Link>
        </div>
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
            <select
              name="vehicleType"
              value={profile.vehicleType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select Vehicle Type</option>
              <option value="Delivery Van">Delivery Van</option>
              <option value="Two-Wheeler / Motorcycle">Two-Wheeler / Motorcycle</option>
              <option value="Three-Wheeler / Electric Auto">Three-Wheeler / Electric Auto</option>
              <option value="Refrigerated Van">Refrigerated Van</option>
              <option value="Bicycle / On-Foot">Bicycle / On-Foot</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Vehicle Registration Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={profile.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g. KA-05-EV-4821"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Preferred Delivery Radius</label>
            <select
              name="deliveryRadius"
              value={profile.deliveryRadius}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select Preferred Radius</option>
              <option value="5 km">5 km</option>
              <option value="10 km">10 km</option>
              <option value="15 km">15 km</option>
              <option value="25 km">25 km</option>
              <option value="50+ km (Citywide)">50+ km (Citywide)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Availability Schedule</label>
            <select
              name="availability"
              value={profile.availability}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select Availability Schedule</option>
              <option value="Mon - Sat (8 AM - 6 PM)">Mon - Sat (8 AM - 6 PM)</option>
              <option value="Weekdays Only (Mon - Fri)">Weekdays Only (Mon - Fri)</option>
              <option value="Weekends Only (Sat - Sun)">Weekends Only (Sat - Sun)</option>
              <option value="Evening Shift (4 PM - 10 PM)">Evening Shift (4 PM - 10 PM)</option>
              <option value="Flexible / On-Demand">Flexible / On-Demand</option>
            </select>
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
