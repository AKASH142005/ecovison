import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import WasteTypeFilter from './components/WasteTypeFilter';
import QuickDistrictSelector, { TN_DISTRICT_COORDINATES } from './components/QuickDistrictSelector';
import TamilNaduMap from './components/TamilNaduMap';
import CollectorList from './components/CollectorList';
import NavigationRoutePanel from './components/NavigationRoutePanel';
import CollectorDetailModal from './components/CollectorDetailModal';
import BookingModal from './components/BookingModal';
import BookingsListModal from './components/BookingsListModal';
import RecyclingTipsModal from './components/RecyclingTipsModal';
import EcoStatsBanner from './components/EcoStatsBanner';
import { api } from './services/api';
import {
  Navigation,
  Compass,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Alert, Snackbar } from '@mui/material';

// Default Tamil Nadu geographical center
const DEFAULT_TN_CENTER = {
  lat: 11.1271,
  lng: 78.6569,
  zoom: 7.5,
  name: 'Tamil Nadu Center'
};

export default function App() {
  // Navigation & Location States
  const [userLocation, setUserLocation] = useState(DEFAULT_TN_CENTER);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Data States
  const [collectors, setCollectors] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active / Selected Collector for Route Navigation
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [modalCollector, setModalCollector] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingsListOpen, setIsBookingsListOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showToast = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch initial stats, districts, and bookings
  useEffect(() => {
    async function loadMeta() {
      try {
        const [distRes, statsRes, bookRes] = await Promise.allSettled([
          api.getDistricts(),
          api.getStats(),
          api.getBookings()
        ]);

        if (distRes.status === 'fulfilled' && distRes.value.districts) {
          setDistricts(distRes.value.districts);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value.stats) {
          setStats(statsRes.value.stats);
        }
        if (bookRes.status === 'fulfilled' && bookRes.value.bookings) {
          setBookings(bookRes.value.bookings);
        }
      } catch (e) {
        console.error('Error loading metadata:', e);
      }
    }
    loadMeta();
  }, []);

  // Fetch collectors whenever user location, waste type, district or search changes
  const loadCollectors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        wasteType: selectedWasteType,
        district: selectedDistrict,
        lat: userLocation.lat,
        lng: userLocation.lng,
        search: searchTerm
      };

      const res = await api.getCollectors(params);
      if (res.success) {
        setCollectors(res.collectors || []);

        // If user actively selected a category and had no collector selected,
        // highlight the top nearest collector automatically!
        if (res.collectors.length > 0 && selectedWasteType !== 'all' && !selectedCollector) {
          setSelectedCollector(res.collectors[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load collectors:', err);
      showToast('Could not refresh collectors. Ensure Fastify backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedWasteType, selectedDistrict, userLocation.lat, userLocation.lng, searchTerm]);

  useEffect(() => {
    loadCollectors();
  }, [loadCollectors]);

  // Handle GPS detection
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Check if coordinate is approximately within or near Tamil Nadu
        const isTN = lat >= 8.0 && lat <= 13.8 && lng >= 76.0 && lng <= 80.5;

        setUserLocation({
          lat,
          lng,
          zoom: 12,
          name: isTN ? 'Your Detected GPS Location' : 'Your Location (Outside TN bounds)'
        });
        setIsLocating(false);
        showToast(isTN ? 'GPS location detected in Tamil Nadu!' : 'Location detected. Calculating distances to Tamil Nadu hubs.', 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('Location permission denied or unavailable. You can click on the map to set your location.', 'warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle user manual click on map
  const handleMapClickUpdate = (coords) => {
    setUserLocation({
      lat: coords.lat,
      lng: coords.lng,
      zoom: userLocation.zoom || 10,
      name: `Custom Pin (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`
    });
    showToast('Origin set on map! Distances updated.', 'info');
  };

  // Handle Quick District Click
  const handleSelectDistrict = (districtKey, districtInfo) => {
    setSelectedDistrict(districtKey);
    setUserLocation({
      lat: districtInfo.lat,
      lng: districtInfo.lng,
      zoom: districtInfo.zoom,
      name: districtInfo.label
    });
  };

  // Handle Navigation Trigger
  const handleStartNavigation = (col) => {
    setSelectedCollector(col);
    setUserLocation((prev) => ({
      ...prev,
      lat: prev.lat,
      lng: prev.lng,
      zoom: 11
    }));
    showToast(`Navigating to ${col.name} (${col.distanceKm} km)`, 'success');
  };

  // Open Details Modal
  const handleOpenDetails = (col) => {
    setModalCollector(col);
    setIsDetailOpen(true);
  };

  // Open Booking Modal
  const handleOpenBooking = (col) => {
    setModalCollector(col || selectedCollector);
    setIsBookingOpen(true);
  };

  // On successful booking
  const handleBookingSuccess = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking ${newBooking.bookingId} confirmed!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navbar */}
      <Navbar
        userLocation={userLocation}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
        locationName={userLocation.name}
        bookingCount={bookings.length}
        onOpenBookings={() => setIsBookingsListOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>TNPCB Certified Eco-Network • Tamil Nadu Circular Economy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Locate & Navigate to the Nearest <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Waste Collector</span> in Tamil Nadu
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Select your specific waste category below (Plastics, E-waste, Organic, Scrap Metal, Paper, Glass, Textiles) to map verified collection hubs across Chennai, Coimbatore, Madurai, Trichy, Salem, and beyond.
            </p>
          </div>
        </div>

        {/* Environmental Stats Metrics */}
        <EcoStatsBanner stats={stats} />

        {/* Section: Manual Waste Type Selector */}
        <section className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <WasteTypeFilter
            selectedWasteType={selectedWasteType}
            onSelectWasteType={(type) => {
              setSelectedWasteType(type);
              setSelectedCollector(null);
            }}
            matchingCollectorCount={collectors.length}
          />

          {/* Quick Tamil Nadu District Filter */}
          <div className="pt-2 border-t border-slate-800/80">
            <QuickDistrictSelector
              selectedDistrict={selectedDistrict}
              onSelectDistrict={handleSelectDistrict}
              districtStats={districts}
            />
          </div>
        </section>

        {/* Active Navigation Guidance Panel */}
        {selectedCollector && (
          <NavigationRoutePanel
            collector={selectedCollector}
            userLocation={userLocation}
            onClose={() => setSelectedCollector(null)}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {/* Map & Collector List Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Map Column (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Interactive Tamil Nadu Map
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Pulsing green pin: Your Location • Dark pins: Recyclers
              </span>
            </div>

            <TamilNaduMap
              collectors={collectors}
              selectedCollector={selectedCollector}
              onSelectCollector={(col) => setSelectedCollector(col)}
              userLocation={userLocation}
              onUpdateUserLocation={handleMapClickUpdate}
              selectedWasteType={selectedWasteType}
              mapCenter={[userLocation.lat, userLocation.lng]}
              mapZoom={userLocation.zoom || 8}
              onStartNavigation={handleStartNavigation}
              onBookPickup={handleOpenBooking}
            />
          </div>

          {/* Collector Cards Column (5 cols on Desktop) */}
          <div className="lg:col-span-5">
            <CollectorList
              collectors={collectors}
              selectedCollector={selectedCollector}
              onSelectCollector={(col) => setSelectedCollector(col)}
              onStartNavigation={handleStartNavigation}
              onOpenDetails={handleOpenDetails}
              onOpenBooking={handleOpenBooking}
              selectedWasteType={selectedWasteType}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isLoading={isLoading}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            EcoVision Tamil Nadu • Clean & Green Circular Resource Management
          </p>
          <p>
            Fastify & Mongoose High-Performance API • React & Material-UI & Tailwind CSS • OpenStreetMap & Leaflet Integration
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <CollectorDetailModal
        collector={modalCollector}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStartNavigation={handleStartNavigation}
        onOpenBooking={handleOpenBooking}
        userLocation={userLocation}
      />

      <BookingModal
        collector={modalCollector}
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultWasteType={selectedWasteType}
        onBookingSuccess={handleBookingSuccess}
      />

      <BookingsListModal
        open={isBookingsListOpen}
        onClose={() => setIsBookingsListOpen(false)}
        bookings={bookings}
      />

      <RecyclingTipsModal
        open={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', bgcolor: '#0f172a', color: '#f8fafc', border: '1px solid rgba(16, 185, 129, 0.4)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
}
