import React from 'react';
import { Sliders, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CHENNAI_ZONE_COORDINATES } from '../../../constants/chennaiZones';

export default function DealerBoundaryTab({
  serviceRadiusKm,
  setServiceRadiusKm,
  serviceWards = [],
  handleToggleWard,
  handleSaveBoundary,
  savingBoundary
}) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            <span>Configure Doorstep Waste Collection Catchment</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Citizens inside this boundary will see your hub highlighted as their nearest doorstep pickup provider.
          </p>
        </div>

        {/* Service Radius Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Service Catchment Radius:
            </span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              {serviceRadiusKm} Kilometers
            </span>
          </div>

          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={serviceRadiusKm}
            onChange={(e) => setServiceRadiusKm(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>2 km (Local Ward)</span>
            <span>8 km (Zone Hub)</span>
            <span>15 km (Central Chennai)</span>
            <span>30 km (Metropolitan Grid)</span>
          </div>
        </div>

        {/* Chennai Wards Multi-Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Active Chennai Collection Zones ({serviceWards.length} selected):
          </label>

          <div className="flex flex-wrap gap-2">
            {Object.keys(CHENNAI_ZONE_COORDINATES).map(ward => {
              const isChecked = serviceWards.includes(ward);

              return (
                <button
                  key={ward}
                  type="button"
                  onClick={() => handleToggleWard(ward)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>{ward}</span>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Boundary Button */}
        <div className="pt-2">
          <button
            onClick={handleSaveBoundary}
            disabled={savingBoundary}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <span>{savingBoundary ? 'Saving Boundary...' : 'Save Collection Catchment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
