import React from 'react';
import HeroBanner from '../layout/HeroBanner';
import EcoStatsBanner from '../common/EcoStatsBanner';
import WasteTypeFilter from './WasteTypeFilter';
import QuickDistrictSelector from './QuickDistrictSelector';
import NavigationRoutePanel from './NavigationRoutePanel';
import TamilNaduMap from '../map/TamilNaduMap';
import CollectorList from './CollectorList';

export default function CustomerHomeView({
  stats,
  collectors = [],
  selectedCollector,
  setSelectedCollector,
  userLocation,
  handleLocateUser,
  isLocating,
  handleMapClickUpdate,
  selectedDistrict,
  handleSelectDistrict,
  districts,
  selectedWasteType,
  setSelectedWasteType,
  searchTerm,
  setSearchTerm,
  isLoading,
  handleStartNavigation,
  handleOpenDetails,
  handleOpenBooking,
  bookings = [],
  setIsBookingsListOpen
}) {
  return (
    <>
      {/* Top Hero Banner - Chennai Citizen Edition */}
      <HeroBanner
        collectors={collectors}
        bookingCount={bookings.length}
        onOpenBooking={() => handleOpenBooking(collectors[0] || null)}
        onLocateUser={handleLocateUser}
        onOpenBookings={() => setIsBookingsListOpen(true)}
      />

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
  );
}
