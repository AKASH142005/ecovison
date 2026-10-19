import L from 'leaflet';

// Create custom SVG Leaflet icon for the user origin with drag hint
export function createUserIcon(isManual = false) {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: grab;" title="Drag to set exact doorstep location">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: #059669; box-shadow: 0 0 12px rgba(16, 185, 129, 0.9);"></div>
        <div style="position: relative; width: 10px; height: 10px; border-radius: 50%; background: #ffffff; border: 2.5px solid #0f172a;"></div>
        <div style="position: absolute; bottom: -20px; white-space: nowrap; font-size: 9px; font-weight: 800; background: #0f172a; color: #34d399; padding: 1px 7px; border-radius: 999px; border: 1px solid rgba(16, 185, 129, 0.4); pointer-events: none; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
          ${isManual ? '🎯 Precise Pin' : '📍 Drag Me'}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
}

// Create custom SVG Leaflet icon for collectors (Dealers & MRFs)
export function createCollectorIcon(collector, isSelected, selectedWasteType, isDark = true) {
  let pinColor = '#10b981'; // emerald default
  if (selectedWasteType === 'ewaste') pinColor = '#a855f7';
  else if (selectedWasteType === 'plastic') pinColor = '#06b6d4';
  else if (selectedWasteType === 'metal') pinColor = '#f59e0b';
  else if (selectedWasteType === 'hazardous') pinColor = '#ef4444';
  else if (selectedWasteType === 'paper') pinColor = '#3b82f6';
  else if (selectedWasteType === 'textile') pinColor = '#14b8a6';

  const scale = isSelected ? 1.25 : 1.0;
  const stroke = isSelected ? (isDark ? '#ffffff' : '#047857') : pinColor;
  const strokeWidth = isSelected ? '3' : '1.5';
  const baseFill = isSelected ? (isDark ? '#047857' : '#059669') : (isDark ? '#0f172a' : '#ffffff');
  const tagBg = isDark ? '#020617' : '#ffffff';
  const tagColor = isDark ? '#34d399' : '#047857';
  const tagBorder = isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.5)';

  return L.divIcon({
    className: 'custom-collector-marker',
    html: `
      <div style="
        transform: scale(${scale});
        transform-origin: bottom center;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));
        position: relative;
        cursor: pointer;
      ">
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 17 42 17 42C17 42 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${baseFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          <circle cx="17" cy="16" r="10" fill="${pinColor}" />
          <path d="M14 16L16 18L20 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${collector.distanceKm != null ? `
          <div style="
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: ${tagBg};
            color: ${tagColor};
            font-size: 9px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 999px;
            border: 1px solid ${tagBorder};
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${collector.distanceKm} km
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42]
  });
}

// Create custom SVG Leaflet icon for industrial manufacturing buyers
export function createFactoryIcon(factory, isDark = true) {
  const pinColor = '#f59e0b'; // amber
  const stroke = '#b45309';
  const baseFill = isDark ? '#1e1b4b' : '#fef3c7';
  const tagBg = isDark ? '#020617' : '#ffffff';

  return L.divIcon({
    className: 'custom-factory-marker',
    html: `
      <div style="
        transform-origin: bottom center;
        filter: drop-shadow(0 6px 12px rgba(245,158,11,0.35));
        position: relative;
        cursor: pointer;
      ">
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8.05888 0 0 8.05888 0 18C0 29 18 44 18 44C18 44 36 29 36 18C36 8.05888 27.9411 0 18 0Z" fill="${baseFill}" stroke="${stroke}" stroke-width="1.5" />
          <circle cx="18" cy="17" r="10" fill="${pinColor}" />
          <text x="18" y="21" font-size="11" font-weight="900" fill="#000000" text-anchor="middle">🏭</text>
        </svg>
        ${factory.distanceKm != null ? `
          <div style="
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: ${tagBg};
            color: #d97706;
            font-size: 9px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 999px;
            border: 1px solid rgba(245, 158, 11, 0.5);
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${factory.distanceKm} km
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44]
  });
}
