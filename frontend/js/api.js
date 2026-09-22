// RailBite - Backend API Client Layer with Auth Support

const API_BASE = window.location.port === '5000' 
  ? '/api' 
  : 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('railbite_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const API = {
  // --- AUTHENTICATION ---
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return await res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/auth/my-orders`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async logout() {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: true };
    }
  },

  // --- TRAINS & STATIONS ---
  async getTrains(query = '') {
    const res = await fetch(`${API_BASE}/trains?q=${encodeURIComponent(query)}`);
    return await res.json();
  },

  async getTrainByNo(trainNo) {
    const res = await fetch(`${API_BASE}/trains/${trainNo}`);
    return await res.json();
  },

  async getStations() {
    const res = await fetch(`${API_BASE}/stations`);
    return await res.json();
  },

  // --- PNR ---
  async lookupPnr(pnrNumber) {
    const res = await fetch(`${API_BASE}/pnr/${encodeURIComponent(pnrNumber)}`);
    return await res.json();
  },

  // --- RESTAURANTS & MENUS ---
  async getRestaurants(stationCode, filters = {}) {
    const params = new URLSearchParams();
    if (filters.pure_veg) params.append('pure_veg', 'true');
    if (filters.jain) params.append('jain', 'true');
    if (filters.min_rating) params.append('min_rating', filters.min_rating);
    if (filters.cuisine) params.append('cuisine', filters.cuisine);

    const url = `${API_BASE}/stations/${encodeURIComponent(stationCode)}/restaurants?${params.toString()}`;
    const res = await fetch(url);
    return await res.json();
  },

  async getRestaurantDetails(restaurantId) {
    const res = await fetch(`${API_BASE}/restaurants/${encodeURIComponent(restaurantId)}`);
    return await res.json();
  },

  // --- ORDERS ---
  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderPayload)
    });
    return await res.json();
  },

  async getOrder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`);
    return await res.json();
  },

  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  async getAllOrders() {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // --- COUPONS & STATS ---
  async getCoupons() {
    const res = await fetch(`${API_BASE}/coupons`);
    return await res.json();
  },

  async validateCoupon(code, amount) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount })
    });
    return await res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  }
};
