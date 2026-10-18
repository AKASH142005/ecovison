import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  X,
  Truck,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  Send,
  AlertCircle,
  Coins,
  ShieldCheck,
  RefreshCw,
  Building,
  Check,
  Calendar,
  Phone,
  ArrowRight,
  Sliders,
  Compass,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CHENNAI_ZONE_COORDINATES } from './QuickDistrictSelector';

export default function DealerPortalModal({ open, onClose, onBoundaryUpdated, onOpenRoleLogin }) {
  const { isDark } = useThemeMode();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('pickups'); // 'pickups' | 'inventory' | 'marketplace' | 'boundary'
  const [pickups, setPickups] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [dealerOrders, setDealerOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Boundary Settings State
  const [serviceRadiusKm, setServiceRadiusKm] = useState(8);
  const [serviceWards, setServiceWards] = useState(['Guindy', 'Adyar', 'Velachery', 'T. Nagar']);
  const [facilityAddress, setFacilityAddress] = useState('');
  const [facilityLat, setFacilityLat] = useState(13.0067);
  const [facilityLng, setFacilityLng] = useState(80.2012);
  const [savingBoundary, setSavingBoundary] = useState(false);
  const [boundaryStatusMsg, setBoundaryStatusMsg] = useState('');

  // Weighed collection completion state
  const [completingPickup, setCompletingPickup] = useState(null);
  const [actualWeightKg, setActualWeightKg] = useState('');
  const [completeNotes, setCompleteNotes] = useState('');

  // PO creation state
  const [committingReq, setCommittingReq] = useState(null);
  const [commitKg, setCommitKg] = useState('');

  // Shipment dispatch state
  const [shippingPO, setShippingPO] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');

  const [statusMsg, setStatusMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [pickupRes, invRes, reqRes, orderRes, boundRes] = await Promise.allSettled([
        api.getDealerPickups(),
        api.getDealerInventory(),
        api.getMarketplaceRequirements(),
        api.getMarketplaceOrders(),
        api.getDealerBoundary()
      ]);

      if (pickupRes.status === 'fulfilled' && pickupRes.value.pickups) {
        setPickups(pickupRes.value.pickups);
      }
      if (invRes.status === 'fulfilled' && invRes.value.inventory) {
        setInventory(invRes.value.inventory);
      }
      if (reqRes.status === 'fulfilled' && reqRes.value.requirements) {
        setRequirements(reqRes.value.requirements);
      }
      if (orderRes.status === 'fulfilled' && orderRes.value.orders) {
        setDealerOrders(orderRes.value.orders);
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
      console.error('Error loading dealer portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user?.role === 'dealer') {
      loadData();
    }
  }, [open, user?.role]);

  // Handle Ward Selection Toggle
  const handleToggleWard = (ward) => {
    setServiceWards(prev => {
      if (prev.includes(ward)) {
        return prev.filter(w => w !== ward);
      } else {
        return [...prev, ward];
      }
    });
  };

  // Handle Save Waste Collection Boundary
  const handleSaveBoundary = async () => {
    setSavingBoundary(true);
    setBoundaryStatusMsg('');
    try {
      const res = await api.updateDealerBoundary({
        serviceRadiusKm: parseFloat(serviceRadiusKm),
        serviceWards,
        address: facilityAddress,
        lat: parseFloat(facilityLat),
        lng: parseFloat(facilityLng)
      });
      if (res.success) {
        setBoundaryStatusMsg(`Boundary updated! Your waste collection radius is now ${serviceRadiusKm} km, covering ${serviceWards.length} Chennai wards.`);
        if (onBoundaryUpdated) onBoundaryUpdated();
      }
    } catch (err) {
      alert('Error updating boundary: ' + err.message);
    } finally {
      setSavingBoundary(false);
    }
  };

  // Handle Accept Pickup
  const handleAcceptPickup = async (id) => {
    try {
      const res = await api.acceptPickup(id);
      if (res.success) {
        setStatusMsg(`Pickup accepted! Now visible in your active collections.`);
        loadData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle Mark In Transit
  const handleInTransit = async (id) => {
    try {
      await api.updatePickupStatus(id, 'in_transit');
      setStatusMsg(`Driver dispatched. Pickup is now in transit.`);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle Complete Collection (Weighbridge Scale Weight verification)
  const handleConfirmComplete = async () => {
    if (!completingPickup) return;
    try {
      const res = await api.completePickup(
        completingPickup._id || completingPickup.bookingId,
        parseFloat(actualWeightKg),
        completeNotes
      );
      if (res.success) {
        setStatusMsg(res.message);
        setCompletingPickup(null);
        setActualWeightKg('');
        loadData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle Commit Supply to Factory
  const handleConfirmCommit = async () => {
    if (!committingReq) return;
    try {
      const res = await api.createPurchaseOrder({
        requirementId: committingReq.requirementId,
        quantityKg: parseFloat(commitKg)
      });
      if (res.success) {
        setStatusMsg(res.message);
        setCommittingReq(null);
        setCommitKg('');
        loadData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle Ship PO
  const handleConfirmShip = async () => {
    if (!shippingPO) return;
    try {
      const res = await api.shipOrder(
        shippingPO._id || shippingPO.poNumber,
        vehicleNumber
      );
      if (res.success) {
        setStatusMsg(res.message);
        setShippingPO(null);
        setVehicleNumber('');
        loadData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          backgroundImage: 'none',
          border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        {user?.role !== 'dealer' ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Dealer Portal Access Gate</span>
              </div>
              <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            <div className="py-8 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Dealer Authorization Required
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This workspace is restricted to registered Chennai Recovery Hubs & Baling Dealers.
                Current session: <strong className="text-slate-700 dark:text-slate-200">{user?.email || 'Guest'}</strong> (Role: <span className="font-bold uppercase text-emerald-600">{user?.role || 'None'}</span>).
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenRoleLogin) {
                      onOpenRoleLogin('dealer', 'Please log in with Dealer credentials to access Weighbridge & Baling Hub.');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Log In to Dealer Workspace</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Dealer Operations & Material Exchange
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  TNPCB Certified Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Facility: <strong>{user?.facilityName || 'Guindy Eco-Recovery Industrial Hub'}</strong> • {user?.district} Cluster
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh Operations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
          <button
            onClick={() => setActiveTab('pickups')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pickups'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Citizen Pickups Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {pickups.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Warehouse Stock & Inventory</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {inventory.reduce((a, c) => a + (c.availableKg || 0), 0).toFixed(0)} kg
            </span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'marketplace'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Factory B2B Demand & Orders</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {requirements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('boundary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'boundary'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Collection Boundary & Wards</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {serviceRadiusKm} km
            </span>
          </button>
        </div>

        {/* TAB 1: CITIZEN PICKUPS QUEUE */}
        {activeTab === 'pickups' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Incoming pickup requests from citizens across your service cluster</span>
              <span>Sorted by latest</span>
            </div>

            {pickups.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                No active pickup requests right now. Customers booking doorstep pickups will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {pickups.map((p) => {
                  const isCompleted = p.status === 'completed';
                  const isAccepted = p.status === 'accepted';
                  const isInTransit = p.status === 'in_transit';
                  const isPending = p.status === 'pending';

                  return (
                    <div
                      key={p._id || p.bookingId}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-80'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                              {p.bookingId}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : isInTransit
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : isAccepted
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                            {p.userName}
                          </h4>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            ~{p.actualWeightKg ? p.actualWeightKg : p.estimatedWeightKg} kg
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            {p.wasteCategory}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-3 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{p.userAddress}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {p.userPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {p.scheduledDate} ({p.timeSlot})
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                        {isPending && (
                          <button
                            onClick={() => handleAcceptPickup(p._id || p.bookingId)}
                            className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept Pickup</span>
                          </button>
                        )}

                        {isAccepted && (
                          <button
                            onClick={() => handleInTransit(p._id || p.bookingId)}
                            className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Mark In Transit</span>
                          </button>
                        )}

                        {(isAccepted || isInTransit) && (
                          <button
                            onClick={() => {
                              setCompletingPickup(p);
                              setActualWeightKg(String(p.estimatedWeightKg || 10));
                            }}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Verify Weight & Complete</span>
                          </button>
                        )}

                        {isCompleted && (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified: {p.actualWeightKg} kg • Payout: ₹{p.estimatedReward}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WAREHOUSE INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                  Live Certified Depot Inventory
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {inventory.reduce((a, c) => a + (c.availableKg || 0), 0).toLocaleString()} kg Ready for B2B Supply
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Diverted from Landfill:</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {inventory.reduce((a, c) => a + (c.totalCollectedKg || 0), 0).toLocaleString()} kg
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {inventory.map((item) => {
                const maxCap = 5000;
                const pct = Math.min(100, Math.round(((item.availableKg || 0) / maxCap) * 100));

                return (
                  <div
                    key={item._id || item.category}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
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
                        <span>Depot Capacity Load</span>
                        <span>{pct}%</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 7,
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

        {/* TAB 3: B2B MARKETPLACE (SUPPLY TO FACTORIES) */}
        {activeTab === 'marketplace' && (
          <div className="space-y-5">
            {/* Factory Demand Cards */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-500" />
                  Active Bulk Requirements from Tamil Nadu Factories
                </h3>
                <span className="text-[11px] text-slate-400">Direct Factory Procurement</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {requirements.map((req) => {
                  const matchingInv = inventory.find(i => i.category === req.category);
                  const availableStock = matchingInv ? matchingInv.availableKg : 0;

                  return (
                    <div
                      key={req._id || req.requirementId}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              {req.requirementId}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {req.factoryName}
                            </h4>
                          </div>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            ₹{req.offeredPricePerKg}/kg
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {req.grade} • {req.district}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 my-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg">
                          <span>Target: {req.quantityNeededKg} kg</span>
                          <span className={availableStock > 0 ? 'text-blue-500 font-bold' : 'text-slate-400'}>
                            Your Stock: {availableStock} kg
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCommittingReq(req);
                          setCommitKg(String(Math.min(availableStock, 500)));
                        }}
                        disabled={availableStock <= 0}
                        className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Supply Stock (Create PO)</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dealer's Committed Purchase Orders & Shipments */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Your Factory Purchase Orders & Dispatch Status
              </h3>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {dealerOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No purchase orders committed yet. Select a factory requirement above to sell stock.
                  </p>
                ) : (
                  dealerOrders.map((po) => (
                    <div
                      key={po._id || po.poNumber}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {po.poNumber}
                          </span>
                          <span className="text-slate-400">→ {po.factoryName}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            po.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : po.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {po.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {po.quantityKg} kg {po.category} • ₹{po.totalAmount.toLocaleString()} • Payment: <strong>{po.paymentStatus}</strong>
                          {po.paymentRef && ` (${po.paymentRef})`}
                        </p>
                      </div>

                      {po.status === 'created' && (
                        <button
                          onClick={() => {
                            setShippingPO(po);
                            setVehicleNumber('TN 09 BX 4412');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-sm"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Dispatch Truck</span>
                        </button>
                      )}

                      {po.status === 'shipped' && (
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold shrink-0">
                          🚚 In Transit ({po.vehicleNumber})
                        </span>
                      )}

                      {po.status === 'verified' && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                          ✅ Verified: {po.verifiedWeightKg} kg
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WASTE COLLECTION BOUNDARY & WARD SETTINGS */}
        {activeTab === 'boundary' && (
          <div className="space-y-6">
            {/* Status Toast */}
            {boundaryStatusMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{boundaryStatusMsg}</span>
                </div>
                <button onClick={() => setBoundaryStatusMsg('')} className="opacity-60 hover:opacity-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Header Description */}
            <div className="p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 dark:border-blue-800/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Waste Collection Service Boundary & Ward Jurisdiction
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Define your facility's doorstep pickup catchment radius and active Chennai wards. Pickup requests inside your boundary are routed with priority to your collection queue.
                  </p>
                </div>
              </div>

              {/* 3 Overview Badges */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-blue-500/10 dark:border-blue-800/20">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Radius</span>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400">⭕ {serviceRadiusKm} km</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Coverage Area</span>
                  <span className="text-base font-black text-slate-800 dark:text-slate-200">
                    ~{Math.round(Math.PI * serviceRadiusKm * serviceRadiusKm)} km²
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Wards</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {serviceWards.length} Zones
                  </span>
                </div>
              </div>
            </div>

            {/* Boundary Radius Slider */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    <span>Waste Collection Boundary Radius</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Rendered live as an interactive circle on the Chennai Leaflet map
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {serviceRadiusKm} km
                </span>
              </div>

              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={serviceRadiusKm}
                onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 cursor-pointer bg-slate-200 dark:bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span>2 km (Local Neighborhood)</span>
                <span>8 km (Suburban Cluster)</span>
                <span>15 km (Inter-Zone Hub)</span>
                <span>30 km (District Wide)</span>
              </div>
            </div>

            {/* Covered Wards & Zones Selection */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Designated Chennai Collection Zones & Wards
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Select the municipal zones where your trucks have waste transit permits
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setServiceWards(Object.keys(CHENNAI_ZONE_COORDINATES).filter(k => k !== 'All'))}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceWards([])}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Object.keys(CHENNAI_ZONE_COORDINATES).filter(k => k !== 'All').map((zone) => {
                  const isChecked = serviceWards.includes(zone);
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => handleToggleWard(zone)}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                        isChecked
                          ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span>{zone}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-transparent'
                      }`}>
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Facility Location Details */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Facility Depot Location & Origin</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Depot Street Address
                  </label>
                  <input
                    type="text"
                    value={facilityAddress}
                    onChange={(e) => setFacilityAddress(e.target.value)}
                    placeholder="e.g. 12, Industrial Estate 4th Cross Rd, Guindy, Chennai 600032"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={facilityLat}
                      onChange={(e) => setFacilityLat(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={facilityLng}
                      onChange={(e) => setFacilityLng(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveBoundary}
                disabled={savingBoundary}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{savingBoundary ? 'Saving Boundaries...' : 'Save Waste Collection Boundaries'}</span>
              </button>
            </div>
          </div>
        )}

        {/* DIALOG: Complete Pickup Scale Weighing */}
        {completingPickup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1400] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <Scale className="w-6 h-6" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Weighbridge Scale Verification
                </h3>
              </div>

              <p className="text-xs text-slate-500">
                Enter the verified scale weight for pickup <strong>{completingPickup.bookingId}</strong> ({completingPickup.userName}). This will automatically credit your dealer warehouse inventory.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Actual Scale Weight (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={actualWeightKg}
                  onChange={(e) => setActualWeightKg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Weighbridge Slip / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Slip No: WB-9921 / Clean dry material"
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCompletingPickup(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmComplete}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Credit Inventory</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DIALOG: Commit Supply to Factory */}
        {committingReq && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1400] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <Send className="w-6 h-6" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Commit Supply & Create Purchase Order
                </h3>
              </div>

              <p className="text-xs text-slate-500">
                Supplying <strong>{committingReq.category}</strong> to <strong>{committingReq.factoryName}</strong> at ₹{committingReq.offeredPricePerKg}/kg.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Quantity to Commit (KG)
                </label>
                <input
                  type="number"
                  step="10"
                  required
                  value={commitKg}
                  onChange={(e) => setCommitKg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Estimated Total PO Value: ₹{(parseFloat(commitKg || 0) * committingReq.offeredPricePerKg).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCommittingReq(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCommit}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Issue Purchase Order</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DIALOG: Dispatch Truck Shipment */}
        {shippingPO && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1400] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <Truck className="w-6 h-6" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Dispatch Shipment to Factory
                </h3>
              </div>

              <p className="text-xs text-slate-500">
                Dispatching <strong>{shippingPO.quantityKg} kg of {shippingPO.category}</strong> for PO <strong>{shippingPO.poNumber}</strong>. This will automatically deduct this volume from your available warehouse stock.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Truck Vehicle Registration Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TN 09 BX 4412 (10-Ton Eicher)"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShippingPO(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmShip}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
