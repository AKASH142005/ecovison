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
  ShieldCheck,
  Layers,
  Sparkles,
  MapPin,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Move,
  Truck,
  Factory,
  Check
} from 'lucide-react';
import { useThemeMode } from '../context/ThemeContext';
import LocationSearchBar from './LocationSearchBar';

// Create custom SVG Leaflet icon for the user origin with drag hint
function createUserIcon(isManual = false) {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: grab;" title="Drag to set exact doorstep location">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: #059669; box-shadow: 0 0 12px rgba(16, 185, 129, 0.9);"></div>
        <div style="position: relative; width: 10px; height: 10px; border-radius: 50%; background: #ffffff; border: 2.5px solid #0f172a;"></div>
        <div style="position: absolute; bottom: -20px; white-space: nowrap; font-size: 9px; font-weight: 800; background: #0f172a; color: #34d399; padding: 1px 7px; border-radius: 999px; border: 1px solid rgba(16, 185, 129, 0.4); pointer-events: none; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
          ${isManual ? '🎯 Precise Pin' : '📍 Drag Me'}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
}

// Create custom SVG Leaflet icon for collectors (Dealers & MRFs)
function createCollectorIcon(collector, isSelected, selectedWasteType, isDark = true) {
  let pinColor = '#10b981'; // emerald default
  if (selectedWasteType === 'ewaste') pinColor = '#a855f7';
  else if (selectedWasteType === 'plastic') pinColor = '#06b6d4';
  else if (selectedWasteType === 'metal') pinColor = '#f59e0b';
  else if (selectedWasteType === 'hazardous') pinColor = '#ef4444';
  else if (selectedWasteType === 'paper') pinColor = '#3b82f6';
  else if (selectedWasteType === 'textile') pinColor = '#14b8a6';

  const scale = isSelected ? 1.25 : 1.0;
  const stroke = isSelected ? (isDark ? '#ffffff' : '#047857') : pinColor;
  const strokeWidth = isSelected ? '3' : '1.5';
  const baseFill = isSelected ? (isDark ? '#047857' : '#059669') : (isDark ? '#0f172a' : '#ffffff');
  const tagBg = isDark ? '#020617' : '#ffffff';
  const tagColor = isDark ? '#34d399' : '#047857';
  const tagBorder = isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.5)';

  return L.divIcon({
    className: 'custom-collector-marker',
    html: `
      <div style="
        transform: scale(${scale});
        transform-origin: bottom center;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));
        cursor: pointer;
      ">
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 14.5 40.5 16.1 41.8C16.6 42.1 17.4 42.1 17.9 41.8C19.5 40.5 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${baseFill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
          <circle cx="17" cy="16" r="11" fill="${pinColor}" fill-opacity="${isSelected ? '1' : '0.25'}" stroke="${pinColor}" stroke-width="1.5"/>
          <path d="M17 11V15M17 17V21M13 14L15.5 16.5M21 18L18.5 15.5" stroke="${isSelected ? '#ffffff' : (isDark ? '#ffffff' : '#0f172a')}" stroke-width="2" stroke-linecap="round"/>
        </svg>
        ${collector.distanceKm != null ? `
          <div style="
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            background: ${tagBg};
            color: ${tagColor};
            font-size: 9px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 999px;
            border: 1px solid ${tagBorder};
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
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

// Create custom SVG Leaflet icon for Industrial Recycling Factories
function createFactoryIcon(factory, isSelected, isDark = true) {
  const scale = isSelected ? 1.25 : 1.0;
  const stroke = isSelected ? '#ffffff' : '#f59e0b';
  const baseFill = isSelected ? '#d97706' : (isDark ? '#1e1b4b' : '#ffffff');

  return L.divIcon({
    className: 'custom-factory-marker',
    html: `
      <div style="
        transform: scale(${scale});
        transform-origin: bottom center;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: drop-shadow(0 6px 12px rgba(245, 158, 11, 0.4));
        cursor: pointer;
      ">
        <svg width="36" height="44" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 14.5 40.5 16.1 41.8C16.6 42.1 17.4 42.1 17.9 41.8C19.5 40.5 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${baseFill}" stroke="${stroke}" stroke-width="${isSelected ? '3' : '2'}"/>
          <circle cx="17" cy="16" r="11" fill="#f59e0b" fill-opacity="${isSelected ? '1' : '0.85'}"/>
        </svg>
        <div style="
          position: absolute;
          top: 9px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 13px;
          line-height: 1;
        ">
          🏭
        </div>
        ${factory.distanceKm != null ? `
          <div style="
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            background: #78350f;
            color: #fde68a;
            font-size: 9px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 999px;
            border: 1px solid rgba(245, 158, 11, 0.5);
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${factory.distanceKm} km
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44]
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
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng, isManual: true });
      }
    }
  });
  return null;
}

