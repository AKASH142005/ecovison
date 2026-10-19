import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Coins,
  Leaf,
  MapPin
} from 'lucide-react';
import { useThemeMode } from '../../context/ThemeContext';

export default function BookingsListModal({ open, onClose, bookings = [] }) {
  const { isDark } = useThemeMode();

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
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                My Eco-Recovery Bookings
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {bookings.length} Scheduled
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Active waste recovery & doorstep collections across Tamil Nadu
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

      <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, maxHeight: '72vh', overflowY: 'auto' }}>
        {bookings.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">No active bookings found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Select any verified Tamil Nadu recycler on the map or list to schedule a drop-off or doorstep eco-van pickup.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.bookingId || b._id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-sm dark:shadow-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-500/30 shadow-xs">
                      {b.bookingId}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{b.collectorName}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">• {b.district}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{(b.status || 'pending').toUpperCase()}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Scheduled Slot</span>
                    <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">{b.scheduledDate}</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">{b.timeSlot}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Category & Weight</span>
                    <span className="font-semibold text-slate-900 dark:text-white block capitalize mt-0.5">{b.wasteCategory}</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">{b.estimatedWeightKg} kg</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Estimated Reward</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm block mt-0.5">₹{b.estimatedReward}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Cash / UPI</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">CO₂ Abated</span>
                    <span className="font-black text-teal-600 dark:text-teal-300 text-sm block mt-0.5">{b.co2SavedKg} kg</span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400/80">Green Impact</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{b.userAddress}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>

      <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
