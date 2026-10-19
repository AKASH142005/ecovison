import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { LinearProgress } from '@mui/material';
import CollectorCard from './CollectorCard';

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
          collectors.map((col) => (
            <CollectorCard
              key={col._id || `${col.lat}-${col.lng}`}
              collector={col}
              isSelected={selectedCollector?._id === col._id}
              onSelectCollector={onSelectCollector}
              onStartNavigation={onStartNavigation}
              onOpenBooking={onOpenBooking}
              onOpenDetails={onOpenDetails}
              selectedWasteType={selectedWasteType}
            />
          ))
        )}
      </div>
    </div>
  );
}
