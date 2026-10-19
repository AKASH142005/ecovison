// Chennai geographical center (Ripon Building / Central)
export const DEFAULT_CHENNAI_CENTER = {
  lat: 13.0827,
  lng: 80.2707,
  zoom: 12,
  name: 'Chennai Central'
};

export const CHENNAI_ZONE_COORDINATES = {
  'All': { lat: 13.0827, lng: 80.2707, zoom: 12, label: 'All Chennai' },
  'Anna Nagar': { lat: 13.0850, lng: 80.2100, zoom: 13.5, label: 'Anna Nagar' },
  'T. Nagar': { lat: 13.0418, lng: 80.2341, zoom: 13.5, label: 'T. Nagar' },
  'Guindy': { lat: 13.0067, lng: 80.2012, zoom: 13.5, label: 'Guindy' },
  'Adyar': { lat: 13.0012, lng: 80.2565, zoom: 13.5, label: 'Adyar' },
  'Velachery': { lat: 12.9750, lng: 80.2210, zoom: 13.5, label: 'Velachery' },
  'Perungudi / OMR': { lat: 12.9698, lng: 80.2374, zoom: 13.5, label: 'Perungudi / OMR' },
  'Ambattur': { lat: 13.1143, lng: 80.1548, zoom: 13.5, label: 'Ambattur' },
  'Mylapore': { lat: 13.0368, lng: 80.2676, zoom: 13.5, label: 'Mylapore' },
  'Porur': { lat: 13.0382, lng: 80.1565, zoom: 13.5, label: 'Porur' },
  'Royapuram': { lat: 13.1120, lng: 80.2950, zoom: 13.5, label: 'Royapuram' },
  'Manali': { lat: 13.1670, lng: 80.2600, zoom: 13.5, label: 'Manali' },
  'Tambaram': { lat: 12.9249, lng: 80.1000, zoom: 13.5, label: 'Tambaram' }
};

// Backwards compatibility alias
export const TN_DISTRICT_COORDINATES = CHENNAI_ZONE_COORDINATES;
