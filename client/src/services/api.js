const API_BASE = 'https://ecovison.onrender.com/api';

function getAuthHeaders() {
  const token = localStorage.getItem('ecovision_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // --- AUTHENTICATION & DEMO SWITCHER ---
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  async getDemoUsers() {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    if (!res.ok) throw new Error('Failed to fetch demo users');
    return res.json();
  },

  async switchDemoRole(role) {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Role switch failed');
    return data;
  },

  async getProfileAggregations() {
    const res = await fetch(`${API_BASE}/auth/profile-aggregations`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load profile aggregations');
    return res.json();
  },

  // --- CORE CUSTOMER OPERATIONS (Pickups & Hubs) ---
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

  async getCollectorById(id) {
    const res = await fetch(`${API_BASE}/collectors/${id}`);
    if (!res.ok) throw new Error('Failed to fetch collector details');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch waste categories');
    return res.json();
  },

  async getDistricts() {
    const res = await fetch(`${API_BASE}/districts`);
    if (!res.ok) throw new Error('Failed to fetch districts');
    return res.json();
  },

  async createBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit booking');
    return result;
  },

  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // --- DEALER OPERATIONS ---
  async getDealerPickups() {
    const res = await fetch(`${API_BASE}/dealer/pickups`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dealer pickups');
    return res.json();
  },

  async acceptPickup(id) {
    const res = await fetch(`${API_BASE}/dealer/pickups/${id}/accept`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to accept pickup');
    return data;
  },

  async updatePickupStatus(id, status) {
    const res = await fetch(`${API_BASE}/dealer/pickups/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update pickup status');
    return data;
  },

  async updateBookingStatus(id, status) {
    return this.updatePickupStatus(id, status);
  },

  async completePickup(id, actualWeightKg, notes = '') {
    const body = typeof actualWeightKg === 'object' && actualWeightKg !== null
      ? actualWeightKg
      : { actualWeightKg: parseFloat(actualWeightKg), notes };
    const res = await fetch(`${API_BASE}/dealer/pickups/${id}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete pickup');
    return data;
  },

  async getDealerInventory() {
    const res = await fetch(`${API_BASE}/dealer/inventory`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dealer inventory');
    return res.json();
  },

  // --- B2B CIRCULAR MARKETPLACE (Factory & Dealer) ---
  async getMarketplaceRequirements(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.district && params.district !== 'All') query.append('district', params.district);
    const res = await fetch(`${API_BASE}/marketplace/requirements?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch marketplace requirements');
    return res.json();
  },

  async createRequirement(data) {
    const res = await fetch(`${API_BASE}/marketplace/requirements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to publish requirement');
    return result;
  },

  async createPurchaseOrder(data) {
    const res = await fetch(`${API_BASE}/marketplace/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create purchase order');
    return result;
  },

  async getMarketplaceOrders() {
    const res = await fetch(`${API_BASE}/marketplace/orders`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async shipOrder(id, vehicleNumber, dispatchDate) {
    let payload = {};
    if (typeof vehicleNumber === 'object' && vehicleNumber !== null) {
      payload = vehicleNumber;
    } else {
      payload = { vehicleNumber, dispatchDate };
    }
    const res = await fetch(`${API_BASE}/marketplace/orders/${id}/ship`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to mark shipment');
    if (data.purchaseOrder && !data.order) data.order = data.purchaseOrder;
    if (data.order && !data.purchaseOrder) data.purchaseOrder = data.order;
    return data;
  },

  async shipPurchaseOrder(id, vehicleNumber, dispatchDate) {
    return this.shipOrder(id, vehicleNumber, dispatchDate);
  },

  async verifyShipment(id, verifiedWeightKg, qualityGrade, notes) {
    let payload = {};
    if (typeof verifiedWeightKg === 'object' && verifiedWeightKg !== null) {
      payload = verifiedWeightKg;
    } else {
      payload = { verifiedWeightKg, qualityGrade, notes };
    }
    const res = await fetch(`${API_BASE}/marketplace/orders/${id}/verify`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to verify shipment');
    if (data.purchaseOrder && !data.order) data.order = data.purchaseOrder;
    if (data.order && !data.purchaseOrder) data.purchaseOrder = data.order;
    return data;
  },

  async verifyPurchaseOrder(id, verifiedWeightKg, qualityGrade, notes) {
    return this.verifyShipment(id, verifiedWeightKg, qualityGrade, notes);
  },

  async verifyOrder(id, verifiedWeightKg, qualityGrade, notes) {
    return this.verifyShipment(id, verifiedWeightKg, qualityGrade, notes);
  },

  async releasePayment(id, paymentStatus, paymentRef) {
    let payload = {};
    if (typeof paymentStatus === 'object' && paymentStatus !== null) {
      payload = paymentStatus;
    } else {
      payload = { paymentStatus, paymentRef };
    }
    const res = await fetch(`${API_BASE}/marketplace/orders/${id}/payment`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to release payment');
    if (data.purchaseOrder && !data.order) data.order = data.purchaseOrder;
    if (data.order && !data.purchaseOrder) data.purchaseOrder = data.order;
    return data;
  },

  async payPurchaseOrder(id, paymentStatus, paymentRef) {
    return this.releasePayment(id, paymentStatus, paymentRef);
  },

  async payOrder(id, paymentStatus, paymentRef) {
    return this.releasePayment(id, paymentStatus, paymentRef);
  },

  // --- ADMIN PLATFORM & AUDIT LOGS ---
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin overview');
    return res.json();
  },

  async getAuditLogs(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.role) query.append('role', params.role);
    const res = await fetch(`${API_BASE}/admin/audit-logs?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async runTestSuite() {
    const res = await fetch(`${API_BASE}/admin/test-suite`);
    const data = await res.json();
    return data;
  },

  async runTests() {
    return this.runTestSuite();
  },

  // --- FACTORIES (BUYERS) ---
  async getFactories(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.district && params.district !== 'All') query.append('district', params.district);
    if (params.lat != null) query.append('lat', params.lat);
    if (params.lng != null) query.append('lng', params.lng);
    const res = await fetch(`${API_BASE}/factories?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch factories');
    return res.json();
  },

  // --- DEALER BOUNDARY & COLLECTION POINTS ---
  async createCollector(data) {
    const res = await fetch(`${API_BASE}/collectors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create collection point');
    return result;
  },

  async deleteCollector(id) {
    const res = await fetch(`${API_BASE}/collectors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to delete collection point');
    return result;
  },

  async getDealerBoundary() {
    const res = await fetch(`${API_BASE}/dealer/boundary`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dealer boundary');
    return res.json();
  },

  async updateDealerBoundary(data) {
    const res = await fetch(`${API_BASE}/dealer/boundary`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update boundary');
    return result;
  }
};
