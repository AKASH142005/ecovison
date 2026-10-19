import React from 'react';
import { Scale, CreditCard, CheckCircle2 } from 'lucide-react';

export default function FactoryShipmentsTab({
  orders = [],
  onOpenInspect,
  onReleasePayment,
  releasingPayment
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
        Dealer Consignments Awaiting Gate QA Weighbridge Inspection ({orders.length})
      </h3>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
            No active dealer shipments right now. When dealers commit stock and dispatch trucks, they appear here.
          </div>
        ) : (
          orders.map((po) => {
            const isShipped = po.status === 'shipped';
            const isVerified = po.status === 'verified';
            const isPaid = po.paymentStatus === 'paid';

            return (
              <div
                key={po._id || po.poNumber}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                      {po.poNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      From: {po.dealerName || 'Chennai Recovery Dealer'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isShipped
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {po.status?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Consignment: <strong>{po.quantityKg} kg {po.category}</strong> • Truck: <strong>{po.vehicleNumber || 'Pending'}</strong> • Value: <strong>₹{po.totalAmount?.toLocaleString()}</strong>
                  </p>
                  {po.verifiedWeightKg && (
                    <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                      ✓ Gate Weight Certified: {po.verifiedWeightKg} kg ({po.qualityGrade})
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isShipped && (
                    <button
                      onClick={() => onOpenInspect(po)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Weighbridge QA Inspect</span>
                    </button>
                  )}

                  {isVerified && !isPaid && (
                    <button
                      onClick={() => onReleasePayment(po)}
                      disabled={releasingPayment}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-xs flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Release Bank Wire (₹{po.totalAmount?.toLocaleString()})</span>
                    </button>
                  )}

                  {isPaid && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settled via Bank Wire ({po.paymentRef})</span>
                    </span>
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
