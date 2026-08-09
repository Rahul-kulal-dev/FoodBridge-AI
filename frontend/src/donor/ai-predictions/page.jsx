import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap, Loader2, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, ListFilter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

const AIPredictionsPage = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAIPredictions = async () => {
    try {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (!authToken) return;

      const res = await fetch(getApiUrl('/api/donations/ai-predictions'), {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const resData = await res.json();
      if (res.ok && resData.predictions) {
        setData(resData.predictions);
      }
    } catch (err) {
      console.warn('Error fetching AI predictions from backend:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAIPredictions();
  }, [token]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAIPredictions();
  };

  const predictedQuantity = data?.predictedQuantity ?? 0;
  const unit = data?.unit || 'kg';
  const confidenceScore = data?.confidenceScore || '0%';
  const contributingFactors = data?.contributingFactors || [
    'Not enough donation data for prediction',
  ];
  const isAdvisoryOnly = data?.isAdvisoryOnly ?? true;
  const disclaimer = data?.disclaimer || 'This prediction is strictly advisory for inventory planning and does NOT automatically create or publish food donations.';

  const surplusRisk = data?.surplusRisk || {
    level: 'None',
    score: 0,
    analysis: 'Not enough donation data for prediction',
  };

  const pickupWindow = data?.pickupWindow || {
    recommended: 'N/A',
    details: 'Not enough donation data for prediction',
  };

  const taxDeduction = data?.taxDeduction || {
    estimatedAmount: '$0',
    details: 'Estimated Section 170(e)(3) corporate tax deduction accumulated from completed donations.',
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 bg-[#F8FAFC]">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100 shrink-0">
            <Brain className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-[-0.03em]">
                AI Surplus Food Prediction Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#16A34A]" /> FastAPI Model
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 font-medium max-w-2xl">
              Machine learning models analyze historical MongoDB donation data (foodType, title, quantity, unit, expiryTime) to forecast surplus food availability.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#16A34A]' : ''}`} />
          <span>Refresh Intelligence</span>
        </button>
      </div>

      {/* Advisory Banner Notice */}
      <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex items-start gap-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-extrabold uppercase tracking-wide text-amber-800 block mb-0.5">
            Advisory Prediction Notice
          </span>
          <p className="font-medium text-amber-800/90 leading-relaxed">
            {disclaimer}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-16 rounded-[20px] border border-slate-200/80 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Querying FastAPI machine learning engine...</p>
        </div>
      ) : (
        <>
          {/* Main Forecast Hero Card */}
          <div className="bg-gradient-to-br from-[#ECFDF5] via-white to-[#F0FDF4] p-6 sm:p-8 rounded-[24px] border border-emerald-200 shadow-soft-card relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  Forecasted Future Surplus
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#0F172A]">
                    {predictedQuantity} <span className="text-2xl sm:text-3xl text-emerald-600 font-bold">{unit}</span>
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full">
                    {confidenceScore} Model Confidence
                  </span>
                </div>
                <p className="text-xs text-[#64748B] font-medium max-w-xl">
                  Approximate surplus food quantity likely to be generated based on historical donor activity, food categories, and expiration rates.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shrink-0 text-right space-y-1 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">Status</span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                  Advisory Mode Active
                </span>
              </div>
            </div>
          </div>

          {/* Key Contributing Factors Section */}
          <div className="bg-white p-6 rounded-[20px] border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ListFilter className="w-5 h-5 text-[#16A34A]" />
              <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                Key Contributing Factors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contributingFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3 text-xs text-slate-700 font-medium hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Metric Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Surplus Risk */}
            <div className="bg-white p-6 rounded-[20px] border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                <span>Predicted Surplus Risk</span>
                <AlertTriangle className={`w-4 h-4 ${surplusRisk.level === 'High' ? 'text-amber-500' : 'text-[#16A34A]'}`} />
              </div>
              <div>
                <div className="text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
                  {surplusRisk.level} <span className="text-xl font-bold text-slate-500">({surplusRisk.score}%)</span>
                </div>
                <p className="text-xs text-[#64748B] font-medium mt-2 leading-relaxed">
                  {surplusRisk.analysis}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>FastAPI Engine</span>
                <span className="text-[#16A34A]">{confidenceScore} Confidence</span>
              </div>
            </div>

            {/* Card 2: Pickup Window */}
            <div className="bg-white p-6 rounded-[20px] border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                <span>Optimal Pickup Window</span>
                <Zap className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
                  {pickupWindow.recommended}
                </div>
                <p className="text-xs text-[#64748B] font-medium mt-2 leading-relaxed">
                  {pickupWindow.details}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>Dispatch Guarantee</span>
                <span className="text-[#16A34A]">Nearby NGO Hubs</span>
              </div>
            </div>

            {/* Card 3: Tax Credit Estimator */}
            <div className="bg-white p-6 rounded-[20px] border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                <span>Tax Credit Estimator</span>
                <TrendingUp className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div>
                <div className="text-3xl font-black text-[#16A34A] tracking-[-0.04em]">
                  {taxDeduction.estimatedAmount}
                </div>
                <p className="text-xs text-[#64748B] font-medium mt-2 leading-relaxed">
                  {taxDeduction.details || 'Accumulated tax deductions calculated under Section 170(e)(3) based on completed donations.'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>Tax Standard</span>
                <span className="text-slate-700">IRS Section 170(e)(3)</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIPredictionsPage;
