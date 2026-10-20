import React, { useState, useEffect } from 'react';
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
  Menu,
  X,
  ChevronRight,
  LogOut,
  Layers
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
  const { isDark, toggleTheme } = useThemeMode();
  const { user, isDealer, isFactory, isAdmin, isCustomer, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock background body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };

      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMobileMenuOpen]);

  const handleMobileNav = (action) => {
    setIsMobileMenuOpen(false);
    if (action) action();
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'dealer':
        return 'bg-blue-600/15 text-blue-500 border-blue-500/30';
      case 'factory':
        return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      case 'admin':
        return 'bg-purple-600/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-[1200] glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 text-slate-950">
            <Recycle className="w-5 h-5 sm:w-7 sm:h-7 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950 animate-ping"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Eco<span className="text-emerald-500 dark:text-emerald-400">Vision</span>
              </span>
              <span className="inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 rounded-full">
                Chennai
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden lg:block">
              GCC Circular Economy, Ward Pickups & Industrial Sourcing
            </p>
          </div>
        </div>

        {/* Center / Location Status (Desktop) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 hidden lg:inline">Chennai:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-300 max-w-[130px] lg:max-w-[200px] truncate" title={locationName || userLocation?.address || ''}>
              {locationName || (userLocation && typeof userLocation.lat === 'number' && !isNaN(userLocation.lat) ? `${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)}` : 'Chennai Central')}
            </span>
            {userLocation?.accuracy ? (
              <span className="hidden lg:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900" title={`GPS Accuracy: ±${userLocation.accuracy}m`}>
                ±{userLocation.accuracy > 1000 ? `${(userLocation.accuracy / 1000).toFixed(1)}k` : `${userLocation.accuracy}`}m
              </span>
            ) : userLocation?.isManual ? (
              <span className="hidden lg:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
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
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#10b981',
                bgcolor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)'
              }
            }}
          >
            <span>{isLocating ? 'Locating...' : 'My Ward GPS'}</span>
          </Button>
        </div>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0">
          
          {/* Active Account / Role Switcher Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs transition-all shadow-xs cursor-pointer"
            title="Account & Role Switcher"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px] leading-tight">
                {user?.name ? user.name.split(' ')[0] : 'Sign In'}
              </div>
              <div className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400">
                {user?.role || 'Guest / Roles'}
              </div>
            </div>
          </button>

          {/* Role-Specific Active Workspace Badges (Clickable to switch) */}
          {isDealer && (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-600/15 hover:bg-blue-600/25 text-blue-500 border border-blue-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Dealer Workspace • Click to switch role"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Dealer Workspace</span>
            </button>
          )}

          {isFactory && (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Factory Procurement • Click to switch role"
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Factory Desk</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-purple-600/15 hover:bg-purple-600/25 text-purple-400 border border-purple-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="GCC Ripon Core • Click to switch role"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GCC Ripon Admin</span>
            </button>
          )}

          {/* Guide Button */}
          <Button
            variant="text"
            size="small"
            onClick={onOpenGuide}
            startIcon={<Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
            sx={{
              color: isDark ? '#94a3b8' : '#475569',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              '&:hover': { color: isDark ? '#f8fafc' : '#0f172a' }
            }}
          >
            <span>Guide</span>
          </Button>

          {/* Theme Toggle Button */}
          <Tooltip title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}>
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-300 border bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-300 shadow-sm active:scale-95"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200 hidden xl:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-semibold text-slate-700 hidden xl:inline">Dark</span>
                </>
              )}
            </button>
          </Tooltip>

          {/* My Pickups Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenBookings}
            startIcon={<Calendar className="w-4 h-4 text-white dark:text-slate-950" />}
            sx={{
              bgcolor: isDark ? '#10b981' : '#059669',
              color: isDark ? '#022c22' : '#ffffff',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: isDark ? '#059669' : '#047857' }
            }}
          >
            <span>My Pickups</span>
            {bookingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 bg-white/20 dark:bg-slate-950 text-white dark:text-emerald-300 text-xs rounded-full font-bold">
                {bookingCount}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Quick Action Strip (Right) */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-300 shadow-xs"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Quick Pickups Button */}
          <button
            onClick={onOpenBookings}
            aria-label="View My Pickups"
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-xs"
          >
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {bookingCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] text-[10px] font-black bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center leading-tight">
                {bookingCount}
              </span>
            )}
          </button>

          {/* Quick User Avatar / Role Switcher */}
          <button
            onClick={onOpenAuth}
            aria-label="User Account"
            className="flex items-center gap-1 p-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 max-w-[55px] truncate">
              {user?.role || 'Sign In'}
            </span>
          </button>

          {/* Mobile Hamburger / Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-emerald-500" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sub-strip: Ward Location & GPS */}
      <div className="flex md:hidden items-center justify-between px-3 py-1.5 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 text-xs gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Chennai:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate text-[11px]" title={locationName || userLocation?.address || ''}>
            {locationName || (userLocation && typeof userLocation.lat === 'number' && !isNaN(userLocation.lat) ? `${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)}` : 'Chennai Central')}
          </span>
          {userLocation?.accuracy ? (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
              ±{userLocation.accuracy > 1000 ? `${(userLocation.accuracy / 1000).toFixed(1)}k` : `${userLocation.accuracy}`}m
            </span>
          ) : userLocation?.isManual ? (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
              🎯 Custom
            </span>
          ) : null}
        </div>

        <button
          onClick={onLocateUser}
          disabled={isLocating}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/30 shrink-0 transition-colors cursor-pointer"
        >
          <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'My GPS'}</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop Overlay (prevents background clicks and touch scrolling) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[102px] z-[-1] bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          onTouchMove={(e) => e.preventDefault()}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer / Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          className="relative z-10 md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl px-4 py-4 space-y-3.5 shadow-2xl animate-fade-in max-h-[calc(100dvh-105px)] overflow-y-auto overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          
          {/* User Account Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {user?.name || 'Citizen Customer'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {user?.email || 'citizen@ecovision.tn'}
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getRoleBadgeStyle(user?.role)}`}>
                {user?.role || 'Guest'}
              </span>
            </div>

            {/* Quick role change button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleMobileNav(onOpenAuth)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Switch Role / Sign In</span>
              </button>

              {user && (
                <button
                  onClick={() => handleMobileNav(logout)}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1 border border-rose-200 dark:border-rose-800 transition-all cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Workspace Switcher Links */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Service Workspaces
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleMobileNav(() => onOpenRoleLogin && onOpenRoleLogin('customer'))}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  isCustomer
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <User className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Citizen Map</div>
                  <div className="text-[10px] text-slate-400 truncate">Household pickups</div>
                </div>
              </button>

              <button
                onClick={() => handleMobileNav(() => onOpenRoleLogin && onOpenRoleLogin('dealer'))}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  isDealer
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-800 dark:text-blue-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Dealer Hub</div>
                  <div className="text-[10px] text-slate-400 truncate">Weighbridge scale</div>
                </div>
              </button>

              <button
                onClick={() => handleMobileNav(() => onOpenRoleLogin && onOpenRoleLogin('factory'))}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  isFactory
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Factory className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Factory Desk</div>
                  <div className="text-[10px] text-slate-400 truncate">Industrial buying</div>
                </div>
              </button>

              <button
                onClick={() => handleMobileNav(() => onOpenRoleLogin && onOpenRoleLogin('admin'))}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  isAdmin
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-800 dark:text-purple-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">GCC Admin</div>
                  <div className="text-[10px] text-slate-400 truncate">Ripon city core</div>
                </div>
              </button>
            </div>
          </div>

          {/* Core Feature Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => handleMobileNav(onOpenBookings)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-emerald-600/25 transition-all"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>My Chennai Scrap Pickups</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black">
                {bookingCount} active
              </span>
            </button>

            <button
              onClick={() => handleMobileNav(onOpenGuide)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-between border border-slate-200 dark:border-slate-800 transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Recycling Tips & Citizen Guide</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
