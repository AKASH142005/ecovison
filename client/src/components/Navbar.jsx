import React from 'react';
import {
  Recycle,
  MapPin,
  Calendar,
  Sparkles,
  Compass,
  Award
} from 'lucide-react';
import { Button, Chip, Badge, Tooltip } from '@mui/material';

export default function Navbar({
  userLocation,
  onLocateUser,
  isLocating,
  locationName,
  bookingCount,
  onOpenBookings,
  onOpenGuide
}) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 text-slate-950">
            <Recycle className="w-7 h-7 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Eco<span className="text-emerald-400">Vision</span>
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-full">
                Tamil Nadu
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart Waste Management & Collector GPS Navigator
            </p>
          </div>
        </div>

        {/* Center / Location status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Origin:</span>
            <span className="font-semibold text-emerald-300 max-w-[180px] truncate">
              {locationName || (userLocation ? `${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)}` : 'Tamil Nadu Center')}
            </span>
          </div>

          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={onLocateUser}
            disabled={isLocating}
            startIcon={<Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />}
            sx={{
              borderColor: 'rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '0.78rem',
              '&:hover': {
                borderColor: '#10b981',
                bgcolor: 'rgba(16, 185, 129, 0.1)'
              }
            }}
          >
            {isLocating ? 'Locating...' : 'Use My GPS'}
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="text"
            size="small"
            onClick={onOpenGuide}
            startIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
            sx={{ color: '#94a3b8', fontSize: '0.8rem', '&:hover': { color: '#f8fafc' } }}
          >
            Recycling Guide
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={onOpenBookings}
            startIcon={<Calendar className="w-4 h-4 text-slate-950" />}
            sx={{
              bgcolor: '#10b981',
              color: '#022c22',
              fontWeight: 700,
              '&:hover': { bgcolor: '#059669' }
            }}
          >
            <span className="hidden sm:inline">My Pickups</span>
            <span className="sm:hidden">Pickups</span>
            {bookingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 bg-slate-950 text-emerald-300 text-xs rounded-full font-bold">
                {bookingCount}
              </span>
            )}
          </Button>
        </div>

      </div>
    </header>
  );
}
