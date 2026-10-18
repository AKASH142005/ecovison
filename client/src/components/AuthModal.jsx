import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  Truck,
  Factory,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  LogOut,
  KeyRound,
  ShieldCheck,
  UserPlus,
  Compass,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_CONFIGS = {
  customer: {
    id: 'customer',
    label: 'Citizen Customer',
    shortLabel: 'Customer',
    icon: User,
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-500/10',
    badge: 'Citizen Scrap Seller',
    defaultEmail: 'customer@ecovision.tn',
    defaultPass: 'pass123',
    demoPersona: 'Kavitha Ramachandran • Anna Nagar (Zone 8)',
    desc: 'Doorstep scrap pickup requests, live Chennai ward scrap rates, carbon offset tracking, and eco-reward points.',
    attributes: [
      '📍 Doorstep Ward Pickups',
      '📈 Live Chennai Scrap Rates',
      '🪙 Eco-Points Accumulation',
      '🌿 CO₂ Abatement Tracking'
    ]
  },
  dealer: {
    id: 'dealer',
    label: 'Chennai Recovery Dealer',
    shortLabel: 'Dealer',
    icon: Truck,
    color: 'from-blue-500 to-indigo-600',
    border: 'border-blue-500',
    accentText: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-500/10',
    badge: 'Weighbridge & Baling Hub',
    defaultEmail: 'dealer@ecovision.tn',
    defaultPass: 'pass123',
    demoPersona: 'Guindy Recovery Hub • SIDCO Cluster (Zone 12)',
    desc: 'Intake citizen waste, verify weighbridge scale weights, manage baled warehouse stock, set 2-30km collection boundary, and supply industrial factories.',
    attributes: [
      '⚖️ Digital Weighbridge Scales',
      '📦 Baled Warehouse Stock',
      '⭕ 2-30km Catchment Boundary',
      '🚚 Factory PO Commitments'
    ]
  },
  factory: {
    id: 'factory',
    label: 'Industrial Factory Buyer',
    shortLabel: 'Factory',
    icon: Factory,
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-500',
    accentText: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-500/10',
    badge: 'Industrial Raw Material Buyer',
    defaultEmail: 'factory@ecovision.tn',
    defaultPass: 'pass123',
    demoPersona: 'Manali Eco-Polymers Ltd • Petrochemical Belt',
    desc: 'Publish bulk material procurement demands (rPET, aluminum, cardboard), inspect inbound consignments at truck gate, and execute bank wire settlements.',
    attributes: [
      '📋 Bulk Demand Publishing',
      '🔬 Truck Gate QA Inspection',
      '🏢 Secondary Smelting & Repulping',
      '💳 Trade Wire Settlements'
    ]
  },
  admin: {
    id: 'admin',
    label: 'GCC & TNPCB City Admin',
    shortLabel: 'GCC Admin',
    icon: ShieldCheck,
    color: 'from-purple-500 to-pink-600',
    border: 'border-purple-500',
    accentText: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-500/10',
    badge: 'Municipal Governance Core',
    defaultEmail: 'admin@ecovision.tn',
    defaultPass: 'pass123',
    demoPersona: 'Dr. S. Meenakshi • Ripon Building Central Core',
    desc: 'City-wide waste diversion analytics across all 15 Chennai zones, TNPCB compliance audit trail, certified dealer point creation, and RBAC test suite.',
    attributes: [
      '🏛️ Ripon Municipal Governance',
      '🛡️ TNPCB Compliance Audits',
      '🗺️ Collection Hub Manager',
      '⚡ Automated RBAC Tester'
    ]
  }
};

