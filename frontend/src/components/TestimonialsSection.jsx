import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, Utensils, HeartHandshake, Truck } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "FoodBridge AI transformed how we handle evening surplus. What used to end up in disposal now feeds over 80 families every single week with zero extra hassle for our kitchen staff.",
      author: "Marcus Vance",
      role: "Executive Chef & Owner",
      organization: "Green Leaf Bistro",
      category: "Restaurant Partner",
      avatarBg: "bg-emerald-500 text-white",
      avatarInitials: "MV",
      icon: Utensils,
      rating: 5,
    },
    {
      quote: "The real-time AI alerts have been a game changer for our shelter. We get notified the moment safe, high-quality surplus food is packaged nearby, cutting our meal procurement costs by 45%.",
      author: "Sarah Lin",
      role: "Operations Director",
      organization: "Hope Community Shelter",
      category: "NGO Partner",
      avatarBg: "bg-amber-500 text-white",
      avatarInitials: "SL",
      icon: HeartHandshake,
      rating: 5,
    },
    {
      quote: "The volunteer driver app optimizes my pickup routes so efficiently. I can pick up warm meals from three local restaurants and deliver them to community hubs in under 25 minutes.",
      author: "David Miller",
      role: "Lead Logistics Volunteer",
      organization: "Metro Rescue Drivers",
      category: "Volunteer Fleet",
      avatarBg: "bg-blue-500 text-white",
      avatarInitials: "DM",
      icon: Truck,
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Loved by Donors, Shelters & Volunteers
          </h2>
          <p className="text-base sm:text-lg text-[#334155]">
            Hear how FoodBridge AI is building a zero-waste food ecosystem across cities.
          </p>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => {
            const IconComponent = t.icon;
            return (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-[#F7F8FB] rounded-3xl p-7 border border-[#E7EAF0] shadow-soft-card flex flex-col justify-between hover:shadow-soft-hover transition-all duration-300 relative group"
              >
                <div>
                  {/* Rating & Category Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      {t.category}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-emerald-600/15 absolute -top-3 -left-2 rotate-180" />
                    <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal relative z-10 italic">
                      "{t.quote}"
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-5 border-t border-[#E7EAF0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center ${t.avatarBg} ring-2 ring-white shadow-xs`}>
                      {t.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
                        {t.author}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </h4>
                      <p className="text-xs text-[#64748B]">{t.role}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">{t.organization}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
