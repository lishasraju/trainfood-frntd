// RailBite - Client Authentication & User Session Manager
import { API } from './api.js';
import { notifier } from './notifications.js';

const TOKEN_KEY = 'railbite_auth_token';
const USER_KEY = 'railbite_auth_user';

class AuthManager {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || null;
    this.currentUser = null;
    this.listeners = [];

    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    } catch (e) {
      this.currentUser = null;
    }
  }

  async init() {
    if (this.token) {
      try {
        const res = await API.getMe();
        if (res.success && res.user) {
          this.currentUser = res.user;
          localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
          this.notifyAuthStateChange();
        } else {
          this.logout(false);
        }
      } catch (err) {
        console.warn('Session verification failed, keeping cached profile if offline');
      }
    }
  }

  isLoggedIn() {
    return !!this.token && !!this.currentUser;
  }

  isAdmin() {
    return this.isLoggedIn() && this.currentUser.role === 'admin';
  }

  getUser() {
    return this.currentUser;
  }

  getToken() {
    return this.token;
  }

  onAuthStateChange(callback) {
    this.listeners.push(callback);
    // Trigger immediately with current state
    callback(this.currentUser, this.isLoggedIn());
  }

  notifyAuthStateChange() {
    this.listeners.forEach(cb => {
      try {
        cb(this.currentUser, this.isLoggedIn());
      } catch (err) {
        console.error('Error in auth state listener:', err);
      }
    });
  }

  async login({ email, password, role = 'user' }) {
    try {
      notifier.showToast(`Authenticating ${role === 'admin' ? 'Station Admin' : 'Passenger'} credentials...`, 'info');
      const res = await API.login({ email, password, role });

      if (res.success) {
        this.token = res.token;
        this.currentUser = res.user;

        localStorage.setItem(TOKEN_KEY, this.token);
        localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));

        this.notifyAuthStateChange();
        notifier.showToast(res.message || 'Logged in successfully!', 'success');
        notifier.playChime('success');
        return { success: true, user: this.currentUser };
      } else {
        notifier.showToast(res.message || 'Authentication failed', 'error');
        return { success: false, message: res.message };
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error during authentication';
      notifier.showToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }
  }

  async register(formData) {
    try {
      notifier.showToast('Creating RailBite account...', 'info');
      const res = await API.register(formData);

      if (res.success) {
        this.token = res.token;
        this.currentUser = res.user;

        localStorage.setItem(TOKEN_KEY, this.token);
        localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));

        this.notifyAuthStateChange();
        notifier.showToast(res.message || 'Account registered successfully!', 'success');
        notifier.playChime('success');
        return { success: true, user: this.currentUser };
      } else {
        notifier.showToast(res.message || 'Registration failed', 'error');
        return { success: false, message: res.message };
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error during registration';
      notifier.showToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }
  }

  async logout(showNotification = true) {
    try {
      if (this.token) {
        await API.logout();
      }
    } catch (e) {
      // Ignore network errors on logout
    }

    const wasAdmin = this.isAdmin();
    this.token = null;
    this.currentUser = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    this.notifyAuthStateChange();

    if (showNotification) {
      notifier.showToast('You have been logged out securely.', 'info');
    }

    return { success: true, wasAdmin };
  }

  async updateProfile(profileData) {
    try {
      const res = await API.updateProfile(profileData);
      if (res.success) {
        this.currentUser = res.user;
        localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
        this.notifyAuthStateChange();
        notifier.showToast('Profile updated successfully!', 'success');
        return { success: true, user: this.currentUser };
      } else {
        notifier.showToast(res.message || 'Update failed', 'error');
        return { success: false, message: res.message };
      }
    } catch (err) {
      notifier.showToast('Network error updating profile', 'error');
      return { success: false, message: err.message };
    }
  }
}

export const auth = new AuthManager();
window.auth = auth;
