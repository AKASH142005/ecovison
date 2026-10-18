import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  X,
  Factory,
  Package,
  CheckCircle2,
  Clock,
  PlusCircle,
  Truck,
  Scale,
  CreditCard,
  Building,
  RefreshCw,
  Coins,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function FactoryPortalModal({ open, onClose, onOpenRoleLogin }) {
  const { isDark } = useThemeMode();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('requirements'); // 'requirements' | 'shipments'
  const [requirements, setRequirements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // New requirement form state
  const [category, setCategory] = useState('plastic');
  const [grade, setGrade] = useState('Clean Flakes (>98% Purity)');
  const [quantityNeededKg, setQuantityNeededKg] = useState('5000');
  const [offeredPricePerKg, setOfferedPricePerKg] = useState('22');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'SIPCOT Industrial Estate, Tiruppur');

  // Shipment inspection state
  const [inspectingPO, setInspectingPO] = useState(null);
  const [verifiedWeightKg, setVerifiedWeightKg] = useState('');
  const [qualityGrade, setQualityGrade] = useState('Grade A+ (>99% Industrial Purity)');
  const [qaNotes, setQaNotes] = useState('');

  // Payment state
  const [payingPO, setPayingPO] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqRes, orderRes] = await Promise.allSettled([
        api.getMarketplaceRequirements(),
        api.getMarketplaceOrders()
      ]);

      if (reqRes.status === 'fulfilled' && reqRes.value.requirements) {
        setRequirements(reqRes.value.requirements);
      }
      if (orderRes.status === 'fulfilled' && orderRes.value.orders) {
        setOrders(orderRes.value.orders);
      }
    } catch (e) {
      console.error('Error loading factory portal:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user?.role === 'factory') {
      loadData();
    }
  }, [open, user?.role]);

  // Handle Publish Requirement
  const handlePublishRequirement = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const res = await api.createRequirement({
        category,
        grade,
        quantityNeededKg: parseFloat(quantityNeededKg),
        offeredPricePerKg: parseFloat(offeredPricePerKg),
        deadline,
        deliveryAddress
      });
      if (res.success) {
        setStatusMsg(res.message);
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Confirm QA Verification
  const handleConfirmVerification = async () => {
    if (!inspectingPO) return;
    try {
      const res = await api.verifyShipment(
        inspectingPO._id || inspectingPO.poNumber,
        parseFloat(verifiedWeightKg),
        qualityGrade,
        qaNotes
      );
      if (res.success) {
        setStatusMsg(res.message);
        setInspectingPO(null);
        setVerifiedWeightKg('');
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Release Payment
  const handleReleasePayment = async (po) => {
    try {
      const res = await api.releasePayment(po._id || po.poNumber, 'paid');
      if (res.success) {
        setStatusMsg(res.message);
        loadData();
      }
    } catch (err) {
      alert(err.message);
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
          border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(245, 158, 11, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        {user?.role !== 'factory' ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Factory className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Factory Sourcing Portal Access</span>
              </div>
              <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            <div className="py-8 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Factory Authorization Required
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This portal is reserved for verified industrial manufacturers, recyclers, and remanufacturers in Chennai industrial corridors (Manali, Ambattur, Guindy, Sriperumbudur).
                Current session: <strong className="text-slate-700 dark:text-slate-200">{user?.email || 'Guest'}</strong> (Role: <span className="font-bold uppercase text-amber-600">{user?.role || 'None'}</span>).
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenRoleLogin) {
                      onOpenRoleLogin('factory', 'Please log in with Industrial Factory credentials to publish requirements & inspect shipments.');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Factory className="w-4 h-4" />
                  <span>Log In to Factory Sourcing</span>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Chennai Industrial Buyer & Factory Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Chennai Industrial B2B
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Facility: <strong>{user?.facilityName || 'Manali Eco-Polymers Ltd'}</strong> • {user?.district || 'Manali'} Industrial Belt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh Data"
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
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-between">
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
            onClick={() => setActiveTab('requirements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requirements'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Bulk Material Demand</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
              {requirements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shipments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shipments'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Inbound Shipments & Quality QA</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
              {orders.length}
            </span>
          </button>
        </div>

        {/* TAB 1: PUBLISH BULK MATERIAL DEMAND */}
        {activeTab === 'requirements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Form */}
            <form onSubmit={handlePublishRequirement} className="lg:col-span-5 space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-500" />
                Post New Procurement Demand
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Material Stream
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2 focus:outline-none"
                  >
                    <option value="plastic">Plastics & Polymers</option>
                    <option value="metal">Metals & Scrap Alloys</option>
                    <option value="paper">Paper & Cardboard</option>
                    <option value="textile">Textiles & Offcuts</option>
                    <option value="glass">Glass & Cullet</option>
                    <option value="ewaste">E-Waste & PCBs</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Offered Price (₹ / KG)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={offeredPricePerKg}
                    onChange={(e) => setOfferedPricePerKg(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Required Volume (KG)
                </label>
                <input
                  type="number"
                  step="100"
                  required
                  placeholder="e.g. 5000"
                  value={quantityNeededKg}
                  onChange={(e) => setQuantityNeededKg(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Purity / Grade Specification
                </label>
                <input
                  type="text"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Delivery Plant Location
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 p-2 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Publish to Tamil Nadu Exchange</span>
              </button>
            </form>

            {/* Right: Published Requirements List */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Your Published B2B Requirements ({requirements.length})
              </h3>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {requirements.map((r) => {
                  const pct = Math.min(100, Math.round(((r.fulfilledKg || 0) / r.quantityNeededKg) * 100));

                  return (
                    <div
                      key={r._id || r.requirementId}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                              {r.requirementId}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              {r.category}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                            {r.grade}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            ₹{r.offeredPricePerKg}/kg
                          </span>
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            Total: ₹{(r.quantityNeededKg * r.offeredPricePerKg).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Fulfillment: {r.fulfilledKg || 0} / {r.quantityNeededKg} kg</span>
                          <span className="font-bold">{pct}%</span>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: isDark ? '#1e293b' : '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: pct >= 100 ? '#10b981' : '#f59e0b',
                              borderRadius: 3
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INBOUND SHIPMENTS & QUALITY QA */}
        {activeTab === 'shipments' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Incoming truck shipments from registered dealers across Tamil Nadu</span>
              <span>Quality inspection & payment clearance</span>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No active dealer shipments at the moment. As dealers commit supply from their inventory, trucks in transit will appear here.
              </p>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {orders.map((po) => {
                  const isVerified = po.status === 'verified';
                  const isShipped = po.status === 'shipped';
                  const isPaid = po.paymentStatus === 'paid';

                  return (
                    <div
                      key={po._id || po.poNumber}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {po.poNumber}
                          </span>
                          <span className="text-xs text-slate-500">from</span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {po.dealerName}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isShipped
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {po.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Committed: <strong>{po.quantityKg} kg {po.category}</strong> @ ₹{po.unitPrice}/kg • Total: <strong>₹{po.totalAmount.toLocaleString()}</strong>
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          {po.vehicleNumber && (
                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <Truck className="w-3 h-3 text-blue-500" />
                              Truck: {po.vehicleNumber}
                            </span>
                          )}
                          {isVerified && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              Scale Weight: {po.verifiedWeightKg} kg ({po.qualityGrade})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isShipped && (
                          <button
                            onClick={() => {
                              setInspectingPO(po);
                              setVerifiedWeightKg(String(po.quantityKg));
                            }}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Inspect & Verify QA</span>
                          </button>
                        )}

                        {isVerified && !isPaid && (
                          <button
                            onClick={() => handleReleasePayment(po)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Release Payment (₹{po.totalAmount.toLocaleString()})</span>
                          </button>
                        )}

                        {isPaid && (
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid ({po.paymentRef || 'NEFT Disbursed'})</span>
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

        {/* DIALOG: Inbound Shipment QA Inspection */}
        {inspectingPO && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1400] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <Scale className="w-6 h-6" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Factory Inbound Quality QA & Weighing
                </h3>
              </div>

              <p className="text-xs text-slate-500">
                Verifying shipment for PO <strong>{inspectingPO.poNumber}</strong> ({inspectingPO.dealerName}). Truck: <strong>{inspectingPO.vehicleNumber}</strong>.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Weighbridge Net Scale Weight (KG)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={verifiedWeightKg}
                  onChange={(e) => setVerifiedWeightKg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Quality Assessment Grade
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 focus:outline-none"
                >
                  <option value="Grade A+ (>99% Industrial Purity)">Grade A+ (&gt;99% Industrial Purity)</option>
                  <option value="Grade A (Standard Purity 95-98%)">Grade A (Standard Purity 95-98%)</option>
                  <option value="Grade B (Acceptable with slight moisture)">Grade B (Acceptable with slight moisture)</option>
                  <option value="Industrial Mix">Industrial Mix</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  QA Inspection Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Moisture 1.1%, color sorting verified"
                  value={qaNotes}
                  onChange={(e) => setQaNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setInspectingPO(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmVerification}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Lock Weight</span>
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
