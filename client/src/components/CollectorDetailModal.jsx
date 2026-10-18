import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  X,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  Navigation,
  Calendar,
  Award
} from 'lucide-react';
import { useThemeMode } from '../context/ThemeContext';

export default function CollectorDetailModal({
  collector,
  open,
  onClose,
  onStartNavigation,
  onOpenBooking,
  userLocation
}) {
  const { isDark } = useThemeMode();
  if (!collector) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
      <div className={`px-6 pt-6 pb-4 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800/80' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner shadow-emerald-500/20">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {collector.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                TNPCB Certified
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Authorized Recycling & Material Recovery Facility • {collector.district}
            </p>
          </div>
        </div>

        <IconButton
          onClick={onClose}
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

      <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, maxHeight: '74vh', overflowY: 'auto' }}>
        <div className="space-y-5">
          
          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Citizen Rating</span>
              <div className="flex items-center justify-center gap-1 text-amber-500 dark:text-amber-400 font-black text-base mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{collector.rating}</span>
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Distance</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black text-base mt-0.5 block">
                {collector.distanceKm != null ? `${collector.distanceKm} km` : 'Tamil Nadu'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">TNPCB Reg.</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono font-bold text-xs mt-1 block truncate">
                {collector.tnpcbRegNo}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Capacity Load</span>
              <div className="mt-1">
                <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">{collector.capacityLoad}%</span>
                <LinearProgress
                  variant="determinate"
                  value={collector.capacityLoad}
                  sx={{
                    mt: 0.5,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: isDark ? '#1e293b' : '#e2e8f0',
                    '& .MuiLinearProgress-bar': { bgcolor: isDark ? '#10b981' : '#059669' }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Description & Location */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Center Profile & Address
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {collector.description}
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{collector.address}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  District: {collector.district} | GPS: {collector.lat.toFixed(5)}, {collector.lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>

          {/* Accepted Materials Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                Accepted Waste Materials & Payout Rates
              </h4>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Rates Verified Today</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {collector.acceptedWasteTypes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white capitalize block">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.acceptsDropoff ? '✓ Drop-off' : ''} {item.acceptsPickup ? '• ✓ Doorstep Van' : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ₹{item.ratePerKg}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-normal">/ kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Official Center Helpline</span>
                <a href={`tel:${collector.phone}`} className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-300 text-sm">
                  {collector.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Weighbridge Timing</span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{collector.operatingHours}</span>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>

      <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
        >
          Close
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenBooking(collector);
            }}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Schedule Collection</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartNavigation(collector);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs tracking-wide shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Navigation className="w-4 h-4 stroke-[2.5]" />
            <span>Start GPS Route</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
