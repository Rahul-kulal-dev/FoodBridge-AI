import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TrustSection() {
  const partners = [
    { name: 'Hope Food Shelter', category: 'NGO Network', image: '/imgs/heart.png' },
    { name: 'Grand Harvest Bistro', category: 'Restaurant Partner', image: '/imgs/Cutlery.png' },
    { name: 'City Relief Alliance', category: 'Healthcare & Rescue', image: '/imgs/shield.png' },
    { name: 'Urban Meal Foundation', category: 'Community Kitchen', image: '/imgs/urban.png' },
    { name: 'Green Table Dining', category: 'Hospitality Group', image: '/imgs/Cutlery.png' },
    { name: 'Metro Rescue Volunteers', category: 'Logistics Network', image: '/imgs/metro.png' },
  ];

  return (
    <section className="py-16 bg-[#F7F8FB] border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Trusted by NGOs, Restaurants & Volunteers
          </h3>
          <p className="text-sm text-[#64748B] mt-2">
            Empowering 500+ food donors and relief organizations across North America & Europe.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner, index) => {
            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col items-center justify-center text-center group cursor-pointer hover:border-green-200 hover:shadow-md transition-all duration-200"
              >
                <img src={partner.image} alt={partner.name} className="w-10 h-10 object-contain mb-3" />
                <span className="text-sm font-bold text-[#0F172A] group-hover:text-green-700 transition-colors line-clamp-1">
                  {partner.name}
                </span>
                <span className="text-[11px] text-[#64748B] font-medium mt-0.5">
                  {partner.category}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Rating Banner */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[#E7EAF0]/60 text-xs font-semibold text-[#64748B]">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-[#0F172A] font-bold ml-1.5 text-sm">4.9 / 5</span>
          </div>
          <span>•</span>
          <span>Zero-Waste Certified Platform</span>
          <span>•</span>
          <span>HIPAA & Food Safety Compliant Logs</span>
        </div>

      </div>
    </section>
  );
}
