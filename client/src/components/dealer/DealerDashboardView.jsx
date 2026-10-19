import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck,
  Factory,
  Package,
  Sliders,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import DealerMarketplaceTab from './tabs/DealerMarketplaceTab';
import DealerPickupsTab from './tabs/DealerPickupsTab';
import DealerInventoryTab from './tabs/DealerInventoryTab';
import DealerBoundaryTab from './tabs/DealerBoundaryTab';
import DealerBidModal from './modals/DealerBidModal';
import DealerDispatchModal from './modals/DealerDispatchModal';
import DealerWeighModal from './modals/DealerWeighModal';

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

  // Modals States
  const [biddingReq, setBiddingReq] = useState(null);
  const [bidKg, setBidKg] = useState('1000');
  const [bidPrice, setBidPrice] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);

  const [shippingPO, setShippingPO] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('TN 09 BX 4412');
  const [submittingShip, setSubmittingShip] = useState(false);

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
        if (b.lat && b.lat !== facilityLat) setFacilityLat(b.lat);
        if (b.lng && b.lng !== facilityLng) setFacilityLng(b.lng);
      }
    } catch (err) {
      console.error('Failed to load dealer workspace data:', err);
      setStatusMsg({ text: 'Error loading dealer operations data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle B2B Sale Confirmation
  const handleConfirmBid = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!biddingReq) return;

    const commitQty = parseFloat(bidKg);
    if (!commitQty || commitQty <= 0) {
      setStatusMsg({ text: 'Please enter a valid weight in kg to commit.', type: 'error' });
      return;
    }

    setSubmittingBid(true);
    try {
      const res = await api.createPurchaseOrder({
        requirementId: biddingReq.requirementId,
        quantityKg: commitQty,
        agreedPricePerKg: parseFloat(bidPrice) || biddingReq.offeredPricePerKg,
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

      {/* Tabs Content */}
      {activeTab === 'marketplace' && (
        <DealerMarketplaceTab
          facilityLat={facilityLat}
          facilityLng={facilityLng}
          facilityAddress={facilityAddress}
          serviceRadiusKm={serviceRadiusKm}
          user={user}
          isDark={isDark}
          totalBaledStock={totalBaledStock}
          factories={factories}
          requirements={requirements}
          inventory={inventory}
          dealerOrders={dealerOrders}
          onOpenBid={(req, availableStock) => {
            setBiddingReq(req);
            setBidKg(String(Math.min(availableStock > 0 ? availableStock : 1000, req.quantityNeededKg)));
            setBidPrice(String(req.offeredPricePerKg));
          }}
          onOpenDispatch={(po) => {
            setShippingPO(po);
            setVehicleNumber('TN 09 BX 4412');
          }}
        />
      )}

      {activeTab === 'pickups' && (
        <DealerPickupsTab
          pickups={pickups}
          serviceRadiusKm={serviceRadiusKm}
          onAcceptPickup={handleAcceptPickup}
          onInTransitPickup={handleInTransitPickup}
          onOpenComplete={(p) => {
            setCompletingPickup(p);
            setActualWeightKg(String(p.estimatedWeightKg || 10));
          }}
        />
      )}

      {activeTab === 'inventory' && (
        <DealerInventoryTab
          inventory={inventory}
          totalBaledStock={totalBaledStock}
          isDark={isDark}
        />
      )}

      {activeTab === 'boundary' && (
        <DealerBoundaryTab
          serviceRadiusKm={serviceRadiusKm}
          setServiceRadiusKm={setServiceRadiusKm}
          serviceWards={serviceWards}
          handleToggleWard={handleToggleWard}
          handleSaveBoundary={handleSaveBoundary}
          savingBoundary={savingBoundary}
        />
      )}

      {/* Modals */}
      <DealerBidModal
        biddingReq={biddingReq}
        onClose={() => setBiddingReq(null)}
        bidKg={bidKg}
        setBidKg={setBidKg}
        bidPrice={bidPrice}
        setBidPrice={setBidPrice}
        submittingBid={submittingBid}
        onSubmit={handleConfirmBid}
      />

      <DealerDispatchModal
        shippingPO={shippingPO}
        onClose={() => setShippingPO(null)}
        vehicleNumber={vehicleNumber}
        setVehicleNumber={setVehicleNumber}
        submittingShip={submittingShip}
        onSubmit={handleConfirmShipment}
      />

      <DealerWeighModal
        completingPickup={completingPickup}
        onClose={() => setCompletingPickup(null)}
        actualWeightKg={actualWeightKg}
        setActualWeightKg={setActualWeightKg}
        submittingComplete={submittingComplete}
        onSubmit={handleCompletePickup}
      />
    </div>
  );
}
