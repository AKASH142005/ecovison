import React from 'react';
import {
  TrendingUp,
  Award,
  ShieldCheck,
  Recycle,
  Leaf,
  Coins,
  MapPin
} from 'lucide-react';

export default function EcoStatsBanner({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* Stat 1 */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Covered Districts</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-white">
            {stats.coveredDistricts || 12}
          </span>
          <span className="text-xs text-slate-400">across Tamil Nadu</span>
        </div>
        <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>{stats.totalCollectors || 18} Verified Facilities</span>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Waste Diverted</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Recycle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-white">
            {Math.round(stats.wasteDivertedTons || 1428)}
          </span>
          <span className="text-xs text-cyan-400 font-bold">Metric Tons</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-cyan-400" />
          <span>Circular Economy Impact</span>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">CO2 Abatement</span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-emerald-400">
            {Math.round(stats.co2PreventedTons || 3120)}
          </span>
          <span className="text-xs text-slate-400">Tons CO2</span>
        </div>
        <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
          <span>🌿 Net Zero Mission 2030</span>
        </div>
      </div>

      {/* Stat 4 */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Citizen Rewards Paid</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-white">
            ₹{(stats.communityRewardsPaidINR || 485000).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
          <Award className="w-3 h-3" />
          <span>{stats.tnpcbComplianceRate || '99.4%'} TNPCB Audit Score</span>
        </div>
      </div>
    </div>
  );
}
