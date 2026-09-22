// RailBite - Core Application Controller with User & Admin Auth Support
import { API } from './api.js';
import { cart } from './cart.js';
import { tracker } from './tracker.js';
import { notifier } from './notifications.js';
import { auth } from './auth.js';

class RailBiteApp {
  constructor() {
    this.currentTrain = null;
    this.currentSchedule = [];
    this.selectedStation = null;
    this.restaurants = [];
    this.activeFilter = 'all';
    this.currentRestaurant = null;
    this.currentMenuItem = null;
    this.theme = localStorage.getItem('railbite_theme') || 'dark';

    // Auth & Admin state
    this.currentAuthRole = 'user';
    this.currentAuthMode = 'login';
    this.adminFilterStatus = 'ALL';
    this.allAdminOrders = [];

    this.init();
  }

  async init() {
    this.applyTheme(this.theme);
    this.bindEvents();
    
    // Initialize user auth session
    await auth.init();
    auth.onAuthStateChange((user, isLoggedIn) => this.renderAuthNav(user, isLoggedIn));

    // Auto load default popular train (Mumbai Rajdhani 12951)
    await this.loadTrainRoute('12951');
    this.loadCoupons();
    cart.updateCartUI();
  }

  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.theme);
      });
    }

    // Sound toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        notifier.soundEnabled = !notifier.soundEnabled;
        soundBtn.innerHTML = notifier.soundEnabled ? '🔔' : '🔕';
        notifier.showToast(notifier.soundEnabled ? 'Audio alerts enabled' : 'Audio alerts muted', 'info');
      });
    }

    // PNR Form Submit
    const pnrForm = document.getElementById('pnr-search-form');
    if (pnrForm) {
      pnrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pnrInput = document.getElementById('pnr-input');
        if (pnrInput && pnrInput.value) {
          this.searchPnr(pnrInput.value.trim());
        }
      });
    }

    // Train Form Submit
    const trainForm = document.getElementById('train-search-form');
    if (trainForm) {
      trainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const trainSelect = document.getElementById('train-select');
        if (trainSelect && trainSelect.value) {
          this.loadTrainRoute(trainSelect.value);
        }
      });
    }

    // Search Tabs (PNR vs Train)
    const tabPnr = document.getElementById('tab-btn-pnr');
    const tabTrain = document.getElementById('tab-btn-train');
    const formPnr = document.getElementById('pnr-form-container');
    const formTrain = document.getElementById('train-form-container');

    if (tabPnr && tabTrain) {
      tabPnr.addEventListener('click', () => {
        tabPnr.classList.add('active');
        tabTrain.classList.remove('active');
        formPnr.style.display = 'block';
        formTrain.style.display = 'none';
      });

      tabTrain.addEventListener('click', () => {
        tabTrain.classList.add('active');
        tabPnr.classList.remove('active');
        formTrain.style.display = 'block';
        formPnr.style.display = 'none';
      });
    }

    // Cart Drawer Toggle
    const cartToggle = document.getElementById('cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');

    if (cartToggle && cartDrawer) {
      cartToggle.addEventListener('click', () => cartDrawer.classList.add('open'));
    }
    if (closeCartBtn && cartDrawer) {
      closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));
    }

    // Quick PNR Sample chips
    document.querySelectorAll('.sample-pnr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pnr = btn.getAttribute('data-pnr');
        const pnrInput = document.getElementById('pnr-input');
        if (pnrInput) pnrInput.value = pnr;
        this.searchPnr(pnr);
      });
    });

    // Close user dropdown menu when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('user-dropdown-menu');
      const profileBtn = document.getElementById('user-profile-btn');
      if (dropdown && dropdown.style.display === 'block') {
        if (profileBtn && !profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      }
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('railbite_theme', theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // =========================================================================
  // AUTHENTICATION UI & INTERACTION CONTROLLER
  // =========================================================================

  renderAuthNav(user, isLoggedIn) {
    const navContainer = document.getElementById('auth-nav-container');
    if (!navContainer) return;

    if (!isLoggedIn || !user) {
      navContainer.innerHTML = `
        <button id="login-open-btn" class="nav-auth-btn" onclick="window.app.openAuthModal('user')">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span>Sign In</span>
        </button>
      `;
    } else if (user.role === 'admin') {
      navContainer.innerHTML = `
        <button id="user-profile-btn" class="nav-user-pill admin-pill" onclick="window.app.toggleUserDropdown(event)">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}" class="user-avatar-thumb admin-avatar-thumb" alt="Admin">
          <span>🛡️ ${user.name.split(' ')[0]} (IRCTC)</span>
          <span style="font-size: 0.65rem; color: var(--accent-cyan);">▼</span>
        </button>
        <div id="user-dropdown-menu" class="user-dropdown-menu" style="display: none;">
          <div class="user-dropdown-header">
            <div class="user-dropdown-name">${user.name}</div>
            <div class="user-dropdown-email">${user.email}</div>
            <span class="user-dropdown-role admin-role">🛡️ IRCTC Station Admin</span>
          </div>
          <button class="dropdown-item" onclick="window.app.switchView('admin'); window.app.closeUserDropdown();">
            <span>📊</span><span>Pantry Dispatch Console</span>
          </button>
          <button class="dropdown-item" onclick="window.app.openMyOrdersModal()">
            <span>📦</span><span>All Station Orders</span>
          </button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger-item" onclick="window.app.handleLogout()">
            <span>🚪</span><span>Admin Sign Out</span>
          </button>
        </div>
      `;
    } else {
      navContainer.innerHTML = `
        <button id="user-profile-btn" class="nav-user-pill" onclick="window.app.toggleUserDropdown(event)">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="user-avatar-thumb" alt="Passenger">
          <span>${user.name.split(' ')[0]}</span>
          <span style="font-size: 0.65rem; color: var(--text-muted);">▼</span>
        </button>
        <div id="user-dropdown-menu" class="user-dropdown-menu" style="display: none;">
          <div class="user-dropdown-header">
            <div class="user-dropdown-name">${user.name}</div>
            <div class="user-dropdown-email">${user.email}</div>
            <span class="user-dropdown-role">🟢 Passenger</span>
          </div>
          <button class="dropdown-item" onclick="window.app.openMyOrdersModal()">
            <span>📦</span><span>My Journey Orders</span>
          </button>
          <button class="dropdown-item" onclick="window.app.openProfileModal()">
            <span>👤</span><span>Profile & Berth</span>
          </button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger-item" onclick="window.app.handleLogout()">
            <span>🚪</span><span>Sign Out</span>
          </button>
        </div>
      `;
    }

    // If currently on admin view, re-check access
    const adminView = document.getElementById('admin-view');
    if (adminView && adminView.style.display === 'block') {
      this.loadAdminDashboard();
    }
  }

  toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) {
      menu.style.display = menu.style.display === 'none' || !menu.style.display ? 'block' : 'none';
    }
  }

  closeUserDropdown() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.style.display = 'none';
  }

  openAuthModal(role = 'user', mode = 'login') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    this.closeUserDropdown();
    this.setAuthRole(role);
    this.setAuthMode(mode);
    modal.classList.add('active');
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  }

  setAuthRole(role) {
    this.currentAuthRole = role;

    const userTab = document.getElementById('auth-role-user-btn');
    const adminTab = document.getElementById('auth-role-admin-btn');
    const titleEl = document.getElementById('auth-modal-title');
    const subtitleEl = document.getElementById('auth-modal-subtitle');
    const emailLabel = document.getElementById('login-email-label');
    const roleIndicator = document.getElementById('auth-role-indicator');
    const adminFields = document.getElementById('auth-reg-admin-fields');
    const passengerFields = document.getElementById('auth-reg-passenger-fields');
    const submitBtn = document.getElementById('auth-login-submit-btn');
    const demoBanner = document.querySelector('.auth-demo-banner');

    if (userTab) userTab.classList.toggle('active', role === 'user');
    if (adminTab) adminTab.classList.toggle('active', role === 'admin');

    if (role === 'admin') {
      if (titleEl) titleEl.textContent = 'Station Pantry & Admin Portal';
      if (subtitleEl) subtitleEl.textContent = 'Authorized IRCTC Station Masters & Kitchen Supervisors';
      if (emailLabel) emailLabel.textContent = 'Station Admin Email (e.g. admin@railbite.in) *';
      if (roleIndicator) {
        roleIndicator.textContent = 'Role: IRCTC Station Admin';
        roleIndicator.style.color = 'var(--accent-cyan)';
      }
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sign In to Station Dispatch ➔</span>';
        submitBtn.style.background = 'linear-gradient(135deg, var(--accent-cyan), #0891b2)';
        submitBtn.style.boxShadow = '0 4px 18px rgba(6, 182, 212, 0.35)';
      }
      if (adminFields) adminFields.style.display = 'block';
      if (passengerFields) passengerFields.style.display = 'none';
      if (demoBanner) demoBanner.classList.add('admin-mode');
    } else {
      if (titleEl) titleEl.textContent = 'Welcome to RailBite Passenger Portal';
      if (subtitleEl) subtitleEl.textContent = 'Sign in for seamless berth delivery, live tracking & orders';
      if (emailLabel) emailLabel.textContent = 'Email Address / Mobile Number *';
      if (roleIndicator) {
        roleIndicator.textContent = 'Role: Passenger';
        roleIndicator.style.color = 'var(--accent-orange)';
      }
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sign In to RailBite ➔</span>';
        submitBtn.style.background = 'linear-gradient(135deg, var(--accent-orange), #ff4d00)';
        submitBtn.style.boxShadow = '0 4px 18px var(--accent-orange-glow)';
      }
      if (adminFields) adminFields.style.display = 'none';
      if (passengerFields) passengerFields.style.display = 'block';
      if (demoBanner) demoBanner.classList.remove('admin-mode');
    }
  }

  setAuthMode(mode) {
    this.currentAuthMode = mode;

    const loginTab = document.getElementById('auth-mode-login-btn');
    const regTab = document.getElementById('auth-mode-register-btn');
    const loginForm = document.getElementById('auth-login-form');
    const regForm = document.getElementById('auth-register-form');

    if (loginTab) loginTab.classList.toggle('active', mode === 'login');
    if (regTab) regTab.classList.toggle('active', mode === 'register');

    if (mode === 'register') {
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'block';
    } else {
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
    }
  }

  fillDemoAuth(role) {
    this.setAuthRole(role);
    this.setAuthMode('login');

    const emailInput = document.getElementById('auth-login-email');
    const pwdInput = document.getElementById('auth-login-password');

    if (role === 'admin') {
      if (emailInput) emailInput.value = 'admin@railbite.in';
      if (pwdInput) pwdInput.value = 'admin123';
      notifier.showToast('Pre-filled Station Admin credentials (admin@railbite.in)', 'info');
    } else {
      if (emailInput) emailInput.value = 'rahul@railbite.in';
      if (pwdInput) pwdInput.value = 'user123';
      notifier.showToast('Pre-filled Passenger credentials (rahul@railbite.in)', 'info');
    }
  }

  togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      if (btnEl) btnEl.textContent = '🙈';
    } else {
      input.type = 'password';
      if (btnEl) btnEl.textContent = '👁️';
    }
  }

  async handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('auth-login-email')?.value.trim();
    const password = document.getElementById('auth-login-password')?.value;

    if (!email || !password) {
      notifier.showToast('Please enter your email and password', 'warning');
      return;
    }

    const res = await auth.login({
      email,
      password,
      role: this.currentAuthRole
    });

    if (res.success) {
      this.closeAuthModal();
      if (res.user.role === 'admin') {
        this.switchView('admin');
      }
    }
  }

  async handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('auth-reg-name')?.value.trim();
    const email = document.getElementById('auth-reg-email')?.value.trim();
    const phone = document.getElementById('auth-reg-phone')?.value.trim();
    const password = document.getElementById('auth-reg-password')?.value;
    const coach = document.getElementById('auth-reg-coach')?.value.trim();
    const berth = document.getElementById('auth-reg-berth')?.value.trim();
    const adminKey = document.getElementById('auth-reg-admin-key')?.value.trim();

    if (!name || !email || !password) {
      notifier.showToast('Please fill all required fields', 'warning');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      password,
      role: this.currentAuthRole,
      coach,
      berth
    };

    if (this.currentAuthRole === 'admin') {
      payload.admin_secret = adminKey;
    }

    const res = await auth.register(payload);
    if (res.success) {
      this.closeAuthModal();
      if (res.user.role === 'admin') {
        this.switchView('admin');
      }
    }
  }

  async handleLogout() {
    this.closeUserDropdown();
    const { wasAdmin } = await auth.logout();
    if (wasAdmin) {
      this.switchView('search');
    }
  }

  openProfileModal() {
    this.closeUserDropdown();
    const user = auth.getUser();
    if (!user) {
      this.openAuthModal('user');
      return;
    }

    const nameInput = document.getElementById('profile-name-input');
    const emailInput = document.getElementById('profile-email-input');
    const phoneInput = document.getElementById('profile-phone-input');
    const coachInput = document.getElementById('profile-coach-input');
    const berthInput = document.getElementById('profile-berth-input');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (coachInput) coachInput.value = user.coach || '';
    if (berthInput) berthInput.value = user.berth || '';

    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.add('active');
  }

  async handleProfileUpdate(event) {
    event.preventDefault();
    const name = document.getElementById('profile-name-input')?.value.trim();
    const phone = document.getElementById('profile-phone-input')?.value.trim();
    const coach = document.getElementById('profile-coach-input')?.value.trim();
    const berth = document.getElementById('profile-berth-input')?.value.trim();

    const res = await auth.updateProfile({ name, phone, coach, berth });
    if (res.success) {
      document.getElementById('profile-modal')?.classList.remove('active');
    }
  }

  async openMyOrdersModal() {
    this.closeUserDropdown();
    const modal = document.getElementById('my-orders-modal');
    if (!modal) return;

    modal.classList.add('active');
    await this.refreshMyOrders();
  }

  async refreshMyOrders() {
    const container = document.getElementById('my-orders-list-container');
    if (!container) return;

    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">📦 Loading journey orders...</div>`;

    try {
      let orders = [];
      if (auth.isAdmin()) {
        const res = await API.getAllOrders();
        orders = (res.success && res.data) ? res.data : [];
      } else if (auth.isLoggedIn()) {
        const res = await API.getMyOrders();
        orders = (res.success && res.data) ? res.data : [];
      } else {
        const res = await API.getAllOrders();
        orders = (res.success && res.data) ? res.data.slice(0, 3) : [];
      }

      if (orders.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <div style="font-size: 2.8rem; margin-bottom: 10px;">🍽️</div>
            <h3>No Orders Found</h3>
            <p style="margin-top: 6px;">You haven't placed any train food orders yet.</p>
            <button onclick="document.getElementById('my-orders-modal').classList.remove('active'); window.app.switchView('search');" style="margin-top: 18px; background: var(--accent-orange); color: white; padding: 10px 22px; border-radius: var(--radius-sm); font-weight: 700;">
              Order Food Now ➔
            </button>
          </div>
        `;
        return;
      }

      let html = '';
      orders.forEach(o => {
        const isDelivered = o.order_status === 'DELIVERED';
        html += `
          <div class="my-order-item-card">
            <div class="order-meta-header">
              <div>
                <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-orange);">Order #${o.order_number}</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 8px;">Train: <strong>${o.train_no}</strong> (${o.station_code})</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: var(--radius-full); background: ${isDelivered ? 'var(--accent-emerald)' : 'var(--accent-orange)'}; color: white;">
                  ${o.order_status}
                </span>
                <span style="font-size: 0.75rem; background: var(--bg-tertiary); padding: 3px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-weight: 700; color: var(--accent-cyan);">
                  OTP: ${o.delivery_otp || '----'}
                </span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <div>
                <div style="font-weight: 700; font-size: 0.95rem;">${o.restaurant_name}</div>
                <div style="font-size: 0.82rem; color: var(--text-secondary);">Berth: Coach <strong>${o.coach}</strong>, Seat <strong>${o.berth}</strong> • Passenger: ${o.passenger_name}</div>
              </div>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">
                ₹${o.total}
              </div>
            </div>

            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
              Items: ${o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button onclick="document.getElementById('my-orders-modal').classList.remove('active'); window.tracker.trackOrder('${o.id}'); window.app.switchView('live-tracker');" style="background: linear-gradient(135deg, var(--accent-orange), #ff4d00); color: white; border: none; padding: 6px 16px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; cursor: pointer;">
                Live Journey Tracker ➔
              </button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    } catch (err) {
      container.innerHTML = `<div style="text-align: center; color: var(--accent-red); padding: 20px;">Failed to load order history</div>`;
    }
  }

  // =========================================================================
  // VIEW SWITCHER & ROUTING
  // =========================================================================

  switchView(viewName) {
    this.closeUserDropdown();

    const views = ['search-view', 'menu-view', 'live-tracker-view', 'admin-view'];
    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) el.style.display = 'none';
    });

    const activeEl = document.getElementById(`${viewName}-view`);
    if (activeEl) {
      activeEl.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav button active states
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    if (viewName === 'admin') {
      this.loadAdminDashboard();
    }
  }

  async searchPnr(pnr) {
    notifier.showToast(`Fetching PNR #${pnr}...`, 'info');
    try {
      const res = await API.lookupPnr(pnr);
      if (res.success) {
        const data = res.data;
        cart.passengerDetails.pnr = data.pnr;
        cart.passengerDetails.name = data.passenger_name;
        cart.passengerDetails.phone = data.passenger_phone;
        cart.passengerDetails.coach = data.coach;
        cart.passengerDetails.berth = data.berth;

        this.renderPnrBanner(data);
        await this.loadTrainRoute(data.train_no);
        notifier.showToast(`PNR Verified! Seat: Coach ${data.coach}, Berth ${data.berth}`, 'success');
      } else {
        notifier.showToast(res.message || 'PNR not found', 'error');
      }
    } catch (err) {
      notifier.showToast('Failed to lookup PNR', 'error');
    }
  }

  renderPnrBanner(data) {
    const banner = document.getElementById('pnr-journey-banner');
    if (!banner) return;

    banner.style.display = 'flex';
    banner.innerHTML = `
      <div class="journey-train-meta">
        <span class="train-badge-pill">PNR: ${data.pnr}</span>
        <div>
          <h3 style="font-size: 1.15rem;">${data.passenger_name} • Coach ${data.coach}, Berth ${data.berth} (${data.berth_type})</h3>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">${data.boarding_station_name} ➔ ${data.destination_station_name} | ${data.journey_date}</div>
        </div>
      </div>
      <div class="journey-passenger-badge">
        <span>🟢 ${data.pnr_status}</span>
      </div>
    `;
  }

  async loadTrainRoute(trainNo) {
    try {
      const res = await API.getTrainByNo(trainNo);
      if (res.success) {
        this.currentTrain = res.data.train;
        this.currentSchedule = res.data.schedule;

        this.renderStationTimeline();

        // Select the first major catering station by default
        const cateringStation = this.currentSchedule.find(s => s.available_restaurants_count > 0) || this.currentSchedule[1] || this.currentSchedule[0];
        if (cateringStation) {
          this.selectStation(cateringStation.station_code);
        }
      }
    } catch (err) {
      notifier.showToast('Failed to load train route', 'error');
    }
  }

  renderStationTimeline() {
    const container = document.getElementById('route-stations-track');
    const trainTitleEl = document.getElementById('current-train-name-badge');
    if (!container) return;

    if (trainTitleEl && this.currentTrain) {
      trainTitleEl.textContent = `${this.currentTrain.train_no} - ${this.currentTrain.name}`;
    }

    let html = '';
    this.currentSchedule.forEach((stop, idx) => {
      const isSelected = this.selectedStation && this.selectedStation.code === stop.station_code;

      html += `
        <div class="station-node-card ${isSelected ? 'selected' : ''}" onclick="window.app.selectStation('${stop.station_code}')">
          <div class="station-header-row">
            <span class="station-code-badge">${stop.station_code}</span>
            <span class="station-platform-badge">Platform #${stop.platform_no || 1}</span>
          </div>
          <div class="station-name-text">${stop.station_name}</div>
          <div class="station-timing-row">
            <span>Arrival: <strong class="timing-val">${stop.arrival_time}</strong></span>
            <span>Halt: <strong class="timing-val">${stop.halt_minutes}m</strong></span>
          </div>
          <div class="order-cutoff-pill">
            <span>⚡ ${stop.available_restaurants_count || 3} Approved Kitchens</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  async selectStation(stationCode) {
    const stationSchedule = this.currentSchedule.find(s => s.station_code === stationCode);
    this.selectedStation = {
      code: stationCode,
      name: stationSchedule ? stationSchedule.station_name : stationCode,
      platform: stationSchedule ? stationSchedule.platform_no : 1,
      arrival: stationSchedule ? stationSchedule.arrival_time : 'On Time'
    };

    cart.selectedStation = this.selectedStation;
    cart.selectedTrain = this.currentTrain;

    this.renderStationTimeline();
    await this.loadRestaurants(stationCode);

    const bannerStation = document.getElementById('selected-station-header-text');
    if (bannerStation) {
      bannerStation.textContent = `Restaurants delivering at ${this.selectedStation.name} (${this.selectedStation.code}) • Platform #${this.selectedStation.platform}`;
    }
  }

  async loadRestaurants(stationCode, filters = {}) {
    const grid = document.getElementById('restaurants-grid');
    if (!grid) return;

    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">🍽️ Loading fresh station kitchens...</div>`;

    try {
      const res = await API.getRestaurants(stationCode, filters);
      if (res.success) {
        this.restaurants = res.data;
        this.renderRestaurants();
      }
    } catch (err) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--accent-red);">Failed to load restaurants</div>`;
    }
  }

  setFilter(filterType) {
    this.activeFilter = filterType;
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-filter') === filterType);
    });

    const filters = {};
    if (filterType === 'veg') filters.pure_veg = true;
    if (filterType === 'jain') filters.jain = true;
    if (filterType === 'rating') filters.min_rating = 4.8;
    if (filterType === 'thali') filters.cuisine = 'Thali';
    if (filterType === 'pizza') filters.cuisine = 'Pizza';

    if (this.selectedStation) {
      this.loadRestaurants(this.selectedStation.code, filters);
    }
  }

  renderRestaurants() {
    const grid = document.getElementById('restaurants-grid');
    if (!grid) return;

    if (this.restaurants.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <div style="font-size: 3rem;">🔍</div>
          <h3>No restaurants match this filter</h3>
          <p>Try selecting 'All Restaurants' or picking another upcoming station on your route.</p>
        </div>
      `;
      return;
    }

    let html = '';
    this.restaurants.forEach(rest => {
      html += `
        <div class="restaurant-card">
          <div class="rest-img-wrapper">
            <img src="${rest.image}" alt="${rest.name}" class="rest-img">
            <div class="rest-badges">
              <span class="badge-irctc">✓ IRCTC Approved</span>
              ${rest.is_pure_veg ? '<span class="badge-veg-tag">Pure Veg</span>' : ''}
              ${rest.jain_available ? '<span class="badge-jain-tag">Jain Satvik</span>' : ''}
            </div>
            <div class="rest-rating-pill">
              ★ ${rest.rating}
            </div>
          </div>
          <div class="rest-body">
            <h3 class="rest-title">${rest.name}</h3>
            <p class="rest-cuisine">${rest.cuisine}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">${rest.tagline || 'Spill-proof sealed meal delivered to your seat'}</p>
            
            <div class="rest-meta-row">
              <div class="rest-meta-item">⏱️ ${rest.delivery_time_mins}m Prep</div>
              <div class="rest-meta-item">🛡️ ${rest.hygiene_score} Hygiene</div>
              <div class="rest-meta-item" style="margin-left: auto;">
                <button onclick="window.app.openRestaurantMenu('${rest.id}')" style="background: var(--accent-orange); color: white; padding: 6px 14px; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.85rem;">
                  View Menu ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  async openRestaurantMenu(restaurantId) {
    try {
      const res = await API.getRestaurantDetails(restaurantId);
      if (res.success) {
        this.currentRestaurant = res.data.restaurant;
        this.currentMenu = res.data.menu || [];
        const categories = res.data.categories;

        this.renderRestaurantMenuView(this.currentRestaurant, this.currentMenu, categories);
        this.switchView('menu');
      }
    } catch (err) {
      notifier.showToast('Failed to load menu', 'error');
    }
  }

  renderRestaurantMenuView(rest, menu, categories) {
    const container = document.getElementById('menu-view');
    if (!container) return;

    let categoriesNav = `<button class="filter-chip active" onclick="window.app.filterMenuCategory('All')">All Items (${menu.length})</button>`;
    Object.keys(categories).forEach(cat => {
      categoriesNav += `<button class="filter-chip" onclick="window.app.filterMenuCategory('${cat}')">${cat} (${categories[cat].length})</button>`;
    });

    let menuCardsHtml = '';
    menu.forEach(item => {
      let typeClass = item.is_jain ? 'jain' : (item.is_veg ? 'veg' : 'nonveg');
      const cartItem = cart.items.find(i => i.id === item.id);
      const qty = cartItem ? cartItem.quantity : 0;

      menuCardsHtml += `
        <div class="menu-item-card" data-category="${item.category}">
          <div class="item-left">
            <span class="item-type-icon ${typeClass}"></span>
            ${item.is_bestseller ? '<span style="font-size: 0.65rem; font-weight: 800; color: var(--accent-orange); text-transform: uppercase;">★ Bestseller</span>' : ''}
            <div class="item-name">${item.name}</div>
            <div class="item-price-row">
              <span class="current-price">₹${item.price}</span>
              ${item.original_price ? `<span class="original-price">₹${item.original_price}</span>` : ''}
            </div>
            <p class="item-desc">${item.description || ''}</p>
          </div>
          <div class="item-right">
            <img src="${item.image}" alt="${item.name}" class="item-thumb">
            <div style="margin-top: 24px;">
              ${item.customizations && Object.keys(item.customizations).length > 0
                ? `<button onclick="window.app.openCustomizerModal('${item.id}')" class="add-btn">ADD +</button>`
                : (qty > 0 
                    ? `<div class="qty-control-group">
                        <button onclick="window.cart.updateQuantity(${cart.items.indexOf(cartItem)}, -1)" class="qty-btn">-</button>
                        <span class="qty-number">${qty}</span>
                        <button onclick="window.cart.updateQuantity(${cart.items.indexOf(cartItem)}, 1)" class="qty-btn">+</button>
                      </div>`
                    : `<button onclick="window.app.quickAddItem('${item.id}')" class="add-btn">ADD +</button>`
                  )
              }
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="container" style="padding-top: 20px;">
        <button onclick="window.app.switchView('search')" style="display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 700; margin-bottom: 20px; font-size: 0.95rem;">
          ← Back to Stations & Kitchens
        </button>

        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 28px; display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
          <img src="${rest.image}" alt="${rest.name}" style="width: 120px; height: 120px; border-radius: var(--radius-md); object-fit: cover;">
          <div style="flex: 1;">
            <div style="display: flex; gap: 8px; margin-bottom: 6px;">
              <span class="badge-irctc">✓ IRCTC Verified</span>
              ${rest.is_pure_veg ? '<span class="badge-veg-tag">Pure Veg</span>' : ''}
              ${rest.jain_available ? '<span class="badge-jain-tag">Jain Options</span>' : ''}
            </div>
            <h1 style="font-size: 2rem; margin-bottom: 6px;">${rest.name}</h1>
            <p style="color: var(--text-secondary);">${rest.cuisine} • ${rest.tagline || ''}</p>
            <div style="display: flex; gap: 16px; margin-top: 12px; font-size: 0.9rem; color: var(--text-muted);">
              <span>⭐ <strong>${rest.rating}</strong> (${rest.reviews_count}+ reviews)</span>
              <span>🛡️ <strong>${rest.hygiene_score}</strong> Hygiene Audit</span>
              <span>⚡ Delivering at Platform #${this.selectedStation ? this.selectedStation.platform : 2}</span>
            </div>
          </div>
        </div>

        <div class="filters-bar" style="margin-bottom: 24px;">
          ${categoriesNav}
        </div>

        <div class="menu-grid" id="menu-items-grid">
          ${menuCardsHtml}
        </div>
      </div>
    `;
  }

  filterMenuCategory(cat) {
    document.querySelectorAll('#menu-view .filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.textContent.includes(cat));
    });

    document.querySelectorAll('.menu-item-card').forEach(card => {
      if (cat === 'All' || card.getAttribute('data-category') === cat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  getItemById(itemId) {
    if (this.currentMenu) {
      const found = this.currentMenu.find(i => i.id === itemId);
      if (found) return found;
    }
    return null;
  }

  quickAddItem(itemId) {
    const item = this.getItemById(itemId);
    if (item && this.currentRestaurant) {
      cart.addItem(item, this.currentRestaurant);
      this.openRestaurantMenu(this.currentRestaurant.id);
    }
  }

  openCustomizerModal(itemId) {
    const item = this.getItemById(itemId);
    if (!item) return;

    this.currentMenuItem = item;
    const modal = document.getElementById('customizer-modal');
    const content = document.getElementById('customizer-modal-content');
    if (!modal || !content) return;

    let customizationsHtml = '';
    if (item.customizations) {
      Object.keys(item.customizations).forEach(groupKey => {
        const options = item.customizations[groupKey];
        customizationsHtml += `
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 8px; text-transform: capitalize; color: var(--text-primary);">
              Choose ${groupKey}:
            </label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${options.map((opt, i) => `
                <label style="display: flex; align-items: center; gap: 10px; background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); cursor: pointer; border: 1px solid var(--border-color);">
                  <input type="radio" name="custom_${groupKey}" value="${opt}" ${i === 0 ? 'checked' : ''} style="accent-color: var(--accent-orange);">
                  <span style="font-size: 0.9rem;">${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      });
    }

    content.innerHTML = `
      <div style="display: flex; gap: 16px; margin-bottom: 20px; align-items: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; border-radius: var(--radius-sm); object-fit: cover;">
        <div>
          <h3 style="font-size: 1.2rem;">${item.name}</h3>
          <div style="font-weight: 800; font-size: 1.1rem; color: var(--accent-orange);">₹${item.price}</div>
        </div>
      </div>
      ${customizationsHtml}
      <button onclick="window.app.confirmCustomization()" style="width: 100%; padding: 12px; background: var(--accent-orange); color: white; font-weight: 800; border-radius: var(--radius-sm); font-size: 1rem; margin-top: 12px; box-shadow: 0 4px 15px var(--accent-orange-glow);">
        Add to Cart (₹${item.price})
      </button>
    `;

    modal.classList.add('active');
  }

  confirmCustomization() {
    if (!this.currentMenuItem || !this.currentRestaurant) return;

    const customization = {};
    if (this.currentMenuItem.customizations) {
      Object.keys(this.currentMenuItem.customizations).forEach(groupKey => {
        const checked = document.querySelector(`input[name="custom_${groupKey}"]:checked`);
        if (checked) {
          customization[groupKey] = checked.value;
        }
      });
    }

    cart.addItem(this.currentMenuItem, this.currentRestaurant, customization);
    document.getElementById('customizer-modal').classList.remove('active');
    this.openRestaurantMenu(this.currentRestaurant.id);
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    // Close drawer
    const drawer = document.getElementById('cart-drawer');
    if (drawer) drawer.classList.remove('open');

    // Populate passenger details from logged in user if available
    const user = auth.getUser();
    const coachInput = document.getElementById('checkout-coach');
    const berthInput = document.getElementById('checkout-berth');
    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');

    if (coachInput) coachInput.value = (user && user.coach) || cart.passengerDetails.coach || 'B3';
    if (berthInput) berthInput.value = (user && user.berth) || cart.passengerDetails.berth || 42;
    if (nameInput) nameInput.value = (user && user.name) || cart.passengerDetails.name || 'Rahul Sharma';
    if (phoneInput) phoneInput.value = (user && user.phone) || cart.passengerDetails.phone || '+91 98765 43210';

    this.renderCheckoutBill();
    modal.classList.add('active');
  }

  renderCheckoutBill() {
    const calcs = cart.getCalculations();
    const subtotalEl = document.getElementById('checkout-subtotal');
    const taxEl = document.getElementById('checkout-tax');
    const discountEl = document.getElementById('checkout-discount');
    const discountRow = document.getElementById('checkout-discount-row');
    const totalEl = document.getElementById('checkout-total');

    if (subtotalEl) subtotalEl.textContent = `₹${calcs.subtotal}`;
    if (taxEl) taxEl.textContent = `₹${calcs.tax}`;
    if (totalEl) totalEl.textContent = `₹${calcs.total}`;

    if (discountRow && discountEl) {
      if (calcs.discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-₹${calcs.discount}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  }

  async processOrder() {
    const coach = document.getElementById('checkout-coach').value.trim();
    const berth = document.getElementById('checkout-berth').value.trim();
    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const note = document.getElementById('checkout-note')?.value.trim() || '';
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'UPI';

    if (!coach || !berth || !name || !phone) {
      notifier.showToast('Please fill all required seat delivery details', 'warning');
      return;
    }

    const user = auth.getUser();
    const payload = {
      user_id: user ? user.id : null,
      passenger_email: user ? user.email : '',
      pnr: cart.passengerDetails.pnr || '2485961034',
      train_no: cart.selectedTrain ? cart.selectedTrain.train_no : '12951',
      train_name: cart.selectedTrain ? cart.selectedTrain.name : 'Rajdhani Express',
      station_code: cart.selectedStation ? cart.selectedStation.code : 'BRC',
      station_name: cart.selectedStation ? cart.selectedStation.name : 'Vadodara Junction',
      platform_no: cart.selectedStation ? cart.selectedStation.platform : 2,
      coach,
      berth,
      passenger_name: name,
      passenger_phone: phone,
      delivery_note: note,
      restaurant_id: cart.items[0]?.restaurant_id || 'rest-brc-01',
      restaurant_name: cart.items[0]?.restaurant_name || 'Station Kitchen',
      items: cart.items,
      payment_method: paymentMethod,
      coupon_applied: cart.appliedCoupon
    };

    notifier.showToast('Placing seat delivery order with Station Kitchen...', 'info');

    try {
      const res = await API.createOrder(payload);
      if (res.success) {
        const order = res.data;
        cart.clearCart();
        document.getElementById('checkout-modal').classList.remove('active');
        
        notifier.showToast('Order confirmed! Tracking live train delivery...', 'success');
        notifier.playChime('success');

        await tracker.trackOrder(order.id);
        this.switchView('live-tracker');
      } else {
        notifier.showToast(res.message || 'Failed to place order', 'error');
      }
    } catch (err) {
      notifier.showToast('Network error while placing order', 'error');
    }
  }

  async loadCoupons() {
    try {
      const res = await API.getCoupons();
      if (res.success && res.data) {
        const container = document.getElementById('coupons-list');
        if (!container) return;

        let html = '';
        res.data.forEach(c => {
          html += `
            <div style="background: var(--bg-tertiary); border: 1px dashed var(--accent-orange); border-radius: var(--radius-sm); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div>
                <div style="font-weight: 800; color: var(--accent-orange); font-size: 0.95rem;">${c.code}</div>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">${c.description}</div>
              </div>
              <button onclick="window.cart.applyCoupon('${c.code}')" style="background: var(--accent-orange); color: white; padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 700;">
                Apply
              </button>
            </div>
          `;
        });
        container.innerHTML = html;
      }
    } catch (e) {
      console.warn('Coupons fetch error:', e);
    }
  }

  // =========================================================================
  // ADMIN & STATION PANTRY CONTROLLER
  // =========================================================================

  async loadAdminDashboard() {
    const gateContainer = document.getElementById('admin-gate-container');
    const authorizedContainer = document.getElementById('admin-authorized-container');
    const container = document.getElementById('admin-orders-table-body');
    const statsContainer = document.getElementById('admin-stats-overview');
    const supervisorGreeting = document.getElementById('admin-supervisor-greeting');

    // Role Gate Check: If not logged in as Admin, display Gate screen
    if (!auth.isAdmin()) {
      if (gateContainer) gateContainer.style.display = 'block';
      if (authorizedContainer) authorizedContainer.style.display = 'none';
      return;
    } else {
      if (gateContainer) gateContainer.style.display = 'none';
      if (authorizedContainer) authorizedContainer.style.display = 'block';
    }

    const adminUser = auth.getUser();
    if (supervisorGreeting && adminUser) {
      supervisorGreeting.textContent = `Logged in as IRCTC Station Supervisor: ${adminUser.name} (${adminUser.station_name || 'Vadodara Hub'})`;
    }

    if (!container) return;
    container.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;">Loading live station orders...</td></tr>`;

    try {
      const [ordersRes, statsRes] = await Promise.all([API.getAllOrders(), API.getStats()]);

      if (statsRes.success && statsContainer) {
        const s = statsRes.data;
        statsContainer.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
              <div style="color: var(--text-muted); font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Total Orders</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-orange);">${s.total_orders_placed || 0}</div>
            </div>
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
              <div style="color: var(--text-muted); font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Active Trains</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-cyan);">${s.total_trains || 6}</div>
            </div>
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
              <div style="color: var(--text-muted); font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Station Kitchens</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-emerald);">${s.total_restaurants || 12}</div>
            </div>
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
              <div style="color: var(--text-muted); font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Registered Users</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-gold);">${s.total_users || 2}</div>
            </div>
          </div>
        `;
      }

      if (ordersRes.success && ordersRes.data) {
        this.allAdminOrders = ordersRes.data;
        this.renderAdminOrdersTable();
      }
    } catch (err) {
      container.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--accent-red); padding: 20px;">Failed to load orders</td></tr>`;
    }
  }

  filterAdminOrders(status) {
    this.adminFilterStatus = status;
    document.querySelectorAll('#admin-view .filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.textContent.includes(status) || (status === 'ALL' && chip.textContent.includes('All')));
    });
    this.renderAdminOrdersTable();
  }

  renderAdminOrdersTable() {
    const container = document.getElementById('admin-orders-table-body');
    if (!container) return;

    let orders = this.allAdminOrders;
    if (this.adminFilterStatus !== 'ALL') {
      orders = orders.filter(o => o.order_status === this.adminFilterStatus);
    }

    if (orders.length === 0) {
      container.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">No orders matching filter "${this.adminFilterStatus}".</td></tr>`;
      return;
    }

    let html = '';
    orders.forEach(o => {
      const isDelivered = o.order_status === 'DELIVERED';
      html += `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 12px; font-weight: 800; color: var(--accent-orange);">${o.order_number}</td>
          <td style="padding: 12px;"><strong>${o.train_no}</strong> (${o.station_code})<br><span style="font-size: 0.78rem; color: var(--text-muted);">${o.station_name}</span></td>
          <td style="padding: 12px;">Coach <strong>${o.coach}</strong>, Seat <strong>${o.berth}</strong><br><span style="font-size: 0.8rem; color: var(--text-secondary);">${o.passenger_name} (${o.passenger_phone})</span></td>
          <td style="padding: 12px;">${o.restaurant_name} <br><span style="font-size: 0.75rem; color: var(--text-muted);">(${o.items.length} items)</span></td>
          <td style="padding: 12px; font-weight: 800; color: var(--text-primary);">₹${o.total}</td>
          <td style="padding: 12px;"><span style="background: var(--bg-tertiary); padding: 4px 8px; border-radius: var(--radius-sm); font-family: monospace; font-weight: 700; color: var(--accent-cyan);">${o.delivery_otp || '----'}</span></td>
          <td style="padding: 12px;">
            <span style="font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: var(--radius-full); background: ${isDelivered ? 'var(--accent-emerald)' : 'var(--accent-orange)'}; color: white;">
              ${o.order_status}
            </span>
          </td>
          <td style="padding: 12px;">
            <select onchange="window.app.updateAdminOrderStatus('${o.id}', this.value)" style="background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 4px 8px; font-size: 0.8rem;">
              <option value="CONFIRMED" ${o.order_status === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
              <option value="PREPARING" ${o.order_status === 'PREPARING' ? 'selected' : ''}>Cooking</option>
              <option value="PACKED" ${o.order_status === 'PACKED' ? 'selected' : ''}>Packed & Sealed</option>
              <option value="DISPATCHED" ${o.order_status === 'DISPATCHED' ? 'selected' : ''}>Runner on Platform</option>
              <option value="DELIVERED" ${o.order_status === 'DELIVERED' ? 'selected' : ''}>Delivered at Seat</option>
            </select>
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;
  }

  async updateAdminOrderStatus(orderId, newStatus) {
    notifier.showToast(`Updating Order status to ${newStatus}...`, 'info');
    try {
      const res = await API.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        notifier.showToast(`Order status updated to ${newStatus}!`, 'success');
        notifier.playChime('success');
        await this.loadAdminDashboard();
      } else {
        notifier.showToast(res.message || 'Failed to update order status', 'error');
      }
    } catch (err) {
      notifier.showToast('Network error updating status', 'error');
    }
  }
}

export const app = new RailBiteApp();
window.app = app;
