import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import {
  X,
  Sparkles,
  CheckCircle2,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { useThemeMode } from '../context/ThemeContext';

export default function RecyclingTipsModal({ open, onClose }) {
  const { isDark } = useThemeMode();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? '#0a0f1d' : '#ffffff',
          backgroundImage: isDark
            ? 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.96) 50%, #030712 100%)'
            : 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, #ffffff 70%)',
          border: isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '24px',
          color: isDark ? '#f8fafc' : '#0f172a',
          boxShadow: isDark
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.15)'
            : '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 35px rgba(16, 185, 129, 0.06)',
          overflow: 'hidden',
          m: 2
        }
      }}
    >
      {/* Header */}
      <div className={`px-6 pt-6 pb-4 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800/80' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-inner shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Tamil Nadu Waste Segregation Guide
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                TNPCB Standard
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Citizen best practices for maximum cash payout & zero landfill waste
            </p>
          </div>
        </div>

        <IconButton
          onClick={onClose}
          sx={{
            color: isDark ? '#94a3b8' : '#64748b',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              color: isDark ? '#ffffff' : '#0f172a',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s'
          }}
          size="small"
        >
          <X className="w-4 h-4" />
        </IconButton>
      </div>

      <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, maxHeight: '74vh', overflowY: 'auto' }}>
        <div className="space-y-6">
          
          {/* Bin Color Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-3 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              <span>1. The 4-Stream Color-Coded Segregation Protocol</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-blue-950/40 border-blue-500/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <span className={`text-xs font-bold block uppercase ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Blue Bin (Dry)
                </span>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Clean plastic bottles, cardboard cartons, newspapers, metal cans.
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <span className={`text-xs font-bold block uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  Green Bin (Wet)
                </span>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Kitchen scraps, fruit/vegetable peelings, tea bags, garden trimmings.
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-purple-950/40 border-purple-500/30' : 'bg-purple-50 border-purple-200'
              }`}>
                <span className={`text-xs font-bold block uppercase ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                  Purple Bin (E-Waste)
                </span>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Batteries, broken smartphones, chargers, cables, PCB motherboards.
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-red-950/40 border-red-500/30' : 'bg-red-50 border-red-200'
              }`}>
                <span className={`text-xs font-bold block uppercase ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                  Red Bin (Hazardous)
                </span>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Pesticide bottles, CFL bulbs, medical strips, paint tins, syringes.
                </p>
              </div>
            </div>
          </div>

          {/* Golden preparation rules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Preparation Rules for Maximum Payout Rate</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className={isDark ? 'text-white' : 'text-slate-900'}>Rinse & Dry Plastic Containers:</strong> Food residue degrades recycling machine extruders. Centers offer +15% premium for clean, dry plastic.</span>
              </div>
              <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className={isDark ? 'text-white' : 'text-slate-900'}>Flatten Corrugated Cardboard:</strong> Cut large shipping cartons flat and bundle with string for rapid weighing at depot weighbridges.</span>
              </div>
              <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className={isDark ? 'text-white' : 'text-slate-900'}>Lithium Battery Safety:</strong> Tape over positive terminals of lithium batteries with masking tape to prevent transit short-circuits.</span>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>

      <div className={`p-4 px-6 border-t flex justify-end ${
        isDark ? 'bg-slate-950/90 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
        >
          Got It, Thanks!
        </button>
      </div>
    </Dialog>
  );
}
