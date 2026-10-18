import React, { useState, useEffect, useCallback } from 'react';
import {
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
  Send,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function FactoryDashboardView() {
  const { isDark } = useThemeMode();
  const { user, refreshAggregations } = useAuth();

  const [activeTab, setActiveTab] = useState('requirements'); // 'requirements' | 'shipments'
  const [requirements, setRequirements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // New requirement form state
  const [category, setCategory] = useState('plastic');
  const [grade, setGrade] = useState('Clean Flakes (>98% Purity)');
  const [quantityNeededKg, setQuantityNeededKg] = useState('5000');
  const [offeredPricePerKg, setOfferedPricePerKg] = useState('22');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'SIPCOT Industrial Estate, Tiruppur');
  const [publishing, setPublishing] = useState(false);

  // Shipment inspection state
  const [inspectingPO, setInspectingPO] = useState(null);
  const [verifiedWeightKg, setVerifiedWeightKg] = useState('');
  const [qualityGrade, setQualityGrade] = useState('Grade A+ (>99% Industrial Purity)');
  const [qaNotes, setQaNotes] = useState('');
  const [submittingQA, setSubmittingQA] = useState(false);

  // Payment state
  const [payingPO, setPayingPO] = useState(null);
  const [releasingPayment, setReleasingPayment] = useState(false);

  const loadData = useCallback(async () => {
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
      console.error('Error loading factory dashboard:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Publish Requirement
  const handlePublishRequirement = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPublishing(true);
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
        setStatusMsg({ text: res.message || 'Procurement requirement published to Chennai dealers!', type: 'success' });
        loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to publish requirement.', type: 'error' });
    } finally {
      setPublishing(false);
    }
  };

  // Handle Confirm QA Verification
  const handleConfirmVerification = async () => {
    if (!inspectingPO) return;
    setSubmittingQA(true);
    try {
      const res = await api.verifyShipment(
        inspectingPO._id || inspectingPO.poNumber,
        parseFloat(verifiedWeightKg || inspectingPO.quantityKg),
        qualityGrade,
        qaNotes || 'Inspected at truck gate. Moisture and contamination within acceptable limits.'
      );
      if (res.success) {
        setStatusMsg({ text: res.message || 'Consignment verified and locked for payment!', type: 'success' });
        setInspectingPO(null);
        loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to verify shipment.', type: 'error' });
    } finally {
      setSubmittingQA(false);
    }
  };

  // Handle Release Payment
  const handleReleasePayment = async (po) => {
    setReleasingPayment(true);
    try {
      const res = await api.releasePayment(po._id || po.poNumber, 'paid');
      if (res.success) {
        setStatusMsg({ text: res.message || 'Payment released to dealer bank wire!', type: 'success' });
        loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to release payment.', type: 'error' });
    } finally {
      setReleasingPayment(false);
    }
  };

  const totalDemandKg = requirements.reduce((sum, r) => sum + (r.quantityNeededKg || 0), 0);
  const pendingShipments = orders.filter(o => o.status === 'shipped').length;

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/30'
          : 'bg-gradient-to-br from-amber-50 via-white to-orange-50/70 border-amber-200'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Factory className="w-3.5 h-3.5" />
              <span>Chennai Industrial Raw Material Procurement Core</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {user?.facilityName || 'Manali Eco-Polymers Ltd'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Corridor: <strong>{user?.district || 'Manali Petrochemical Belt'}</strong>.
              Publish bulk secondary raw material requirements for Chennai scrap recovery dealers, inspect inbound consignments at the truck gate, and disburse bank wire settlements.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Demand</span>
              <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                {totalDemandKg.toLocaleString()} kg
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Gate Inbound</span>
              <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                {pendingShipments} trucks
              </span>
            </div>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg.text && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
            statusMsg.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg({ text: '', type: '' })} className="hover:opacity-75">×</button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'requirements'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/50'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Sourcing Requirements</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-slate-950/20 text-slate-950">
              {requirements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shipments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'shipments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Inbound Dealer Consignments (QA & Payment)</span>
            {pendingShipments > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white/20 text-white">
                {pendingShipments}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab 1: Publish Requirements */}
      {activeTab === 'requirements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Requirement Creation Form (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-500" />
                <span>Publish Bulk Sourcing Requirement</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chennai dealers will immediately see this requirement and bid their warehouse stock.
              </p>
            </div>

            <form onSubmit={handlePublishRequirement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Material Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="plastic">rPET & Polymers (Plastic Flakes)</option>
                  <option value="metal">Ferrous & Non-Ferrous (Heavy Melting Scrap)</option>
                  <option value="paper">Kraft & Corrugated Paper Pulp</option>
                  <option value="ewaste">Electronic PCB Assemblies & Copper Wire</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quality Grade Specification:
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Quantity (kg):
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={quantityNeededKg}
                    onChange={(e) => setQuantityNeededKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Offered Rate (₹/kg):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={offeredPricePerKg}
                    onChange={(e) => setOfferedPricePerKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Plant / Factory Gate:
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex justify-between items-center font-bold">
                <span className="text-amber-800 dark:text-amber-300">Total Purchase Budget:</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  ₹{((parseFloat(quantityNeededKg) || 0) * (parseFloat(offeredPricePerKg) || 0)).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={publishing}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{publishing ? 'Publishing...' : 'Publish to Chennai Dealers'}</span>
              </button>
            </form>
          </div>

          {/* Active Requirements List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Active Sourcing Requirements ({requirements.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {requirements.map((req) => (
                <div
                  key={req._id || req.requirementId}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-black text-amber-600 dark:text-amber-400">
                        {req.requirementId}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {req.grade}
                      </h4>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {req.category}
                      </span>
                    </div>

                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ₹{req.offeredPricePerKg}/kg
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl flex justify-between">
                    <span>Target: {req.quantityNeededKg.toLocaleString()} kg</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Total: ₹{(req.quantityNeededKg * req.offeredPricePerKg).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 truncate">
                    📍 {req.deliveryAddress}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Inbound Shipments from Dealers */}
      {activeTab === 'shipments' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Dealer Consignments Awaiting Gate QA Weighbridge Inspection ({orders.length})
          </h3>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                No active dealer shipments right now. When dealers commit stock and dispatch trucks, they appear here.
              </div>
            ) : (
              orders.map((po) => {
                const isShipped = po.status === 'shipped';
                const isVerified = po.status === 'verified';
                const isPaid = po.paymentStatus === 'paid';

                return (
                  <div
                    key={po._id || po.poNumber}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                          {po.poNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          From: {po.dealerName || 'Chennai Recovery Dealer'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isShipped
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {po.status?.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        Consignment: <strong>{po.quantityKg} kg {po.category}</strong> • Truck: <strong>{po.vehicleNumber || 'Pending'}</strong> • Value: <strong>₹{po.totalAmount?.toLocaleString()}</strong>
                      </p>
                      {po.verifiedWeightKg && (
                        <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                          ✓ Gate Weight Certified: {po.verifiedWeightKg} kg ({po.qualityGrade})
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isShipped && (
                        <button
                          onClick={() => {
                            setInspectingPO(po);
                            setVerifiedWeightKg(String(po.quantityKg));
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-1.5"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Weighbridge QA Inspect</span>
                        </button>
                      )}

                      {isVerified && !isPaid && (
                        <button
                          onClick={() => handleReleasePayment(po)}
                          disabled={releasingPayment}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-xs flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Release Bank Wire (₹{po.totalAmount?.toLocaleString()})</span>
                        </button>
                      )}

                      {isPaid && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Settled via Bank Wire ({po.paymentRef})</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* QA Inspection Modal */}
      {inspectingPO && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/40 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase">
                  Truck Gate Weighbridge Inspection
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Inspect PO {inspectingPO.poNumber}
                </h3>
              </div>
              <button onClick={() => setInspectingPO(null)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verified Gate Scale Weight (kg):
                </label>
                <input
                  type="number"
                  value={verifiedWeightKg}
                  onChange={(e) => setVerifiedWeightKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Certified Purity Grade:
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="Grade A+ (>99% Industrial Purity)">Grade A+ (&gt;99% Industrial Purity)</option>
                  <option value="Grade A (Standard Purity)">Grade A (Standard Purity)</option>
                  <option value="Grade B (Downcycled Secondary)">Grade B (Downcycled Secondary)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectingPO(null)}
                  className="flex-1 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  disabled={submittingQA}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md"
                >
                  {submittingQA ? 'Certifying...' : 'Certify & Lock Gate Weight'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
