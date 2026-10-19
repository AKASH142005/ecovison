import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Building,
  FileText,
  Activity,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CHENNAI_ZONE_COORDINATES } from '../../constants/chennaiZones';
import AdminOverviewTab from './tabs/AdminOverviewTab';
import AdminDealersTab from './tabs/AdminDealersTab';
import AdminAuditTab from './tabs/AdminAuditTab';
import AdminTestSuiteTab from './tabs/AdminTestSuiteTab';

export default function AdminDashboardView({ onDealerPointAdded }) {
  const { isDark } = useThemeMode();
  const { user, refreshAggregations } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'dealers' | 'audit' | 'tests'
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dealersList, setDealersList] = useState([]);
  const [logCategory, setLogCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // New Dealer Point Form State
  const [newDealer, setNewDealer] = useState({
    name: '',
    district: 'Adyar',
    address: '',
    lat: 13.0012,
    lng: 80.2565,
    phone: '+91 94440 12345',
    email: '',
    serviceRadiusKm: 8,
    operatingHours: '08:00 AM - 07:00 PM',
    categories: ['plastic', 'metal', 'paper', 'ewaste']
  });
  const [dealerSubmitting, setDealerSubmitting] = useState(false);
  const [dealerStatusMsg, setDealerStatusMsg] = useState({ text: '', type: '' });

  // Test Suite State
  const [testResults, setTestResults] = useState(null);
  const [runningTests, setRunningTests] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [overRes, logRes, collRes] = await Promise.allSettled([
        api.getAdminOverview(),
        api.getAuditLogs({ category: logCategory }),
        api.getCollectors({ district: 'All' })
      ]);

      if (overRes.status === 'fulfilled' && overRes.value.kpis) {
        setOverview(overRes.value);
      }
      if (logRes.status === 'fulfilled' && (logRes.value.auditLogs || logRes.value.logs)) {
        setAuditLogs(logRes.value.auditLogs || logRes.value.logs);
      }
      if (collRes.status === 'fulfilled' && collRes.value.collectors) {
        setDealersList(collRes.value.collectors);
      }
    } catch (e) {
      console.error('Error loading admin dashboard:', e);
    } finally {
      setLoading(false);
    }
  }, [logCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleZoneSelect = (zone) => {
    const coords = CHENNAI_ZONE_COORDINATES[zone] || { lat: 13.0827, lng: 80.2707 };
    setNewDealer(prev => ({
      ...prev,
      district: zone,
      lat: coords.lat,
      lng: coords.lng
    }));
  };

  const handleCreateDealerPoint = async (e) => {
    e.preventDefault();
    setDealerStatusMsg({ text: '', type: '' });

    if (!newDealer.name || !newDealer.address) {
      setDealerStatusMsg({ text: 'Please enter dealer point name and physical address.', type: 'error' });
      return;
    }

    setDealerSubmitting(true);
    try {
      const payload = {
        name: newDealer.name,
        district: newDealer.district,
        address: newDealer.address,
        lat: parseFloat(newDealer.lat),
        lng: parseFloat(newDealer.lng),
        phone: newDealer.phone,
        email: newDealer.email,
        serviceRadiusKm: parseFloat(newDealer.serviceRadiusKm) || 8,
        operatingHours: newDealer.operatingHours,
        acceptedWasteTypes: newDealer.categories.map(cat => ({
          category: cat,
          ratePerKg: cat === 'plastic' ? 19 : cat === 'metal' ? 38 : cat === 'paper' ? 15 : 60,
          acceptsDropoff: true,
          acceptsPickup: true
        }))
      };

      const res = await api.createCollector(payload);
      if (res.success) {
        setDealerStatusMsg({
          text: `Success! Dealer Hub "${newDealer.name}" registered with ${newDealer.serviceRadiusKm} km boundary.`,
          type: 'success'
        });
        setNewDealer(prev => ({ ...prev, name: '', address: '', email: '' }));
        loadData();
        if (onDealerPointAdded) onDealerPointAdded();
        if (refreshAggregations) refreshAggregations();
      }
    } catch (err) {
      setDealerStatusMsg({ text: err.message || 'Failed to create dealer point.', type: 'error' });
    } finally {
      setDealerSubmitting(false);
    }
  };

  const handleRunTests = async () => {
    setRunningTests(true);
    try {
      const res = await api.runTests();
      if (res.success) {
        setTestResults(res);
      }
    } catch (e) {
      console.error('Error running test suite:', e);
    } finally {
      setRunningTests(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 border-purple-500/30'
          : 'bg-gradient-to-br from-purple-50 via-white to-pink-50/70 border-purple-200'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GCC Ripon Building & TNPCB Municipal Circular Core</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              City Waste Diversion & Compliance Governance
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Officer: <strong>{user?.name || 'Dr. S. Meenakshi (GCC Environmental Officer)'}</strong>.
              Supervising circular resource flows, dealer collection boundaries, and TNPCB regulatory compliance across all 15 Chennai zones.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Diverted Waste</span>
              <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">
                {overview?.kpis?.totalWasteDivertedKg ? `${(overview.kpis.totalWasteDivertedKg / 1000).toFixed(1)} T` : '42.8 T'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Certified Hubs</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                {dealersList.length} Hubs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-400/50'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Chennai Municipal KPIs & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('dealers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'dealers'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Manage Dealer Points & Boundaries</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white/20 text-white">
              {dealersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>TNPCB Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'tests'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Automated RBAC Test Suite</span>
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

      {/* Tabs View */}
      {activeTab === 'overview' && <AdminOverviewTab overview={overview} />}

      {activeTab === 'dealers' && (
        <AdminDealersTab
          newDealer={newDealer}
          setNewDealer={setNewDealer}
          handleZoneSelect={handleZoneSelect}
          handleCreateDealerPoint={handleCreateDealerPoint}
          dealerSubmitting={dealerSubmitting}
          dealerStatusMsg={dealerStatusMsg}
          dealersList={dealersList}
        />
      )}

      {activeTab === 'audit' && (
        <AdminAuditTab
          auditLogs={auditLogs}
          logCategory={logCategory}
          setLogCategory={setLogCategory}
        />
      )}

      {activeTab === 'tests' && (
        <AdminTestSuiteTab
          handleRunTests={handleRunTests}
          runningTests={runningTests}
          testResults={testResults}
        />
      )}
    </div>
  );
}
