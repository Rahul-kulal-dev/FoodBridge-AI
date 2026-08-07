import React, { useState, useEffect } from 'react';
import { Save, BadgeCheck, Clock, XCircle, User, Building2, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

import LocationSearchInput from '../../components/LocationSearchInput';

const DonorProfilePage = () => {
  const { user, token, updateUser, fetchProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    organizationName: '',
    email: '',
    phone: '',
    address: '',
    locationName: '',
    formattedAddress: '',
    latitude: 0,
    longitude: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        organizationName: user.organizationName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || user.formattedAddress || '',
        locationName: user.locationName || '',
        formattedAddress: user.formattedAddress || user.address || '',
        latitude: user.latitude || (user.location?.lat) || 0,
        longitude: user.longitude || (user.location?.lng) || 0,
      });
    }
  }, [user]);

  const handleLocationChange = (loc) => {
    setFormData((prev) => ({
      ...prev,
      locationName: loc.locationName,
      formattedAddress: loc.formattedAddress,
      address: loc.formattedAddress,
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch(getApiUrl('/api/users/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          organizationName: formData.organizationName,
          phone: formData.phone,
          address: formData.formattedAddress || formData.address,
          locationName: formData.locationName,
          formattedAddress: formData.formattedAddress || formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          location: {
            lat: Number(formData.latitude) || 0,
            lng: Number(formData.longitude) || 0,
          },
          locationUpdatedAt: new Date(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user);
        setMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Server connection error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const isApproved = user.verificationStatus === 'approved';
  const isRejected = user.verificationStatus === 'rejected';
  const initialLetter = (user.organizationName || user.name || 'D').charAt(0).toUpperCase();

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Profile Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 p-2">
            <img src="/imgs/donor.png" alt="Donor" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.045em]">
                {user.organizationName || user.name || 'Food Donor Account'}
              </h1>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isApproved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                    : isRejected
                    ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                    : 'bg-amber-50 text-amber-700 border-amber-200/80'
                }`}
              >
                {isApproved && <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />}
                {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                {!isApproved && !isRejected && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                <span>
                  {isApproved ? 'Verified Donor' : isRejected ? 'Verification Rejected' : 'Verification Pending'}
                </span>
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {user.email || 'Food Donor'} • Role: <span className="capitalize font-bold text-slate-700">{user.user_role || user.role || 'donor'}</span>
            </p>
          </div>
        </div>

        {loading && <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />}
      </div>

      {/* Alert Messages */}
      {msg.text && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
        <h2 className="text-base font-extrabold text-[#0F172A] tracking-[-0.045em] border-b border-slate-100 pb-3">
          Organization Profile Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Organization Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter organization name"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact Person Name</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter contact person name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Email</span>
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-slate-100 text-xs text-slate-500 font-medium cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        <LocationSearchInput
          label="Pickup Address / Primary Location"
          placeholder="Search city, area, or full street address..."
          value={{
            locationName: formData.locationName,
            formattedAddress: formData.formattedAddress || formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }}
          onChange={handleLocationChange}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonorProfilePage;
