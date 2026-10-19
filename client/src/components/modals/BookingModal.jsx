import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import {
  X,
  Calendar,
  Truck,
  CheckCircle2,
  Sparkles,
  Coins,
  Leaf,
  ShieldCheck,
  Package,
  User,
  Phone,
  MapPin,
  Compass,
  Clock,
  FileText,
  Copy,
  Check,
  Store,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Wine,
  Shirt,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';

const DEFAULT_CATEGORIES = [
  { id: 'plastic', name: 'Plastics & Polymers', rate: 20, co2: 1.8, icon: Package, color: 'from-cyan-500 to-blue-600', badge: 'Recyclable' },
  { id: 'ewaste', name: 'E-Waste & Electronics', rate: 60, co2: 14.5, icon: Cpu, color: 'from-purple-500 to-indigo-600', badge: 'High Value' },
  { id: 'organic', name: 'Organic & Wet Waste', rate: 5, co2: 0.9, icon: Leaf, color: 'from-emerald-500 to-green-600', badge: 'Compost' },
  { id: 'metal', name: 'Metals & Scrap Alloys', rate: 40, co2: 4.2, icon: ShieldCheck, color: 'from-amber-500 to-orange-600', badge: 'High Value' },
  { id: 'paper', name: 'Paper & Cardboard', rate: 15, co2: 1.2, icon: BookOpen, color: 'from-blue-500 to-sky-600', badge: 'Recyclable' },
  { id: 'glass', name: 'Glass & Cullet', rate: 8, co2: 0.8, icon: Wine, color: 'from-pink-500 to-rose-600', badge: 'Fragile' },
  { id: 'textile', name: 'Textiles & Fabric', rate: 24, co2: 3.5, icon: Shirt, color: 'from-teal-500 to-emerald-600', badge: 'Upcycle' }
];

const WEIGHT_PRESETS = [5, 10, 25, 50, 100];

const TIME_SLOTS = [
  { label: 'Morning Slot', time: '08:00 AM - 11:00 AM', icon: '🌅' },
  { label: 'Midday Slot', time: '11:00 AM - 02:00 PM', icon: '☀️' },
  { label: 'Afternoon', time: '02:00 PM - 05:00 PM', icon: '🌤️' },
  { label: 'Evening Slot', time: '05:00 PM - 07:30 PM', icon: '🌙' }
];

export default function BookingModal({
  open,
  onClose,
  collector,
  defaultWasteType,
  onBookingSuccess,
  userLocation,
  onLocateUser
}) {
  const { isDark } = useThemeMode();
  const [bookingType, setBookingType] = useState('dropoff'); // 'dropoff' or 'doorstep_pickup'
  const [wasteCategory, setWasteCategory] = useState(
    defaultWasteType && defaultWasteType !== 'all' ? defaultWasteType : 'plastic'
  );
  const [estimatedWeightKg, setEstimatedWeightKg] = useState('10');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (open) {
      if (defaultWasteType && defaultWasteType !== 'all') {
        setWasteCategory(defaultWasteType);
      }
      setConfirmedBooking(null);
      setErrorMsg('');
    }
  }, [open, defaultWasteType]);

  // Compute live estimated earnings and CO2
  const currentCat = DEFAULT_CATEGORIES.find(c => c.id === wasteCategory) || DEFAULT_CATEGORIES[0];
  const weightNum = Math.max(0, parseFloat(estimatedWeightKg) || 0);
  const estimatedReward = Math.round(weightNum * currentCat.rate);
  const estimatedCo2 = Math.round(weightNum * currentCat.co2 * 10) / 10;
  const treeEquivalents = Math.round(estimatedCo2 * 0.05 * 10) / 10;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      setErrorMsg('Please enter your full name and contact number');
      return;
    }
    if (bookingType === 'doorstep_pickup' && !userAddress.trim()) {
      setErrorMsg('Please enter your doorstep pickup address in Tamil Nadu');
      return;
    }
    if (weightNum <= 0) {
      setErrorMsg('Please provide a valid estimated weight (min 1 kg)');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        collectorId: collector?._id || 'tn_central_depot',
        collectorName: collector?.name || 'Tamil Nadu Recycling Center',
        type: bookingType,
        wasteCategory,
        estimatedWeightKg: weightNum,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        userAddress: (userAddress.trim() || collector?.address || 'Direct Center Drop-off'),
        district: collector?.district || 'Tamil Nadu',
        scheduledDate,
        timeSlot,
        notes: notes.trim()
      };

      const result = await api.createBooking(payload);

      if (result.success) {
        setConfirmedBooking(result.booking);
        // Fire confetti effect
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24', '#a855f7']
        });

        if (onBookingSuccess) {
          onBookingSuccess(result.booking);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (confirmedBooking?.bookingId) {
      navigator.clipboard.writeText(confirmedBooking.bookingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setErrorMsg('');
    setCopiedId(false);
    onClose();
  };

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const maxDateStr = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  return (
    <Dialog
      open={open}
      onClose={handleResetAndClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? '#0a0f1d' : '#ffffff',
          backgroundImage: isDark
            ? 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.96) 50%, #030712 100%)'
            : 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, #ffffff 70%)',
          border: isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '24px',
          color: isDark ? '#f8fafc' : '#0f172a',
          boxShadow: isDark
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.15)'
            : '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 35px rgba(16, 185, 129, 0.06)',
          overflow: 'hidden',
          m: 2
        }
      }}
    >
      {/* Header */}
      <div className={`relative px-6 pt-6 pb-4 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800/80' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner shadow-emerald-500/20">
            {confirmedBooking ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            ) : (
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {confirmedBooking ? 'Eco-Pass Confirmed!' : 'Schedule Waste Collection'}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                TNPCB Verified
              </span>
            </div>
            <p className={`text-xs truncate max-w-[280px] sm:max-w-md mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {collector ? collector.name : 'Tamil Nadu Clean Hub Network'}
            </p>
          </div>
        </div>

        <IconButton
          onClick={handleResetAndClose}
          sx={{
            color: isDark ? '#94a3b8' : '#64748b',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              color: isDark ? '#ffffff' : '#0f172a',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s'
          }}
          size="small"
        >
          <X className="w-4 h-4" />
        </IconButton>
      </div>

      <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, maxHeight: '78vh', overflowY: 'auto' }}>
        {confirmedBooking ? (
          /* =========================================================
             STUNNING CONFIRMATION ECO-BOARDING PASS
             ========================================================= */
          <div className="space-y-5 py-2">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 mb-2">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Booking Dispatched!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Your collection has been scheduled. Present your reference code upon arrival or when the eco-van arrives.
              </p>
            </div>

            {/* Boarding Pass Ticket */}
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-emerald-300 dark:border-emerald-500/30 p-5 shadow-lg dark:shadow-2xl overflow-hidden">
              {/* Top Decorative Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    EcoVision Recovery Pass
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  {confirmedBooking.type === 'doorstep_pickup' ? '🚐 Doorstep Pickup' : '🏢 Direct Drop-off'}
                </span>
              </div>

              {/* Reference ID Bar */}
              <div className="my-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Tracking Reference</span>
                  <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {confirmedBooking.bookingId}
                  </span>
                </div>

                <button
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Pass Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Center / Facility</span>
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{confirmedBooking.collectorName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{confirmedBooking.district} District</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Scheduled Date & Time</span>
                  <p className="font-semibold text-slate-900 dark:text-white">{confirmedBooking.scheduledDate}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{confirmedBooking.timeSlot}</p>
                </div>

                <div className="space-y-0.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Material & Weight</span>
                  <p className="font-bold text-slate-900 dark:text-white capitalize">{confirmedBooking.wasteCategory}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">{confirmedBooking.estimatedWeightKg} kg</p>
                </div>

                <div className="space-y-0.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Estimated Citizen Payout</span>
                  <p className="font-black text-emerald-600 dark:text-emerald-400 text-base">₹{confirmedBooking.estimatedReward}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">UPI / Cash on Weighing</p>
                </div>
              </div>

              {/* Perforation visual line */}
              <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Citizen: {confirmedBooking.userName}</span>
                <span className="font-mono">{confirmedBooking.userPhone}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Done & Return to Map</span>
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================
             BOOKING FORM
             ========================================================= */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-500/40 text-red-800 dark:text-red-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* 1. Mode of Recovery */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400 block mb-2">
                1. Select Handover Method
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setBookingType('dropoff')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    bookingType === 'dropoff'
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-emerald-950/80 dark:to-slate-900 border-emerald-500 dark:border-emerald-400 shadow-md ring-1 ring-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      bookingType === 'dropoff' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Store className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                      Express
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Direct Center Drop-off</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Deliver your waste directly to the recovery depot
                  </p>
                </div>

                <div
                  onClick={() => setBookingType('doorstep_pickup')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    bookingType === 'doorstep_pickup'
                      ? 'bg-gradient-to-br from-teal-50 to-emerald-50/70 dark:from-teal-950/80 dark:to-slate-900 border-teal-500 dark:border-teal-400 shadow-md ring-1 ring-teal-500'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      bookingType === 'doorstep_pickup' ? 'bg-teal-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/30">
                      At Home
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Doorstep Eco-Van Pickup</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Authorized collection van arrives at your home
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Waste Category Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">
                  2. Waste Category
                </label>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  Current Market Rate: ₹{currentCat.rate}/kg
                </span>
              </div>

              <div className="relative">
                <select
                  value={wasteCategory}
                  onChange={(e) => setWasteCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none transition-all cursor-pointer"
                >
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {c.name} — ₹{c.rate}/kg ({c.badge})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* 3. Weight Input with Quick-Pills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">
                  3. Estimated Weight
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tap preset or enter custom</span>
              </div>

              <div className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={estimatedWeightKg}
                    onChange={(e) => setEstimatedWeightKg(e.target.value)}
                    placeholder="Enter weight in kg"
                    className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-700 pl-4 pr-14 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <div className="absolute right-3 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-slate-200 dark:border-slate-700">
                    KG
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {WEIGHT_PRESETS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setEstimatedWeightKg(String(w))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        String(w) === String(estimatedWeightKg)
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {w} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Valuation & Carbon Savings Card */}
            <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/60 border border-emerald-300 dark:border-emerald-500/30 shadow-md grid grid-cols-2 gap-3 divide-x divide-slate-200 dark:divide-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                    Estimated Citizen Payout
                  </span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">
                    ₹{estimatedReward.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Cash / UPI on Weighing</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 dark:bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-300 shrink-0">
                  <Leaf className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                    Carbon Offset
                  </span>
                  <div className="text-xl font-black text-teal-600 dark:text-teal-300 leading-tight">
                    {estimatedCo2} kg <span className="text-xs text-teal-500 dark:text-teal-400 font-normal">CO₂</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">≈ {treeEquivalents} tree equivalents</span>
                </div>
              </div>
            </div>

            {/* 4. Citizen Contact Details */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400 block mb-2">
                4. Citizen Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-sm rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number *"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-sm rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {bookingType === 'doorstep_pickup' && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Pickup Address in Tamil Nadu *
                    </span>
                    <div className="flex items-center gap-1.5">
                      {userLocation && (userLocation.address || userLocation.name) && (
                        <button
                          type="button"
                          onClick={() => setUserAddress(userLocation.address || userLocation.name)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 bg-emerald-100/80 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800/80 transition-colors"
                          title="Fill from map pin"
                        >
                          <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Use Map Pin ({userLocation.name?.slice(0, 18)}...)</span>
                        </button>
                      )}
                      {onLocateUser && (
                        <button
                          type="button"
                          onClick={onLocateUser}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800 transition-colors"
                          title="Detect GPS"
                        >
                          <Compass className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          <span>Detect GPS</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3.5 top-3 text-slate-400">
                      <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder="Complete Pickup Address (Door No, Street, Area, Landmark, City/Town) *"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-sm rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. Date & Time Scheduling */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400 block mb-2">
                5. Preferred Date & Time
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <input
                    type="date"
                    min={tomorrowStr}
                    max={maxDateStr}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-sm rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Clock className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                  </div>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-sm rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-8 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.time} value={slot.time} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {slot.icon} {slot.time}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5 rotate-90 text-teal-500 dark:text-teal-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Special Instructions (Optional) */}
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Optional notes (e.g. bulk cartons packed, call before arrival)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Scheduling Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm & Schedule</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
