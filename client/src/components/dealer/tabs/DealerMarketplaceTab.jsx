import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Building, Send, TrendingUp } from 'lucide-react';
import { createDealerFactoryIcon, createDealerHubIcon } from '../utils/dealerMapIcons';

export default function DealerMarketplaceTab({
  facilityLat,
  facilityLng,
  facilityAddress,
  serviceRadiusKm,
  user,
  isDark,
  totalBaledStock,
  factories = [],
  requirements = [],
  inventory = [],
  dealerOrders = [],
  onOpenBid,
  onOpenDispatch
}) {
  return (
    <div className="space-y-6">
      {/* Interactive Dual Panel: Map of Factories (Left) + Factory Demands & Bidding (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Map Column: Chennai Factories & Dealer Hub (7 cols) */}
        <div className="lg:col-span-7 h-[500px] lg:h-[620px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative">
          <MapContainer
            center={[13.0400, 80.2200]}
            zoom={11}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Dealer's own Hub Marker and Service Boundary */}
            <Marker
              position={[facilityLat, facilityLng]}
              icon={createDealerHubIcon(user?.facilityName, isDark)}
            >
              <Popup>
                <div className="p-1 space-y-1 text-slate-900">
                  <div className="font-black text-xs text-blue-700">⭐ {user?.facilityName || 'Your Hub'}</div>
                  <div className="text-[11px] text-slate-600">{facilityAddress}</div>
                  <div className="text-[10px] font-bold text-emerald-600">
                    Baled Stock: {totalBaledStock.toLocaleString()} kg
                  </div>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[facilityLat, facilityLng]}
              radius={serviceRadiusKm * 1000}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '6, 6'
              }}
            />

            {/* Industrial Factories Markers */}
            {factories.map((fac) => (
              <Marker
                key={fac._id || `fac_${fac.lat}-${fac.lng}`}
                position={[fac.lat, fac.lng]}
                icon={createDealerFactoryIcon(fac, isDark)}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-slate-900 max-w-[220px]">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-amber-700">🏭 {fac.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {fac.district}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{fac.address}</p>
                    <div className="text-[10px] font-bold text-slate-500">
                      Corridor: <strong>{fac.industrialBelt || 'Industrial Corridor'}</strong>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">
                      Demand: {fac.procurementDemands?.map(d => `${d.category} (₹${d.offeredRatePerKg}/kg)`).join(', ') || 'Bulk rPET, Steel, Cardboard'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Floating Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md text-xs space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
              Map Guide for Dealer:
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-md bg-amber-500 inline-block"></span>
              <span>🏭 Industrial Factories (Procurement Buyers)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <span>🚛 Your Recovery Depot & {serviceRadiusKm} km Boundary</span>
            </div>
          </div>
        </div>

        {/* Factory Demands & Bidding Action Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-500" />
                <span>Factories Buying Bulk Scrap</span>
              </h3>
              <p className="text-xs text-slate-500">
                Bid your baled stock and confirm purchase orders directly.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {requirements.length} Active Demands
            </span>
          </div>

          {/* Requirements Scrollable Cards */}
          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {requirements.map((req) => {
              const matchingInv = inventory.find(i => i.category === req.category);
              const availableStock = matchingInv ? matchingInv.availableKg : 0;
              const totalPayout = (req.quantityNeededKg * req.offeredPricePerKg);

              return (
                <div
                  key={req._id || req.requirementId}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/50 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                        {req.requirementId} • {req.district || 'Chennai'}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {req.factoryName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Grade: <strong>{req.grade}</strong> ({req.category?.toUpperCase()})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block">
                        ₹{req.offeredPricePerKg}/kg
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Est. ₹{totalPayout.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target Needed:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {req.quantityNeededKg.toLocaleString()} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Your Warehouse Stock:</span>
                      <span className={`font-bold ${availableStock > 0 ? 'text-blue-500' : 'text-slate-400'}`}>
                        {availableStock.toLocaleString()} kg {availableStock > 0 ? '✓' : '(Low)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBid(req, availableStock)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Bid & Sell Waste (Commit PO)</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dealer Dispatched Purchase Orders Overview */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                <span>Your Factory Purchase Orders</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {dealerOrders.length} Dispatched
              </span>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {dealerOrders.length === 0 ? (
                <p className="text-xs text-slate-400 p-3 text-center border border-dashed rounded-xl">
                  No purchase orders yet. Select a factory above to commit stock.
                </p>
              ) : (
                dealerOrders.map(po => (
                  <div
                    key={po._id || po.poNumber}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs flex items-center justify-between gap-2 border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{po.poNumber}</span>
                        <span className="text-[10px] text-slate-400">→ {po.factoryName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {po.quantityKg} kg • ₹{po.totalAmount?.toLocaleString()} • Status: <strong>{po.status}</strong>
                      </div>
                    </div>

                    {po.status === 'created' && (
                      <button
                        onClick={() => onOpenDispatch(po)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shrink-0"
                      >
                        Dispatch Truck
                      </button>
                    )}
                    {po.status === 'shipped' && (
                      <span className="text-[10px] font-bold text-blue-500 shrink-0">
                        🚚 In Transit ({po.vehicleNumber})
                      </span>
                    )}
                    {po.status === 'verified' && (
                      <span className="text-[10px] font-bold text-emerald-500 shrink-0">
                        ✓ Verified & Paid
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
