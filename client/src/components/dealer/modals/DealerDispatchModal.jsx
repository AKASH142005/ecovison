import React from 'react';

export default function DealerDispatchModal({
  shippingPO,
  onClose,
  vehicleNumber,
  setVehicleNumber,
  submittingShip,
  onSubmit
}) {
  if (!shippingPO) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/40 shadow-2xl space-y-4">
        <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase">
              Consignment Transport Gate
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Dispatch Truck for {shippingPO.poNumber}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Truck Vehicle Registration Number:
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. TN 09 BX 4412"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-600 dark:text-blue-400">
            Consignment: <strong>{shippingPO.quantityKg} kg {shippingPO.category}</strong> to {shippingPO.factoryName}
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
              disabled={submittingShip}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md"
            >
              {submittingShip ? 'Dispatching...' : 'Confirm Truck Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
