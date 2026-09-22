import { TRAINS, STATIONS, RESTAURANTS, MENU_ITEMS, COUPONS, MOCK_PNRS } from '../data/mockData';

const BASE_URL = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api';

// Helper to safely fetch or fall back to local mock data
async function safeFetch(url, options = {}, fallbackData) {
  try {
    const token = localStorage.getItem('railbite_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  } catch (err) {
    console.warn(`API call to ${url} failed or offline. Using local mock fallback:`, err.message);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
}

export const apiService = {
  // --- AUTHENTICATION ---
  async login(email, password, role = 'user') {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      if (data.token) {
        localStorage.setItem('railbite_auth_token', data.token);
        localStorage.setItem('railbite_auth_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.warn('Backend login offline, attempting mock credentials validation:', err.message);
      // Demo fallback authentication
      if (email === 'admin@railbite.in' && password === 'admin123') {
        const mockAdmin = {
          id: 'admin-001',
          name: 'Vikram Malhotra',
          email: 'admin@railbite.in',
          phone: '+91 99887 76655',
          role: 'admin',
          designation: 'IRCTC Station Pantry Officer',
          station_code: 'BRC',
          station_name: 'Vadodara Junction',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
        };
        const mockToken = 'mock-admin-token-' + Date.now();
        localStorage.setItem('railbite_auth_token', mockToken);
        localStorage.setItem('railbite_auth_user', JSON.stringify(mockAdmin));
        return { success: true, token: mockToken, user: mockAdmin, message: 'Welcome back, Station Pantry Officer!' };
      }

      if (email === 'rahul@railbite.in' && password === 'user123') {
        const mockUser = {
          id: 'user-001',
          name: 'Rahul Sharma',
          email: 'rahul@railbite.in',
          phone: '+91 98765 43210',
          role: 'user',
          pnr: '2485961034',
          coach: 'B3',
          berth: '42',
          berth_type: 'Lower Berth',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
        const mockToken = 'mock-user-token-' + Date.now();
        localStorage.setItem('railbite_auth_token', mockToken);
        localStorage.setItem('railbite_auth_user', JSON.stringify(mockUser));
        return { success: true, token: mockToken, user: mockUser, message: 'Welcome back, Rahul Sharma!' };
      }

      throw err;
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      if (data.token) {
        localStorage.setItem('railbite_auth_token', data.token);
        localStorage.setItem('railbite_auth_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.warn('Backend register offline, creating local mock user:', err.message);
      const newUser = {
        id: (userData.role === 'admin' ? 'admin-' : 'user-') + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '+91 98765 43210',
        role: userData.role || 'user',
        pnr: userData.pnr || '2485961034',
        coach: userData.coach || 'B4',
        berth: userData.berth || '42',
        berth_type: 'Lower Berth',
        avatar: userData.role === 'admin' 
          ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      const token = 'mock-token-' + Date.now();
      localStorage.setItem('railbite_auth_token', token);
      localStorage.setItem('railbite_auth_user', JSON.stringify(newUser));
      return { success: true, token, user: newUser, message: 'Account created successfully!' };
    }
  },

  async getMe() {
    try {
      const token = localStorage.getItem('railbite_auth_token');
      if (!token) return null;
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Session expired');
      const data = await res.json();
      return data.user;
    } catch {
      return this.getLocalAuthUser();
    }
  },

  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('railbite_auth_token');
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Profile update failed');
      localStorage.setItem('railbite_auth_user', JSON.stringify(data.user));
      return data.user;
    } catch {
      const current = this.getLocalAuthUser() || {};
      const updated = { ...current, ...profileData };
      localStorage.setItem('railbite_auth_user', JSON.stringify(updated));
      return updated;
    }
  },

  logout() {
    localStorage.removeItem('railbite_auth_token');
    localStorage.removeItem('railbite_auth_user');
  },

  getLocalAuthUser() {
    try {
      const u = localStorage.getItem('railbite_auth_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  // --- TRAINS & PNR ---
  async getTrains() {
    return safeFetch(`${BASE_URL}/trains`, {}, TRAINS);
  },

  async getTrainByNo(trainNo) {
    const fallback = TRAINS.find(t => t.train_no === trainNo) || null;
    return safeFetch(`${BASE_URL}/trains/${trainNo}`, {}, fallback);
  },

  async lookupPnr(pnr) {
    const cleanPnr = pnr.replace(/\D/g, '');
    const fallback = MOCK_PNRS[cleanPnr] || {
      pnr: cleanPnr,
      train_no: "12951",
      train_name: "Mumbai Central - New Delhi Rajdhani Express",
      passenger_name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@railbite.in",
      coach: "B3",
      berth: "42",
      berth_type: "Lower Berth",
      boarding: "MMCT",
      destination: "NDLS",
      status: "CNF / B3-42"
    };
    return safeFetch(`${BASE_URL}/pnr/${cleanPnr}`, {}, fallback);
  },

  // --- STATIONS & RESTAURANTS ---
  async getStations() {
    return safeFetch(`${BASE_URL}/stations`, {}, STATIONS);
  },

  async getRestaurantsByStation(stationCode) {
    const fallback = RESTAURANTS.filter(r => r.station_codes.includes(stationCode));
    return safeFetch(`${BASE_URL}/stations/${stationCode}/restaurants`, {}, fallback.length > 0 ? fallback : RESTAURANTS);
  },

  async getMenuItems(restaurantId = null) {
    if (restaurantId) {
      return MENU_ITEMS.filter(m => m.restaurant_id === restaurantId);
    }
    return MENU_ITEMS;
  },

  async getCoupons() {
    return safeFetch(`${BASE_URL}/coupons`, {}, COUPONS);
  },

  // --- ORDERS ---
  async createOrder(orderPayload) {
    const orderId = 'RB-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      ...orderPayload,
      order_id: orderId,
      order_otp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'CONFIRMED',
      placed_at: new Date().toISOString(),
      tracking_timeline: [
        { status: 'CONFIRMED', title: 'Order Confirmed', time: 'Just now', completed: true, desc: 'Your meal order has been confirmed by the station partner kitchen.' },
        { status: 'PREPARING', title: 'Kitchen Preparing Meal', time: 'In 5 mins', completed: false, desc: 'Fresh ingredients being cooked under strict hygiene & FSSAI standards.' },
        { status: 'PACKED', title: 'Quality Checked & Packed', time: 'In 15 mins', completed: false, desc: 'Thermal sealed food packed in tamper-proof container.' },
        { status: 'DISPATCHED', title: 'Executive at Platform', time: 'Train Arrival', completed: false, desc: 'Delivery partner waiting at designated platform.' },
        { status: 'DELIVERED', title: 'Delivered to Seat', time: 'Coach Handover', completed: false, desc: 'Hot meal handed over to your berth.' }
      ]
    };

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const data = await res.json();
        const savedOrder = data.order || newOrder;
        this.saveOrderLocally(savedOrder);
        return savedOrder;
      }
    } catch (e) {
      console.warn('Backend order creation offline, saving to localStorage:', e.message);
    }

    this.saveOrderLocally(newOrder);
    return newOrder;
  },

  async getAllOrders() {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          return data.data;
        }
      }
    } catch (e) {
      console.warn('Backend orders fetch failed, using local orders:', e.message);
    }
    return this.getLocalOrders();
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        this.updateLocalOrderStatus(orderId, status);
        return data.order;
      }
    } catch (e) {
      console.warn('Backend order status update offline, updating locally:', e.message);
    }
    return this.updateLocalOrderStatus(orderId, status);
  },

  updateLocalOrderStatus(orderId, status) {
    try {
      const orders = this.getLocalOrders();
      const updated = orders.map(o => {
        if (o.order_id === orderId || o.id === orderId) {
          const statusOrder = ['CONFIRMED', 'PREPARING', 'PACKED', 'DISPATCHED', 'DELIVERED'];
          const targetIdx = statusOrder.indexOf(status);
          const updatedTimeline = (o.tracking_timeline || []).map((step, idx) => ({
            ...step,
            completed: idx <= targetIdx,
            time: idx === targetIdx ? 'Updated now' : step.time
          }));

          return {
            ...o,
            status,
            order_status: status,
            tracking_timeline: updatedTimeline
          };
        }
        return o;
      });
      localStorage.setItem('railbite_orders', JSON.stringify(updated));
      return updated.find(o => o.order_id === orderId || o.id === orderId);
    } catch (e) {
      console.error('Error updating order locally', e);
      return null;
    }
  },

  saveOrderLocally(order) {
    try {
      const existing = JSON.parse(localStorage.getItem('railbite_orders') || '[]');
      const updated = [order, ...existing.filter(o => o.order_id !== order.order_id)];
      localStorage.setItem('railbite_orders', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving order locally', e);
    }
  },

  getLocalOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem('railbite_orders') || '[]');
      // If empty, provide realistic active orders for demonstration
      if (orders.length === 0) {
        const demoOrder = {
          order_id: 'RB-849204',
          order_otp: '4892',
          status: 'PREPARING',
          placed_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          train: {
            train_no: "12951",
            name: "Mumbai Central - New Delhi Rajdhani Express",
            speed_kmh: 125
          },
          station: {
            code: "BRC",
            name: "Vadodara Jn",
            platform: "2",
            arrival: "21:06",
            departure: "21:16"
          },
          passenger: {
            name: "Rahul Sharma",
            phone: "+91 98765 43210",
            email: "rahul@railbite.in",
            coach: "B3",
            berth: "42",
            berth_type: "Lower Berth",
            pnr: "2485961034"
          },
          items: [
            {
              id: "dish_1",
              name: "Special Maharaja Veg Thali (IRCTC Certified)",
              price: 249,
              quantity: 2,
              restaurant_name: "Haldiram's Express",
              is_veg: true
            },
            {
              id: "dish_2",
              name: "Gulab Jamun (2 Pcs, Warm in Desi Ghee)",
              price: 79,
              quantity: 1,
              restaurant_name: "Haldiram's Express",
              is_veg: true
            }
          ],
          billSummary: {
            itemTotal: 577,
            gst: 28.85,
            deliveryFee: 0,
            couponDiscount: 50,
            grandTotal: 555.85
          },
          paymentDetails: {
            method: 'UPI',
            transactionId: 'UPI-RB-9382109'
          },
          tracking_timeline: [
            { status: 'CONFIRMED', title: 'Order Confirmed', time: '20:45', completed: true, desc: 'Sent to Haldiram\'s Express Station Kitchen.' },
            { status: 'PREPARING', title: 'Kitchen Preparing Meal', time: '20:52', completed: true, desc: 'Fresh ingredients cooked under hygienic conditions.' },
            { status: 'PACKED', title: 'Quality Checked & Packed', time: 'In 5 mins', completed: false, desc: 'Thermal insulated packaging applied.' },
            { status: 'DISPATCHED', title: 'Executive at Platform', time: '21:05', completed: false, desc: 'Ramesh Kumar on Platform #2.' },
            { status: 'DELIVERED', title: 'Delivered to Seat', time: '21:10', completed: false, desc: 'Handed at Coach B3, Seat 42.' }
          ]
        };
        localStorage.setItem('railbite_orders', JSON.stringify([demoOrder]));
        return [demoOrder];
      }
      return orders;
    } catch {
      return [];
    }
  }
};
