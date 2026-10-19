import React from 'react';

export default function FactoryInspectModal({
  inspectingPO,
  onClose,
  verifiedWeightKg,
  setVerifiedWeightKg,
  qualityGrade,
  setQualityGrade,
  submittingQA,
  onConfirm
}) {
  if (!inspectingPO) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/40 shadow-2xl space-y-4">
        <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase">
              Truck Gate Weighbridge Inspection
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Inspect PO {inspectingPO.poNumber}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Verified Gate Scale Weight (kg):
            </label>
            <input
              type="number"
              value={verifiedWeightKg}
              onChange={(e) => setVerifiedWeightKg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Certified Purity Grade:
            </label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
            >
              <option value="Grade A+ (>99% Industrial Purity)">Grade A+ (&gt;99% Industrial Purity)</option>
              <option value="Grade A (Standard Purity)">Grade A (Standard Purity)</option>
              <option value="Grade B (Downcycled Secondary)">Grade B (Downcycled Secondary)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={submittingQA}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md"
            >
              {submittingQA ? 'Certifying...' : 'Certify & Lock Gate Weight'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
