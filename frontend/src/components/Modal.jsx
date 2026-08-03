import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, Leaf, ArrowRight, Utensils, HeartHandshake, Truck, Loader2 } from 'lucide-react';

export default function Modal({ isOpen, onClose, initialType = 'register' }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('donor');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    org: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Validate required fields
    if (!formData.email) {
      setErrorMsg('Please enter your email address.');
      setLoading(false);
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    if (initialType !== 'login' && !formData.name) {
      setErrorMsg('Please enter your full name.');
      setLoading(false);
      return;
    }

    const payload = initialType === 'login'
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          user_role: role,
          role: role,
          organizationName: formData.org || '',
        };

    try {
      const endpoint = initialType === 'login'
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.token && data.user) {
        // Successful authentication — save to localStorage and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        const finalRole = data.user.user_role || data.user.role || role;
        const redirectRoute = finalRole === 'admin' ? '/admin'
          : finalRole === 'ngo' ? '/ngo'
          : finalRole === 'volunteer' ? '/volunteer'
          : '/donor';

        setSubmitted(true);
        setTimeout(() => {
          onClose();
          navigate(redirectRoute);
        }, 1200);
      } else {
        // Server returned an error — show it, do NOT navigate
        setErrorMsg(data.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      // Network error — server is likely down
      setErrorMsg('Cannot connect to server. Please make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E7EAF0] z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-[#0F172A]">Welcome to FoodBridge AI!</h3>
              <p className="text-sm text-[#64748B]">
                Account authenticated for <strong className="text-[#0F172A]">{formData.email || 'your account'}</strong>.
              </p>
              <p className="text-xs text-emerald-600 font-semibold">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  {initialType === 'login' ? 'FoodBridge Account' : 'Join FoodBridge Network'}
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
                {initialType === 'login' ? 'Welcome Back' : 'Start Redistributing Surplus Food'}
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Join 500+ restaurants, shelters, and volunteers transforming surplus into community hope.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Role Toggle Selector */}
              {initialType !== 'login' && (
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F7F8FB] rounded-2xl border border-[#E7EAF0] mb-5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRole('donor')}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${role === 'donor' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#64748B]'}`}
                  >
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Food Donor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ngo')}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${role === 'ngo' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#64748B]'}`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                    <span>NGO / Hub</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('volunteer')}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${role === 'volunteer' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#64748B]'}`}
                  >
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Volunteer</span>
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {initialType !== 'login' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Full Name / Contact Person</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivers"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@restaurant.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {initialType !== 'login' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Organization Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ocean View Bakery & Bistro"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl shadow-emerald-btn transition-all duration-200 flex items-center justify-center gap-2 text-base cursor-pointer mt-2 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{initialType === 'login' ? 'Sign In' : 'Create Free Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
