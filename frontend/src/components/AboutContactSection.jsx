import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ShieldCheck, 
  CheckCircle2,
  Heart,
  Globe2
} from 'lucide-react';

export default function AboutContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Restaurant / Business',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <section id="about" className="py-24 bg-white border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: About Mission Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              Building a World Where No Safe Meal Goes to Waste.
            </h2>

            <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
              Founded by technologists, food safety experts, and community leaders, SavorSurplus is dedicated to eliminating hunger and food waste through investor-grade technology.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F7F8FB] border border-[#E7EAF0]">
                <ShieldCheck className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-extrabold text-[#0F172A]">Strict Food Safety Standards</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">Compliant with Good Samaritan Food Donation Acts & FDA temperature guidelines.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F7F8FB] border border-[#E7EAF0]">
                <Globe2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-extrabold text-[#0F172A]">Zero-Friction Logistics</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">Automated dispatch connects volunteers with nearby pickup points in real-time.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-6 text-xs font-semibold text-[#64748B]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Operating in 35+ Metropolitan Areas</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>100% Non-Profit First Approach</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 bg-[#F7F8FB] rounded-3xl p-6 sm:p-8 border border-[#E7EAF0] shadow-soft-hover"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Get in Touch with SavorSurplus
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Have questions about onboarding your restaurant, NGO, or volunteer group? Send us a message!
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <h4 className="font-extrabold text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-green-700">Thank you for reaching out. Our redistribution team will contact you within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1.5">Organization Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option value="Restaurant / Business">Restaurant / Bakery</option>
                      <option value="NGO / Shelter">NGO / Shelter Hub</option>
                      <option value="Volunteer">Volunteer Driver</option>
                      <option value="Enterprise / City">City / Enterprise Partner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your donation goals or partnership inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7EAF0] text-sm text-[#0F172A] focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl shadow-green-btn transition-all duration-200 flex items-center justify-center gap-2 text-base cursor-pointer active:scale-95"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
