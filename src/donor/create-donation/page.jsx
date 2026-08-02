import React, { useState } from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';

const CreateDonationPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Create Surplus Food Listing
            </h1>
            <p className="text-xs text-[#64748B]">
              Instant AI matching connects your surplus directly with verified shelters & food banks nearby.
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 text-center space-y-4 shadow-soft-card">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">Donation Created & Matched!</h2>
          <p className="text-sm text-[#334155] max-w-md mx-auto">
            FoodBridge AI has assigned <strong>Hope Harvest Shelter</strong> (1.4 km away) for pickup between 6:00 PM – 7:30 PM.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-emerald-btn transition-all"
          >
            Create Another Listing
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Food Item Name & Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Freshly Baked Rolls & Sandwiches"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Quantity (kg / meals)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 45 kg (approx 90 meals)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Category
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium">
                <option>Cooked Meal / Catering</option>
                <option>Bakery & Confectionery</option>
                <option>Fresh Produce & Fruits</option>
                <option>Dairy & Refrigerated</option>
                <option>Packaged / Dry Goods</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Safe Shelf Life Window
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium">
                <option>Use within 4 Hours (Urgent)</option>
                <option>Use within 12 Hours</option>
                <option>Use within 24 Hours</option>
                <option>Use within 3 Days</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Pickup Address
              </label>
              <input
                type="text"
                defaultValue="GreenHarvest Main Depot, Bay 4"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-[#334155]">
              <strong>AI Match Active:</strong> Upon submitting, our algorithm will notify the 3 nearest verified shelters with matching storage capacities.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-emerald-btn transition-all cursor-pointer active:scale-98"
          >
            Publish Surplus & Request AI Dispatch
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateDonationPage;
