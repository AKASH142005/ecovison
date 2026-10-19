import React from 'react';

export default function AdminAuditTab({
  auditLogs = [],
  logCategory,
  setLogCategory
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          TNPCB Environmental Compliance & Security Audit Logs ({auditLogs.length})
        </h3>

        <select
          value={logCategory}
          onChange={(e) => setLogCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
        >
          <option value="all">All Categories</option>
          <option value="auth">Authentication & RBAC</option>
          <option value="pickup">Citizen Pickups</option>
          <option value="marketplace">B2B Consignments</option>
          <option value="inventory">Dealer Inventory</option>
          <option value="payment">Settlements & Escrow</option>
          <option value="admin">System & Admin</option>
          <option value="boundary">Boundary Catchments</option>
        </select>
      </div>

      <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
        {auditLogs.map((log, idx) => (
          <div
            key={log._id || idx}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  [{log.category?.toUpperCase()}]
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {log.action}
                </span>
                <span className="text-[10px] text-slate-400">
                  by {log.actorName || log.userName || log.userEmail || (log.actor && (log.actor.name || log.actor.id)) || 'System'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
            </div>

            <span className="text-[10px] text-slate-400 shrink-0">
              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
