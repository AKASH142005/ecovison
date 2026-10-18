import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck,
  Building,
  Factory,
  Package,
  Layers,
  Scale,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Coins,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Compass,
  ArrowRight,
  TrendingUp,
  FileText,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { LinearProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CHENNAI_ZONE_COORDINATES } from './QuickDistrictSelector';

// Leaflet custom factory icon (Amber)
function createFactoryIcon(factory, isDark = true) {
  return L.divIcon({
    className: 'custom-factory-marker',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(245, 158, 11, 0.25); animation: pulse 2s infinite;"></div>
        <div style="position: absolute; width: 26px; height: 26px; border-radius: 8px; background: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.8); display: flex; align-items: center; justify-content: center; color: #000; font-weight: 900; font-size: 13px;">
          🏭
        </div>
        <div style="position: absolute; bottom: -16px; white-space: nowrap; font-size: 9px; font-weight: 800; background: #0f172a; color: #fbbf24; padding: 1px 6px; border-radius: 999px; border: 1px solid rgba(245, 158, 11, 0.4); pointer-events: none;">
          ${factory.name ? factory.name.split(' ')[0] : 'Factory'}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });
}

// Leaflet custom dealer hub icon (Blue)
function createDealerHubIcon(name, isDark = true) {
  return L.divIcon({
    className: 'custom-dealer-marker',
    html: `
      <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 30px; height: 30px; border-radius: 10px; background: #2563eb; box-shadow: 0 0 16px rgba(59, 130, 246, 0.9); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 14px;">
          🚛
        </div>
        <div style="position: absolute; bottom: -18px; white-space: nowrap; font-size: 10px; font-weight: 900; background: #1e3a8a; color: #93c5fd; padding: 1px 8px; border-radius: 999px; border: 1.5px solid #60a5fa; pointer-events: none;">
          ⭐ YOUR HUB
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -21]
  });
}

export default function DealerDashboardView({ onBoundaryUpdated }) {
  const { isDark } = useThemeMode();
  const { user, refreshAggregations } = useAuth();

  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'pickups' | 'inventory' | 'boundary'
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // Data States
  const [factories, setFactories] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [dealerOrders, setDealerOrders] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Boundary States
  const [serviceRadiusKm, setServiceRadiusKm] = useState(8);
  const [serviceWards, setServiceWards] = useState(['Guindy', 'Adyar', 'Velachery', 'T. Nagar']);
  const [facilityAddress, setFacilityAddress] = useState(user?.address || 'SIDCO Industrial Estate, Guindy, Chennai');
  const [facilityLat, setFacilityLat] = useState(user?.lat || 13.0067);
  const [facilityLng, setFacilityLng] = useState(user?.lng || 80.2012);
  const [savingBoundary, setSavingBoundary] = useState(false);

  // Bidding / Commit PO State
  const [biddingReq, setBiddingReq] = useState(null);
  const [bidKg, setBidKg] = useState('1000');
  const [bidPrice, setBidPrice] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);

  // Dispatch Consignment State
  const [shippingPO, setShippingPO] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('TN 09 BX 4412');
  const [submittingShip, setSubmittingShip] = useState(false);

  // Weighbridge Pickup Completion State
  const [completingPickup, setCompletingPickup] = useState(null);
  const [actualWeightKg, setActualWeightKg] = useState('12.5');
  const [submittingComplete, setSubmittingComplete] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [facRes, reqRes, orderRes, pickupRes, invRes, boundRes] = await Promise.allSettled([
        api.getFactories({ lat: facilityLat, lng: facilityLng }),
        api.getMarketplaceRequirements(),
        api.getMarketplaceOrders(),
        api.getDealerPickups(),
        api.getDealerInventory(),
        api.getDealerBoundary()
      ]);

      if (facRes.status === 'fulfilled' && facRes.value.factories) {
        setFactories(facRes.value.factories);
      }
      if (reqRes.status === 'fulfilled' && reqRes.value.requirements) {
        setRequirements(reqRes.value.requirements);
      }
      if (orderRes.status === 'fulfilled' && orderRes.value.orders) {
        setDealerOrders(orderRes.value.orders);
      }
      if (pickupRes.status === 'fulfilled' && pickupRes.value.pickups) {
        setPickups(pickupRes.value.pickups);
      }
      if (invRes.status === 'fulfilled' && invRes.value.inventory) {
        setInventory(invRes.value.inventory);
      }
      if (boundRes.status === 'fulfilled' && boundRes.value.boundary) {
        const b = boundRes.value.boundary;
        if (b.serviceRadiusKm) setServiceRadiusKm(b.serviceRadiusKm);
        if (b.serviceWards && b.serviceWards.length > 0) setServiceWards(b.serviceWards);
        if (b.address) setFacilityAddress(b.address);
        if (b.lat) setFacilityLat(b.lat);
        if (b.lng) setFacilityLng(b.lng);
      }
    } catch (e) {
      console.error('Error loading dealer dashboard data:', e);
    } finally {
      setLoading(false);
    }
  }, [facilityLat, facilityLng]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Bidding / Committing Stock to Factory Requirement
  const handleConfirmBid = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!biddingReq) return;

    const commitQty = parseFloat(bidKg);
    if (!commitQty || commitQty <= 0) {
      setStatusMsg({ text: 'Please enter a valid weight in kg to sell.', type: 'error' });
      return;
    }

    setSubmittingBid(true);
    try {
      const res = await api.createPurchaseOrder({
        requirementId: biddingReq._id || biddingReq.requirementId,
        quantityKg: commitQty,
        factoryId: biddingReq.factoryId,
        factoryName: biddingReq.factoryName,
        category: biddingReq.category,
        unitPrice: parseFloat(bidPrice || biddingReq.offeredPricePerKg),
        notes: `Committed by ${user?.facilityName || 'Guindy Dealer Hub'} for prompt truck delivery.`
      });

      if (res.success) {
        setStatusMsg({
          text: `Success! Purchase Order ${res.order?.poNumber || ''} created for ${commitQty} kg @ ₹${bidPrice || biddingReq.offeredPricePerKg}/kg. Ready to dispatch truck!`,
          type: 'success'
        });
        setBiddingReq(null);
        await loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to commit sale to factory.', type: 'error' });
    } finally {
      setSubmittingBid(false);
    }
  };

  // Handle Dispatch Consignment Truck
  const handleConfirmShipment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!shippingPO) return;

    if (!vehicleNumber.trim()) {
      setStatusMsg({ text: 'Please specify the vehicle registration number.', type: 'error' });
      return;
    }

    setSubmittingShip(true);
    try {
      const res = await api.shipPurchaseOrder(shippingPO._id || shippingPO.poNumber, {
        vehicleNumber: vehicleNumber.trim(),
        notes: 'Dispatched via Chennai Industrial Truck Corridor.'
      });

      if (res.success) {
        setStatusMsg({
          text: `Consignment truck ${vehicleNumber} dispatched for PO ${shippingPO.poNumber}! Inbound at factory weighbridge gate.`,
          type: 'success'
        });
        setShippingPO(null);
        await loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to dispatch shipment.', type: 'error' });
    } finally {
      setSubmittingShip(false);
    }
  };

  // Handle Citizen Pickup Status Transitions
  const handleAcceptPickup = async (pickupId) => {
    try {
      const res = await api.updateBookingStatus(pickupId, 'accepted');
      if (res.success) {
        setStatusMsg({ text: `Pickup #${pickupId} accepted! Assigned to recovery vehicle.`, type: 'success' });
        loadData();
      }
    } catch (e) {
      setStatusMsg({ text: e.message || 'Failed to accept pickup.', type: 'error' });
    }
  };

  const handleInTransitPickup = async (pickupId) => {
    try {
      const res = await api.updateBookingStatus(pickupId, 'in_transit');
      if (res.success) {
        setStatusMsg({ text: `Vehicle dispatched to doorstep for pickup #${pickupId}.`, type: 'info' });
        loadData();
      }
    } catch (e) {
      setStatusMsg({ text: e.message || 'Failed to update transit status.', type: 'error' });
    }
  };

  const handleCompletePickup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!completingPickup) return;

    const finalWeight = parseFloat(actualWeightKg);
    if (!finalWeight || finalWeight <= 0) {
      setStatusMsg({ text: 'Please enter verified weighbridge scale weight in kg.', type: 'error' });
      return;
    }

    setSubmittingComplete(true);
    try {
      const res = await api.completePickup(completingPickup._id || completingPickup.bookingId, {
        actualWeightKg: finalWeight,
        notes: 'Weighed on TNPCB certified digital scale. Cash/Eco-Points disbursed to citizen.'
      });

      if (res.success) {
        setStatusMsg({
          text: `Verified ${finalWeight} kg scrap collected! Added to your baled warehouse stock.`,
          type: 'success'
        });
        setCompletingPickup(null);
        await loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to complete pickup verification.', type: 'error' });
    } finally {
      setSubmittingComplete(false);
    }
  };

  // Handle Save Boundary Settings
  const handleSaveBoundary = async () => {
    setSavingBoundary(true);
    try {
      const res = await api.updateDealerBoundary({
        serviceRadiusKm,
        serviceWards,
        address: facilityAddress,
        lat: facilityLat,
        lng: facilityLng
      });

      if (res.success) {
        setStatusMsg({
          text: `Dealer collection boundary updated to ${serviceRadiusKm} km radius (${serviceWards.join(', ')})!`,
          type: 'success'
        });
        if (onBoundaryUpdated) onBoundaryUpdated();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to update boundary.', type: 'error' });
    } finally {
      setSavingBoundary(false);
    }
  };

  const handleToggleWard = (ward) => {
    setServiceWards(prev =>
      prev.includes(ward) ? prev.filter(w => w !== ward) : [...prev, ward]
    );
  };

  const totalBaledStock = inventory.reduce((sum, item) => sum + (item.availableKg || 0), 0);
  const activePickupsCount = pickups.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length;

  return (
    <div className="space-y-6">

      {/* Dealer Command Header Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950 border-blue-500/30'
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50/70 border-blue-200'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              <Truck className="w-3.5 h-3.5" />
              <span>Chennai Recovery Dealer Trading Desk • B2B Factory Exchange</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {user?.facilityName || 'Guindy Eco-Recovery Industrial Hub'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Cluster: <strong>{user?.district || 'Guindy (Zone 12)'}</strong> • TNPCB Certified Material Recovery Facility.
              Intake waste from doorstep citizens and sell baled truck consignments directly to industrial factories.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Baled Stock</span>
              <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                {totalBaledStock.toLocaleString()} kg
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Intake Queue</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                {activePickupsCount} pickups
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Boundary</span>
              <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">
                {serviceRadiusKm} km radius
              </span>
            </div>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMsg.text && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
            statusMsg.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              : statusMsg.type === 'info'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg({ text: '', type: '' })} className="hover:opacity-75">
              ×
            </button>
          </div>
        )}
      </div>

      {/* Main Dealer Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'marketplace'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/50'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Factory className="w-4 h-4 text-slate-950" />
            <span>Sell Scrap to Factories (B2B Demands)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-slate-950/20 text-slate-950">
              {requirements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pickups')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'pickups'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Truck className="w-4 h-4 text-blue-500" />
            <span>Citizen Doorstep Pickups (Intake)</span>
            {activePickupsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white/20 text-white">
                {activePickupsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Package className="w-4 h-4 text-blue-500" />
            <span>Warehouse Baled Stock</span>
          </button>

          <button
            onClick={() => setActiveTab('boundary')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'boundary'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4 text-blue-500" />
            <span>Collection Boundary ({serviceRadiusKm} km)</span>
          </button>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all shrink-0"
          title="Refresh Dealer Operations"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: SELL TO FACTORIES (B2B REQUIREMENTS & BIDDING) */}
      {/* ============================================================== */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">

          {/* Interactive Dual Panel: Map of Factories (Left) + Factory Demands & Bidding (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Map Column: Chennai Factories & Dealer Hub (7 cols) */}
            <div className="lg:col-span-7 h-[500px] lg:h-[620px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative">
              <MapContainer
                center={[13.0400, 80.2200]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Dealer's own Hub Marker and Service Boundary */}
                <Marker
                  position={[facilityLat, facilityLng]}
                  icon={createDealerHubIcon(user?.facilityName, isDark)}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900">
                      <div className="font-black text-xs text-blue-700">⭐ {user?.facilityName || 'Your Hub'}</div>
                      <div className="text-[11px] text-slate-600">{facilityAddress}</div>
                      <div className="text-[10px] font-bold text-emerald-600">
                        Baled Stock: {totalBaledStock.toLocaleString()} kg
                      </div>
                    </div>
                  </Popup>
                </Marker>

                <Circle
                  center={[facilityLat, facilityLng]}
                  radius={serviceRadiusKm * 1000}
                  pathOptions={{
                    color: '#2563eb',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.12,
                    weight: 2,
                    dashArray: '6, 6'
                  }}
                />

                {/* Industrial Factories Markers */}
                {factories.map((fac) => (
                  <Marker
                    key={fac._id || `fac_${fac.lat}-${fac.lng}`}
                    position={[fac.lat, fac.lng]}
                    icon={createFactoryIcon(fac, isDark)}
                  >
                    <Popup>
                      <div className="p-1 space-y-1.5 text-slate-900 max-w-[220px]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-amber-700">🏭 {fac.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            {fac.district}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{fac.address}</p>
                        <div className="text-[10px] font-bold text-slate-500">
                          Corridor: <strong>{fac.industrialBelt || 'Industrial Corridor'}</strong>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold">
                          Demand: {fac.procurementDemands?.map(d => `${d.category} (₹${d.offeredRatePerKg}/kg)`).join(', ') || 'Bulk rPET, Steel, Cardboard'}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map Floating Legend */}
              <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md text-xs space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
                  Map Guide for Dealer:
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-md bg-amber-500 inline-block"></span>
                  <span>🏭 Industrial Factories (Procurement Buyers)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                  <span>🚛 Your Recovery Depot & {serviceRadiusKm} km Boundary</span>
                </div>
              </div>
            </div>

            {/* Factory Demands & Bidding Action Panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-500" />
                    <span>Factories Buying Bulk Scrap</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bid your baled stock and confirm purchase orders directly.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {requirements.length} Active Demands
                </span>
              </div>

              {/* Requirements Scrollable Cards */}
              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                {requirements.map((req) => {
                  const matchingInv = inventory.find(i => i.category === req.category);
                  const availableStock = matchingInv ? matchingInv.availableKg : 0;
                  const totalPayout = (req.quantityNeededKg * req.offeredPricePerKg);

                  return (
                    <div
                      key={req._id || req.requirementId}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/50 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                            {req.requirementId} • {req.district || 'Chennai'}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {req.factoryName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Grade: <strong>{req.grade}</strong> ({req.category?.toUpperCase()})
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block">
                            ₹{req.offeredPricePerKg}/kg
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Est. ₹{totalPayout.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Target Needed:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {req.quantityNeededKg.toLocaleString()} kg
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Your Warehouse Stock:</span>
                          <span className={`font-bold ${availableStock > 0 ? 'text-blue-500' : 'text-slate-400'}`}>
                            {availableStock.toLocaleString()} kg {availableStock > 0 ? '✓' : '(Low)'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setBiddingReq(req);
                          setBidKg(String(Math.min(availableStock > 0 ? availableStock : 1000, req.quantityNeededKg)));
                          setBidPrice(String(req.offeredPricePerKg));
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Bid & Sell Waste (Commit PO)</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Dealer Dispatched Purchase Orders Overview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span>Your Factory Purchase Orders</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {dealerOrders.length} Dispatched
                  </span>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {dealerOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 p-3 text-center border border-dashed rounded-xl">
                      No purchase orders yet. Select a factory above to commit stock.
                    </p>
                  ) : (
                    dealerOrders.map(po => (
                      <div
                        key={po._id || po.poNumber}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs flex items-center justify-between gap-2 border border-slate-100 dark:border-slate-800"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{po.poNumber}</span>
                            <span className="text-[10px] text-slate-400">→ {po.factoryName}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {po.quantityKg} kg • ₹{po.totalAmount?.toLocaleString()} • Status: <strong>{po.status}</strong>
                          </div>
                        </div>

                        {po.status === 'created' && (
                          <button
                            onClick={() => {
                              setShippingPO(po);
                              setVehicleNumber('TN 09 BX 4412');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shrink-0"
                          >
                            Dispatch Truck
                          </button>
                        )}
                        {po.status === 'shipped' && (
                          <span className="text-[10px] font-bold text-blue-500 shrink-0">
                            🚚 In Transit ({po.vehicleNumber})
                          </span>
                        )}
                        {po.status === 'verified' && (
                          <span className="text-[10px] font-bold text-emerald-500 shrink-0">
                            ✓ Verified & Paid
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: INBOUND CITIZEN PICKUPS (WEIGHBRIDGE INTAKE QUEUE) */}
      {/* ============================================================== */}
      {activeTab === 'pickups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                <span>Doorstep Scrap Pickups in Your Boundary ({serviceRadiusKm} km)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Citizen scrap requests in your assigned Chennai wards. Accept, dispatch vehicle, and certify weighbridge scale weights.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {pickups.length} Total Bookings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pickups.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                No active doorstep pickup requests in your catchment radius right now.
              </div>
            ) : (
              pickups.map(p => {
                const isPending = p.status === 'pending';
                const isAccepted = p.status === 'accepted';
                const isInTransit = p.status === 'in_transit';
                const isCompleted = p.status === 'completed';

                return (
                  <div
                    key={p._id || p.bookingId}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-black text-blue-600 dark:text-blue-400">
                          {p.bookingId}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {p.customerName || 'Citizen Scrap Seller'}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{p.address}</span>
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isAccepted || isInTransit
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {p.status?.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Material:</span>
                        <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
                          {p.wasteType}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Est. Weight:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {p.estimatedWeightKg} kg
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      {isPending && (
                        <button
                          onClick={() => handleAcceptPickup(p._id || p.bookingId)}
                          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Accept Booking
                        </button>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() => handleInTransitPickup(p._id || p.bookingId)}
                          className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Dispatch Vehicle (In Transit)
                        </button>
                      )}

                      {(isAccepted || isInTransit) && (
                        <button
                          onClick={() => {
                            setCompletingPickup(p);
                            setActualWeightKg(String(p.estimatedWeightKg || 10));
                          }}
                          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Weigh Scale & Complete</span>
                        </button>
                      )}

                      {isCompleted && (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verified: {p.actualWeightKg} kg (Paid ₹{p.estimatedReward})</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: WAREHOUSE BALED STOCK & INVENTORY */}
      {/* ============================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                Certified Material Recovery Depot Stock
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalBaledStock.toLocaleString()} kg Ready for Industrial Supply
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Landfill Waste Diverted:</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {inventory.reduce((a, c) => a + (c.totalCollectedKg || 0), 0).toLocaleString()} kg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => {
              const maxCap = 5000;
              const pct = Math.min(100, Math.round(((item.availableKg || 0) / maxCap) * 100));

              return (
                <div
                  key={item._id || item.category}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {item.availableKg} kg
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Baling Capacity Load</span>
                      <span>{pct}%</span>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: isDark ? '#1e293b' : '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: pct > 80 ? '#f59e0b' : '#3b82f6',
                          borderRadius: 4
                        }
                      }}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Total Inward: {item.totalCollectedKg} kg</span>
                    <span>Dispatched: {item.totalDispatchedKg || 0} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: COLLECTION BOUNDARY & SERVICE WARDS */}
      {/* ============================================================== */}
      {activeTab === 'boundary' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" />
                <span>Configure Doorstep Waste Collection Catchment</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Citizens inside this boundary will see your hub highlighted as their nearest doorstep pickup provider.
              </p>
            </div>

            {/* Service Radius Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Service Catchment Radius:
                </span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {serviceRadiusKm} Kilometers
                </span>
              </div>

              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={serviceRadiusKm}
                onChange={(e) => setServiceRadiusKm(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2 km (Local Ward)</span>
                <span>8 km (Zone Hub)</span>
                <span>15 km (Central Chennai)</span>
                <span>30 km (Metropolitan Grid)</span>
              </div>
            </div>

            {/* Chennai Wards Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Active Chennai Collection Zones ({serviceWards.length} selected):
              </label>

              <div className="flex flex-wrap gap-2">
                {Object.keys(CHENNAI_ZONE_COORDINATES).map(ward => {
                  const isChecked = serviceWards.includes(ward);

                  return (
                    <button
                      key={ward}
                      type="button"
                      onClick={() => handleToggleWard(ward)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{ward}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Boundary Button */}
            <div className="pt-2">
              <button
                onClick={handleSaveBoundary}
                disabled={savingBoundary}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <span>{savingBoundary ? 'Saving Boundary...' : 'Save Collection Catchment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: BID & SELL WASTE TO FACTORY (PO COMMITMENT) */}
      {/* ============================================================== */}
      {biddingReq && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase">
                  Direct Factory Procurement Contract
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Sell Scrap to {biddingReq.factoryName}
                </h3>
              </div>
              <button onClick={() => setBiddingReq(null)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            <form onSubmit={handleConfirmBid} className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
                Target: <strong>{biddingReq.quantityNeededKg.toLocaleString()} kg</strong> of {biddingReq.grade} ({biddingReq.category?.toUpperCase()})
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity You Commit to Supply (kg):
                </label>
                <input
                  type="number"
                  min="100"
                  max={biddingReq.quantityNeededKg}
                  value={bidKg}
                  onChange={(e) => setBidKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:outline-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Agreed Rate per kg (₹):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={bidPrice || biddingReq.offeredPricePerKg}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:outline-blue-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Purchase Order Value:</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  ₹{((parseFloat(bidKg) || 0) * (parseFloat(bidPrice || biddingReq.offeredPricePerKg) || 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBiddingReq(null)}
                  className="flex-1 py-2 rounded-xl border text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBid}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
                >
                  {submittingBid ? 'Creating PO...' : 'Confirm Sale & Create PO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: DISPATCH TRUCK SHIPMENT */}
      {/* ============================================================== */}
      {shippingPO && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/40 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase">
                  Consignment Transport Gate
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Dispatch Truck for {shippingPO.poNumber}
                </h3>
              </div>
              <button onClick={() => setShippingPO(null)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            <form onSubmit={handleConfirmShipment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Truck Vehicle Registration Number:
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. TN 09 BX 4412"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-600 dark:text-blue-400">
                Consignment: <strong>{shippingPO.quantityKg} kg {shippingPO.category}</strong> to {shippingPO.factoryName}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShippingPO(null)}
                  className="flex-1 py-2 rounded-xl border text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingShip}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md"
                >
                  {submittingShip ? 'Dispatching...' : 'Confirm Truck Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: WEIGHBRIDGE SCALE PICKUP COMPLETION */}
      {/* ============================================================== */}
      {completingPickup && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black text-emerald-500 uppercase">
                  TNPCB Weighbridge Scale Certification
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Certify Weight for Pickup #{completingPickup.bookingId}
                </h3>
              </div>
              <button onClick={() => setCompletingPickup(null)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            <form onSubmit={handleCompletePickup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Actual Digital Scale Weight (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={actualWeightKg}
                  onChange={(e) => setActualWeightKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300">
                Customer: <strong>{completingPickup.customerName}</strong> ({completingPickup.wasteType})
                <br />
                Estimated Cash/Reward: ₹{((parseFloat(actualWeightKg) || 0) * 19).toFixed(0)}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingPickup(null)}
                  className="flex-1 py-2 rounded-xl border text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComplete}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md"
                >
                  {submittingComplete ? 'Certifying...' : 'Certify Scale Weight & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
