import React, { useState } from 'react';
import {
  PlusCircle,
  Sparkles,
  Upload,
  X,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Check,
  ShieldCheck,
  Utensils,
  Package,
  Folder,
  Maximize2,
  Send,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const CreateDonationPage = () => {
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Cooked Meal / Catering');
  const [prepDate, setPrepDate] = useState('2025-08-02');
  const [prepTime, setPrepTime] = useState('10:30');
  const [expiryDate, setExpiryDate] = useState('2025-08-02');
  const [expiryTime, setExpiryTime] = useState('18:30');
  const [address, setAddress] = useState('GreenHarvest Main Depot, Bay 4, Springfield Road, Metro City, 560001');
  const [isLocating, setIsLocating] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);

  // Sample Food Images
  const [images, setImages] = useState([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      name: 'catering_trays.jpg'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=400&q=80',
      name: 'sandwiches.jpg'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
      name: 'fresh_fruits.jpg'
    }
  ]);

  // Food Quality Checklist State
  const [checklist, setChecklist] = useState({
    freshlyPrepared: true,
    hygienicallyPacked: true,
    properlySealed: true,
    safeTempMaintained: true,
    noDamage: true
  });

  const toggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.map((file, idx) => ({
        id: Date.now() + '-' + idx,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setAddress('Current Location: Sector 14, Central Boulevard, Tech City, 560034');
      setIsLocating(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Create Surplus Food Listing
            </h1>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 text-center space-y-5 shadow-soft-card">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Donation Created & Matched!
            </h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">
              FoodBridge AI has assigned <strong>Hope Harvest Shelter</strong> (1.4 km away) for pickup between 6:00 PM – 7:30 PM.
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#E7EAF0] max-w-lg mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Listing:</span>
              <span className="font-semibold text-slate-800">{foodName || 'Freshly Baked Rolls & Sandwiches'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Pickup Location:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[260px]">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expiry Window:</span>
              <span className="font-semibold text-emerald-600">Safe Until {expiryTime || '06:30 PM'}</span>
            </div>
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-emerald-btn transition-all cursor-pointer"
          >
            Create Another Listing
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-6">
          
          {/* SECTION 1: Food Images Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <Upload className="w-4 h-4" />
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Food Images
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Drag & Drop Zone */}
              <div className="md:col-span-5 border-2 border-dashed border-emerald-200/90 bg-emerald-50/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center hover:bg-emerald-50/40 hover:border-emerald-300 transition-all relative group cursor-pointer min-h-[140px]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="p-2.5 bg-emerald-100/70 text-emerald-600 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-slate-700">
                  Drag & drop food images here
                </p>
                <span className="text-[11px] text-slate-400 my-0.5">or</span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-semibold transition-colors mt-0.5"
                >
                  Browse Files
                </button>
                <p className="text-[10px] text-slate-400 mt-2">
                  JPG, PNG up to 5MB each (Max 5 images)
                </p>
              </div>

              {/* Uploaded Images Preview Grid */}
              <div className="md:col-span-7 flex flex-wrap items-center gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#E7EAF0] shadow-xs group shrink-0"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/70 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:bg-red-500 transition-all cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-[#E7EAF0] hover:border-emerald-400 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-500 bg-[#f8fafc] hover:bg-emerald-50/20 transition-all cursor-pointer shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <hr className="border-[#E7EAF0]" />

          {/* SECTION 2: Food Name & Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600">
              <Utensils className="w-4 h-4" />
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Food Item Name & Description
              </label>
            </div>
            <input
              type="text"
              required
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Freshly Baked Rolls & Sandwiches"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium transition-all"
            />
          </div>

          {/* SECTION 3: Quantity & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600">
                <Package className="w-4 h-4" />
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Quantity (KG / Meals)
                </label>
              </div>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 45 kg (approx 90 meals)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600">
                <Folder className="w-4 h-4" />
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Category
                </label>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium transition-all cursor-pointer"
              >
                <option value="Cooked Meal / Catering">Cooked Meal / Catering</option>
                <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                <option value="Fresh Produce & Fruits">Fresh Produce & Fruits</option>
                <option value="Dairy & Refrigerated">Dairy & Refrigerated</option>
                <option value="Packaged / Dry Goods">Packaged / Dry Goods</option>
              </select>
            </div>
          </div>

          {/* SECTION 4: Prep Date/Time & Expiry Date/Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preparation Date & Time */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600">
                <Calendar className="w-4 h-4" />
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Preparation Date & Time
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={prepDate}
                    onChange={(e) => setPrepDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium transition-all"
                  />
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full px-3 py-2.5 pr-8 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium transition-all"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Expiry Date & Time */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600">
                <Calendar className="w-4 h-4" />
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Expiry Date & Time
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium transition-all"
                  />
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                    placeholder="06:30 PM"
                    className="w-full px-3 py-2.5 pr-8 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium transition-all"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Pickup Location with Google Maps Picker */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <MapPin className="w-4 h-4" />
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Pickup Location
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Left Address Inputs */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-3 py-3 pr-9 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium leading-relaxed"
                  />
                  {address && (
                    <button
                      type="button"
                      onClick={() => setAddress('')}
                      className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#E7EAF0] hover:border-emerald-500 bg-white hover:bg-emerald-50/50 text-[#0F172A] hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Locating...' : 'Use Current Location'}
                </button>
              </div>

              {/* Right Map Preview Box */}
              <div className="md:col-span-7 h-44 rounded-2xl overflow-hidden border border-[#E7EAF0] relative bg-[#e5e3df] shadow-inner group">
                {/* Map Grid / Styled Graphic */}
                <div className="absolute inset-0 opacity-80 pointer-events-none">
                  {/* Street SVG mockup representation */}
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d6d3ce" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="#f4f3f0" />
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Parks & Water */}
                    <path d="M 0 20 Q 80 50 160 30 T 320 60 L 320 0 L 0 0 Z" fill="#c5e8c5" opacity="0.6" />
                    <path d="M 200 100 Q 250 140 350 120 L 400 180 L 200 180 Z" fill="#d0e4f7" opacity="0.7" />
                    {/* Major Roads */}
                    <path d="M -10 90 L 410 90" stroke="#ffffff" strokeWidth="12" />
                    <path d="M -10 90 L 410 90" stroke="#fcd34d" strokeWidth="6" />
                    <path d="M 180 -10 L 180 200" stroke="#ffffff" strokeWidth="10" />
                    <path d="M 180 -10 L 180 200" stroke="#fcd34d" strokeWidth="4" />
                    <path d="M 50 -10 L 280 190" stroke="#ffffff" strokeWidth="8" />
                    <path d="M 50 -10 L 280 190" stroke="#fca5a5" strokeWidth="3" strokeDasharray="6 3" />
                  </svg>
                </div>

                {/* Map Pin Marker */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
                  <div className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-md whitespace-nowrap mb-1 flex items-center gap-1.5 border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    GreenHarvest Main Depot
                  </div>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 animate-ping absolute inset-0"></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                      <MapPin className="w-4 h-4 fill-white text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-2.5 right-2.5 flex flex-col bg-white rounded-lg shadow-md border border-[#E7EAF0] overflow-hidden z-20">
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.min(prev + 1, 18))}
                    className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border-b border-gray-100"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[9px] font-bold text-slate-500 text-center py-0.5 bg-slate-50 border-b border-gray-100">
                    {mapZoom}x
                  </span>
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.max(prev - 1, 10))}
                    className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg shadow-xs border border-[#E7EAF0] text-slate-600 hover:text-slate-900 z-20 cursor-pointer">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#E7EAF0]" />

          {/* SECTION 6: Food Quality Checklist */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Food Quality Checklist
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {[
                {
                  key: 'freshlyPrepared',
                  title: 'Freshly Prepared',
                  desc: 'Food is prepared today or within safe time'
                },
                {
                  key: 'hygienicallyPacked',
                  title: 'Hygienically Packed',
                  desc: 'Packed in clean and hygienic conditions'
                },
                {
                  key: 'properlySealed',
                  title: 'Properly Sealed',
                  desc: 'Properly sealed to maintain quality'
                },
                {
                  key: 'safeTempMaintained',
                  title: 'Safe Temperature Maintained',
                  desc: 'Stored at safe temperature'
                },
                {
                  key: 'noDamage',
                  title: 'No Visible Damage or Contamination',
                  desc: 'Food is safe for consumption'
                }
              ].map((item) => {
                const isChecked = checklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleChecklist(item.key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                        : 'border-[#E7EAF0] bg-[#f8fafc] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1.5">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isChecked ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold text-[#0F172A] leading-snug">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#64748B] pl-6 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 7: AI Match Active Information */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#0F172A] tracking-tight">
                  AI Match Active
                </h4>
                <p className="text-xs text-[#334155] mt-0.5">
                  Our AI will notify the 3 nearest verified shelters with matching storage capacities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-200/60">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 font-medium">Predicted Match</p>
                <p className="font-extrabold text-[#0F172A]">High (98%)</p>
              </div>
              <div className="text-center border-l border-emerald-200 pl-2">
                <p className="text-[10px] text-slate-500 font-medium">Est. Pickup</p>
                <p className="font-extrabold text-[#0F172A]">2 – 4 Hours</p>
              </div>
              <div className="text-center border-l border-emerald-200 pl-2">
                <p className="text-[10px] text-slate-500 font-medium">Expiry Risk</p>
                <p className="font-extrabold text-emerald-600">Low</p>
              </div>
            </div>
          </div>

          {/* SECTION 8: Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-emerald-btn transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>Publish Surplus & Request AI Dispatch</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateDonationPage;