export default function AuthModal({
  isOpen,
  onClose,
  onRoleSwitched,
  initialRole = null,
  requiredRoleMessage = null
}) {
  const { user, login, register, logout, switchRole, aggregations } = useAuth();

  const [activeRole, setActiveRole] = useState(initialRole || user?.role || 'customer');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    district: 'Anna Nagar',
    facilityName: '',
    address: '',
    serviceRadiusKm: 8,
    serviceWards: ['Anna Nagar', 'Ambattur', 'T. Nagar']
  });

  // When modal opens or initialRole changes, sync active role
  useEffect(() => {
    if (initialRole) {
      setActiveRole(initialRole);
      setLoginEmail(ROLE_CONFIGS[initialRole]?.defaultEmail || '');
      setLoginPassword(ROLE_CONFIGS[initialRole]?.defaultPass || '');
    } else if (user?.role) {
      setActiveRole(user.role);
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const currentRoleConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.customer;
  const RoleIcon = currentRoleConfig.icon;

  const handleRoleTabClick = (roleKey) => {
    setActiveRole(roleKey);
    setErrorMsg('');
    setSuccessMsg('');
    setIsRegisterMode(false);
    setLoginEmail(ROLE_CONFIGS[roleKey]?.defaultEmail || '');
    setLoginPassword(ROLE_CONFIGS[roleKey]?.defaultPass || '');
  };

  const handleFillDemoCreds = () => {
    setLoginEmail(currentRoleConfig.defaultEmail);
    setLoginPassword(currentRoleConfig.defaultPass);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const loggedUser = await login(loginEmail, loginPassword);

      if (loggedUser.role !== activeRole) {
        setSuccessMsg(`Authenticated as ${loggedUser.name} (${loggedUser.role.toUpperCase()})!`);
      } else {
        setSuccessMsg(`Welcome to ${currentRoleConfig.label}, ${loggedUser.name}!`);
      }

      if (onRoleSwitched) onRoleSwitched(loggedUser.role);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regData.name || !regData.email || !regData.password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newUser = await register({
        ...regData,
        role: activeRole
      });
      setSuccessMsg(`Account registered as ${newUser.role.toUpperCase()}! You are now logged in.`);
      if (onRoleSwitched) onRoleSwitched(newUser.role);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${currentRoleConfig.bgLight} border border-current flex items-center justify-center ${currentRoleConfig.accentText}`}>
              <RoleIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Chennai Role-Based Authentication
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/30">
                  GCC Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log into dedicated services to access individual aggregations and attributes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access Restricted Warning Banner if triggered by unauthorized access */}
        {requiredRoleMessage && (
          <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>🔒 Access Restricted: {requiredRoleMessage}</span>
          </div>
        )}

        {/* Active Logged-in Account Banner */}
        {user && (
          <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-500 dark:text-slate-400">Current Session:</span>
              <strong className="text-slate-900 dark:text-white">{user.name}</strong>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {user.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* 4 Dedicated Role Portal Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60 p-1.5 gap-1.5">
          {Object.entries(ROLE_CONFIGS).map(([roleKey, conf]) => {
            const Icon = conf.icon;
            const isTabActive = activeRole === roleKey;

            return (
              <button
                key={roleKey}
                type="button"
                onClick={() => handleRoleTabClick(roleKey)}
                className={`py-2 px-1 sm:px-2 rounded-xl text-center transition-all flex flex-col items-center gap-1 ${
                  isTabActive
                    ? 'bg-white dark:bg-slate-900 shadow-md font-black ' + conf.accentText
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] leading-tight truncate">{conf.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Persona Header & Distinct Attributes Card */}
          <div className={`p-4 rounded-2xl border ${currentRoleConfig.border}/30 ${currentRoleConfig.bgLight} space-y-3`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${currentRoleConfig.accentText}`}>
                  {currentRoleConfig.badge}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {currentRoleConfig.label} Portal
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {currentRoleConfig.desc}
                </p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0">
                <RoleIcon className={`w-5 h-5 ${currentRoleConfig.accentText}`} />
              </div>
            </div>

            {/* Individual Role Attributes Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              {currentRoleConfig.attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate"
                >
                  {attr}
                </div>
              ))}
            </div>
          </div>

          {/* Mode Switcher: Login vs Register */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>{isRegisterMode ? `Register New ${currentRoleConfig.shortLabel} Account` : `Sign In to ${currentRoleConfig.label}`}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{isRegisterMode ? 'Already have an account? Sign In' : `Create New ${currentRoleConfig.shortLabel}`}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* MODE 1: LOGIN FORM */}
          {!isRegisterMode && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">
                  <span>Demo Persona: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{currentRoleConfig.demoPersona}</strong>
                </div>

                <button
                  type="button"
                  onClick={handleFillDemoCreds}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-[10px] font-bold transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Fill {currentRoleConfig.shortLabel} Creds</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {currentRoleConfig.shortLabel} Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={currentRoleConfig.defaultEmail}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password (default pass123)"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  activeRole === 'customer' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25' :
                  activeRole === 'dealer' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25' :
                  activeRole === 'factory' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/25' :
                  'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25'
                }`}
              >
                <span>{isSubmitting ? 'Authenticating...' : `Sign In as ${currentRoleConfig.label}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: REGISTER FORM */}
          {isRegisterMode && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {activeRole === 'customer' ? 'Citizen Full Name' : 'Facility Officer / Lead Name'} *
                  </label>
                  <input
                    type="text"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="e.g. S. Karthik"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="e.g. karthik@chennairecycle.org"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Create a password"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / Contact
                  </label>
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+91 98401 00000"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chennai Zone / Locality
                  </label>
                  <select
                    value={regData.district}
                    onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Anna Nagar">Anna Nagar (Zone 8)</option>
                    <option value="Guindy">Guindy (Zone 12)</option>
                    <option value="Adyar">Adyar (Zone 13)</option>
                    <option value="T. Nagar">T. Nagar (Zone 10)</option>
                    <option value="Velachery">Velachery (Zone 13)</option>
                    <option value="Perungudi / OMR">Perungudi / OMR (Zone 14)</option>
                    <option value="Ambattur">Ambattur (Zone 7)</option>
                    <option value="Mylapore">Mylapore (Zone 9)</option>
                    <option value="Porur">Porur (Zone 11)</option>
                    <option value="Royapuram">Royapuram (Zone 5)</option>
                    <option value="Manali">Manali (Zone 2)</option>
                    <option value="Tambaram">Tambaram South</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Facility / Company Name
                  </label>
                  <input
                    type="text"
                    value={regData.facilityName}
                    onChange={(e) => setRegData({ ...regData, facilityName: e.target.value })}
                    placeholder={activeRole === 'customer' ? 'Apartment / Residence' : 'e.g. Adyar Eco-Recovery Hub'}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={regData.address}
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                  placeholder="e.g. 18, 3rd Cross Street, Gandhinagar, Adyar, Chennai 600020"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Dealer Collection Boundary Configuration */}
              {activeRole === 'dealer' && (
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Waste Collection Service Boundary</span>
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        This radius circle will be plotted on Chennai live map upon registration
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
                      {regData.serviceRadiusKm || 8} km
                    </span>
                  </div>

                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={regData.serviceRadiusKm || 8}
                    onChange={(e) => setRegData({ ...regData, serviceRadiusKm: Number(e.target.value) })}
                    className="w-full accent-blue-600 h-2 cursor-pointer bg-blue-200 dark:bg-blue-900/60 rounded-lg"
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span>2 km (Local)</span>
                    <span>8 km (Cluster)</span>
                    <span>15 km (Multi-Zone)</span>
                    <span>30 km (District)</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <span>{isSubmitting ? 'Registering...' : `Complete ${currentRoleConfig.shortLabel} Registration`}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
