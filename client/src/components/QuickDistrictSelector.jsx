import React from 'react';
import { MapPin } from 'lucide-react';

export const CHENNAI_ZONE_COORDINATES = {
  'All': { lat: 13.0827, lng: 80.2707, zoom: 12, label: 'All Chennai' },
  'Anna Nagar': { lat: 13.0850, lng: 80.2100, zoom: 13.5, label: 'Anna Nagar' },
  'T. Nagar': { lat: 13.0418, lng: 80.2341, zoom: 13.5, label: 'T. Nagar' },
  'Guindy': { lat: 13.0067, lng: 80.2012, zoom: 13.5, label: 'Guindy' },
  'Adyar': { lat: 13.0012, lng: 80.2565, zoom: 13.5, label: 'Adyar' },
  'Velachery': { lat: 12.9750, lng: 80.2210, zoom: 13.5, label: 'Velachery' },
  'Perungudi / OMR': { lat: 12.9698, lng: 80.2374, zoom: 13.5, label: 'Perungudi / OMR' },
  'Ambattur': { lat: 13.1143, lng: 80.1548, zoom: 13.5, label: 'Ambattur' },
  'Mylapore': { lat: 13.0368, lng: 80.2676, zoom: 13.5, label: 'Mylapore' },
  'Porur': { lat: 13.0382, lng: 80.1565, zoom: 13.5, label: 'Porur' },
  'Royapuram': { lat: 13.1120, lng: 80.2950, zoom: 13.5, label: 'Royapuram' },
  'Manali': { lat: 13.1670, lng: 80.2600, zoom: 13.5, label: 'Manali' },
  'Tambaram': { lat: 12.9249, lng: 80.1000, zoom: 13.5, label: 'Tambaram' }
};

// Backwards compatibility alias
export const TN_DISTRICT_COORDINATES = CHENNAI_ZONE_COORDINATES;

export default function QuickDistrictSelector({
  selectedDistrict,
  onSelectDistrict,
  districtStats = []
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar py-1">
      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider pl-1 pr-2 flex-shrink-0">
        <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
        <span>Chennai Zone:</span>
      </div>

      {Object.entries(CHENNAI_ZONE_COORDINATES).map(([key, info]) => {
        const isSelected = selectedDistrict === key;
        const count = districtStats.find(d => d.name.toLowerCase() === key.toLowerCase())?.collectorCount;

        return (
          <button
            key={key}
            onClick={() => onSelectDistrict(key, info)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-xs dark:shadow-none'
            }`}
          >
            <span>{info.label}</span>
            {count != null && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                isSelected
                  ? 'bg-emerald-800 dark:bg-emerald-950 text-emerald-100 dark:text-emerald-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
