import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import WasteTypeFilter from './components/WasteTypeFilter';
import QuickDistrictSelector, { CHENNAI_ZONE_COORDINATES } from './components/QuickDistrictSelector';
import TamilNaduMap from './components/TamilNaduMap';
import CollectorList from './components/CollectorList';
import NavigationRoutePanel from './components/NavigationRoutePanel';
import CollectorDetailModal from './components/CollectorDetailModal';
import BookingModal from './components/BookingModal';
import BookingsListModal from './components/BookingsListModal';
import RecyclingTipsModal from './components/RecyclingTipsModal';
import EcoStatsBanner from './components/EcoStatsBanner';
import RoleSwitcherBar from './components/RoleSwitcherBar';
import AuthModal from './components/AuthModal';
import DealerPortalModal from './components/DealerPortalModal';
import FactoryPortalModal from './components/FactoryPortalModal';
import AdminPortalModal from './components/AdminPortalModal';
import DealerDashboardView from './components/DealerDashboardView';
import FactoryDashboardView from './components/FactoryDashboardView';
import AdminDashboardView from './components/AdminDashboardView';
import { api } from './services/api';
import { reverseGeocode } from './services/geocoding';
import {
  Navigation,
  Compass,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Truck,
  Factory,
  User,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Alert, Snackbar } from '@mui/material';
import { useThemeMode } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

// Default Chennai geographical center (Ripon Building / Central)
const DEFAULT_CHENNAI_CENTER = {
  lat: 13.0827,
  lng: 80.2707,
  zoom: 12,
  name: 'Chennai Central'
};

