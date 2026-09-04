import React from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  CheckSquare, 
  Truck, 
  BarChart3, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Food Donor Uploads Surplus',
      description: 'Restaurant or caterer logs surplus food items with photos, quantity, and pickup availability.',
      icon: Upload,
      accent: 'green',
      bgColor: 'bg-green-50 text-green-600 border-green-200',
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Nearby NGO Accepts Donation',
      description: 'AI matches and alerts local verified shelters. The NGO accepts with a single tap on mobile.',
      icon: CheckSquare,
      accent: 'amber',
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Volunteer Picks Up & Delivers',
      description: 'Dispatched volunteer picks up temperature-controlled food and delivers via optimized GPS routes.',
      icon: Truck,
      accent: 'blue',
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'Step 3'
    },
    {
      number: '04',
      title: 'Impact Analytics Updated',
      description: 'Meals saved, tax credit receipts, and carbon offset logs update automatically in real-time.',
      icon: BarChart3,
      accent: 'purple',
      bgColor: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Step 4'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#F7F8FB] border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            How SavorSurplus Works
          </h2>
          <p className="text-base sm:text-lg text-[#334155]">
            A friction-free, 4-step workflow connecting donors, volunteers, and shelters in minutes.
          </p>
        </div>

        {/* Desktop Connected Steps Grid (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <React.Fragment key={step.number}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.12 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl p-6 border border-[#E7EAF0] shadow-soft-card flex flex-col justify-between relative group hover:border-green-300 hover:shadow-soft-hover transition-all"
                >
                  <div>
                    {/* Header: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-2xl font-black text-slate-300 group-hover:text-green-500 transition-colors">
                        {step.number}
                      </span>
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold ${step.bgColor} shadow-xs`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-lg font-black text-[#0F172A] mb-2 tracking-tight group-hover:text-green-700 transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>

                  {/* Step status pill */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#64748B]">
                    <span>Status</span>
                    <span className="text-green-600 bg-green-50 px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                      Automated
                    </span>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
}
