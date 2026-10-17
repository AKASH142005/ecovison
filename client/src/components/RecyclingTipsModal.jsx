import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import {
  X,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Package,
  Cpu,
  Leaf,
  Wine
} from 'lucide-react';

export default function RecyclingTipsModal({ open, onClose }) {
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
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              Tamil Nadu Citizen Waste Segregation & Recycling Guidelines
            </h3>
            <p className="text-xs text-slate-400">
              Approved by TNPCB & Municipal Administration
            </p>
          </div>
        </div>

        <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', px: 3, py: 3 }}>
        <div className="space-y-6">
          
          {/* Bin Color Guidelines */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
              1. The 4-Stream Color-Coded Segregation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-1">
                <span className="text-xs font-bold text-blue-400 block uppercase">Blue Bin (Dry)</span>
                <p className="text-xs text-slate-300">Clean plastic bottles, cardboard cartons, newspapers, metal cans.</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                <span className="text-xs font-bold text-emerald-400 block uppercase">Green Bin (Wet)</span>
                <p className="text-xs text-slate-300">Kitchen scraps, fruit/vegetable peelings, tea bags, garden trimmings.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1">
                <span className="text-xs font-bold text-purple-400 block uppercase">Purple Bin (E-Waste)</span>
                <p className="text-xs text-slate-300">Batteries, broken smartphones, chargers, cables, PCB motherboards.</p>
              </div>

              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1">
                <span className="text-xs font-bold text-red-400 block uppercase">Red Bin (Hazardous)</span>
                <p className="text-xs text-slate-300">Pesticide bottles, CFL bulbs, medical strips, paint tins, syringes.</p>
              </div>
            </div>
          </div>

          {/* Golden preparation rules */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
              2. Best Practices for Maximum Cash Payout
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Rinse & Dry Plastic Containers:</strong> Food residue degrades recycling machine extruders. Centers offer +15% premium for clean, dry plastic.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Flatten Corrugated Cardboard:</strong> Cut large shipping cartons flat and bundle with string for rapid weighing at depot weighbridges.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Lithium Battery Safety:</strong> Tape over positive terminals of lithium batteries with masking tape to prevent transit short-circuits.</span>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: '#0b1120', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#10b981', color: '#022c22', fontWeight: 800 }}>
          Got It
        </Button>
      </DialogActions>
    </Dialog>
  );
}
