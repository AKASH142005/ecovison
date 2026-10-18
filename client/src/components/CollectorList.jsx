import React from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Star,
  Clock,
  Search,
  Filter,
  Calendar,
  Eye,
  X
} from 'lucide-react';
import { LinearProgress } from '@mui/material';

export default function CollectorList({
  collectors = [],
  selectedCollector,
  onSelectCollector,
  onStartNavigation,
  onOpenDetails,
  onOpenBooking,
  selectedWasteType,
  searchTerm,
  onSearchChange,
  isLoading
}) {
  return (
    <div className="h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-xl dark:shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col transition-colors duration-300">
      {/* Pinned Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/70 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Verified Centers</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                {collectors.length}
              </span>
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            Ranked by nearest
          </span>
        </div>

        {/* Search Input with Clear Button */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search depot, city, or area..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700/80 pl-10 pr-9 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Collector Cards Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400 space-y-3 px-4">
            <LinearProgress color="primary" sx={{ borderRadius: 4, height: 6 }} />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Calculating GPS routes to Tamil Nadu recovery hubs...</p>
          </div>
        ) : collectors.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 space-y-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">No centers match this search</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Try selecting another waste type or clearing your search term.
            </p>
          </div>
        ) : (
          collectors.map((col) => {
            const isSelected = selectedCollector?._id === col._id;

            return (
              <div
                key={col._id || `${col.lat}-${col.lng}`}
                onClick={() => onSelectCollector(col)}
                className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer text-left border overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-slate-900 dark:to-emerald-950/60 border-emerald-500 dark:border-emerald-400 shadow-lg dark:shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                    : 'glass-card border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-xs dark:shadow-none'
                }`}
              >
                {/* Top Meta: District/City + Distance Badge */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{col.city}</span>
                    <span>•</span>
                    <span className="truncate">{col.district} District</span>
                  </div>

                  {col.distanceKm != null && (
                    <div className="shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                      <Navigation className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{col.distanceKm} km</span>
                      <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-normal">({col.durationMin}m)</span>
                    </div>
                  )}
                </div>

                {/* Facility Name & Rating */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors leading-snug break-words">
                    {col.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-amber-500 dark:text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{col.rating}</span>
                    <span className="text-slate-500 dark:text-slate-500 font-normal">({col.totalReviews} reviews)</span>
                  </div>
                </div>

                {/* Address */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {col.address}
                </p>

                {/* Accepted Waste Types */}
                <div className="mt-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Accepted Materials</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-normal text-[10px]">Daily Rates</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {col.acceptedWasteTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                          selectedWasteType === type.category
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/50 font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        {type.category} <strong className="text-emerald-600 dark:text-emerald-400">₹{type.ratePerKg}/kg</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hours & Depot Load */}
                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="text-[11px]">{col.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span>Depot Load:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{col.capacityLoad}%</span>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div
                  className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onStartNavigation(col)}
                    className="flex-1 min-w-0 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                    <span className="truncate">Navigate</span>
                  </button>

                  <button
                    onClick={() => onOpenBooking(col)}
                    className="shrink-0 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Schedule</span>
                  </button>

                  <button
                    onClick={() => onOpenDetails(col)}
                    className="shrink-0 py-2.5 px-3 rounded-xl bg-slate-100/90 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                    title="View Center Details"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
