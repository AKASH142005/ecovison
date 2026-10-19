import React from 'react';
import { Package, PlusCircle, ArrowRight } from 'lucide-react';

export default function FactoryRequirementsTab({
  category,
  setCategory,
  grade,
  setGrade,
  quantityNeededKg,
  setQuantityNeededKg,
  offeredPricePerKg,
  setOfferedPricePerKg,
  deadline,
  setDeadline,
  deliveryAddress,
  setDeliveryAddress,
  publishing,
  onPublish,
  requirements = []
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Post Demand Form (5 cols) */}
      <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-500" />
            <span>Post Scrap Procurement Demand</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast live material tenders to verified Chennai recovery dealers.
          </p>
        </div>

        <form onSubmit={onPublish} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Material Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
            >
              <option value="plastic">Plastics & Polymers (rPET, HDPE, LDPE)</option>
              <option value="metal">Scrap Metals (Steel, Aluminum, Copper)</option>
              <option value="paper">Paper & Industrial Cardboard Kraft</option>
              <option value="ewaste">Electronic PCB Scrap & Lithium Batteries</option>
              <option value="glass">Glass Cullet (Flint & Amber)</option>
              <option value="textile">Textile Waste (Cotton Rags & Synthetic)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Quality Specification / Grade:
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Volume Needed (kg):
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={quantityNeededKg}
                onChange={(e) => setQuantityNeededKg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Offered Price (₹/kg):
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={offeredPricePerKg}
                onChange={(e) => setOfferedPricePerKg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Fulfillment Deadline:
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Factory Receiving Gate Address:
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={publishing}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{publishing ? 'Publishing...' : 'Broadcast Requirement to Dealers'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Sourcing Contracts List (7 cols) */}
      <div className="lg:col-span-7 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Live Factory Sourcing Contracts ({requirements.length})
        </h3>

        <div className="space-y-3">
          {requirements.map((req) => (
            <div
              key={req._id || req.requirementId}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                    {req.requirementId}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {req.category?.toUpperCase()} ({req.grade})
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹{req.offeredPricePerKg}/kg
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Target: {req.quantityNeededKg.toLocaleString()} kg
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Remaining: <strong>{req.remainingKg?.toLocaleString() || req.quantityNeededKg.toLocaleString()} kg</strong></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {req.status?.toUpperCase()}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 truncate">
                📍 {req.deliveryAddress}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
