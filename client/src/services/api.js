const API_BASE = '/api';

export const api = {
  // Get collectors with optional filters (wasteType, district, coords)
  async getCollectors(params = {}) {
    const query = new URLSearchParams();
    if (params.wasteType && params.wasteType !== 'all') query.append('wasteType', params.wasteType);
    if (params.district && params.district !== 'All') query.append('district', params.district);
    if (params.lat != null) query.append('lat', params.lat);
    if (params.lng != null) query.append('lng', params.lng);
    if (params.search) query.append('search', params.search);
    if (params.maxDistanceKm) query.append('maxDistanceKm', params.maxDistanceKm);

    const res = await fetch(`${API_BASE}/collectors?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch waste collectors');
    return res.json();
  },

  // Get single collector
  async getCollectorById(id) {
    const res = await fetch(`${API_BASE}/collectors/${id}`);
    if (!res.ok) throw new Error('Failed to fetch collector details');
    return res.json();
  },

  // Post find nearest
  async findNearestCollectors(payload) {
    const res = await fetch(`${API_BASE}/collectors/nearest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to compute nearest collectors');
    return res.json();
  },

  // Get waste categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch waste categories');
    return res.json();
  },

  // Get Tamil Nadu districts
  async getDistricts() {
    const res = await fetch(`${API_BASE}/districts`);
    if (!res.ok) throw new Error('Failed to fetch districts');
    return res.json();
  },

  // Create booking (drop-off / pickup)
  async createBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit booking');
    }
    return res.json();
  },

  // Get bookings
  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  // Get regional statistics
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
