import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react';
import { Button, Chip, TextField, InputAdornment, LinearProgress } from '@mui/material';

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
    <div className="space-y-4">
      {/* Search & Header bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Verified Tamil Nadu Waste Collectors</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
              {collectors.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Ranked by proximity to your chosen location in Tamil Nadu
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72">
          <TextField
            size="small"
            placeholder="Search depot, area, city..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4 text-slate-400" />
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'rgba(15, 23, 42, 0.8)',
                borderRadius: 2,
                fontSize: '0.85rem',
                color: '#f8fafc',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(51, 65, 85, 0.7)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Collector Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 glass-panel rounded-2xl">
          <LinearProgress color="primary" sx={{ borderRadius: 4, height: 6 }} />
          <p className="text-sm font-semibold">Calculating routes and loading Tamil Nadu collectors...</p>
        </div>
      ) : collectors.length === 0 ? (
        <div className="p-8 text-center glass-panel rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-white">No collectors match this filter</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try choosing another Tamil Nadu district or selecting "All Categories" from the waste filter above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectors.map((col) => {
            const isSelected = selectedCollector?._id === col._id;

            return (
              <div
                key={col._id || `${col.lat}-${col.lng}`}
                onClick={() => onSelectCollector(col)}
                className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left border ${
                  isSelected
                    ? 'bg-gradient-to-br from-slate-900 to-emerald-950/50 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.01]'
                    : 'glass-card border-slate-800/80 hover:border-slate-700 bg-slate-900/70 hover:bg-slate-900'
                }`}
              >
                {/* Distance Badge top right */}
                {col.distanceKm != null && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    <Navigation className="w-3 h-3 text-emerald-400" />
                    <span>{col.distanceKm} km</span>
                    <span className="text-[10px] text-emerald-400/80 font-normal">({col.durationMin}m)</span>
                  </div>
                )}

                {/* Main Content */}
                <div className="pr-20">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white hover:text-emerald-300 transition-colors">
                      {col.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-semibold text-emerald-400">{col.city}</span>
                    <span>•</span>
                    <span>{col.district} District</span>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{col.rating}</span>
                      <span className="text-slate-500 font-normal">({col.totalReviews})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {col.address}
                </p>

                {/* Accepted Waste Types pills with rates */}
                <div className="mt-3">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Accepted Waste Types & Rates</span>
                    <span className="text-emerald-400 font-normal">Daily Rates</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {col.acceptedWasteTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                          selectedWasteType === type.category
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700/60'
                        }`}
                      >
                        {type.category} <strong className="text-emerald-400">₹{type.ratePerKg}/kg</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capacity meter */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px]">{col.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span>Depot Load:</span>
                    <span className="font-semibold text-slate-300">{col.capacityLoad}%</span>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onStartNavigation(col)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </button>

                  <button
                    onClick={() => onOpenBooking(col)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Schedule</span>
                  </button>

                  <button
                    onClick={() => onOpenDetails(col)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
                    title="View Full Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
