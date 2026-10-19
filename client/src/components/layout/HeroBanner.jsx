import React from 'react';
import { Sparkles, User, Compass } from 'lucide-react';
import { useThemeMode } from '../../context/ThemeContext';

export default function HeroBanner({
  collectors = [],
  bookingCount = 0,
  onOpenBooking,
  onLocateUser,
  onOpenBookings
}) {
  const { isDark } = useThemeMode();

  return (
    <div className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-300 ${
      isDark
        ? 'border border-emerald-500/20 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 shadow-2xl'
        : 'border border-emerald-500/25 bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 shadow-lg'
    }`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl space-y-3">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
          isDark
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>Citizen Recycling • Greater Chennai Corporation (GCC) & TNPCB Clean City</span>
        </div>

        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Give Household Waste to Verified <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
            isDark ? 'from-emerald-400 to-teal-300' : 'from-emerald-600 to-teal-500'
          }`}>Chennai Scrap Dealers</span>
        </h1>

        <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Locate nearby certified recovery dealers across Anna Nagar, Adyar, Guindy, T. Nagar, Perungudi, and Ambattur. Book doorstep waste pickups, get paid live scrap rates, and accumulate eco-reward points.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onOpenBooking?.(collectors[0] || null)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Book Doorstep Scrap Pickup</span>
          </button>

          <button
            onClick={onLocateUser}
            className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-emerald-500" />
            <span>Find Nearest Dealer (GPS)</span>
          </button>

          <button
            onClick={onOpenBookings}
            className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-1.5"
          >
            <span>My Pickup Bookings ({bookingCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
