import React from 'react';
import {
  Package,
  Leaf,
  Cpu,
  Shield,
  BookOpen,
  Wine,
  Shirt,
  AlertOctagon,
  Layers,
  Info
} from 'lucide-react';

const CATEGORY_ITEMS = [
  {
    id: 'all',
    name: 'All Categories',
    tamil: 'அனைத்து கழிவுகள்',
    icon: Layers,
    color: '#10b981',
    lightBgActive: 'bg-emerald-50 text-emerald-950 border-emerald-500 shadow-emerald-500/10',
    darkBgActive: 'bg-slate-800 text-white border-emerald-400 shadow-emerald-500/20',
    rate: 'All Centers'
  },
  {
    id: 'plastic',
    name: 'Plastics & Polymers',
    tamil: 'பிளாஸ்டிக்',
    icon: Package,
    color: '#06b6d4',
    lightBgActive: 'bg-cyan-50 text-cyan-950 border-cyan-500 shadow-cyan-500/10',
    darkBgActive: 'bg-cyan-950/70 text-cyan-300 border-cyan-400 shadow-cyan-500/20',
    rate: '₹18 - ₹22/kg'
  },
  {
    id: 'ewaste',
    name: 'E-Waste & Electronics',
    tamil: 'மின்னணு கழிவு',
    icon: Cpu,
    color: '#a855f7',
    lightBgActive: 'bg-purple-50 text-purple-950 border-purple-500 shadow-purple-500/10',
    darkBgActive: 'bg-purple-950/70 text-purple-300 border-purple-400 shadow-purple-500/20',
    rate: '₹45 - ₹75/kg'
  },
  {
    id: 'organic',
    name: 'Organic & Food',
    tamil: 'ஈர மக்கும் கழிவு',
    icon: Leaf,
    color: '#10b981',
    lightBgActive: 'bg-emerald-50 text-emerald-950 border-emerald-500 shadow-emerald-500/10',
    darkBgActive: 'bg-emerald-950/70 text-emerald-300 border-emerald-400 shadow-emerald-500/20',
    rate: 'Biogas & Compost'
  },
  {
    id: 'metal',
    name: 'Metals & Alloys',
    tamil: 'உலோகம் & இரும்பு',
    icon: Shield,
    color: '#f59e0b',
    lightBgActive: 'bg-amber-50 text-amber-950 border-amber-500 shadow-amber-500/10',
    darkBgActive: 'bg-amber-950/70 text-amber-300 border-amber-400 shadow-amber-500/20',
    rate: '₹35 - ₹50/kg'
  },
  {
    id: 'paper',
    name: 'Paper & Cardboard',
    tamil: 'காகிதம் & அட்டை',
    icon: BookOpen,
    color: '#3b82f6',
    lightBgActive: 'bg-blue-50 text-blue-950 border-blue-500 shadow-blue-500/10',
    darkBgActive: 'bg-blue-950/70 text-blue-300 border-blue-400 shadow-blue-500/20',
    rate: '₹12 - ₹16/kg'
  },
  {
    id: 'glass',
    name: 'Glass & Cullet',
    tamil: 'கண்ணாடி பாட்டில்',
    icon: Wine,
    color: '#ec4899',
    lightBgActive: 'bg-pink-50 text-pink-950 border-pink-500 shadow-pink-500/10',
    darkBgActive: 'bg-pink-950/70 text-pink-300 border-pink-400 shadow-pink-500/20',
    rate: '₹8 - ₹10/kg'
  },
  {
    id: 'textile',
    name: 'Textiles & Fabric',
    tamil: 'துணி & ஆடை',
    icon: Shirt,
    color: '#14b8a6',
    lightBgActive: 'bg-teal-50 text-teal-950 border-teal-500 shadow-teal-500/10',
    darkBgActive: 'bg-teal-950/70 text-teal-300 border-teal-400 shadow-teal-500/20',
    rate: '₹20 - ₹28/kg'
  },
  {
    id: 'hazardous',
    name: 'Hazardous / Medical',
    tamil: 'அபாயகரமானவை',
    icon: AlertOctagon,
    color: '#ef4444',
    lightBgActive: 'bg-red-50 text-red-950 border-red-500 shadow-red-500/10',
    darkBgActive: 'bg-red-950/70 text-red-300 border-red-400 shadow-red-500/20',
    rate: 'TNPCB Safe Disposal'
  }
];

export default function WasteTypeFilter({
  selectedWasteType,
  onSelectWasteType,
  matchingCollectorCount = 0
}) {
  const currentCategory = CATEGORY_ITEMS.find(c => c.id === selectedWasteType) || CATEGORY_ITEMS[0];

  return (
    <div className="w-full space-y-3">
      {/* Label and Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-wide">
            Select Manual Waste Type to Locate Nearest Collector
          </h2>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{matchingCollectorCount}</span>
          <span>TNPCB verified collection centers accepting this category</span>
        </div>
      </div>

      {/* Horizontal Scrollable Categories Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {CATEGORY_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedWasteType === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectWasteType(item.id)}
              className={`flex-shrink-0 group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 text-left ${
                isSelected
                  ? `${item.lightBgActive} dark:${item.darkBgActive} border-2 shadow-lg scale-105`
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm dark:shadow-none'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold leading-tight block">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.rate}</span>
                  <span className="opacity-40">•</span>
                  <span>{item.tamil}</span>
                </div>
              </div>

              {isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Active Category Mini Hint */}
      {selectedWasteType !== 'all' && (
        <div className="flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              Filtering Tamil Nadu collectors accepting <strong className="text-slate-900 dark:text-white font-bold">{currentCategory.name}</strong> ({currentCategory.tamil}). Closest verified centers prioritized automatically on map.
            </span>
          </div>
          <button
            onClick={() => onSelectWasteType('all')}
            className="text-[11px] font-semibold underline text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex-shrink-0 ml-3"
          >
            Show All Waste Types
          </button>
        </div>
      )}
    </div>
  );
}
