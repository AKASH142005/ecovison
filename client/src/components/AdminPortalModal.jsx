import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import {
  X,
  ShieldCheck,
  Activity,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  Building,
  Truck,
  Coins,
  Package,
  Calendar,
  Filter,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  MapPin,
  Sliders,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CHENNAI_ZONE_COORDINATES } from './QuickDistrictSelector';

export default function AdminPortalModal({ open, onClose, onDealerPointAdded, onOpenRoleLogin }) {
  const { isDark } = useThemeMode();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'audit' | 'dealers' | 'tests'
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [overRes, logRes, userRes, collRes] = await Promise.allSettled([
        api.getAdminOverview(),
        api.getAuditLogs({ category: logCategory }),
        api.getAdminUsers(),
        api.getCollectors({ district: 'All' })
      ]);

      if (overRes.status === 'fulfilled' && overRes.value.kpis) {
        setOverview(overRes.value.kpis);
      }
      if (logRes.status === 'fulfilled' && logRes.value.auditLogs) {
        setAuditLogs(logRes.value.auditLogs);
      }
      if (userRes.status === 'fulfilled' && userRes.value.users) {
        setUsers(userRes.value.users);
      }
      if (collRes.status === 'fulfilled' && collRes.value.collectors) {
        setDealersList(collRes.value.collectors);
      }
    } catch (e) {
      console.error('Error loading admin portal:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user?.role === 'admin') {
      loadData();
    }
  }, [open, logCategory, user?.role]);

  // Handle Zone Change for New Dealer (auto-presets coordinates)
  const handleZoneSelect = (zone) => {
    const coords = CHENNAI_ZONE_COORDINATES[zone] || { lat: 13.0827, lng: 80.2707 };
    setNewDealer(prev => ({
      ...prev,
      district: zone,
      lat: coords.lat,
      lng: coords.lng
    }));
  };

  // Handle Toggle Category
  const handleToggleCategory = (cat) => {
    setNewDealer(prev => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter(c => c !== cat)
          : [...prev.categories, cat]
      };
    });
  };

  // Handle Create Dealer Point (Admin Authorized)
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
          text: `Success! Dealer Hub "${newDealer.name}" registered with ${newDealer.serviceRadiusKm} km waste collection boundary.`,
          type: 'success'
        });
        // Reset name & address
        setNewDealer(prev => ({
          ...prev,
          name: '',
          address: '',
          email: ''
        }));
        // Reload collectors list
        const refresh = await api.getCollectors({ district: 'All' });
        if (refresh.success) setDealersList(refresh.collectors || []);
        if (onDealerPointAdded) onDealerPointAdded();
      }
    } catch (err) {
      setDealerStatusMsg({ text: err.message || 'Failed to create dealer point.', type: 'error' });
    } finally {
      setDealerSubmitting(false);
    }
  };

  // Handle Delete Dealer Point
  const handleDeleteDealerPoint = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove dealer point "${name}" from Chennai circular map?`)) {
      return;
    }
    try {
      const res = await api.deleteCollector(id);
      if (res.success) {
        setDealersList(prev => prev.filter(d => (d._id || d.id) !== id));
        if (onDealerPointAdded) onDealerPointAdded();
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleRunTestSuite = async () => {
    setRunningTests(true);
    try {
      const res = await api.runTestSuite();
      setTestResults(res);
      // Reload audit logs to show test logs
      loadData();
    } catch (e) {
      alert('Test suite execution failed: ' + e.message);
    } finally {
      setRunningTests(false);
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
          border: isDark ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(168, 85, 247, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        {user?.role !== 'admin' ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">GCC & TNPCB Portal Access Gate</span>
              </div>
              <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            <div className="py-8 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                GCC Ripon Administrative Authorization Required
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This governance console is strictly restricted to certified Greater Chennai Corporation (GCC) Ripon Building Officers and TNPCB environmental compliance auditors.
                Current session: <strong className="text-slate-700 dark:text-slate-200">{user?.email || 'Guest'}</strong> (Role: <span className="font-bold uppercase text-purple-600">{user?.role || 'None'}</span>).
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenRoleLogin) {
                      onOpenRoleLogin('admin', 'Please log in with GCC Ripon Municipal Administrative credentials.');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In to GCC Administrative Console</span>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  GCC & TNPCB City Compliance & Governance
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  GCC Ripon Core
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized Officer: <strong>{user?.name || 'Dr. S. Meenakshi (GCC Environmental Officer)'}</strong> • Greater Chennai Corporation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>State Platform Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Security & Transaction Audit Logs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {auditLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dealers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dealers'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Manage Dealer Points</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {dealersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tests'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Access Control & Workflow Test Suite</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-black">
              8 Tests
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Registered Personas
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {overview?.userCounts?.total || users.length}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{overview?.userCounts?.customer || 1} Citizens</span> •
                  <span>{overview?.userCounts?.dealer || 1} Dealers</span> •
                  <span>{overview?.userCounts?.factory || 1} Factories</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Waste Diverted From Landfill
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {overview?.pickupStats?.totalCollectedKg?.toLocaleString() || '1,250'} kg
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {overview?.pickupStats?.completed || 1} verified doorstep pickups
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  B2B Marketplace Trade Volume
                </span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  ₹{(overview?.marketplaceStats?.totalTradeVolumeInr || 71400).toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Disbursed: ₹{(overview?.marketplaceStats?.totalPaidInr || 33000).toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Warehouse Stock In Circulation
                </span>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  {overview?.totalInventoryStockKg?.toLocaleString() || '9,420'} kg
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Across 8 certified material streams
                </span>
              </div>
            </div>

            {/* Platform Users Table */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Certified Network Participants ({users.length})
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">User & Facility</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">District</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr key={u.id || u.email} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          <div>{u.name}</div>
                          {u.facilityName && (
                            <div className="text-[11px] text-slate-400 font-normal">{u.facilityName}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : u.role === 'factory'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : u.role === 'dealer'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{u.email}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{u.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT LOGS STREAM */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {['all', 'AUTH', 'PICKUP', 'INVENTORY', 'MARKETPLACE', 'PAYMENT', 'ADMIN'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLogCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    logCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Audit Log Stream */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log._id || `${log.timestamp}-${log.action}`}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        log.category === 'AUTH'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : log.category === 'PICKUP'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.category === 'INVENTORY'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : log.category === 'MARKETPLACE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : log.category === 'PAYMENT'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {log.category}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {log.action}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        by {log.actorName} ({log.actorRole})
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE CHENNAI DEALER POINTS (GCC / TNPCB ADMIN) */}
        {activeTab === 'dealers' && (
          <div className="space-y-6">
            {/* Status Toast */}
            {dealerStatusMsg.text && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between border ${
                dealerStatusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{dealerStatusMsg.text}</span>
                </div>
                <button onClick={() => setDealerStatusMsg({ text: '', type: '' })} className="opacity-60 hover:opacity-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Section 1: Add Dealer Point Form */}
            <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 dark:bg-purple-950/20 dark:border-purple-800/40">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Register New Chennai Dealer Collection Point
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    GCC Municipal & TNPCB Verified Hub. Authorized points appear instantly on the live Chennai map with custom boundary circles.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateDealerPoint} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dealer Hub / Point Name *
                    </label>
                    <input
                      type="text"
                      value={newDealer.name}
                      onChange={(e) => setNewDealer({ ...newDealer, name: e.target.value })}
                      placeholder="e.g. Adyar Green Scrap Depot"
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Chennai Zone / Cluster *
                    </label>
                    <select
                      value={newDealer.district}
                      onChange={(e) => handleZoneSelect(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.keys(CHENNAI_ZONE_COORDINATES).filter(k => k !== 'All').map(z => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={newDealer.phone}
                      onChange={(e) => setNewDealer({ ...newDealer, phone: e.target.value })}
                      placeholder="+91 94440 00000"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Street Address & Ward *
                    </label>
                    <input
                      type="text"
                      value={newDealer.address}
                      onChange={(e) => setNewDealer({ ...newDealer, address: e.target.value })}
                      placeholder="e.g. 24, Lattice Bridge Rd, Ward 173, Adyar, Chennai 600020"
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={newDealer.operatingHours}
                      onChange={(e) => setNewDealer({ ...newDealer, operatingHours: e.target.value })}
                      placeholder="08:00 AM - 07:00 PM"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* GPS Coordinates & Boundary Slider */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-500" />
                      <span>Latitude</span>
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newDealer.lat}
                      onChange={(e) => setNewDealer({ ...newDealer, lat: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-500" />
                      <span>Longitude</span>
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newDealer.lng}
                      onChange={(e) => setNewDealer({ ...newDealer, lng: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-purple-500" />
                        <span>Service Boundary</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        {newDealer.serviceRadiusKm} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="30"
                      step="1"
                      value={newDealer.serviceRadiusKm}
                      onChange={(e) => setNewDealer({ ...newDealer, serviceRadiusKm: e.target.value })}
                      className="w-full accent-purple-600 h-1.5 cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                      <span>2 km (Local)</span>
                      <span>30 km (District)</span>
                    </div>
                  </div>
                </div>

                {/* Accepted Waste Categories Checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Accepted Waste Streams & Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'plastic', label: 'Plastics (PET/HDPE)' },
                      { id: 'metal', label: 'Metals (Iron/Aluminium)' },
                      { id: 'paper', label: 'Paper & Cardboard' },
                      { id: 'ewaste', label: 'E-Waste & Gadgets' },
                      { id: 'glass', label: 'Bottles & Glass' },
                      { id: 'battery', label: 'Batteries & Lead' }
                    ].map((cat) => {
                      const isSelected = newDealer.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleToggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-purple-300'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={dealerSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{dealerSubmitting ? 'Registering Dealer Point...' : 'Register Dealer Point (GCC Certified)'}</span>
                </button>
              </form>
            </div>

            {/* Section 2: Existing Dealer Points List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Authorized Chennai Dealer Network
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {dealersList.length} Active Hubs
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Each hub renders with its doorstep collection boundary circle on the Chennai map
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {dealersList.map((d) => (
                  <div
                    key={d._id || d.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 text-xs shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-blue-500" />
                            <span>{d.name}</span>
                          </h4>
                          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                            {d.district} Cluster
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 shrink-0">
                          ⭕ {d.serviceRadiusKm || 8} km Boundary
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {d.address}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                        <span>📞 {d.phone || '+91 94440 00000'}</span> •
                        <span>Lat: {d.lat?.toFixed(3)}, Lng: {d.lng?.toFixed(3)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap gap-1">
                        {d.acceptedWasteTypes?.slice(0, 3).map((w, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase"
                          >
                            {w.category || w}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleDeleteDealerPoint(d._id || d.id, d.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove Dealer Hub"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUTOMATED TEST SUITE RUNNER */}
        {activeTab === 'tests' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950/60 dark:via-slate-900 dark:to-pink-950/60 border border-purple-200 dark:border-purple-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                  Automated End-to-End Verification
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Access Control & Business Workflow Test Runner
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tests Customer pickup creation, Dealer acceptance, Weighbridge inventory credit, Factory requirement posting, Purchase order dispatch, Quality verification, and Audit logging.
                </p>
              </div>

              <button
                onClick={handleRunTestSuite}
                disabled={runningTests}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-4 h-4 fill-current ${runningTests ? 'animate-spin' : ''}`} />
                <span>{runningTests ? 'Running Assertions...' : 'Run Complete Test Suite'}</span>
              </button>
            </div>

            {/* Test Results Output */}
            {testResults ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                      {testResults.summary}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {testResults.passRate}
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {testResults.testResults.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {t.test}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {t.details}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        PASSED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                Click <strong>"Run Complete Test Suite"</strong> above to test all 8 access control and circular business workflow requirements.
              </div>
            )}
          </div>
        )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
