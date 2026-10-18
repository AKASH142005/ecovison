import React from 'react';
import {
  Navigation,
  Compass,
  Clock,
  MapPin,
  ExternalLink,
  X,
  Phone
} from 'lucide-react';
import { Button } from '@mui/material';
import { useThemeMode } from '../context/ThemeContext';

export default function NavigationRoutePanel({
  collector,
  userLocation,
  onClose,
  onOpenBooking
}) {
  const { isDark } = useThemeMode();
  if (!collector) return null;

  const googleMapsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${collector.lat},${collector.lng}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${collector.lat},${collector.lng}`;

  return (
    <div className="relative glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 shadow-xl dark:shadow-2xl space-y-4 transition-all duration-200">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              Active Route Navigation
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              TNPCB: {collector.tnpcbRegNo}
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {collector.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
            <span>{collector.address}</span>
          </p>
        </div>

        {/* Distance & Time Pill */}
        {collector.distanceKm != null && (
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs dark:shadow-none">
            <div className="text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Distance</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {collector.distanceKm} <span className="text-xs text-emerald-500 dark:text-emerald-300 font-normal">km</span>
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
            <div className="text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Drive Time</span>
              <span className="text-xl font-black text-teal-600 dark:text-teal-300">
                {collector.durationMin} <span className="text-xs text-teal-500 dark:text-teal-200 font-normal">mins</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Turn-by-Turn Route Preview steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2.5 shadow-xs dark:shadow-none">
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
            1
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Depart From Origin</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Head toward nearest Tamil Nadu State Highway/Corridor</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2.5 shadow-xs dark:shadow-none">
          <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
            2
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Corridor Transit</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Follow designated municipal recycling recovery lane</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2.5 shadow-xs dark:shadow-none">
          <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
            3
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Arrive at Depot Weighbridge</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Electronic tare weight & instant cash/digital payout</span>
          </div>
        </div>
      </div>

      {/* Action CTA buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Phone className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>Depot Hotline: <strong className="text-slate-800 dark:text-white">{collector.phone}</strong></span>
          <span className="opacity-40">•</span>
          <Clock className="w-3.5 h-3.5 text-amber-500 ml-1" />
          <span>{collector.operatingHours}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => onOpenBooking(collector)}
            sx={{
              borderColor: isDark ? 'rgba(16, 185, 129, 0.4)' : '#059669',
              color: isDark ? '#34d399' : '#059669',
              fontSize: '0.82rem',
              '&:hover': { bgcolor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)' }
            }}
          >
            Schedule Drop-Off / Pickup
          </Button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps GPS</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
      </div>

    </div>
  );
}
