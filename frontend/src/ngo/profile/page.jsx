import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Editable NGO Profile Page (/ngo/profile)
 * Persists changes directly to MongoDB Atlas database.
 */
const NgoProfilePage = () => {
  const { user, token, updateUser, fetchProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    organizationName: '',
    email: '',
    phone: '',
    address: '',
    servingCapacity: '',
    operatingHours: '',
    foodCategories: '',
  });

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        organizationName: user.organizationName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        servingCapacity: user.servingCapacity || '',
        operatingHours: user.operatingHours || '',
        foodCategories: user.foodCategories || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSavedSuccess(false);

    try {
      const authToken = token || localStorage.getItem('foodbridge_token');
      const res = await fetch(getApiUrl('/api/users/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          organizationName: formData.organizationName,
          phone: formData.phone,
          address: formData.address,
          servingCapacity: formData.servingCapacity,
          operatingHours: formData.operatingHours,
          foodCategories: formData.foodCategories,
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
      setErrorMessage('Server error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = user?.verificationStatus === 'approved';

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 p-2">
            <img src="/imgs/ngo.png" alt="NGO" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
                {formData.organizationName || formData.name || 'NGO Organization'}
              </h1>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full w-fit shrink-0 ${
                isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isVerified ? 'Verified NGO' : 'Verification Pending'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Connected MongoDB User ID: <span className="font-mono font-bold text-[#0F172A]">{user?._id || 'N/A'}</span>
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2 animate-scale-up shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved to MongoDB!</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-rose-50 text-rose-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-rose-200 flex items-center gap-2 animate-scale-up shrink-0">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Editable Form Container */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5 sm:space-y-6">
        <div className="pb-4 border-b border-[#E7EAF0]">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">Organization Profile & Operations</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Update your organization details. Changes persist directly into MongoDB Atlas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Organization / NGO Name</label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="e.g. Hope Community Kitchen"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Contact Person Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Admin Contact"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Official Email Address</label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#64748B] bg-slate-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Primary Pickup / Kitchen Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Sector 5 Community Hub, Metro City"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Daily Serving Capacity</label>
            <select
              name="servingCapacity"
              value={formData.servingCapacity}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select Serving Capacity</option>
              <option value="Under 100 Meals / Day">Under 100 Meals / Day</option>
              <option value="100 - 500 Meals / Day">100 - 500 Meals / Day</option>
              <option value="500 - 1000 Meals / Day">500 - 1000 Meals / Day</option>
              <option value="1000+ Meals / Day">1000+ Meals / Day</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1">Operating Hours</label>
            <select
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-[#f7f8fb] focus:outline-emerald-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select Operating Hours</option>
              <option value="8:00 AM – 10:00 PM (Daily)">8:00 AM – 10:00 PM (Daily)</option>
              <option value="24 Hours (Round the Clock)">24 Hours (Round the Clock)</option>
              <option value="Morning Shift (6 AM - 2 PM)">Morning Shift (6 AM - 2 PM)</option>
              <option value="Evening Shift (2 PM - 10 PM)">Evening Shift (2 PM - 10 PM)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E7EAF0] flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer text-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NgoProfilePage;
