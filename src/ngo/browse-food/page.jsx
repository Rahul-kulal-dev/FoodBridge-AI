import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Browse Nearby Food Page (/ngo/browse-food)
 */
const BrowseFoodPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [distanceFilter, setDistanceFilter] = useState('All');
  const [foodTypeFilter, setFoodTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Distance');
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  const initialFoodItems = [
    {
      id: 'FOOD-101',
      name: 'Fresh Prepared Lunch Meals (Paneer Curry & Rice)',
      category: 'Meals',
      foodType: 'Cooked Food',
      quantity: '120 Portions',
      expiry: '3 Hours',
      distance: '1.2 km',
      donorName: 'Grand Palace Hotel',
      freshnessScore: 98,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      description: 'Hot fresh vegetarian lunch meals packed in food-grade insulated containers.',
      address: '74 MG Road, Sector 4, Metro City',
    },
    {
      id: 'FOOD-102',
      name: 'Whole Grain Bread Buns & Artisanal Pastries',
      category: 'Bakery',
      foodType: 'Bakery',
      quantity: '40 kg',
      expiry: '6 Hours',
      distance: '2.5 km',
      donorName: 'Daily Harvest Bakery',
      freshnessScore: 95,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      description: 'Freshly baked surplus bread buns, croissants, and fruit loaves.',
      address: '12 Bakery Lane, Market Complex',
    },
    {
      id: 'FOOD-103',
      name: 'Farm Fresh Organic Tomatoes & Vegetables',
      category: 'Grocery',
      foodType: 'Raw Produce',
      quantity: '85 kg',
      distance: '3.1 km',
      donorName: 'GreenHarvest Market',
      freshnessScore: 92,
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
      description: 'High-quality organic farm produce ready for community meal prep.',
      address: 'Supermarket Complex, Block C',
    },
    {
      id: 'FOOD-104',
      name: 'Pasteurized Organic Whole Milk Pouches',
      category: 'Dairy',
      foodType: 'Packaged',
      quantity: '60 Units',
      expiry: '1.5 Hours',
      distance: '4.8 km',
      donorName: 'Metro Supermarket',
      freshnessScore: 89,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      description: 'Chilled pasteurized dairy pouches stored under optimal refrigeration.',
      address: 'Main Highway Circle, Retail Hub',
    },
    {
      id: 'FOOD-105',
      name: 'Assorted Sandwich Platters & Salads',
      category: 'Meals',
      foodType: 'Cooked Food',
      quantity: '50 Boxes',
      expiry: '2 Hours',
      distance: '1.8 km',
      donorName: 'Corporate Tech Cafe',
      freshnessScore: 96,
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
      description: 'Fresh gourmet sandwiches and garden salads packed from corporate event surplus.',
      address: 'Tech Park Tower B, Food Court',
    },
    {
      id: 'FOOD-106',
      name: 'Seasonal Apples & Citrus Fruit Crates',
      category: 'Grocery',
      foodType: 'Raw Produce',
      quantity: '110 kg',
      expiry: '24 Hours',
      distance: '3.8 km',
      donorName: 'City Orchard Logistics',
      freshnessScore: 94,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      description: 'Sweet fresh orchard apples and oranges packed in wooden crates.',
      address: 'Wholesale Mandi Hub, Gate 2',
    },
  ];

  const handleAcceptDonation = (foodId) => {
    setAcceptedIds([...acceptedIds, foodId]);
    setSelectedFood(null);
    navigate('/ngo/accepted-donations');
  };

  const filteredItems = initialFoodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesFoodType = foodTypeFilter === 'All' || item.foodType === foodTypeFilter;
    return matchesSearch && matchesCategory && matchesFoodType;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Browse Nearby Surplus Food
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Explore 15 active food donations matched to Hope Community Kitchen within 5 km radius
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
            AI Verified Freshness Engine
          </span>
        </div>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search food item or donor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7EAF0] text-xs focus:outline-emerald-500 bg-[#f7f8fb]"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-white focus:outline-emerald-500 cursor-pointer"
            >
              <option value="Distance">Nearest Distance</option>
              <option value="Expiry">Earliest Expiry</option>
              <option value="Freshness">Highest AI Score</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="pt-3 border-t border-[#E7EAF0] flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider mr-1">Category:</span>
          {['All', 'Meals', 'Bakery', 'Grocery', 'Dairy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer text-xs ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          <span className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider ml-1 sm:ml-3 mr-1">Type:</span>
          {['All', 'Cooked Food', 'Raw Produce', 'Bakery', 'Packaged'].map((type) => (
            <button
              key={type}
              onClick={() => setFoodTypeFilter(type)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer text-xs ${
                foodTypeFilter === type
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredItems.map((item) => {
          const isAccepted = acceptedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image Header Container */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-extrabold text-[#0F172A] shadow-xs">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-white" />
                    {item.freshnessScore}% AI Score
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A] line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-[#E7EAF0] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[10px] font-bold uppercase block">Quantity</span>
                    <span className="font-extrabold text-[#0F172A]">{item.quantity}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] font-bold uppercase block">Expiry Time</span>
                    <span className="font-extrabold text-amber-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.expiry}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1 text-[#64748B] font-medium truncate">
                    <span className="font-bold text-[#0F172A]">{item.donorName}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px] shrink-0">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {item.distance}
                  </span>
                </div>

                {/* Buttons */}
                <div className="pt-3 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/ngo/food-details`)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    disabled={isAccepted}
                    onClick={() => handleAcceptDonation(item.id)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-emerald-btn cursor-pointer ${
                      isAccepted
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {isAccepted ? 'Accepted' : 'Accept Donation'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseFoodPage;
