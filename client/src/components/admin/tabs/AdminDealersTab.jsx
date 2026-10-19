import React from 'react';
import { Plus } from 'lucide-react';
import { CHENNAI_ZONE_COORDINATES } from '../../../constants/chennaiZones';

export default function AdminDealersTab({
  newDealer,
  setNewDealer,
  handleZoneSelect,
  handleCreateDealerPoint,
  dealerSubmitting,
  dealerStatusMsg,
  dealersList = []
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* New Dealer Point Form (5 cols) */}
      <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-500" />
            <span>Register Certified Dealer Point</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorized dealers receive doorstep pickup requests in their defined Chennai ward boundary.
          </p>
        </div>

        {dealerStatusMsg.text && (
          <div className={`p-3 rounded-xl border text-xs font-bold ${
            dealerStatusMsg.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
          }`}>
            {dealerStatusMsg.text}
          </div>
        )}

        <form onSubmit={handleCreateDealerPoint} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Dealer Facility Name:
            </label>
            <input
              type="text"
              value={newDealer.name}
              onChange={(e) => setNewDealer(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Adyar Eco-Recovery Hub"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Primary Chennai Zone:
            </label>
            <select
              value={newDealer.district}
              onChange={(e) => handleZoneSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
            >
              {Object.keys(CHENNAI_ZONE_COORDINATES).map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Physical Address:
            </label>
            <input
              type="text"
              value={newDealer.address}
              onChange={(e) => setNewDealer(prev => ({ ...prev, address: e.target.value }))}
              placeholder="e.g. LB Road, Adyar, Chennai 600020"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Initial Service Radius ({newDealer.serviceRadiusKm} km):
            </label>
            <input
              type="range"
              min="2"
              max="30"
              value={newDealer.serviceRadiusKm}
              onChange={(e) => setNewDealer(prev => ({ ...prev, serviceRadiusKm: e.target.value }))}
              className="w-full accent-purple-600"
            />
          </div>

          <button
            type="submit"
            disabled={dealerSubmitting}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md shadow-purple-500/25 transition-all"
          >
            {dealerSubmitting ? 'Registering...' : 'Register Dealer Hub'}
          </button>
        </form>
      </div>

      {/* Active Dealer Hubs List (7 cols) */}
      <div className="lg:col-span-7 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Active Authorized Chennai Dealer Points ({dealersList.length})
        </h3>

        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {dealersList.map(dealer => (
            <div
              key={dealer._id || dealer.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {dealer.name}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {dealer.district}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{dealer.address}</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                  Catchment Boundary: {dealer.serviceRadiusKm || 8} km radius
                </p>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                TNPCB Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
