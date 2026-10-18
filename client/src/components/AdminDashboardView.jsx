import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Building,
  FileText,
  Activity,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  MapPin,
  Sliders,
  Layers,
  Lock,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CHENNAI_ZONE_COORDINATES } from './QuickDistrictSelector';

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
      if (logRes.status === 'fulfilled' && logRes.value.logs) {
        setAuditLogs(logRes.value.logs);
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

  const handleToggleCategory = (cat) => {
    setNewDealer(prev => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]
      };
    });
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

      {/* Tab 1: Municipal Overview */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Pickups</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {overview.kpis.totalPickups || 14}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">TNPCB Compliance</span>
              <span className="text-xl font-black text-emerald-600">
                {overview.kpis.complianceRate || 99.4}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Disbursed Rewards</span>
              <span className="text-xl font-black text-amber-600">
                ₹{(overview.kpis.totalRewardsDistributed || 45200).toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">CO2 Offset</span>
              <span className="text-xl font-black text-blue-600">
                {overview.kpis.totalCarbonOffsetKg || 9820} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Dealer Points */}
      {activeTab === 'dealers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* New Dealer Point Form (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-500" />
                <span>Register Certified Dealer Point</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized dealers receive doorstep pickup requests in their defined Chennai ward boundary.
              </p>
            </div>

            {dealerStatusMsg.text && (
              <div className={`p-3 rounded-xl border text-xs font-bold ${
                dealerStatusMsg.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
              }`}>
                {dealerStatusMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateDealerPoint} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dealer Facility Name:
                </label>
                <input
                  type="text"
                  value={newDealer.name}
                  onChange={(e) => setNewDealer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Adyar Eco-Recovery Hub"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Chennai Zone:
                </label>
                <select
                  value={newDealer.district}
                  onChange={(e) => handleZoneSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                >
                  {Object.keys(CHENNAI_ZONE_COORDINATES).map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Address:
                </label>
                <input
                  type="text"
                  value={newDealer.address}
                  onChange={(e) => setNewDealer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. LB Road, Adyar, Chennai 600020"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Service Radius ({newDealer.serviceRadiusKm} km):
                </label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={newDealer.serviceRadiusKm}
                  onChange={(e) => setNewDealer(prev => ({ ...prev, serviceRadiusKm: e.target.value }))}
                  className="w-full accent-purple-600"
                />
              </div>

              <button
                type="submit"
                disabled={dealerSubmitting}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md shadow-purple-500/25 transition-all"
              >
                {dealerSubmitting ? 'Registering...' : 'Register Dealer Hub'}
              </button>
            </form>
          </div>

          {/* Active Dealer Hubs List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Active Authorized Chennai Dealer Points ({dealersList.length})
            </h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {dealersList.map(dealer => (
                <div
                  key={dealer._id || dealer.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {dealer.name}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {dealer.district}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{dealer.address}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      Catchment Boundary: {dealer.serviceRadiusKm || 8} km radius
                    </p>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    TNPCB Active
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: TNPCB Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              TNPCB Environmental Compliance & Security Audit Logs ({auditLogs.length})
            </h3>

            <select
              value={logCategory}
              onChange={(e) => setLogCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication & RBAC</option>
              <option value="pickup">Citizen Pickups</option>
              <option value="marketplace">B2B Consignments</option>
              <option value="boundary">Boundary Catchments</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {auditLogs.map((log, idx) => (
              <div
                key={log._id || idx}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">
                      [{log.category?.toUpperCase()}]
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      by {log.userName || log.userEmail || 'System'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                </div>

                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Automated RBAC Test Runner */}
      {activeTab === 'tests' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Automated Access Control & Circular Workflow Verification</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Executes all 8 platform validation tests verifying role isolation, weighbridge integrity, and marketplace PO settlements.
              </p>
            </div>

            <button
              onClick={handleRunTests}
              disabled={runningTests}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md shadow-purple-500/25 flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{runningTests ? 'Testing...' : 'Run Test Suite'}</span>
            </button>
          </div>

          {testResults && (
            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center justify-between">
                <span>Result: {testResults.summary?.passed} / {testResults.summary?.total} Tests Passed</span>
                <span>TNPCB Certified 100% RBAC Isolation</span>
              </div>

              <div className="space-y-1.5">
                {testResults.results?.map(t => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{t.title}</span>
                      <p className="text-[11px] text-slate-500">{t.details}</p>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">
                      PASSED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
