import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  X,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  Mail,
  Navigation,
  Calendar,
  Layers,
  Award,
  Sparkles
} from 'lucide-react';

export default function CollectorDetailModal({
  collector,
  open,
  onClose,
  onStartNavigation,
  onOpenBooking,
  userLocation
}) {
  if (!collector) return null;

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
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {collector.name}
            </h3>
            <p className="text-xs text-slate-400">
              TNPCB Authorized Recycling & Resource Recovery Center
            </p>
          </div>
        </div>

        <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', px: 3, py: 2.5 }}>
        <div className="space-y-5">
          
          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Rating</span>
              <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-base mt-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{collector.rating}</span>
                <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Proximity</span>
              <span className="text-emerald-400 font-black text-base mt-0.5 block">
                {collector.distanceKm != null ? `${collector.distanceKm} km` : 'Tamil Nadu'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">TNPCB Reg. No</span>
              <span className="text-slate-200 font-bold text-xs mt-1 block truncate">
                {collector.tnpcbRegNo}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Current Capacity</span>
              <div className="mt-1">
                <span className="text-slate-200 font-bold text-xs">{collector.capacityLoad}%</span>
                <LinearProgress
                  variant="determinate"
                  value={collector.capacityLoad}
                  sx={{ mt: 0.5, height: 4, borderRadius: 2, bgcolor: '#334155' }}
                />
              </div>
            </div>
          </div>

          {/* Description & Location */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Center Profile & Address
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {collector.description}
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{collector.address}</p>
                <p className="text-slate-400 mt-0.5">
                  District: {collector.district} | GPS: {collector.lat.toFixed(5)}, {collector.lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>

          {/* Accepted Materials Table */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
              <span>Accepted Waste Materials & Cash Inflow Rates</span>
              <span className="text-emerald-400 font-normal lowercase">rates verified daily</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {collector.acceptedWasteTypes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-sm text-white capitalize block">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.acceptsDropoff ? '✓ Drop-off' : ''} {item.acceptsPickup ? '• ✓ Doorstep Pickup' : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400">
                      ₹{item.ratePerKg}
                    </span>
                    <span className="text-xs text-slate-400 block font-normal">/ kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Phone className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <span className="text-slate-400 block">Official Helpline</span>
                <a href={`tel:${collector.phone}`} className="font-bold text-white hover:text-emerald-300">
                  {collector.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400 block">Weighbridge Timing</span>
                <span className="font-semibold text-white">{collector.operatingHours}</span>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: '#0b1120', borderTop: '1px solid rgba(255, 255, 255, 0.05)', justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ color: '#94a3b8' }}>
          Close
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              onOpenBooking(collector);
            }}
            startIcon={<Calendar className="w-4 h-4" />}
            sx={{
              borderColor: 'rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' }
            }}
          >
            Schedule Pickup / Drop-off
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onClose();
              onStartNavigation(collector);
            }}
            startIcon={<Navigation className="w-4 h-4 text-slate-950" />}
            sx={{
              bgcolor: '#10b981',
              color: '#022c22',
              fontWeight: 800,
              '&:hover': { bgcolor: '#059669' }
            }}
          >
            Start GPS Route
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
