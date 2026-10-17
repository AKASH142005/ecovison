import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Coins,
  Leaf,
  MapPin
} from 'lucide-react';

export default function BookingsListModal({ open, onClose, bookings = [] }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0f172a',
          backgroundImage: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15), transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          color: '#f8fafc'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              My Scheduled Pickups & Drop-offs
            </h3>
            <p className="text-xs text-slate-400">
              Active waste recovery bookings in Tamil Nadu
            </p>
          </div>
        </div>

        <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', px: 3, py: 2.5 }}>
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 mx-auto text-slate-500" />
            <h4 className="font-bold text-white">No active bookings found</h4>
            <p className="text-xs">
              Select any Tamil Nadu collector on the map to schedule your first drop-off or doorstep pickup.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.bookingId || b._id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {b.bookingId}
                    </span>
                    <span className="font-bold text-sm text-white">{b.collectorName}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Scheduled</span>
                    <span className="font-semibold text-white">{b.scheduledDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Category & Weight</span>
                    <span className="font-semibold text-white">{b.estimatedWeightKg} kg ({b.wasteCategory})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Estimated Reward</span>
                    <span className="font-black text-emerald-400">₹{b.estimatedReward}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">CO2 Offset</span>
                    <span className="font-black text-teal-300">{b.co2SavedKg} kg</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{b.userAddress}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: '#0b1120', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Button onClick={onClose} sx={{ color: '#94a3b8' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
