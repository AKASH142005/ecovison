import React from 'react';
import {
  User,
  Truck,
  Factory,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight,
  KeyRound,
  LogOut,
  Lock,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const ROLE_ENTRIES = [
  {
    id: 'customer',
    label: 'Citizen Portal',
    shortLabel: 'Citizen',
    icon: User,
    color: 'from-emerald-500 to-teal-600',
    roleName: 'Customer',
    desc: 'Doorstep pickups & scrap rates'
  },
  {
    id: 'dealer',
    label: 'Dealer Hub',
    shortLabel: 'Dealer',
    icon: Truck,
    color: 'from-blue-500 to-indigo-600',
    roleName: 'Dealer',
    desc: 'Weighbridge & boundary catchment'
  },
  {
    id: 'factory',
    label: 'Factory Exchange',
    shortLabel: 'Factory',
    icon: Factory,
    color: 'from-amber-500 to-orange-600',
    roleName: 'Factory',
    desc: 'Industrial procurement & QA'
  },
  {
    id: 'admin',
    label: 'GCC Ripon Admin',
    shortLabel: 'GCC Admin',
    icon: ShieldCheck,
    color: 'from-purple-500 to-pink-600',
    roleName: 'Admin',
    desc: 'City governance & audit logs'
  }
];

export default function RoleSwitcherBar({
  onOpenDealerPortal,
  onOpenFactoryPortal,
  onOpenAdminPortal,
  onOpenAuthForRole,
  onOpenBookings
}) {
  const { user, logout, isCustomer, isDealer, isFactory, isAdmin } = useAuth();
  const { isDark } = useThemeMode();

  return (
    <div className="w-full bg-slate-900 dark:bg-slate-950 border-b border-emerald-500/20 text-white px-3 sm:px-6 py-2 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Active Persona & Attributes */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Session:
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <span>{user?.name || 'Citizen'}</span>
              <span className="text-[10px] text-emerald-400 uppercase font-black">
                ({user?.role || 'Guest'})
              </span>
              <span className="text-[10px] text-slate-400 hidden lg:inline">
                • {user?.district || 'Chennai'}
              </span>
            </div>
          </div>

          {/* Persona-specific descriptive badge */}
          <div className="hidden xl:flex items-center text-xs text-slate-400">
            {isCustomer && '• Handing over household scrap to certified Chennai dealers'}
            {isDealer && `• Operating ${user?.facilityName || 'Depot'} • Supplying Industrial Factories`}
            {isFactory && `• Procurement Desk • Purchasing bulk secondary materials from dealers`}
            {isAdmin && '• Greater Chennai Corporation (GCC) & TNPCB Municipal Core'}
          </div>
        </div>

        {/* Right: Contextual Role Switch / Login Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isCustomer && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Are you a Dealer or Industrial Buyer?</span>
              <button
                onClick={() => onOpenAuthForRole('dealer')}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 transition-all flex items-center gap-1"
                title="Log In or Register as Chennai Recovery Dealer"
              >
                <Truck className="w-3 h-3 text-blue-400" />
                <span>Dealer Login</span>
              </button>
              <button
                onClick={() => onOpenAuthForRole('factory')}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1"
                title="Log In or Register as Industrial Factory"
              >
                <Factory className="w-3 h-3 text-amber-400" />
                <span>Factory Login</span>
              </button>
            </div>
          )}

          {(isDealer || isFactory || isAdmin) && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Switched to isolated {user?.role?.toUpperCase()} workspace
              </span>
            </div>
          )}

          <button
            onClick={() => onOpenAuthForRole(user?.role || 'customer')}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs shrink-0"
            title="Account & Persona Settings"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Switch Role / Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
