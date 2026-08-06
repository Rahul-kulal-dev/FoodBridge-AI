import React, { useState, useEffect } from 'react';
import {
  Save,
  ShieldCheck,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  PhoneCall,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

const AdminProfilePage = () => {
  const { user, token, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    organizationName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        organizationName: user.organizationName || '',
        email: user.email || 'admin@gmail.com',
        phone: user.phone || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
      });
    }
  }, [user]);

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
          address: formData.address,
          emergencyContact: formData.emergencyContact,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user);
        setMsg({ type: 'success', text: 'Admin profile details updated successfully!' });
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to update admin profile.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Server connection error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const initialLetter = (user?.name || user?.organizationName || 'Admin').charAt(0).toUpperCase();

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Admin Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-emerald-btn shrink-0">
            {initialLetter}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                {user?.name || 'System Administrator'}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Super Admin</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user?.email || 'admin@gmail.com'} • Organization: <span className="font-semibold text-slate-700">{user?.organizationName || 'FoodBridge AI'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {msg.text && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7EAF0] shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
              Edit Administrator Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your account details. Email address and password cannot be changed here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Admin Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter administrator full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium transition-all"
            />
          </div>

          {/* Organization Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Organization / Department</span>
            </label>
            <input
              type="text"
              placeholder="Enter organization name"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium transition-all"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="Enter contact phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium transition-all"
            />
          </div>

          {/* Emergency / Hotline Contact */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secondary / Hotline Contact</span>
            </label>
            <input
              type="tel"
              placeholder="Enter emergency or hotline contact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium transition-all"
            />
          </div>

          {/* Disabled Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin Email (Locked)</span>
              <Lock className="w-3 h-3 text-amber-500 ml-auto" />
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-slate-100 text-xs text-slate-500 font-medium cursor-not-allowed"
            />
          </div>

          {/* Disabled Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Password (Locked)</span>
              <Lock className="w-3 h-3 text-amber-500 ml-auto" />
            </label>
            <input
              type="password"
              disabled
              value="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-slate-100 text-xs text-slate-500 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* Office Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Office Headquarters Address</span>
          </label>
          <textarea
            rows={3}
            placeholder="Enter admin office street address..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium transition-all"
          />
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfilePage;
