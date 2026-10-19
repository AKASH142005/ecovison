import L from 'leaflet';

// Leaflet custom factory icon (Amber)
export function createDealerFactoryIcon(factory, isDark = true) {
  return L.divIcon({
    className: 'custom-factory-marker',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(245, 158, 11, 0.25); animation: pulse 2s infinite;"></div>
        <div style="position: absolute; width: 26px; height: 26px; border-radius: 8px; background: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.8); display: flex; align-items: center; justify-content: center; color: #000; font-weight: 900; font-size: 13px;">
          🏭
        </div>
        <div style="position: absolute; bottom: -16px; white-space: nowrap; font-size: 9px; font-weight: 800; background: #0f172a; color: #fbbf24; padding: 1px 6px; border-radius: 999px; border: 1px solid rgba(245, 158, 11, 0.4); pointer-events: none;">
          ${factory.name ? factory.name.split(' ')[0] : 'Factory'}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });
}

// Leaflet custom dealer hub icon (Blue)
export function createDealerHubIcon(name, isDark = true) {
  return L.divIcon({
    className: 'custom-dealer-marker',
    html: `
      <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 30px; height: 30px; border-radius: 10px; background: #2563eb; box-shadow: 0 0 16px rgba(59, 130, 246, 0.9); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 14px;">
          🚛
        </div>
        <div style="position: absolute; bottom: -18px; white-space: nowrap; font-size: 10px; font-weight: 900; background: #1e3a8a; color: #93c5fd; padding: 1px 8px; border-radius: 999px; border: 1.5px solid #60a5fa; pointer-events: none;">
          ⭐ YOUR HUB
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -21]
  });
}
