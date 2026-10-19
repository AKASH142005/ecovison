// Layout components
export { default as Navbar } from './layout/Navbar';
export { default as RoleSwitcherBar } from './layout/RoleSwitcherBar';
export { default as HeroBanner } from './layout/HeroBanner';
export { default as Footer } from './layout/Footer';

// Customer components & views
export { default as CustomerHomeView } from './customer/CustomerHomeView';
export { default as CollectorList } from './customer/CollectorList';
export { default as CollectorCard } from './customer/CollectorCard';
export { default as WasteTypeFilter } from './customer/WasteTypeFilter';
export { default as QuickDistrictSelector, CHENNAI_ZONE_COORDINATES, TN_DISTRICT_COORDINATES } from './customer/QuickDistrictSelector';
export { default as NavigationRoutePanel } from './customer/NavigationRoutePanel';

// Dealer components & views
export { default as DealerDashboardView } from './dealer/DealerDashboardView';
export { default as DealerMarketplaceTab } from './dealer/tabs/DealerMarketplaceTab';
export { default as DealerPickupsTab } from './dealer/tabs/DealerPickupsTab';
export { default as DealerInventoryTab } from './dealer/tabs/DealerInventoryTab';
export { default as DealerBoundaryTab } from './dealer/tabs/DealerBoundaryTab';
export { default as DealerBidModal } from './dealer/modals/DealerBidModal';
export { default as DealerDispatchModal } from './dealer/modals/DealerDispatchModal';
export { default as DealerWeighModal } from './dealer/modals/DealerWeighModal';

// Factory components & views
export { default as FactoryDashboardView } from './factory/FactoryDashboardView';
export { default as FactoryRequirementsTab } from './factory/tabs/FactoryRequirementsTab';
export { default as FactoryShipmentsTab } from './factory/tabs/FactoryShipmentsTab';
export { default as FactoryInspectModal } from './factory/modals/FactoryInspectModal';

// Admin components & views
export { default as AdminDashboardView } from './admin/AdminDashboardView';
export { default as AdminOverviewTab } from './admin/tabs/AdminOverviewTab';
export { default as AdminDealersTab } from './admin/tabs/AdminDealersTab';
export { default as AdminAuditTab } from './admin/tabs/AdminAuditTab';
export { default as AdminTestSuiteTab } from './admin/tabs/AdminTestSuiteTab';

// Map components
export { default as TamilNaduMap } from './map/TamilNaduMap';
export { default as LocationSearchBar } from './map/LocationSearchBar';
export * from './map/mapIcons';

// Modals
export { default as AuthModal } from './modals/AuthModal';
export { default as BookingModal } from './modals/BookingModal';
export { default as BookingsListModal } from './modals/BookingsListModal';
export { default as CollectorDetailModal } from './modals/CollectorDetailModal';
export { default as RecyclingTipsModal } from './modals/RecyclingTipsModal';

// Common
export { default as EcoStatsBanner } from './common/EcoStatsBanner';
export { default as ToastSnackbar } from './common/ToastSnackbar';
