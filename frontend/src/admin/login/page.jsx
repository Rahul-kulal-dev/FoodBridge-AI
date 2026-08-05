import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token && data.user) {
        const userRole = data.user.user_role || data.user.role;
        if (userRole !== 'admin') {
          setErrorMsg('Access denied. Administrator privileges required.');
          setLoading(false);
          return;
        }

        login(data.token, data.user);
        navigate('/admin');
      } else {
        setErrorMsg(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-4 selection:bg-[#16A34A] selection:text-white">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-[24px] p-8 shadow-xs space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100 shrink-0">
            <Leaf className="w-6 h-6 fill-emerald-500/20 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Sign in to access the FoodBridge AI admin console
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0F172A] uppercase">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#16A34A] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0F172A] uppercase">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#16A34A] font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1.5 transition-colors">
            <Leaf className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Back to main site</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
