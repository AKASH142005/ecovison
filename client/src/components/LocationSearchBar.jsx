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
import { searchLocations } from '../services/geocoding';

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
        const hits = await searchLocations(query);
        setResults(hits);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onSelectLocation({
      lat: item.lat,
      lng: item.lng,
      zoom: 15,
      name: item.name,
      address: item.fullName || item.name,
      isManual: true
    });
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-emerald-600 dark:text-emerald-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search street, area, or pincode in TN..."
          className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 pl-10 pr-20 py-2.5 shadow-lg shadow-black/5 dark:shadow-black/30 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}

          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin mr-1" />
          ) : (
            <button
              type="button"
              onClick={onLocateGPS}
              disabled={isLocating}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-all disabled:opacity-50"
              title="Detect device GPS"
            >
              <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'GPS'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-[1100] max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          
          {/* Live Search Results */}
          {results.length > 0 && (
            <div className="p-1">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Found Locations in Tamil Nadu
              </div>
              {results.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-start gap-2.5 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      {item.fullName}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {query.trim().length >= 2 && !isSearching && results.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
              <p>No exact area found for "{query}".</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching by locality, street, or Tamil Nadu pincode (e.g. 600001).</p>
            </div>
          )}

          {/* Quick Popular Localities */}
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Popular Hubs & Localities
              </span>
              <span className="text-[9px] lowercase font-normal text-slate-400">1-click set</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
              {POPULAR_AREAS.map((area, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(area)}
                  className="text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between gap-1 transition-colors"
                >
                  <span className="truncate">{area.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                    {area.district}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Drag marker helper */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Navigation className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              💡 <strong>Inaccurate GPS?</strong> Drag the green pin on the map to pinpoint your exact home/street!
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
