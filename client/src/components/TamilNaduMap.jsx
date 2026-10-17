import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import {
  Navigation,
  ExternalLink,
  ShieldCheck,
  Clock,
  Phone,
  Layers,
  Sparkles,
  MapPin
} from 'lucide-react';

// Create custom SVG Leaflet icon for the user origin
function createUserIcon() {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(16, 185, 129, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: rgba(16, 185, 129, 0.8);"></div>
        <div style="position: relative; width: 12px; height: 12px; border-radius: 50%; background: #ffffff; border: 2px solid #059669; box-shadow: 0 0 10px #10b981;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

// Create custom SVG Leaflet icon for collectors
function createCollectorIcon(collector, isSelected, selectedWasteType) {
  let pinColor = '#10b981'; // emerald default
  if (selectedWasteType === 'ewaste') pinColor = '#a855f7';
  else if (selectedWasteType === 'plastic') pinColor = '#06b6d4';
  else if (selectedWasteType === 'metal') pinColor = '#f59e0b';
  else if (selectedWasteType === 'hazardous') pinColor = '#ef4444';
  else if (selectedWasteType === 'paper') pinColor = '#3b82f6';
  else if (selectedWasteType === 'textile') pinColor = '#14b8a6';

  const scale = isSelected ? 1.25 : 1.0;
  const stroke = isSelected ? '#ffffff' : pinColor;
  const strokeWidth = isSelected ? '3' : '1.5';

  return L.divIcon({
    className: 'custom-collector-marker',
    html: `
      <div style="
        transform: scale(${scale});
        transform-origin: bottom center;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: drop-shadow(0 6px 12px rgba(0,0,0,0.45));
        cursor: pointer;
      ">
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 14.5 40.5 16.1 41.8C16.6 42.1 17.4 42.1 17.9 41.8C19.5 40.5 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${isSelected ? '#047857' : '#0f172a'}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
          <circle cx="17" cy="16" r="11" fill="${pinColor}" fill-opacity="${isSelected ? '1' : '0.25'}" stroke="${pinColor}" stroke-width="1.5"/>
          <path d="M17 11V15M17 17V21M13 14L15.5 16.5M21 18L18.5 15.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>
        ${collector.distanceKm != null ? `
          <div style="
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            background: #020617;
            color: #34d399;
            font-size: 9px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 999px;
            border: 1px solid rgba(16,185,129,0.3);
            white-space: nowrap;
          ">
            ${collector.distanceKm} km
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42]
  });
}

// Controller component to smoothly fly to updated coordinates
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);

  return null;
}

// Handle map click to manually set user location
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

export default function TamilNaduMap({
  collectors = [],
  selectedCollector,
  onSelectCollector,
  userLocation,
  onUpdateUserLocation,
  selectedWasteType,
  mapCenter = [11.1271, 78.6569],
  mapZoom = 8,
  onStartNavigation,
  onBookPickup
}) {
  const [mapStyle, setMapStyle] = useState('dark'); // 'dark' or 'light'

  // Build navigation route polyline coordinates if both user and selected collector exist
  const routePoints = useMemo(() => {
    if (!userLocation || !selectedCollector) return null;
    return [
      [userLocation.lat, userLocation.lng],
      [selectedCollector.lat, selectedCollector.lng]
    ];
  }, [userLocation, selectedCollector]);

  const tileUrl = mapStyle === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = mapStyle === 'dark'
    ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
    : '&copy; OpenStreetMap contributors';

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Map Control Toolbar Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
        <button
          onClick={() => setMapStyle(mapStyle === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>{mapStyle === 'dark' ? 'Modern Map' : 'Satellite/Clean'}</span>
        </button>

        <button
          onClick={() => onUpdateUserLocation({ lat: 11.1271, lng: 78.6569, zoom: 7.5, name: 'Tamil Nadu Center' })}
          className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
        >
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>Reset TN View</span>
        </button>
      </div>

      {/* Map Guidance Overlay banner */}
      <div className="absolute bottom-4 left-4 z-[1000] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800 text-slate-400 text-xs backdrop-blur-md pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Click anywhere on the map to set your origin location</span>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapViewController center={mapCenter} zoom={mapZoom} />
        <MapClickHandler onMapClick={onUpdateUserLocation} />

        <TileLayer
          url={tileUrl}
          attribution={attribution}
          maxZoom={19}
        />

        {/* User Location Marker & Proximity Circle */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserIcon()}
            >
              <Popup>
                <div className="p-1 text-slate-100">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Your Location Origin</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Showing distances & route lines to nearest Tamil Nadu waste centers.
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Proximity Radius Circle (20 km) */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={20000} // 20 km
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.05,
                weight: 1.2,
                dashArray: '4, 8'
              }}
            />
          </>
        )}

        {/* Dynamic Navigation Polyline */}
        {routePoints && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: '#10b981',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8'
            }}
          />
        )}

        {/* Waste Collector Markers across Tamil Nadu */}
        {collectors.map((collector) => {
          const isSelected = selectedCollector?._id === collector._id;

          return (
            <Marker
              key={collector._id || `${collector.lat}-${collector.lng}`}
              position={[collector.lat, collector.lng]}
              icon={createCollectorIcon(collector, isSelected, selectedWasteType)}
              eventHandlers={{
                click: () => onSelectCollector(collector)
              }}
            >
              <Popup>
                <div className="p-1 min-w-[260px] text-slate-100 space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="font-bold text-sm text-white leading-tight">
                        {collector.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-semibold">{collector.city}</span>
                        <span>•</span>
                        <span>{collector.district}</span>
                      </div>
                    </div>
                    {collector.isVerified && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex-shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        TNPCB
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {collector.address}
                  </p>

                  {collector.distanceKm != null && (
                    <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Proximity:</span>
                      <span className="text-emerald-400 font-bold">
                        {collector.distanceKm} km ({collector.durationMin} mins away)
                      </span>
                    </div>
                  )}

                  {/* Accepted categories badges */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Accepted Waste:</span>
                    <div className="flex flex-wrap gap-1">
                      {collector.acceptedWasteTypes.map((type, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {type.category} (₹{type.ratePerKg}/kg)
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Popup Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => onStartNavigation(collector)}
                      className="w-full py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate</span>
                    </button>
                    <button
                      onClick={() => onBookPickup(collector)}
                      className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Book Pickup</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
