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

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-extrabold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase">Total Deliveries</span>
            <p className="text-xl font-black text-[#0F172A]">{profile.totalDeliveries}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-extrabold">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase">Average Courier Rating</span>
            <p className="text-xl font-black text-[#0F172A]">{profile.rating} / 5.0</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-extrabold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase">Compliance Status</span>
            <p className="text-xs font-black text-emerald-700">Level 1 Verified Partner</p>
          </div>
        </div>
      </div>

      {/* Editable Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-6">
        <div className="pb-4 border-b border-[#E7EAF0]">
          <h2 className="text-lg font-extrabold text-[#0F172A]">Courier Credentials & Logistics</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Update vehicle details, preferred delivery radius, and emergency contact numbers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerProfilePage;
