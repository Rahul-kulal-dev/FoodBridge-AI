import React from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  MapPin, 
  BrainCircuit, 
  CheckCircle2
} from 'lucide-react';

export default function FeaturesSection({ onOpenDonateModal }) {
  const features = [
    {
      id: 'smart-donation',
      badge: 'QUICK UPLOAD',
      title: 'Smart Food Donation',
      description: 'Upload surplus food effortlessly with photo scanning, instant expiry calculation, GPS location tag, and AI quality evaluation.',
      icon: Utensils,
      bgColor: 'bg-green-500/10 text-green-600 border-green-200',
      highlights: [
        'AI Photo Quality Assessment (99.2% Accuracy)',
        'Automatic Shelf-Life & Temperature Estimation',
        'One-Tap Batch Quantity Tagging'
      ]
    },
    {
      id: 'ngo-matching',
      badge: 'GEO DISCOVERY',
      title: 'Nearby NGO Matching',
      description: 'Google Maps powered discovery algorithm automatically routes surplus food to the nearest verified community shelters.',
      icon: MapPin,
      bgColor: 'bg-amber-500/10 text-amber-600 border-amber-200',
      highlights: [
        'Real-Time Proximity & Capacity Indexing',
        'Automated Dispatch & Driver Routing',
        'SMS & Push Alerts for Instant Acceptance'
      ]
    },
    {
      id: 'ai-prediction',
      badge: 'PREDICTIVE TECH',
      title: 'AI Surplus Prediction',
      description: 'Forecast future food surplus using foot-traffic forecasts, local weather events, calendar schedules, and historical waste data.',
      icon: BrainCircuit,
      bgColor: 'bg-green-500/10 text-green-600 border-green-200',
      highlights: [
        'Weather & Traffic Impact Modeling',
        'Prep Volume Optimization Suggestions',
        'Pre-Arranged Pickup Reservations'
      ]
    }
  ];

  return (
    <section id="features" className="py-24 bg-white border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Engineered for Maximum Social Impact
          </h2>
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
            Our end-to-end platform combines computer vision, geolocation algorithms, and predictive AI to eliminate food waste effortlessly.
          </p>
        </div>

        {/* 3 Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[#F7F8FB] rounded-3xl p-6 sm:p-8 border border-[#E7EAF0] shadow-soft-card flex flex-col justify-between hover:shadow-soft-hover transition-all duration-300 group"
              >
                <div>
                  {/* Large Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-slate-100 text-green-600">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${feature.bgColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#334155] leading-relaxed mb-6 font-normal">
                    {feature.description}
                  </p>

                  {/* Checklist */}
                  <ul className="space-y-2.5">
                    {feature.highlights.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
