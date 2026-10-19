import React from 'react';

export default function DealerWeighModal({
  completingPickup,
  onClose,
  actualWeightKg,
  setActualWeightKg,
  submittingComplete,
  onSubmit
}) {
  if (!completingPickup) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
        <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black text-emerald-500 uppercase">
              TNPCB Weighbridge Scale Certification
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Certify Weight for Pickup #{completingPickup.bookingId}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Actual Digital Scale Weight (kg):
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={actualWeightKg}
              onChange={(e) => setActualWeightKg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300">
            Customer: <strong>{completingPickup.userName || completingPickup.customerName || 'Citizen'}</strong> ({completingPickup.wasteCategory || completingPickup.wasteType || 'Scrap'})
            <br />
            Estimated Cash/Reward: ₹{((parseFloat(actualWeightKg) || 0) * 19).toFixed(0)}
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
              disabled={submittingComplete}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md"
            >
              {submittingComplete ? 'Certifying...' : 'Certify Scale Weight & Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
