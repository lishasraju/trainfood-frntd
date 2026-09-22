// RailBite - Shopping Cart & Checkout State Manager
import { notifier } from './notifications.js';
import { API } from './api.js';

class CartManager {
  constructor() {
    this.items = [];
    this.appliedCoupon = null;
    this.discountAmount = 0;
    this.selectedStation = null;
    this.selectedTrain = null;
    this.passengerDetails = {
      pnr: '',
      name: '',
      phone: '',
      coach: 'B3',
      berth: 42,
      berthType: 'LB',
      deliveryNote: ''
    };
    this.loadCart();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('railbite_cart');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveCart() {
    localStorage.setItem('railbite_cart', JSON.stringify(this.items));
    this.updateCartUI();
  }

  addItem(item, restaurant, customization = null) {
    // If cart has items from a different restaurant or station, ask or reset
    if (this.items.length > 0 && this.items[0].restaurant_id !== restaurant.id) {
      if (confirm(`Your cart contains items from "${this.items[0].restaurant_name}". Would you like to clear your cart to add items from "${restaurant.name}"?`)) {
        this.items = [];
      } else {
        return false;
      }
    }

    const customKey = customization ? JSON.stringify(customization) : '';
    const existing = this.items.find(i => i.id === item.id && i.customKey === customKey);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        is_veg: item.is_veg,
        is_jain: item.is_jain,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        station_code: restaurant.station_code,
        customization,
        customKey,
        quantity: 1
      });
    }

    this.saveCart();
    notifier.showToast(`Added "${item.name}" to cart!`, 'success');
    return true;
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
        notifier.showToast('Item removed from cart', 'info');
      }
      this.saveCart();
    }
  }

  removeItem(index) {
    if (this.items[index]) {
      this.items.splice(index, 1);
      this.saveCart();
      notifier.showToast('Item removed from cart', 'info');
    }
  }

  clearCart() {
    this.items = [];
    this.appliedCoupon = null;
    this.discountAmount = 0;
    this.saveCart();
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  async applyCoupon(code) {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) {
      notifier.showToast('Add items to cart before applying coupon', 'warning');
      return false;
    }

    try {
      const res = await API.validateCoupon(code, subtotal);
      if (res.success) {
        this.appliedCoupon = res.data.code;
        this.discountAmount = res.data.discount;
        notifier.showToast(res.message, 'success');
        this.updateCartUI();
        return true;
      } else {
        notifier.showToast(res.message || 'Invalid coupon', 'error');
        return false;
      }
    } catch (err) {
      notifier.showToast('Failed to validate coupon', 'error');
      return false;
    }
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.discountAmount = 0;
    this.updateCartUI();
    notifier.showToast('Coupon removed', 'info');
  }

  getCalculations() {
    const subtotal = this.getSubtotal();
    const discount = this.discountAmount;
    const tax = Math.round((subtotal - discount) * 0.05); // 5% GST
    const packagingFee = subtotal > 0 ? 15 : 0;
    const deliveryFee = 0; // Free berth delivery
    const total = Math.max(0, subtotal - discount + tax + packagingFee + deliveryFee);

    return {
      subtotal,
      discount,
      tax,
      packagingFee,
      deliveryFee,
      total,
      itemCount: this.items.reduce((sum, i) => sum + i.quantity, 0)
    };
  }

  updateCartUI() {
    const badge = document.getElementById('nav-cart-count');
    const calcs = this.getCalculations();

    if (badge) {
      badge.textContent = calcs.itemCount;
      badge.style.display = calcs.itemCount > 0 ? 'flex' : 'none';
    }

    const drawerBody = document.getElementById('cart-drawer-items');
    const drawerFooter = document.getElementById('cart-drawer-footer');

    if (!drawerBody) return;

    if (this.items.length === 0) {
      drawerBody.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <div style="font-size: 3.5rem; margin-bottom: 16px;">🍱</div>
          <h3 style="margin-bottom: 8px; color: var(--text-primary);">Your Cart is Empty</h3>
          <p style="font-size: 0.9rem;">Select your upcoming station & pick delicious meals for your journey!</p>
        </div>
      `;
      if (drawerFooter) drawerFooter.style.display = 'none';
      return;
    }

    if (drawerFooter) drawerFooter.style.display = 'block';

    let html = '';
    this.items.forEach((item, idx) => {
      let customText = '';
      if (item.customization) {
        customText = Object.values(item.customization).filter(Boolean).join(', ');
      }

      html += `
        <div style="display: flex; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); align-items: center;">
          <img src="${item.image}" alt="${item.name}" style="width: 54px; height: 54px; border-radius: var(--radius-sm); object-fit: cover;">
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.95rem; line-height: 1.2;">${item.name}</div>
            ${customText ? `<div style="font-size: 0.75rem; color: var(--accent-orange); margin-top: 2px;">${customText}</div>` : ''}
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">₹${item.price} each</div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; background: var(--bg-tertiary); border-radius: var(--radius-sm); padding: 2px 6px;">
            <button onclick="window.cart.updateQuantity(${idx}, -1)" style="color: var(--text-primary); font-weight: 800; padding: 2px 6px;">-</button>
            <span style="font-weight: 700; font-size: 0.9rem;">${item.quantity}</span>
            <button onclick="window.cart.updateQuantity(${idx}, 1)" style="color: var(--text-primary); font-weight: 800; padding: 2px 6px;">+</button>
          </div>
          <div style="font-weight: 800; min-width: 50px; text-align: right; color: var(--accent-orange);">
            ₹${item.price * item.quantity}
          </div>
        </div>
      `;
    });

    drawerBody.innerHTML = html;

    // Update Drawer Summary Values
    const subtotalEl = document.getElementById('drawer-subtotal');
    const taxEl = document.getElementById('drawer-tax');
    const discountRow = document.getElementById('drawer-discount-row');
    const discountEl = document.getElementById('drawer-discount');
    const totalEl = document.getElementById('drawer-total');

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
}

export const cart = new CartManager();
window.cart = cart;
