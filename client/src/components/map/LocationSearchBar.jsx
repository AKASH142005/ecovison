import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  X,
  Loader2,
  Navigation,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { searchLocations } from '../../services/geocoding';

const POPULAR_AREAS = [
  { name: 'Anna Nagar, Chennai', lat: 13.0850, lng: 80.2101, district: 'Chennai' },
  { name: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341, district: 'Chennai' },
  { name: 'Adyar, Chennai', lat: 13.0012, lng: 80.2565, district: 'Chennai' },
  { name: 'RS Puram, Coimbatore', lat: 11.0098, lng: 76.9458, district: 'Coimbatore' },
  { name: 'Gandhipuram, Coimbatore', lat: 11.0180, lng: 76.9674, district: 'Coimbatore' },
  { name: 'Mattuthavani, Madurai', lat: 9.9497, lng: 78.1568, district: 'Madurai' },
  { name: 'Thillai Nagar, Trichy', lat: 10.8250, lng: 78.6850, district: 'Tiruchirappalli' },
  { name: 'Fairlands, Salem', lat: 11.6780, lng: 78.1390, district: 'Salem' }
];

export default function LocationSearchBar({
  onSelectLocation,
  onLocateGPS,
  isLocating = false,
  currentLocationName = ''
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const hits = await searchLocations(query.trim());
        setResults(hits || []);
      } catch (err) {
        console.warn('Location search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc) => {
    onSelectLocation({
      lat: loc.lat,
      lng: loc.lng,
      zoom: 14,
      name: loc.shortName || loc.name,
      address: loc.fullName || loc.name,
      isManual: true
    });
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm sm:max-w-md">
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 pointer-events-none" />
        
        <input
          type="text"
          placeholder={currentLocationName ? `📍 ${currentLocationName}` : 'Search city, town, or landmark in TN...'}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="w-full pl-9 pr-20 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-2xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />

        {/* Right Action Icons: Clear & GPS */}
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onLocateGPS}
            disabled={isLocating}
            className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all disabled:opacity-50"
            title="Use My Current GPS Location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Compass className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl z-[2000] overflow-hidden max-h-72 overflow-y-auto">
          {isSearching && (
            <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span>Searching Tamil Nadu locations...</span>
            </div>
          )}

          {!isSearching && query.length >= 2 && results.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching locations found in Tamil Nadu.
            </div>
          )}

          {/* Search Hits */}
          {results.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Search Results
              </div>
              {results.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800/80 transition-all flex items-start gap-2.5 group"
                >
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {loc.shortName || loc.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {loc.fullName}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Popular Tamil Nadu Centers (shown if no query yet) */}
          {!query && (
            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Popular Tamil Nadu Hubs</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {POPULAR_AREAS.map((area, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(area)}
                    className="text-left px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-1.5 group"
                  >
                    <Navigation className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {area.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
