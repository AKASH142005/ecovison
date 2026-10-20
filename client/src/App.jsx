import React, { useState, useCallback } from 'react';
import { useThemeMode } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { useLocationManager } from './hooks/useLocationManager';
import { useEcoData } from './hooks/useEcoData';
import {
  Navbar,
  Footer,
  CustomerHomeView,
  EcoStatsBanner,
  DealerDashboardView,
  FactoryDashboardView,
  AdminDashboardView,
  AuthModal,
  CollectorDetailModal,
  BookingModal,
  BookingsListModal,
  RecyclingTipsModal,
  ToastSnackbar
} from './components';

export default function App() {
  const { isDark } = useThemeMode();
  const { user, isDealer, isFactory, isAdmin } = useAuth();

  // Toast notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const showToast = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Location & Geocoding Hook
  const {
    userLocation,
    setUserLocation,
    isLocating,
    selectedDistrict,
    handleLocateUser,
    handleMapClickUpdate,
    handleSelectDistrict
  } = useLocationManager(showToast);

  // Filters & Search
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Active / Selected Collector for Navigation
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [modalCollector, setModalCollector] = useState(null);

  // Modals Visibility
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingsListOpen, setIsBookingsListOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('customer');
  const [authRequiredMsg, setAuthRequiredMsg] = useState('');

  // Data Management Hook
  const {
    collectors,
    factories,
    districts,
    stats,
    bookings,
    addBooking,
    isLoading,
    loadCollectors,
    loadFactories
  } = useEcoData(userLocation, selectedDistrict, selectedWasteType, searchTerm, showToast);

  // Role Switch & Auth triggers
  const handleOpenRoleLogin = useCallback((role, message = '') => {
    setAuthInitialRole(role);
    setAuthRequiredMsg(message);
    setIsAuthOpen(true);
  }, []);

  const handleRoleSwitched = useCallback((roleKey) => {
    showToast(`Switched to ${roleKey.toUpperCase()} service workspace!`, 'success');
  }, [showToast]);

  const handleStartNavigation = useCallback((col) => {
    setSelectedCollector(col);
    setUserLocation((prev) => ({ ...prev, zoom: 13 }));
    showToast(`Navigating to ${col.name} (${col.distanceKm} km)`, 'success');
  }, [setUserLocation, showToast]);

  const handleOpenDetails = useCallback((col) => {
    setModalCollector(col);
    setIsDetailOpen(true);
  }, []);

  const handleOpenBooking = useCallback((col) => {
    setModalCollector(col || selectedCollector);
    setIsBookingOpen(true);
  }, [selectedCollector]);

  const handleBookingSuccess = useCallback((newBooking) => {
    addBooking(newBooking);
    showToast(`Pickup Request ${newBooking.bookingId} registered successfully!`, 'success');
  }, [addBooking, showToast]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
        : 'bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white'
    }`}>

      {/* Main Navbar */}
      <Navbar
        userLocation={userLocation}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
        locationName={userLocation.name}
        bookingCount={bookings.length}
        onOpenBookings={() => setIsBookingsListOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAuth={() => handleOpenRoleLogin(user?.role || 'customer', '')}
        onOpenRoleLogin={handleOpenRoleLogin}
      />

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isDealer ? (
          <>
            <EcoStatsBanner stats={stats} />
            <DealerDashboardView onBoundaryUpdated={loadCollectors} />
          </>
        ) : isFactory ? (
          <>
            <EcoStatsBanner stats={stats} />
            <FactoryDashboardView />
          </>
        ) : isAdmin ? (
          <>
            <EcoStatsBanner stats={stats} />
            <AdminDashboardView onDealerPointAdded={() => { loadCollectors(); loadFactories(); }} />
          </>
        ) : (
          <CustomerHomeView
            stats={stats}
            collectors={collectors}
            selectedCollector={selectedCollector}
            setSelectedCollector={setSelectedCollector}
            userLocation={userLocation}
            handleLocateUser={handleLocateUser}
            isLocating={isLocating}
            handleMapClickUpdate={handleMapClickUpdate}
            selectedDistrict={selectedDistrict}
            handleSelectDistrict={handleSelectDistrict}
            districts={districts}
            selectedWasteType={selectedWasteType}
            setSelectedWasteType={setSelectedWasteType}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={isLoading}
            handleStartNavigation={handleStartNavigation}
            handleOpenDetails={handleOpenDetails}
            handleOpenBooking={handleOpenBooking}
            bookings={bookings}
            setIsBookingsListOpen={setIsBookingsListOpen}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Application Modals */}
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

      {/* Toast Alert Snackbar */}
      <ToastSnackbar
        snackbar={snackbar}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
