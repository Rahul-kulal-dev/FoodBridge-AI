import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X, Check, AlertCircle } from 'lucide-react';
import { searchLocations } from '../services/geocodingService';

/**
 * Reusable Location Search Autocomplete Input Component
 * Uses OpenStreetMap Nominatim API via geocodingService.
 *
 * @param {Object} props
 * @param {string|Object} props.value - Formatted address string or location object
 * @param {Function} props.onChange - Callback fired when a location is selected or updated
 * @param {string} [props.placeholder='Search location or full street address...']
 * @param {string} [props.label='Location']
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.required=false]
 * @param {string} [props.className='']
 */
const LocationSearchInput = ({
  value = '',
  onChange,
  placeholder = 'Search location or full street address...',
  label = 'Location',
  disabled = false,
  required = false,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync internal state when prop value changes
  useEffect(() => {
    if (typeof value === 'string') {
      setQuery(value);
    } else if (value && typeof value === 'object') {
      const displayStr = value.formattedAddress || value.locationName || value.address || '';
      setQuery(displayStr);
      setSelectedLocation(value);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    setError('');
    setSelectedLocation(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!text.trim() || text.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      if (onChange) {
        onChange({
          locationName: '',
          formattedAddress: text,
          latitude: 0,
          longitude: 0,
          locationUpdatedAt: new Date(),
        });
      }
      return;
    }

    setLoading(true);
    setIsOpen(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(text);
        setSuggestions(results);
        setError('');
      } catch (err) {
        console.warn('Geocoding search failed:', err);
        setError('Unable to fetch locations. Please try again.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (location) => {
    setSelectedLocation(location);
    setQuery(location.formattedAddress);
    setSuggestions([]);
    setIsOpen(false);
    setError('');

    if (onChange) {
      onChange({
        locationName: location.locationName,
        formattedAddress: location.formattedAddress,
        latitude: location.latitude,
        longitude: location.longitude,
        locationUpdatedAt: new Date(),
      });
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedLocation(null);
    setIsOpen(false);
    setError('');

    if (onChange) {
      onChange({
        locationName: '',
        formattedAddress: '',
        latitude: 0,
        longitude: 0,
        locationUpdatedAt: new Date(),
      });
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        />

        <div className="absolute left-3 text-slate-400 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {query && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md transition-colors"
            title="Clear location"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Geocoding Status Badge */}
      {selectedLocation && selectedLocation.latitude !== 0 && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 w-fit">
          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Location Geocoded ({selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)})</span>
        </div>
      )}

      {/* Error Indicator */}
      {error && (
        <div className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl border border-[#E7EAF0] shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-scale-up">
          {loading && suggestions.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Searching OpenStreetMap locations...</span>
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="p-4 text-center space-y-1">
              <p className="text-xs font-bold text-slate-700">No matching locations found</p>
              <p className="text-[11px] text-slate-400">Try typing city, area name, or full street address.</p>
            </div>
          )}

          {suggestions.map((item, idx) => (
            <button
              key={item.placeId || idx}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              className="w-full p-3 text-left border-b border-slate-100 last:border-0 hover:bg-emerald-50/60 transition-colors flex items-start gap-2.5 cursor-pointer group"
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#0F172A] group-hover:text-emerald-700 transition-colors truncate">
                  {item.locationName}
                </p>
                <p className="text-[11px] text-[#64748B] font-medium line-clamp-1 mt-0.5">
                  {item.formattedAddress}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
