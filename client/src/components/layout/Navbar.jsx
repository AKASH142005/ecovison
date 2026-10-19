import React from 'react';
import {
  Recycle,
  MapPin,
  Calendar,
  Sparkles,
  Compass,
  Sun,
  Moon,
  Truck,
  Factory,
  ShieldCheck,
  User,
  KeyRound,
  Lock
} from 'lucide-react';
import { Button, Tooltip } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({
  userLocation,
  onLocateUser,
  isLocating,
  locationName,
  bookingCount,
  onOpenBookings,
  onOpenGuide,
  onOpenAuth,
  onOpenRoleLogin
}) {
  const { theme, isDark, toggleTheme } = useThemeMode();
  const { user, isDealer, isFactory, isAdmin, isCustomer } = useAuth();

  return (
    <header className="sticky top-0 z-[1200] glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 text-slate-950">
            <Recycle className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950 animate-ping"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Eco<span className="text-emerald-500 dark:text-emerald-400">Vision</span>
              </span>
              <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 rounded-full">
                Chennai City
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              GCC Circular Economy, Ward Pickups & Industrial Sourcing
            </p>
          </div>
        </div>

        {/* Center / Location status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Chennai:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-300 max-w-[140px] sm:max-w-[200px] truncate" title={locationName || userLocation?.address || ''}>
              {locationName || (userLocation && typeof userLocation.lat === 'number' && !isNaN(userLocation.lat) ? `${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)}` : 'Chennai Central')}
            </span>
            {userLocation?.accuracy ? (
              <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900" title={`GPS Accuracy: ±${userLocation.accuracy}m`}>
                ±{userLocation.accuracy > 1000 ? `${(userLocation.accuracy / 1000).toFixed(1)}k` : `${userLocation.accuracy}`}m
              </span>
            ) : userLocation?.isManual ? (
              <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                🎯 Custom
              </span>
            ) : null}
          </div>

          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={onLocateUser}
            disabled={isLocating}
            startIcon={<Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />}
            sx={{
              borderColor: isDark ? 'rgba(16, 185, 129, 0.4)' : '#059669',
              color: isDark ? '#34d399' : '#059669',
              fontSize: '0.78rem',
              '&:hover': {
                borderColor: '#10b981',
                bgcolor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)'
              }
            }}
          >
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Ward GPS'}</span>
            <span className="sm:hidden">{isLocating ? '...' : 'GPS'}</span>
          </Button>
        </div>

        {/* Right Actions: Role Portals, Auth/Account, Guide, Theme, Pickups */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Active Account / Role Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs transition-all shadow-xs"
            title="Open Account & Role Authentication"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden md:block">
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px] leading-tight">
                {user?.name ? user.name.split(' ')[0] : 'Sign In'}
              </div>
              <div className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400">
                {user?.role || 'Guest'}
              </div>
            </div>
          </button>

          {/* Role-Specific Active Workspace Badges */}
          {isDealer && (
            <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-600/15 text-blue-500 border border-blue-500/30 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Dealer Workspace</span>
            </div>
          )}

          {isFactory && (
            <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5" />
              <span>Factory Procurement</span>
            </div>
          )}

          {isAdmin && (
            <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-purple-600/15 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GCC Ripon Core</span>
            </div>
          )}

          <Button
            variant="text"
            size="small"
            onClick={onOpenGuide}
            startIcon={<Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
            sx={{
              color: isDark ? '#94a3b8' : '#475569',
              fontSize: '0.8rem',
              '&:hover': { color: isDark ? '#f8fafc' : '#0f172a' }
            }}
          >
            <span className="hidden sm:inline">Guide</span>
          </Button>

          {/* Theme Toggle Button */}
          <Tooltip title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}>
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all duration-300 border bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-300 shadow-sm active:scale-95"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
                  <span className="text-xs font-semibold text-slate-200 hidden lg:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 -rotate-12 transition-transform duration-300" />
                  <span className="text-xs font-semibold text-slate-700 hidden lg:inline">Dark</span>
                </>
              )}
            </button>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            onClick={onOpenBookings}
            startIcon={<Calendar className="w-4 h-4 text-white dark:text-slate-950" />}
            sx={{
              bgcolor: isDark ? '#10b981' : '#059669',
              color: isDark ? '#022c22' : '#ffffff',
              fontWeight: 700,
              '&:hover': { bgcolor: isDark ? '#059669' : '#047857' }
            }}
          >
            <span className="hidden sm:inline">My Pickups</span>
            <span className="sm:hidden">Pickups</span>
            {bookingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 bg-white/20 dark:bg-slate-950 text-white dark:text-emerald-300 text-xs rounded-full font-bold">
                {bookingCount}
              </span>
            )}
          </Button>
        </div>

      </div>
    </header>
  );
}
