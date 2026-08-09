import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  Utensils, 
  Users, 
  Leaf, 
  Globe, 
  TrendingUp, 
  Award,
  Share2,
  FileCheck2
} from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function ImpactSection() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const res = await fetch(getApiUrl('/api/analytics/impact'));
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.metrics && isMounted) {
            setMetrics(data.metrics);
          }
        }
      } catch (err) {
        console.error('Error fetching impact metrics in ImpactSection:', err);
      }
    };
    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  const monthlyImpactData = [
    { month: 'Jan', meals: 1800, co2: 2.1 },
    { month: 'Feb', meals: 2400, co2: 2.8 },
    { month: 'Mar', meals: 3100, co2: 3.5 },
    { month: 'Apr', meals: 4200, co2: 4.8 },
    { month: 'May', meals: 5600, co2: 6.2 },
    { month: 'Jun', meals: metrics ? metrics.mealsSaved : 7900, co2: metrics ? (metrics.co2SavedKg / 1000).toFixed(1) : 8.9 },
  ];

  const mealsVal = metrics ? metrics.mealsSaved.toLocaleString() : '25,480';
  const peopleFedVal = metrics ? metrics.peopleFed.toLocaleString() : '18,200';
  const wasteVal = metrics
    ? metrics.wasteReducedKg >= 1000
      ? (metrics.wasteReducedKg / 1000).toFixed(1)
      : metrics.wasteReducedKg.toString()
    : '15.4';
  const wasteUnit = metrics && metrics.wasteReducedKg < 1000 ? 'Kg' : 'Metric Tons';
  const co2Val = metrics ? (metrics.co2SavedKg / 1000).toFixed(1) : '38.2';

  const impactCards = [
    {
      title: 'Meals Saved',
      value: mealsVal,
      unit: 'Portions',
      change: '+34% vs last month',
      icon: Utensils,
      color: 'bg-emerald-500 text-white',
      progress: 88,
      progressColor: 'bg-emerald-500'
    },
    {
      title: 'People Fed',
      value: peopleFedVal,
      unit: 'Individuals',
      change: `Across ${metrics ? metrics.activeNGOs : 42} shelter hubs`,
      icon: Users,
      color: 'bg-amber-500 text-white',
      progress: 76,
      progressColor: 'bg-amber-500'
    },
    {
      title: 'Food Waste Reduced',
      value: wasteVal,
      unit: wasteUnit,
      change: '100% Diverted from Landfills',
      icon: Leaf,
      color: 'bg-blue-500 text-white',
      progress: 92,
      progressColor: 'bg-blue-500'
    },
    {
      title: 'CO₂ Emissions Prevented',
      value: co2Val,
      unit: 'Tons CO₂e',
      change: `Equivalent to ${metrics ? Math.round(metrics.co2SavedKg * 2.2) : 84} trees planted`,
      icon: Globe,
      color: 'bg-indigo-500 text-white',
      progress: 82,
      progressColor: 'bg-indigo-500'
    }
  ];

  return (
    <section id="impact" className="py-24 bg-[#F7F8FB] border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
            REAL-TIME METRICS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Quantifiable Environmental & Social Impact
          </h2>
          <p className="text-base sm:text-lg text-[#334155]">
            Every donation logged on FoodBridge AI generates verifiable ESG reports, tax receipt documentation, and carbon offset tracking.
          </p>
        </div>

        {/* 4 Large Impact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-6 border border-[#E7EAF0] shadow-soft-card flex flex-col justify-between hover:shadow-soft-hover transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${card.color} shadow-xs`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                      {card.value}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">{card.unit}</span>
                  </div>

                  <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-200 mb-4">
                    {card.change}
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#64748B] mb-1.5">
                    <span>Monthly Target</span>
                    <span>{card.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${card.progressColor} rounded-full transition-all duration-1000`} style={{ width: `${card.progress}%` }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Large Dashboard Interactive Analytics Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7EAF0] shadow-soft-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Community Impact Trajectory
              </h3>
              <p className="text-xs text-[#64748B]">Cumulative food redistribution growth across connected regions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="text-xs font-semibold text-[#334155] bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Export Tax Receipt</span>
              </button>
              <button className="text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                <span>Share ESG Report</span>
              </button>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyImpactData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="meals" fill="#22C55E" radius={[8, 8, 0, 0]} name="Meals Saved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </section>
  );
}
