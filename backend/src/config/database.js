import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localDbPath = path.resolve(__dirname, '../../database/railbite_db.json');
const parentDbPath = path.resolve(__dirname, '../../../database/railbite_db.json');
const DB_PATH = process.env.DB_PATH || (fs.existsSync(localDbPath) ? localDbPath : parentDbPath);

const localSeedPath = path.resolve(__dirname, '../../database/seed_data.json');
const parentSeedPath = path.resolve(__dirname, '../../../database/seed_data.json');
const SEED_PATH = process.env.SEED_PATH || (fs.existsSync(localSeedPath) ? localSeedPath : parentSeedPath);

const JWT_SECRET = process.env.JWT_SECRET || 'railbite-super-secret-security-key-2026';

// Password Security Utilities
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

// Token Generation & Verification
export function createToken(payload, expiresInHours = 24) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (expiresInHours * 3600);
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

class Database {
  constructor() {
    this.data = {
      trains: [],
      stations: [],
      train_schedules: [],
      restaurants: [],
      menu_items: [],
      pnr_records: [],
      coupons: [],
      orders: [],
      users: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        if (!this.data.users) this.data.users = [];
        this.ensureSeedUsers();
        console.log('✅ RailBite Database loaded from persistent store.');
      } else if (fs.existsSync(SEED_PATH)) {
        const seedContent = fs.readFileSync(SEED_PATH, 'utf-8');
        this.data = JSON.parse(seedContent);
        if (!this.data.users) this.data.users = [];
        this.ensureSeedUsers();
        this.save();
        console.log('🌱 RailBite Database initialized from seed data.');
      } else {
        console.warn('⚠️ Seed data not found, starting with empty tables.');
        this.ensureSeedUsers();
      }
    } catch (err) {
      console.error('❌ Error initializing database:', err);
    }
  }

  ensureSeedUsers() {
    if (!this.data.users) this.data.users = [];

    // Seed default passenger user if not present
    if (!this.data.users.some(u => u.email === 'rahul@railbite.in')) {
      const userHash = hashPassword('user123');
      this.data.users.push({
        id: 'user-001',
        name: 'Rahul Sharma',
        email: 'rahul@railbite.in',
        phone: '+91 98765 43210',
        role: 'user',
        salt: userHash.salt,
        password_hash: userHash.hash,
        pnr: '2485961034',
        coach: 'B3',
        berth: '42',
        berth_type: 'LB',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString()
      });
    }

    // Seed default IRCTC station pantry admin if not present
    if (!this.data.users.some(u => u.email === 'admin@railbite.in')) {
      const adminHash = hashPassword('admin123');
      this.data.users.push({
        id: 'admin-001',
        name: 'Vikram Malhotra',
        email: 'admin@railbite.in',
        phone: '+91 99887 76655',
        role: 'admin',
        designation: 'IRCTC Station Pantry Officer',
        station_code: 'BRC',
        station_name: 'Vadodara Junction',
        salt: adminHash.salt,
        password_hash: adminHash.hash,
        permissions: ['manage_orders', 'manage_restaurants', 'manage_menu', 'view_analytics', 'dispatch_pantry', 'refund_control'],
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString()
      });
    }

    this.save();
  }

  save() {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Error saving database to disk:', err);
    }
  }

  // --- USERS & AUTH ---
  findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    return this.data.users.find(u => u.email.toLowerCase() === cleanEmail);
  }

  findUserById(id) {
    if (!id) return null;
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const { name, email, phone, password, role = 'user', coach, berth, pnr, designation, station_code, station_name } = userData;
    const cleanEmail = email.toLowerCase().trim();

    if (this.findUserByEmail(cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const { salt, hash } = hashPassword(password);
    const newUser = {
      id: (role === 'admin' ? 'admin-' : 'user-') + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      role: role === 'admin' ? 'admin' : 'user',
      salt,
      password_hash: hash,
      avatar: role === 'admin'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    };

    if (role === 'admin') {
      newUser.designation = designation || 'Station Pantry Supervisor';
      newUser.station_code = station_code || 'ALL';
      newUser.station_name = station_name || 'All Stations Hub';
      newUser.permissions = ['manage_orders', 'view_analytics', 'dispatch_pantry'];
    } else {
      newUser.pnr = pnr || '';
      newUser.coach = coach || '';
      newUser.berth = berth || '';
      newUser.berth_type = 'Seat';
    }

    this.data.users.push(newUser);
    this.save();

    // Return safe user object (excluding salt and hash)
    const { salt: s, password_hash: ph, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (!user) return null;

    if (updates.name) user.name = updates.name.trim();
    if (updates.phone) user.phone = updates.phone.trim();
    if (updates.coach) user.coach = updates.coach.trim();
    if (updates.berth) user.berth = updates.berth.trim();
    if (updates.pnr) user.pnr = updates.pnr.trim();
    if (updates.password) {
      const { salt, hash } = hashPassword(updates.password);
      user.salt = salt;
      user.password_hash = hash;
    }

    this.save();
    const { salt, password_hash, ...safeUser } = user;
    return safeUser;
  }

  getAllUsers() {
    return this.data.users.map(({ salt, password_hash, ...safeUser }) => safeUser);
  }

  // --- TRAINS & ROUTES ---
  getTrains(query = '') {
    if (!query) return this.data.trains;
    const q = query.toLowerCase().trim();
    return this.data.trains.filter(t => 
      t.train_no.toLowerCase().includes(q) || 
      t.name.toLowerCase().includes(q) ||
      t.source_station_name.toLowerCase().includes(q) ||
      t.dest_station_name.toLowerCase().includes(q) ||
      t.source_station_code.toLowerCase().includes(q) ||
      t.dest_station_code.toLowerCase().includes(q)
    );
  }

  getTrainByNo(trainNo) {
    return this.data.trains.find(t => t.train_no === String(trainNo));
  }

  getTrainSchedule(trainNo) {
    return this.data.train_schedules
      .filter(s => s.train_no === String(trainNo))
      .sort((a, b) => a.sequence - b.sequence);
  }

  // --- STATIONS ---
  getStations() {
    return this.data.stations;
  }

  getStationByCode(code) {
    if (!code) return null;
    return this.data.stations.find(s => s.code.toUpperCase() === code.toUpperCase());
  }

  // --- RESTAURANTS & MENUS ---
  getRestaurantsByStation(stationCode, filters = {}) {
    let list = this.data.restaurants.filter(r => r.station_code.toUpperCase() === stationCode.toUpperCase());
    
    if (filters.pure_veg === 'true' || filters.pure_veg === true) {
      list = list.filter(r => r.is_pure_veg === true);
    }
    if (filters.jain === 'true' || filters.jain === true) {
      list = list.filter(r => r.jain_available === true);
    }
    if (filters.min_rating) {
      const minRating = parseFloat(filters.min_rating);
      list = list.filter(r => r.rating >= minRating);
    }
    if (filters.cuisine) {
      const c = filters.cuisine.toLowerCase();
      list = list.filter(r => r.cuisine.toLowerCase().includes(c));
    }
    return list;
  }

  getRestaurantById(id) {
    return this.data.restaurants.find(r => r.id === id);
  }

  getMenuItemsByRestaurant(restaurantId, category = '') {
    let items = this.data.menu_items.filter(m => m.restaurant_id === restaurantId);
    if (category && category !== 'All') {
      items = items.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }
    return items;
  }

  getMenuItemById(id) {
    return this.data.menu_items.find(m => m.id === id);
  }

  // --- PNR RECORDS ---
  getPnr(pnrNumber) {
    const cleanPnr = String(pnrNumber).trim();
    return this.data.pnr_records.find(p => p.pnr === cleanPnr);
  }

  // --- COUPONS ---
  getCoupons() {
    return this.data.coupons.filter(c => c.is_active);
  }

  getCouponByCode(code) {
    if (!code) return null;
    return this.data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active);
  }

  // --- ORDERS ---
  createOrder(orderPayload) {
    const orderNumber = 'RB-' + Math.floor(100000 + Math.random() * 900000);
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    
    const newOrder = {
      id: 'ord-' + Date.now(),
      order_number: orderNumber,
      delivery_otp: otp,
      order_status: 'CONFIRMED',
      payment_status: orderPayload.payment_method === 'COD' ? 'PAY_ON_DELIVERY' : 'PAID',
      created_at: new Date().toISOString(),
      delivery_agent_name: 'Ramesh Kumar (IRCTC Delivery ID: #5821)',
      delivery_agent_phone: '+91 98765 43210',
      status_timeline: [
        { status: 'CONFIRMED', title: 'Order Confirmed', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), completed: true },
        { status: 'PREPARING', title: 'Cooking at Station Kitchen', time: 'In ~5 mins', completed: false },
        { status: 'PACKED', title: 'Thermal Sealed & Quality Checked', time: 'In ~15 mins', completed: false },
        { status: 'DISPATCHED', title: 'Delivery Executive on Platform', time: 'At Arrival Time', completed: false },
        { status: 'DELIVERED', title: 'Handed at Coach & Seat', time: 'Scheduled Halt', completed: false }
      ],
      ...orderPayload
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  getOrderById(orderId) {
    return this.data.orders.find(o => o.id === orderId || o.order_number === orderId);
  }

  getAllOrders() {
    return this.data.orders;
  }

  getOrdersByUser(userId, email = '', phone = '') {
    return this.data.orders.filter(o => 
      (userId && o.user_id === userId) ||
      (email && o.passenger_email && o.passenger_email.toLowerCase() === email.toLowerCase()) ||
      (phone && o.passenger_phone === phone)
    );
  }

  updateOrderStatus(orderId, status) {
    const order = this.data.orders.find(o => o.id === orderId || o.order_number === orderId);
    if (!order) return null;

    order.order_status = status;
    
    // Update timeline steps
    const statusOrder = ['CONFIRMED', 'PREPARING', 'PACKED', 'DISPATCHED', 'DELIVERED'];
    const targetIdx = statusOrder.indexOf(status);
    
    if (targetIdx !== -1) {
      order.status_timeline.forEach((step, idx) => {
        if (idx <= targetIdx) {
          step.completed = true;
          if (idx === targetIdx) {
            step.time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          }
        }
      });
    }

    if (status === 'DELIVERED') {
      order.payment_status = 'PAID';
    }

    this.save();
    return order;
  }

  getStats() {
    return {
      total_trains: this.data.trains.length,
      total_stations: this.data.stations.length,
      total_restaurants: this.data.restaurants.length,
      total_menu_items: this.data.menu_items.length,
      total_orders_placed: this.data.orders.length,
      active_coupons: this.data.coupons.length,
      total_users: this.data.users ? this.data.users.length : 0
    };
  }

  resetSeed() {
    if (fs.existsSync(SEED_PATH)) {
      const seedContent = fs.readFileSync(SEED_PATH, 'utf-8');
      this.data = JSON.parse(seedContent);
      if (!this.data.users) this.data.users = [];
      this.ensureSeedUsers();
      this.save();
      return true;
    }
    return false;
  }
}

export const db = new Database();
export default db;

