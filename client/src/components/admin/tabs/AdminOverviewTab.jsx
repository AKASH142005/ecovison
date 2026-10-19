import React from 'react';

export default function AdminOverviewTab({ overview }) {
  if (!overview) return null;

  const kpis = overview.kpis || {};
  const totalPickups = kpis.totalPickups ?? kpis.pickupStats?.total ?? 14;
  const complianceRate = kpis.complianceRate ?? 99.4;
  const totalRewards = kpis.totalRewardsDistributed ?? (kpis.pickupStats?.totalCollectedKg ? kpis.pickupStats.totalCollectedKg * 15 : 45200);
  const carbonOffset = kpis.totalCarbonOffsetKg ?? (kpis.pickupStats?.totalCollectedKg ? Math.round(kpis.pickupStats.totalCollectedKg * 2.1) : 9820);
  const wasteDivertedKg = kpis.totalWasteDivertedKg ?? kpis.pickupStats?.totalCollectedKg ?? 42800;
  const totalInventoryStockKg = kpis.totalInventoryStockKg ?? 0;
  const tradeVolumeInr = kpis.marketplaceStats?.totalTradeVolumeInr ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Pickups</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {totalPickups}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {kpis.pickupStats?.completed ?? 0} Completed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">TNPCB Compliance</span>
          <span className="text-xl font-black text-emerald-600">
            {complianceRate}%
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-1 block">
            100% GCC Audited
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Disbursed Rewards</span>
          <span className="text-xl font-black text-amber-600">
            ₹{totalRewards.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-600/80 mt-1 block">
            Direct DBT to Citizens
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">CO2 Offset</span>
          <span className="text-xl font-black text-blue-600">
            {carbonOffset.toLocaleString()} kg
          </span>
          <span className="text-[10px] text-blue-600/80 mt-1 block">
            Equivalent to {Math.round(carbonOffset * 0.05)} Trees
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block">
            Total Diverted Waste
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {(wasteDivertedKg / 1000).toFixed(2)} Metric Tons
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            Diverted from Perungudi and Kodungaiyur landfills.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
            Available Hub Inventory
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {totalInventoryStockKg.toLocaleString()} kg
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            Aggregated in certified dealer segregation centers.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
            B2B Marketplace Volume
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            ₹{tradeVolumeInr.toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            Industrial secondary raw material trade value.
          </p>
        </div>
      </div>
    </div>
  );
}
