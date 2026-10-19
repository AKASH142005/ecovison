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
import { useThemeMode } from '../../context/ThemeContext';
import LocationSearchBar from './LocationSearchBar';
import { createUserIcon, createCollectorIcon, createFactoryIcon } from './mapIcons';

// Controller component to smoothly fly to updated coordinates
function MapViewController({ center, zoom }) {
  const map = useMap();
  const lat = center ? center[0] : null;
  const lng = center ? center[1] : null;

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom || map.getZoom(), {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [lat, lng, zoom, map]);

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
        
        {/* Search Bar */}
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
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle GCC Recovery Boundaries"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Boundaries</span>
          </button>

          {/* Map Tile Style Toggle */}
          <div className="flex rounded-xl bg-white/90 dark:bg-slate-900/90 p-0.5 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
            <button
              onClick={() => setMapStyleOverride('light')}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                currentTileTheme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setMapStyleOverride('dark')}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                currentTileTheme === 'dark'
                  ? 'bg-slate-800 text-emerald-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Night
            </button>
          </div>

        </div>
      </div>

      {/* Drag Hint Banner */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold backdrop-blur-md shadow-lg">
        <Move className="w-3.5 h-3.5 animate-bounce" />
        <span>Click anywhere or drag the green pin to set your exact doorstep address</span>
      </div>

      {/* Leaflet Map Body */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{
          background: isDark ? '#020617' : '#e2e8f0',
          filter: currentTileTheme === 'dark' ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)' : 'none'
        }}
      >
        <TileLayer url={tileUrl} attribution={attribution} maxZoom={19} />
        
        {/* Dynamic Pan/Zoom Controller */}
        <MapViewController center={mapCenter} zoom={mapZoom} />

        {/* Click to reposition pin */}
        <MapClickHandler onMapClick={onUpdateUserLocation} />

        {/* 1. USER ORIGIN MARKER (Draggable) */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon(userLocation.isManual)}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onUpdateUserLocation({
                  lat: position.lat,
                  lng: position.lng,
                  zoom: mapZoom,
                  isManual: true
                });
              }
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-1 text-slate-900">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Your Pickup Location</span>
                </div>
                <p className="text-xs font-semibold">{userLocation.name || 'Selected Point'}</p>
                {userLocation.address && (
                  <p className="text-[11px] text-slate-500 leading-tight">{userLocation.address}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  GPS: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  💡 Drag this marker anywhere to recalculate nearby recovery centers.
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* User GPS Accuracy Circle */}
        {userLocation && userLocation.accuracy && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={userLocation.accuracy}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.1,
              weight: 1,
              dashArray: '4, 4'
            }}
          />
        )}

        {/* 2. CHENNAI RECOVERY DEALER HUBS & MRFs */}
        {showDealers && collectors.map((col) => {
          const isSelected = selectedCollector?._id === col._id;

          return (
            <React.Fragment key={col._id || `${col.lat}-${col.lng}`}>
              {/* Optional dealer service radius circle */}
              {showBoundaries && col.serviceRadiusKm && (
                <Circle
                  center={[col.lat, col.lng]}
                  radius={col.serviceRadiusKm * 1000}
                  pathOptions={{
                    color: isSelected ? '#10b981' : '#3b82f6',
                    fillColor: isSelected ? '#10b981' : '#3b82f6',
                    fillOpacity: isSelected ? 0.08 : 0.03,
                    weight: isSelected ? 1.5 : 0.75,
                    dashArray: '3, 6'
                  }}
                />
              )}

              <Marker
                position={[col.lat, col.lng]}
                icon={createCollectorIcon(col, isSelected, selectedWasteType, isDark)}
                eventHandlers={{
                  click: () => onSelectCollector(col)
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-2 text-slate-900 max-w-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>GCC Certified Recovery Center</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{col.name}</h4>
                      <p className="text-[11px] text-slate-500">{col.address}</p>
                    </div>

                    {/* Rates List */}
                    <div className="space-y-1 border-t border-slate-100 pt-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Accepted Scrap Rates:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {col.acceptedWasteTypes?.slice(0, 4).map((type, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                              selectedWasteType === type.category
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {type.category}: <strong>₹{type.ratePerKg}/kg</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions inside popup */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                      <button
                        onClick={() => onStartNavigation(col)}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Navigate ({col.distanceKm} km)</span>
                      </button>

                      <button
                        onClick={() => onBookPickup(col)}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Book Pickup
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* 3. CHENNAI INDUSTRIAL MANUFACTURING BUYERS (FACTORIES) */}
        {showFactories && factories.map((factory) => {
          const isSelected = selectedFactory?._id === factory._id;

          return (
            <Marker
              key={factory._id || `${factory.lat}-${factory.lng}`}
              position={[factory.lat, factory.lng]}
              icon={createFactoryIcon(factory, isDark)}
              eventHandlers={{
                click: () => onSelectFactory && onSelectFactory(factory)
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-2 text-slate-900 max-w-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                      <Factory className="w-3.5 h-3.5" />
                      <span>Industrial Manufacturing Buyer</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{factory.name}</h4>
                    <p className="text-[11px] text-slate-500">{factory.address}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-1.5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Demand:</span>
                    <p className="text-xs font-semibold text-amber-700">
                      {factory.demands || 'High-volume Scrap Polymers & Metals'}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 4. NAVIGATION ROUTE POLYLINE */}
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

      </MapContainer>
    </div>
  );
}
