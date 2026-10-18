import React from 'react';
import {
  TrendingUp,
  Award,
  ShieldCheck,
  Recycle,
  Leaf,
  Coins,
  MapPin,
  Package,
  Scale,
  Compass,
  Truck,
  Building,
  Factory,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EcoStatsBanner({ stats }) {
  const { user, isCustomer, isDealer, isFactory, isAdmin, aggregations } = useAuth();
  const agg = aggregations?.aggregations || {};

  // 1. CUSTOMER CITIZEN AGGREGATIONS & ATTRIBUTES
  if (isCustomer) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Recycle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Citizen Household Recycling Profile • {user?.name || 'Citizen'} ({user?.district || 'Anna Nagar'})</span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Live Doorstep Scrap Aggregations
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">My Diverted Scrap</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Recycle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {agg.myDivertedKg ?? 45}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">kg collected</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Doorstep pickups completed</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Eco-Reward Points</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {agg.myEcoPoints ?? 450}
              </span>
              <span className="text-xs text-slate-400">Pts</span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>10 pts per kg diverted</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Pickups</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {agg.myActiveBookings ?? 1}
              </span>
              <span className="text-xs text-slate-400">in queue</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-500" />
              <span>Assigned to Chennai Hub</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CO2 Abatement</span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {agg.co2SavedKg ?? 112}
              </span>
              <span className="text-xs text-slate-400">kg CO2</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <span>🌿 Net Zero Chennai Mission</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. DEALER RECOVERY HUB AGGREGATIONS & ATTRIBUTES
  if (isDealer) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-500" />
            <span>Dealer Facility Operations • {user?.facilityName || 'Guindy Eco-Recovery Hub'} ({user?.district || 'Guindy Cluster'})</span>
          </span>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            Weighbridge, Baling & Ward Catchment Attributes
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Baled Stock on Hand</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {(agg.inventoryTotalKg ?? 9420).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">kg stock</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>PET, HDPE, Iron, OCC Paper</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weighbridge Intake</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {agg.pendingPickupsCount ?? 3}
              </span>
              <span className="text-xs text-slate-400">pickups queue</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Awaiting gross/tare scale verification</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Collection Boundary</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                ⭕ {agg.serviceRadiusKm ?? 8} km
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>~{agg.coverageAreaSqKm ?? 201} km² across {agg.activeWardsCount ?? 4} wards</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Factory Shipments</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {agg.dispatchedOrdersCount ?? 2}
              </span>
              <span className="text-xs text-slate-400">active POs</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Dispatched to Manali & Ambattur</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. FACTORY BUYER AGGREGATIONS & ATTRIBUTES
  if (isFactory) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Factory className="w-3.5 h-3.5 text-amber-500" />
            <span>Industrial Processing & Sourcing • {user?.facilityName || 'Manali Eco-Polymers Ltd'} ({user?.district || 'Manali Corridor'})</span>
          </span>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Raw Material QA & Procurement Attributes
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Open Sourcing Demands</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {(agg.activeDemandsKg ?? 12000).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">kg target</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>PET Flakes & Aluminum Shred</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inbound Deliveries</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {agg.inboundShipmentsCount ?? 1}
              </span>
              <span className="text-xs text-slate-400">trucks en route</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Arriving at factory gate for QA</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">QA Verified Inventory</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {(agg.verifiedMaterialKg ?? 4500).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">kg accepted</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Secondary smelting & repulping</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Disbursed Trade Payments</span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{(agg.procurementSpendInr ?? 71400).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <span>Automated bank wire clearance</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. ADMIN MUNICIPAL GOVERNANCE AGGREGATIONS & ATTRIBUTES
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
          <span>Greater Chennai Corporation (GCC) & TNPCB Governance • Ripon Building Directorate</span>
        </span>
        <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
          City-Wide Waste Diversion & Compliance Audits
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chennai Diverted Scrap</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {(agg.cityDivertedKg ?? 142800).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">kg city-wide</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>Diverted across 15 GCC zones</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certified Dealer Points</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {agg.dealersCount ?? 12}
            </span>
            <span className="text-xs text-slate-400">authorized hubs</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>Configured with boundary radiuses</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Industrial Buyers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {agg.factoriesCount ?? 5}
            </span>
            <span className="text-xs text-slate-400">recycling mills</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>Manali, Ambattur, Guindy, Sriperumbudur</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-slate-900/60 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">TNPCB Audit Rating</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {agg.complianceScore ?? '99.4%'}
            </span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>{agg.auditLogsCount ?? 14} Verified municipal records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
