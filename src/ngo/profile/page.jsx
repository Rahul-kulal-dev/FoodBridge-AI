import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  BadgeCheck,
  CheckCircle2,
  Save,
  FileText,
  ShieldCheck
} from 'lucide-react';

/**
 * Editable NGO Profile Page (/ngo/profile)
 */
const NgoProfilePage = () => {
  const [profile, setProfile] = useState({
    ngoName: 'Hope Community Kitchen',
    email: 'ngo@hopekitchen.org',
    phone: '+91 98765 00112',
    address: 'Sector 5 Community Hub, Metro City, 560001',
    operatingHours: '8:00 AM – 10:00 PM (Daily)',
    servingCapacity: '850 Meals / Day',
    foodCategories: 'Cooked Meals, Bakery Goods, Packaged Dairy, Fresh Fruits & Produce',
    description: 'Non-profit community kitchen serving hot nutritious meals to underprivileged families, homeless shelters, and youth development centers.',
    verificationStatus: 'Verified NGO (Tier 1)',
    regNumber: 'NGO-TRUST-8849-2024',
  });

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
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold shrink-0">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
                {profile.ngoName}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit shrink-0">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                {profile.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Registration No: <span className="font-bold text-[#0F172A]">{profile.regNumber}</span>
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2 animate-scale-up shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Editable Form Container */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5 sm:space-y-6">
        <div className="pb-4 border-b border-[#E7EAF0]">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">Organization Profile & Operations</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Update your serving capacity and contact details to ensure accurate surplus dispatching
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">NGO / Organization Name</label>
            <input
              type="text"
              name="ngoName"
              value={profile.ngoName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Official Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Daily Serving Capacity</label>
            <input
              type="text"
              name="servingCapacity"
              value={profile.servingCapacity}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Primary Pickup Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Operating Hours</label>
            <input
              type="text"
              name="operatingHours"
              value={profile.operatingHours}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Food Categories Handled</label>
            <input
              type="text"
              name="foodCategories"
              value={profile.foodCategories}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Organization Description</label>
            <textarea
              rows="3"
              name="description"
              value={profile.description}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#334155] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#E7EAF0] flex items-center justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NgoProfilePage;