export default function TamilNaduMap({
  collectors = [],
  factories = [],
  selectedCollector,
  onSelectCollector,
  selectedFactory,
  onSelectFactory,
  userLocation,
  onUpdateUserLocation,
  selectedWasteType,
  mapCenter = [13.0827, 80.2707],
  mapZoom = 12,
  onStartNavigation,
  onBookPickup,
  onLocateGPS,
  isLocating = false,
  allowFactories = false
}) {
  const { isDark } = useThemeMode();
  const [mapStyleOverride, setMapStyleOverride] = useState(null);

  // Layer Visibility Controls
  const [showDealers, setShowDealers] = useState(true);
  const [showFactories, setShowFactories] = useState(allowFactories);
  const [showBoundaries, setShowBoundaries] = useState(true);

  // Default to follow global theme unless explicitly overridden by user
  const currentTileTheme = mapStyleOverride || (isDark ? 'dark' : 'light');

  // Build navigation route polyline coordinates if both user and selected target exist
  const routePoints = useMemo(() => {
    if (!userLocation) return null;
    const target = selectedCollector || selectedFactory;
    if (!target) return null;
    return [
      [userLocation.lat, userLocation.lng],
      [target.lat, target.lng]
    ];
  }, [userLocation, selectedCollector, selectedFactory]);

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="relative isolate z-0 w-full h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-xl dark:shadow-2xl bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      
      {/* Top Floating Bar: Location Search & Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Search Bar (pointer-events-auto) */}
        <div className="pointer-events-auto flex-1 min-w-[240px] max-w-sm sm:max-w-md">
          <LocationSearchBar
            onSelectLocation={onUpdateUserLocation}
            onLocateGPS={onLocateGPS}
            isLocating={isLocating}
            currentLocationName={userLocation?.name}
          />
        </div>

        {/* Action Controls & Layer Toggles */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* Show Dealers Toggle */}
          <button
            onClick={() => setShowDealers(!showDealers)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm backdrop-blur-md ${
              showDealers
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Chennai Dealers & MRFs"
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dealers ({collectors.length})</span>
          </button>

          {/* Show Factories Toggle - Only shown if allowFactories is enabled */}
          {allowFactories && (
            <button
              onClick={() => setShowFactories(!showFactories)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm backdrop-blur-md ${
                showFactories
                  ? 'bg-amber-500 text-slate-950 font-black shadow-amber-500/20'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
              title="Toggle Chennai Industrial Factories (Buyers)"
            >
              <Factory className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Factories ({factories.length})</span>
            </button>
          )}

          {/* Show Boundaries Toggle */}
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm backdrop-blur-md ${
              showBoundaries
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Dealer Waste Collection Service Boundaries"
          >
            <span>⭕ Boundaries</span>
          </button>

          {/* Tile Layer Theme Toggle */}
          <button
            onClick={() => setMapStyleOverride(currentTileTheme === 'dark' ? 'light' : 'dark')}
            className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all"
            title="Toggle Map Tile Theme"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{currentTileTheme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={() => onUpdateUserLocation({ lat: 13.0827, lng: 80.2707, zoom: 12, name: 'Chennai Central', isManual: true })}
            className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all"
            title="Reset Map to Chennai City Center"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Reset Chennai</span>
          </button>
        </div>

      </div>

      {/* Accuracy & Legend Status Banner (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-1 pointer-events-none">
        {userLocation && userLocation.accuracy && userLocation.accuracy > 500 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/95 text-slate-950 text-xs font-bold shadow-lg backdrop-blur-md pointer-events-auto animate-bounce-subtle">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              Network GPS is approximate (±{userLocation.accuracy >= 1000 ? `${(userLocation.accuracy/1000).toFixed(1)} km` : `${userLocation.accuracy}m`}). Drag the green pin to your exact spot!
            </span>
          </div>
        ) : userLocation?.isManual ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-medium shadow-md backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Doorstep Origin: <strong>{userLocation.name}</strong> • Drag pin anytime</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs backdrop-blur-md shadow-sm">
            <Move className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Drag green marker or click on map to set your doorstep pickup spot</span>
          </div>
        )}
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
          className={currentTileTheme === 'dark' ? 'dark-tiles' : ''}
          url={tileUrl}
          attribution={attribution}
          maxZoom={19}
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon(userLocation.isManual)}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                if (onUpdateUserLocation) {
                  onUpdateUserLocation({
                    lat: position.lat,
                    lng: position.lng,
                    isManual: true
                  });
                }
              }
            }}
          >
            <Popup>
              <div className="p-1 min-w-[200px] text-slate-900 dark:text-slate-100">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                  {userLocation.isManual ? '🎯 Doorstep Pick-Up Origin' : '📡 Detected Ward GPS'}
                </span>
                <p className="font-bold text-xs mt-0.5 leading-snug">
                  {userLocation.name || 'Your Location'}
                </p>
                {userLocation.address && (
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {userLocation.address}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Drag pin anytime to change your doorstep collection point.
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dynamic Navigation Polyline */}
        {routePoints && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: isDark ? '#10b981' : '#059669',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8'
            }}
          />
        )}

        {/* Dealer Collection Points & Waste Boundaries */}
        {showDealers && collectors.map((collector) => {
          const isSelected = selectedCollector?._id === collector._id;
          const radiusMeters = (collector.serviceRadiusKm || 8) * 1000;

          return (
            <React.Fragment key={collector._id || `${collector.lat}-${collector.lng}`}>
              {/* Waste Collection Service Boundary Circle */}
              {showBoundaries && (
                <Circle
                  center={[collector.lat, collector.lng]}
                  radius={radiusMeters}
                  pathOptions={{
                    color: isSelected ? '#10b981' : '#3b82f6',
                    fillColor: isSelected ? '#10b981' : '#3b82f6',
                    fillOpacity: isSelected ? 0.16 : 0.07,
                    weight: isSelected ? 2 : 1,
                    dashArray: '6, 6'
                  }}
                />
              )}

              <Marker
                position={[collector.lat, collector.lng]}
                icon={createCollectorIcon(collector, isSelected, selectedWasteType, isDark)}
                eventHandlers={{
                  click: () => onSelectCollector && onSelectCollector(collector)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[270px] text-slate-900 dark:text-slate-100 space-y-2">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                            Chennai Dealer Hub
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {collector.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{collector.zone || collector.district}</span>
                          <span>•</span>
                          <span>Chennai</span>
                        </div>
                      </div>
                      {collector.isVerified && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/30 flex-shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          TNPCB
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {collector.address}
                    </p>

                    {/* Proximity & Service Boundary Indicator */}
                    <div className="space-y-1">
                      {collector.distanceKm != null && (
                        <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Proximity:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {collector.distanceKm} km ({collector.durationMin} mins away)
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                        <span className="text-blue-700 dark:text-blue-300 font-semibold">Service Boundary:</span>
                        <span className="font-bold text-blue-800 dark:text-blue-200">
                          {collector.serviceRadiusKm || 8} km radius
                        </span>
                      </div>

                      {collector.isWithinServiceBoundary != null && (
                        <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          collector.isWithinServiceBoundary
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {collector.isWithinServiceBoundary
                            ? '✅ Your address is inside this dealer\'s doorstep collection boundary'
                            : '⚠️ Outside doorstep boundary - Hub drop-off recommended'}
                        </div>
                      )}
                    </div>

                    {/* Accepted categories badges */}
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 uppercase font-semibold">Accepted Waste & Rates:</span>
                      <div className="flex flex-wrap gap-1">
                        {collector.acceptedWasteTypes?.map((type, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                          >
                            {type.category} (₹{type.ratePerKg}/kg)
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Popup Actions */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => onStartNavigation && onStartNavigation(collector)}
                        className="w-full py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate</span>
                      </button>
                      <button
                        onClick={() => onBookPickup && onBookPickup(collector)}
                        className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-1 transition-all border border-slate-200 dark:border-slate-700"
                      >
                        <span>Book Pickup</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Industrial Recycling Factories (Buyers) */}
        {showFactories && factories.map((factory) => {
          const isSelected = selectedFactory?._id === factory._id;

          return (
            <Marker
              key={factory._id || `fac_${factory.lat}-${factory.lng}`}
              position={[factory.lat, factory.lng]}
              icon={createFactoryIcon(factory, isSelected, isDark)}
              eventHandlers={{
                click: () => onSelectFactory && onSelectFactory(factory)
              }}
            >
              <Popup>
                <div className="p-1 min-w-[270px] text-slate-900 dark:text-slate-100 space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-amber-200 dark:border-amber-800 pb-2">
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          Chennai Industrial Buyer
                        </span>
                      </div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                        {factory.name}
                      </h3>
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                        📍 {factory.zone || factory.district} Industrial Belt
                      </div>
                    </div>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-300 text-[10px] font-bold border border-amber-500/30 shrink-0">
                      Factory
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {factory.address}
                  </p>

                  {/* Sourcing Demand Callout */}
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300 block mb-0.5">
                      Active Bulk Sourcing Demand:
                    </span>
                    <strong className="text-slate-900 dark:text-amber-100 text-xs">
                      {factory.openDemands || 'Bulk recyclable feedstock required'}
                    </strong>
                  </div>

                  {factory.distanceKm != null && (
                    <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Distance from Origin:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        {factory.distanceKm} km ({factory.durationMin} mins away)
                      </span>
                    </div>
                  )}

                  <div className="pt-1">
                    <button
                      onClick={() => onStartNavigation && onStartNavigation(factory)}
                      className="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate to Receiving Gate</span>
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
