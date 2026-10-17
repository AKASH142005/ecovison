import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const TN_DISTRICT_COORDINATES = {
  'All': { lat: 11.1271, lng: 78.6569, zoom: 7, label: 'All Tamil Nadu' },
  'Chennai': { lat: 13.0827, lng: 80.2707, zoom: 11, label: 'Chennai' },
  'Coimbatore': { lat: 11.0168, lng: 76.9558, zoom: 11, label: 'Coimbatore' },
  'Madurai': { lat: 9.9252, lng: 78.1198, zoom: 11, label: 'Madurai' },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047, zoom: 11, label: 'Trichy' },
  'Salem': { lat: 11.6643, lng: 78.1460, zoom: 11, label: 'Salem' },
  'Tirunelveli': { lat: 8.7139, lng: 77.7567, zoom: 11, label: 'Tirunelveli' },
  'Tiruppur': { lat: 11.1085, lng: 77.3411, zoom: 11, label: 'Tiruppur' },
  'Vellore': { lat: 12.9165, lng: 79.1325, zoom: 11, label: 'Vellore' },
  'Erode': { lat: 11.3410, lng: 77.7172, zoom: 11, label: 'Erode' },
  'Thanjavur': { lat: 10.7870, lng: 79.1378, zoom: 11, label: 'Thanjavur' },
  'Kanchipuram': { lat: 12.8342, lng: 79.7036, zoom: 11, label: 'Kanchipuram' },
  'Dindigul': { lat: 10.3673, lng: 77.9803, zoom: 11, label: 'Dindigul' }
};

export default function QuickDistrictSelector({
  selectedDistrict,
  onSelectDistrict,
  districtStats = []
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none py-1">
      <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold uppercase tracking-wider pl-1 pr-2 flex-shrink-0">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <span>TN District:</span>
      </div>

      {Object.entries(TN_DISTRICT_COORDINATES).map(([key, info]) => {
        const isSelected = selectedDistrict === key;
        const count = districtStats.find(d => d.name.toLowerCase() === key.toLowerCase())?.collectorCount;

        return (
          <button
            key={key}
            onClick={() => onSelectDistrict(key, info)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span>{info.label}</span>
            {count != null && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
