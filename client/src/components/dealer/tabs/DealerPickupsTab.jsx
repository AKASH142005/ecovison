import React from 'react';
import { Truck, MapPin, Scale, CheckCircle2 } from 'lucide-react';

export default function DealerPickupsTab({
  pickups = [],
  serviceRadiusKm,
  onAcceptPickup,
  onInTransitPickup,
  onOpenComplete
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <span>Doorstep Scrap Pickups in Your Boundary ({serviceRadiusKm} km)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Citizen scrap requests in your assigned Chennai wards. Accept, dispatch vehicle, and certify weighbridge scale weights.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
          {pickups.length} Total Bookings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pickups.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
            No active doorstep pickup requests in your catchment radius right now.
          </div>
        ) : (
          pickups.map(p => {
            const isPending = p.status === 'pending';
            const isAccepted = p.status === 'accepted';
            const isInTransit = p.status === 'in_transit';
            const isCompleted = p.status === 'completed';

            return (
              <div
                key={p._id || p.bookingId}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-black text-blue-600 dark:text-blue-400">
                      {p.bookingId}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {p.userName || p.customerName || 'Citizen Scrap Seller'}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{p.userAddress || p.address || 'Chennai Doorstep'}</span>
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : isAccepted || isInTransit
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {p.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Material:</span>
                    <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
                      {p.wasteCategory || p.wasteType || 'Scrap'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Weight:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {p.estimatedWeightKg} kg
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {isPending && (
                    <button
                      onClick={() => onAcceptPickup(p._id || p.bookingId)}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Accept Booking
                    </button>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => onInTransitPickup(p._id || p.bookingId)}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Dispatch Vehicle (In Transit)
                    </button>
                  )}

                  {(isAccepted || isInTransit) && (
                    <button
                      onClick={() => onOpenComplete(p)}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Weigh Scale & Complete</span>
                    </button>
                  )}

                  {isCompleted && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified: {p.actualWeightKg} kg (Paid ₹{p.estimatedReward})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
