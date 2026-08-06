import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  BrainCircuit,
  CloudRain,
  Users,
  History,
  Utensils,
  TrendingDown,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function AIPredictionSection({ onOpenDonateModal }) {
  const [selectedFactor, setSelectedFactor] = useState('weather');

  const chartData = [
    { day: 'Mon', actualWaste: 45, predictedSurplus: 12 },
    { day: 'Tue', actualWaste: 38, predictedSurplus: 10 },
    { day: 'Wed', actualWaste: 52, predictedSurplus: 14 },
    { day: 'Thu', actualWaste: 30, predictedSurplus: 8 },
    { day: 'Fri', actualWaste: 68, predictedSurplus: 18 },
    { day: 'Sat', actualWaste: 85, predictedSurplus: 22 },
    { day: 'Sun', actualWaste: 40, predictedSurplus: 11 },
  ];

  const factors = [
    {
      id: 'donations',
      title: 'Previous Donations',
      detail: 'Analyzes historical donation patterns to optimize daily prep quantities.',
      icon: History,
      metric: '-38% Waste'
    },
    {
      id: 'weather',
      title: 'Weather & Events',
      detail: 'Correlates rain forecasts and local sports events with dining foot traffic.',
      icon: CloudRain,
      metric: '+94.2% Acc.'
    },
    {
      id: 'type',
      title: 'Restaurant Type',
      detail: 'Tailored models for buffets, fine dining, bakeries, and fast-casual outlets.',
      icon: Utensils,
      metric: 'Custom Models'
    },
    {
      id: 'traffic',
      title: 'Customer Count',
      detail: 'Integrates with POS systems to monitor reservation drops in real time.',
      icon: Users,
      metric: 'POS Synced'
    },
    {
      id: 'waste',
      title: 'Historical Waste Logs',
      detail: 'Machine learning flags recurring surplus trends by day of the week.',
      icon: TrendingDown,
      metric: 'Automated'
    }
  ];

  return (
    <section id="ai-prediction" className="py-24 bg-white border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Interactive AI Dashboard Illustration & Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 order-2 lg:order-1"
          >
            <div className="bg-[#F7F8FB] rounded-3xl p-6 border border-[#E7EAF0] shadow-soft-hover space-y-6 relative overflow-hidden">

              {/* Top Bar of Dashboard Mock */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-emerald-btn">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                      Surplus Intelligence Engine
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">v4.2 Active</span>
                    </h4>
                    <p className="text-xs text-[#64748B]">Real-time Waste Prevention & Yield Prediction</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-[#0F172A]">AI Forecast: Optimal</span>
                </div>
              </div>

              {/* Chart Title & Stats */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs text-[#64748B] block font-medium">Weekly Waste Reduction Trend</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">-64.2% Waste Saved</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                    <span className="text-[#64748B]">Unplanned Surplus</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-[#0F172A]">AI Redistributed</span>
                  </div>
                </div>
              </div>

              {/* Recharts Area Chart */}
              <div className="h-60 w-full bg-white p-3 rounded-2xl border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSurplus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="actualWaste" stroke="#94A3B8" fillOpacity={1} fill="url(#colorWaste)" strokeWidth={2} name="Unplanned Waste (kg)" />
                    <Area type="monotone" dataKey="predictedSurplus" stroke="#22C55E" fillOpacity={1} fill="url(#colorSurplus)" strokeWidth={3} name="AI Saved Meals (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom Prediction Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 text-[10px] uppercase font-bold block">Tomorrow Forecast</span>
                  <span className="font-extrabold text-[#0F172A] text-sm">18 kg Surplus Expected</span>
                  <span className="text-emerald-600 font-medium block mt-0.5">Pre-matched to Hope Shelter</span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-amber-800 text-[10px] uppercase font-bold block">Recommended Prep</span>
                  <span className="font-extrabold text-[#0F172A] text-sm">-15% Batch Size</span>
                  <span className="text-amber-700 font-medium block mt-0.5">Saves ~ $240 / Day</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: AI Content & Factor List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 order-1 lg:order-2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
              <span>PREDICTIVE ML ALGORITHM</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              Predict Tomorrow's Surplus Today
            </h2>

            <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
              FoodBridge AI uses deep learning algorithms trained on millions of dining variables to forecast surplus before food is even prepared allowing proactive redistribution.
            </p>

            {/* Factor Pills / Accordion list */}
            <div className="space-y-3 pt-2">
              {factors.map((factor) => {
                const IconComponent = factor.icon;
                const isSelected = selectedFactor === factor.id;
                return (
                  <div
                    key={factor.id}
                    onClick={() => setSelectedFactor(factor.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${isSelected
                        ? 'bg-white border-emerald-500 shadow-soft-card'
                        : 'bg-[#F7F8FB] border-[#E7EAF0] hover:bg-white'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-[#334155]'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-[#0F172A]">
                          {factor.title}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {factor.metric}
                      </span>
                    </div>

                    {isSelected && (
                      <p className="text-xs text-[#334155] mt-2.5 pl-12 font-normal leading-relaxed">
                        {factor.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => onOpenDonateModal('ai-demo')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-emerald-btn transition-all duration-200 flex items-center gap-2.5 text-base cursor-pointer active:scale-95"
              >
                <span>See AI in Action</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
