import React from 'react';

export default function DealerBidModal({
  biddingReq,
  onClose,
  bidKg,
  setBidKg,
  bidPrice,
  setBidPrice,
  submittingBid,
  onSubmit
}) {
  if (!biddingReq) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black text-amber-500 uppercase">
              B2B Scrap Contract
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Commit Supply to {biddingReq.factoryName}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Material: {biddingReq.category?.toUpperCase()} ({biddingReq.grade})
            </label>
            <p className="text-xs text-slate-500">
              Factory Offered Rate: ₹{biddingReq.offeredPricePerKg}/kg • Total Demand: {biddingReq.quantityNeededKg} kg
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Quantity to Commit & Supply (kg):
            </label>
            <input
              type="number"
              min="100"
              max={biddingReq.remainingKg || biddingReq.quantityNeededKg}
              value={bidKg}
              onChange={(e) => setBidKg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Agreed Sale Price (₹/kg):
            </label>
            <input
              type="number"
              step="0.5"
              value={bidPrice || biddingReq.offeredPricePerKg}
              onChange={(e) => setBidPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500">Total Purchase Order Value:</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              ₹{((parseFloat(bidKg) || 0) * (parseFloat(bidPrice || biddingReq.offeredPricePerKg) || 0)).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingBid}
              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
            >
              {submittingBid ? 'Creating PO...' : 'Confirm Sale & Create PO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