export default function App() {
  const { isDark } = useThemeMode();
  const { user, isCustomer, isDealer, isFactory, isAdmin } = useAuth();

  // Navigation & Location States
  const [userLocation, setUserLocation] = useState(DEFAULT_CHENNAI_CENTER);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Data States
  const [collectors, setCollectors] = useState([]);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('customer');
  const [authRequiredMsg, setAuthRequiredMsg] = useState('');
  const [isDealerOpen, setIsDealerOpen] = useState(false);
  const [isFactoryOpen, setIsFactoryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showToast = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenRoleLogin = (role, message = '') => {
    setAuthInitialRole(role);
    setAuthRequiredMsg(message);
    setIsAuthOpen(true);
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

  // Fetch factories located in Chennai industrial corridors
  const loadFactories = useCallback(async () => {
    try {
      const res = await api.getFactories({
        lat: userLocation.lat,
        lng: userLocation.lng
      });
      if (res && res.success) {
        setFactories(res.factories || []);
      }
    } catch (err) {
      console.warn('Could not load Chennai factories:', err);
    }
  }, [userLocation.lat, userLocation.lng]);

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
    loadFactories();
  }, [loadCollectors, loadFactories]);

  // Handle GPS detection with high accuracy & reverse geocoding
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 0);

        // Check if coordinate is approximately within or near Chennai
        const isChennai = lat >= 12.8 && lat <= 13.4 && lng >= 80.0 && lng <= 80.4;

        let locationName = isChennai ? 'Your Chennai Ward GPS' : 'Detected GPS Location';
        let fullAddress = '';
        try {
          const geo = await reverseGeocode(lat, lng);
          if (geo && geo.shortName) {
            locationName = geo.shortName;
            fullAddress = geo.fullName;
          }
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
        }

        setUserLocation({
          lat,
          lng,
          zoom: 14,
          accuracy,
          name: locationName,
          address: fullAddress,
          isManual: false
        });
        setIsLocating(false);

        if (accuracy > 1000) {
          showToast(`Estimated location (±${(accuracy / 1000).toFixed(1)} km). Drag the green pin to refine your exact house or ward!`, 'warning');
        } else if (accuracy > 80) {
          showToast(`Location detected: ${locationName} (±${accuracy}m). Drag pin on map for doorstep precision.`, 'info');
        } else {
          showToast(`Accurate GPS location locked in Chennai: ${locationName}!`, 'success');
        }
      },
      (err) => {
        setIsLocating(false);
        showToast('Location permission denied or unavailable. Click any Chennai zone below to position map.', 'warning');
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Handle user manual click, search, or pin drag on map
  const handleMapClickUpdate = async (coords) => {
    let locationName = coords.name || `Pin (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`;
    let fullAddress = coords.address || '';

    // If reverse-geocoded name is missing (clicked/dragged directly on map), fetch it
    if (!coords.name || coords.name.startsWith('Pin (')) {
      try {
        const geo = await reverseGeocode(coords.lat, coords.lng);
        if (geo && geo.shortName) {
          locationName = geo.shortName;
          fullAddress = geo.fullName;
        }
      } catch (e) {
        console.warn('Reverse geocode error:', e);
      }
    }

    setUserLocation({
      lat: coords.lat,
      lng: coords.lng,
      zoom: coords.zoom || userLocation.zoom || 14,
      accuracy: coords.accuracy || null,
      name: locationName,
      address: fullAddress,
      isManual: true
    });
    showToast(`Origin set to ${locationName}! Distances updated.`, 'info');
  };

  // Handle Quick Zone Click
  const handleSelectDistrict = (zoneKey, zoneInfo) => {
    setSelectedDistrict(zoneKey);
    setUserLocation({
      lat: zoneInfo.lat,
      lng: zoneInfo.lng,
      zoom: zoneInfo.zoom || 13.5,
      name: zoneInfo.label
    });
  };

  // Handle Navigation Trigger
  const handleStartNavigation = (col) => {
    setSelectedCollector(col);
    setUserLocation((prev) => ({
      ...prev,
      lat: prev.lat,
      lng: prev.lng,
      zoom: 13
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
    showToast(`Pickup Request ${newBooking.bookingId} registered successfully!`, 'success');
  };

  const handleRoleSwitched = (roleKey) => {
    showToast(`Switched to ${roleKey.toUpperCase()} service workspace!`, 'success');
    loadCollectors();
    loadFactories();
    if (roleKey === 'dealer') setIsDealerOpen(true);
    if (roleKey === 'factory') setIsFactoryOpen(true);
    if (roleKey === 'admin') setIsAdminOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
        : 'bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white'
    }`}>
      
      {/* Authenticated Persona Status Bar */}
      <RoleSwitcherBar
        onOpenDealerPortal={() => {
          if (isDealer) setIsDealerOpen(true);
          else handleOpenRoleLogin('dealer', 'Dealer authentication required to open Dealer Workspace.');
        }}
        onOpenFactoryPortal={() => {
          if (isFactory) setIsFactoryOpen(true);
          else handleOpenRoleLogin('factory', 'Industrial Factory authentication required to open Sourcing Marketplace.');
        }}
        onOpenAdminPortal={() => {
          if (isAdmin) setIsAdminOpen(true);
          else handleOpenRoleLogin('admin', 'GCC Ripon Municipal Administrative credentials required.');
        }}
        onOpenAuthForRole={(role) => handleOpenRoleLogin(role, '')}
        onOpenBookings={() => setIsBookingsListOpen(true)}
      />

      {/* Navbar */}
      <Navbar
        userLocation={userLocation}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
        locationName={userLocation.name}
        bookingCount={bookings.length}
        onOpenBookings={() => setIsBookingsListOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDealer={() => {
          if (isDealer) setIsDealerOpen(true);
          else handleOpenRoleLogin('dealer', 'Dealer authorization required to access collection operations & warehouse stock.');
        }}
        onOpenFactory={() => {
          if (isFactory) setIsFactoryOpen(true);
          else handleOpenRoleLogin('factory', 'Industrial Factory procurement credentials required to view marketplace.');
        }}
        onOpenAdmin={() => {
          if (isAdmin) setIsAdminOpen(true);
          else handleOpenRoleLogin('admin', 'GCC Ripon Municipal administrative credentials required for compliance audit.');
        }}
        onOpenAuth={() => handleOpenRoleLogin(user?.role || 'customer', '')}
        onOpenRoleLogin={handleOpenRoleLogin}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ============================================================== */}
        {/* ROLE 1: CHENNAI RECOVERY DEALER DASHBOARD */}
        {/* ============================================================== */}
        {isDealer ? (
          <>
            <EcoStatsBanner stats={stats} />
            <DealerDashboardView onBoundaryUpdated={loadCollectors} />
          </>
        ) : isFactory ? (
        /* ============================================================== */
        /* ROLE 2: CHENNAI INDUSTRIAL FACTORY DASHBOARD */
        /* ============================================================== */
          <>
            <EcoStatsBanner stats={stats} />
            <FactoryDashboardView />
          </>
        ) : isAdmin ? (
        /* ============================================================== */
        /* ROLE 3: GCC RIPON MUNICIPAL & TNPCB ADMIN DASHBOARD */
        /* ============================================================== */
          <>
            <EcoStatsBanner stats={stats} />
            <AdminDashboardView onDealerPointAdded={() => { loadCollectors(); loadFactories(); }} />
          </>
        ) : (
        /* ============================================================== */
        /* ROLE 4: CITIZEN CUSTOMER RECYCLING PORTAL (ONLY SEES DEALERS) */
        /* ============================================================== */
          <>
            {/* Top Hero Banner - Chennai Citizen Edition */}
            <div className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-300 ${
              isDark
                ? 'border border-emerald-500/20 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 shadow-2xl'
                : 'border border-emerald-500/25 bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 shadow-lg'
            }`}>
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Citizen Recycling • Greater Chennai Corporation (GCC) & TNPCB Clean City</span>
                </div>

                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Give Household Waste to Verified <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isDark ? 'from-emerald-400 to-teal-300' : 'from-emerald-600 to-teal-500'
                  }`}>Chennai Scrap Dealers</span>
                </h1>

                <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Locate nearby certified recovery dealers across Anna Nagar, Adyar, Guindy, T. Nagar, Perungudi, and Ambattur. Book doorstep waste pickups, get paid live scrap rates, and accumulate eco-reward points.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleOpenBooking(collectors[0] || null)}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Book Doorstep Scrap Pickup</span>
                  </button>

                  <button
                    onClick={handleLocateUser}
                    className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-1.5"
                  >
                    <Compass className="w-4 h-4 text-emerald-500" />
                    <span>Find Nearest Dealer (GPS)</span>
                  </button>

                  <button
                    onClick={() => setIsBookingsListOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-1.5"
                  >
                    <span>My Pickup Bookings ({bookings.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Environmental Stats Metrics */}
            <EcoStatsBanner stats={stats} />

            {/* Section: Manual Waste Type Selector & Chennai Zone Filters */}
            <section className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <WasteTypeFilter
                selectedWasteType={selectedWasteType}
                onSelectWasteType={(type) => {
                  setSelectedWasteType(type);
                  setSelectedCollector(null);
                }}
                matchingCollectorCount={collectors.length}
              />

              {/* Quick Chennai Zone Filter */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
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

            {/* Map & Collector Explorer Dual Panel: CUSTOMER ONLY SEES DEALERS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Map Column (7 cols on Desktop) - Customer Map ONLY displays Dealers */}
              <div className="lg:col-span-7 h-[600px] lg:h-[720px]">
                <TamilNaduMap
                  collectors={collectors}
                  factories={[]}
                  allowFactories={false}
                  selectedCollector={selectedCollector}
                  onSelectCollector={(col) => setSelectedCollector(col)}
                  userLocation={userLocation}
                  onUpdateUserLocation={handleMapClickUpdate}
                  selectedWasteType={selectedWasteType}
                  mapCenter={[userLocation.lat, userLocation.lng]}
                  mapZoom={userLocation.zoom || 12}
                  onStartNavigation={handleStartNavigation}
                  onBookPickup={handleOpenBooking}
                  onLocateGPS={handleLocateUser}
                  isLocating={isLocating}
                />
              </div>

              {/* Collector Cards Column (5 cols on Desktop) - Certified Dealers to Give Waste To */}
              <div className="lg:col-span-5 h-[600px] lg:h-[720px]">
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
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-400">
            EcoVision Chennai • Greater Chennai Corporation (GCC) & TNPCB Circular Resource Management
          </p>
          <p>
            Role-Based Authentication (Customer, Dealer, Factory, Admin) • Fastify & Mongoose API • OpenStreetMap Chennai Grid
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthRequiredMsg('');
        }}
        initialRole={authInitialRole}
        requiredRoleMessage={authRequiredMsg}
        onRoleSwitched={handleRoleSwitched}
      />

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
        userLocation={userLocation}
        onLocateUser={handleLocateUser}
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

      {/* Role-Specific Specialized Operation Portals */}
      <DealerPortalModal
        open={isDealerOpen}
        onClose={() => setIsDealerOpen(false)}
        onOpenRoleLogin={handleOpenRoleLogin}
        onBoundaryUpdated={() => {
          loadCollectors();
          showToast('Dealer collection boundaries updated!', 'success');
        }}
      />

      <FactoryPortalModal
        open={isFactoryOpen}
        onClose={() => setIsFactoryOpen(false)}
        onOpenRoleLogin={handleOpenRoleLogin}
      />

      <AdminPortalModal
        open={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenRoleLogin={handleOpenRoleLogin}
        onDealerPointAdded={() => {
          loadCollectors();
          loadFactories();
          showToast('Chennai dealer points updated on map!', 'success');
        }}
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
          sx={{
            width: '100%',
            bgcolor: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.6)',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
}
