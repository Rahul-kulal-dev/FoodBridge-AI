import React from 'react';
import { motion } from 'framer-motion';

export default function StatsBar() {
  const stats = [
    {
      image: '/imgs/Cutlery.png',
      value: '25,000+',
      label: 'Meals Saved',
      subtext: 'Provided to families in need',
      accentColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      bgColor: 'bg-emerald-50/60 border-emerald-100',
    },
    {
      image: '/imgs/web.png',
      value: '15 Tons',
      label: 'Food Waste Reduced',
      subtext: 'Kept away from landfills',
      accentColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      bgColor: 'bg-emerald-50/60 border-emerald-100',
    },
    {
      image: '/imgs/heart.png',
      value: '500+',
      label: 'Partner NGOs',
      subtext: 'Shelters & community kitchens',
      accentColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      bgColor: 'bg-amber-50/60 border-amber-100',
    },
    {
      image: '/imgs/truck.png',
      value: '1,200+',
      label: 'Successful Deliveries',
      subtext: 'Zero food spoilage rate',
      accentColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      bgColor: 'bg-blue-50/60 border-blue-100',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl border ${stat.bgColor} shadow-soft-card transition-all duration-300 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <img src={stat.image} alt={stat.label} className="w-10 h-10 object-contain" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
                    Verified Impact
                  </span>
                </div>
              
              <div className={`text-3xl sm:text-4xl font-black ${stat.accentColor} tracking-tight mb-1`}>
                {stat.value}
              </div>
              
              <div className="text-base font-extrabold text-[#0F172A]">
                {stat.label}
              </div>
              
              <div className="text-xs text-[#64748B] mt-1 font-medium">
                {stat.subtext}
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
