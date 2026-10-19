import React, { useState, useEffect, useCallback } from 'react';
import { Factory, Package, Truck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import FactoryRequirementsTab from './tabs/FactoryRequirementsTab';
import FactoryShipmentsTab from './tabs/FactoryShipmentsTab';
import FactoryInspectModal from './modals/FactoryInspectModal';

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
  const [submittingQA, setSubmittingQA] = useState(false);

  // Payment state
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

  // Handle QA Verification
  const handleConfirmVerification = async () => {
    if (!inspectingPO) return;
    const finalWeight = parseFloat(verifiedWeightKg);
    if (!finalWeight || finalWeight <= 0) {
      setStatusMsg({ text: 'Please enter verified weighbridge weight in kg.', type: 'error' });
      return;
    }

    setSubmittingQA(true);
    try {
      const res = await api.verifyPurchaseOrder(inspectingPO._id || inspectingPO.poNumber, {
        verifiedWeightKg: finalWeight,
        qualityGrade,
        notes: `Inspected at Factory Gate Scale. Quality confirmed: ${qualityGrade}`
      });

      if (res.success) {
        setStatusMsg({
          text: `Consignment ${inspectingPO.poNumber} verified at ${finalWeight} kg (${qualityGrade})! Inbound gate cleared.`,
          type: 'success'
        });
        setInspectingPO(null);
        loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to certify gate inspection.', type: 'error' });
    } finally {
      setSubmittingQA(false);
    }
  };

  // Handle Release Payment
  const handleReleasePayment = async (po) => {
    setReleasingPayment(true);
    try {
      const res = await api.payPurchaseOrder(po._id || po.poNumber, {
        paymentRef: `NEFT-TN-${Date.now().toString().slice(-6)}`
      });

      if (res.success) {
        setStatusMsg({
          text: `Bank wire payment of ₹${po.totalAmount?.toLocaleString()} released to ${po.dealerName || 'Dealer'}! Ref: ${res.order?.paymentRef}`,
          type: 'success'
        });
        loadData();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to release payment.', type: 'error' });
    } finally {
      setReleasingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Factory Command Header Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/30'
          : 'bg-gradient-to-br from-amber-50 via-white to-orange-50/70 border-amber-200'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Factory className="w-3.5 h-3.5" />
              <span>Chennai Industrial Sourcing & Procurement Desk</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {user?.companyName || 'Industrial Sourcing Marketplace'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Cluster: <strong>{user?.industrialBelt || 'SIPCOT Industrial Corridor'}</strong> • Purchase baled scrap directly from certified Chennai recovery dealers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMsg.text && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
            statusMsg.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg({ text: '', type: '' })}>×</button>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'requirements'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/50'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Package className="w-4 h-4 text-slate-950" />
          <span>Procurement Requirements ({requirements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shipments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'shipments'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/50'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Truck className="w-4 h-4 text-slate-950" />
          <span>Inbound Consignments ({orders.length})</span>
        </button>
      </div>

      {/* Tab 1: Requirements */}
      {activeTab === 'requirements' && (
        <FactoryRequirementsTab
          category={category}
          setCategory={setCategory}
          grade={grade}
          setGrade={setGrade}
          quantityNeededKg={quantityNeededKg}
          setQuantityNeededKg={setQuantityNeededKg}
          offeredPricePerKg={offeredPricePerKg}
          setOfferedPricePerKg={setOfferedPricePerKg}
          deadline={deadline}
          setDeadline={setDeadline}
          deliveryAddress={deliveryAddress}
          setDeliveryAddress={setDeliveryAddress}
          publishing={publishing}
          onPublish={handlePublishRequirement}
          requirements={requirements}
        />
      )}

      {/* Tab 2: Shipments */}
      {activeTab === 'shipments' && (
        <FactoryShipmentsTab
          orders={orders}
          onOpenInspect={(po) => {
            setInspectingPO(po);
            setVerifiedWeightKg(String(po.quantityKg));
          }}
          onReleasePayment={handleReleasePayment}
          releasingPayment={releasingPayment}
        />
      )}

      {/* QA Inspection Modal */}
      <FactoryInspectModal
        inspectingPO={inspectingPO}
        onClose={() => setInspectingPO(null)}
        verifiedWeightKg={verifiedWeightKg}
        setVerifiedWeightKg={setVerifiedWeightKg}
        qualityGrade={qualityGrade}
        setQualityGrade={setQualityGrade}
        submittingQA={submittingQA}
        onConfirm={handleConfirmVerification}
      />
    </div>
  );
}
