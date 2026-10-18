// Geocoding & Reverse Geocoding service for EcoVision Tamil Nadu

const cache = new Map();

/**
 * Cleanly format Nominatim reverse geocode response into readable area and city name
 */
function formatAddress(data) {
  if (!data || !data.address) {
    return data?.display_name || null;
  }
  const addr = data.address;
  const parts = [];

  // Locality / Neighborhood / Suburb
  const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village;
  if (locality) parts.push(locality);

  // City / Town / District
  const city = addr.city || addr.town || addr.municipality || addr.county || addr.state_district;
  if (city && !parts.includes(city)) parts.push(city);

  // State / Pincode
  if (addr.postcode) parts.push(addr.postcode);

  if (parts.length > 0) {
    return parts.join(', ');
  }
  return data.display_name?.split(',').slice(0, 3).join(',') || null;
}

/**
 * Reverse geocode latitude and longitude to a human-readable address
 */
export async function reverseGeocode(lat, lng) {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();
    const formatted = formatAddress(data) || `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
    const fullAddress = data.display_name || formatted;

    const result = {
      shortName: formatted,
      fullName: fullAddress,
      raw: data
    };

    cache.set(key, result);
    return result;
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return {
      shortName: `Pin (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      fullName: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      raw: null
    };
  }
}

/**
 * Search locations, landmarks, areas, and pincodes in Tamil Nadu
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const trimmed = query.trim();
  const cacheKey = `search:${trimmed.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    // Append Tamil Nadu if not already present to bias results to Tamil Nadu
    const searchQuery = /tamil nadu|chennai|coimbatore|madurai/i.test(trimmed)
      ? trimmed
      : `${trimmed}, Tamil Nadu`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchQuery
    )}&countrycodes=in&viewbox=76.0,13.8,80.5,8.0&bounded=0&limit=5&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (!res.ok) throw new Error('Search failed');
    const items = await res.json();

    const results = items.map((item) => ({
      name: formatAddress(item) || item.display_name.split(',').slice(0, 2).join(','),
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));

    cache.set(cacheKey, results);
    return results;
  } catch (err) {
    console.warn('Location search error:', err);
    return [];
  }
}
