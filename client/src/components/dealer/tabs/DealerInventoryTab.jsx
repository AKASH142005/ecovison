import React from 'react';
import { LinearProgress } from '@mui/material';

export default function DealerInventoryTab({
  inventory = [],
  totalBaledStock = 0,
  isDark = true
}) {
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
            Certified Material Recovery Depot Stock
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {totalBaledStock.toLocaleString()} kg Ready for Industrial Supply
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Landfill Waste Diverted:</span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            {inventory.reduce((a, c) => a + (c.totalCollectedKg || 0), 0).toLocaleString()} kg
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const maxCap = 5000;
          const pct = Math.min(100, Math.round(((item.availableKg || 0) / maxCap) * 100));

          return (
            <div
              key={item._id || item.category}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {item.category}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {item.availableKg} kg
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Baling Capacity Load</span>
                  <span>{pct}%</span>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: isDark ? '#1e293b' : '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: pct > 80 ? '#f59e0b' : '#3b82f6',
                      borderRadius: 4
                    }
                  }}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Total Inward: {item.totalCollectedKg} kg</span>
                <span>Dispatched: {item.totalDispatchedKg || 0} kg</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
