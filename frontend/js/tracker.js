// RailBite - Live Train & Order Tracker Engine
import { API } from './api.js';
import { notifier } from './notifications.js';

class OrderTracker {
  constructor() {
    this.currentOrder = null;
    this.pollInterval = null;
  }

  async trackOrder(orderId) {
    try {
      const res = await API.getOrder(orderId);
      if (res.success) {
        this.currentOrder = res.data;
        this.renderTrackerUI();
      } else {
        notifier.showToast('Order not found', 'error');
      }
    } catch (err) {
      notifier.showToast('Failed to fetch tracking details', 'error');
    }
  }

  async advanceStatus(nextStatus) {
    if (!this.currentOrder) return;
    try {
      const res = await API.updateOrderStatus(this.currentOrder.id, nextStatus);
      if (res.success) {
        this.currentOrder = res.data;
        this.renderTrackerUI();
        notifier.showToast(`Order status updated to: ${nextStatus}!`, 'success');
        if (nextStatus === 'DELIVERED') {
          notifier.playChime('train-whistle');
        }
      }
    } catch (err) {
      notifier.showToast('Failed to update status', 'error');
    }
  }

  renderTrackerUI() {
    const trackerContainer = document.getElementById('live-tracker-view');
    if (!trackerContainer || !this.currentOrder) return;

    const ord = this.currentOrder;
    const isCompleted = ord.order_status === 'DELIVERED';

    const steps = [
      { key: 'CONFIRMED', title: 'Order Confirmed', desc: 'Station kitchen accepted order & started preparation' },
      { key: 'PREPARING', title: 'Fresh Cooking in Progress', desc: 'Master chefs preparing meal adhering to strict hygiene' },
      { key: 'PACKED', title: 'Thermal Sealed & Quality Checked', desc: 'Spill-proof hot thermal box sealed with security code' },
      { key: 'DISPATCHED', title: 'Delivery Executive on Platform', desc: `Agent at Platform #${ord.platform_no || 2} waiting for train arrival` },
      { key: 'DELIVERED', title: 'Handed at Coach & Berth', desc: `Delivered safely to Coach ${ord.coach}, Seat ${ord.berth}` }
    ];

    const statusOrder = ['CONFIRMED', 'PREPARING', 'PACKED', 'DISPATCHED', 'DELIVERED'];
    const currentIdx = statusOrder.indexOf(ord.order_status);

    let stepsHtml = '';
    steps.forEach((step, idx) => {
      let statusClass = '';
      let markerContent = idx + 1;

      if (idx < currentIdx) {
        statusClass = 'completed';
        markerContent = '✓';
      } else if (idx === currentIdx) {
        statusClass = 'active';
        markerContent = '●';
      }

      stepsHtml += `
        <div class="timeline-step ${statusClass}">
          <div class="step-marker">${markerContent}</div>
          <div class="step-content">
            <h4 style="color: ${idx === currentIdx ? 'var(--accent-orange)' : 'var(--text-primary)'};">${step.title}</h4>
            <p>${step.desc}</p>
          </div>
        </div>
      `;
    });

    let itemsHtml = '';
    (ord.items || []).forEach(item => {
      itemsHtml += `
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
          <span>${item.quantity}x ${item.name}</span>
          <span style="font-weight: 700;">₹${item.price * item.quantity}</span>
        </div>
      `;
    });

    trackerContainer.innerHTML = `
      <div class="tracker-card animate-scale-in">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <span style="font-size: 0.78rem; font-weight: 800; background: rgba(255,107,0,0.15); color: var(--accent-orange); padding: 4px 10px; border-radius: var(--radius-full);">LIVE TRAIN BERTH DELIVERY</span>
            <h2 style="font-size: 1.6rem; margin-top: 6px;">Order #${ord.order_number}</h2>
            <div style="font-size: 0.88rem; color: var(--text-secondary);">Train: <strong>${ord.train_no} - ${ord.train_name}</strong></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.82rem; color: var(--text-muted);">Delivery Station</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent-cyan);">${ord.station_name} (${ord.station_code})</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">Platform #${ord.platform_no || 2} • Coach <strong>${ord.coach}</strong>, Seat <strong>${ord.berth}</strong></div>
          </div>
        </div>

        <!-- Animated Train Track Banner -->
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px; position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="live-indicator-dot pulse-dot"></span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-emerald);">TRAIN ON ROUTE TO STATION</span>
            </div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-orange);">Speed: 104 km/h</div>
          </div>
          
          <!-- Track graphic -->
          <div style="position: relative; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; margin: 20px 0;">
            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${Math.min(100, (currentIdx + 1) * 20)}%; background: linear-gradient(90deg, var(--accent-emerald), var(--accent-orange)); border-radius: 6px; transition: width 0.5s ease;"></div>
            <div style="position: absolute; left: ${Math.min(92, (currentIdx + 1) * 18)}%; top: -14px; font-size: 1.5rem;" class="train-bob">🚆</div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
            <span>En Route</span>
            <span>Platform Entry</span>
            <span>Delivery at Berth</span>
          </div>
        </div>

        <!-- Secure Delivery OTP Box -->
        <div class="otp-box">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Share this OTP with Delivery Executive at Seat</div>
          <div class="otp-code">${ord.delivery_otp}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Passenger: <strong>${ord.passenger_name}</strong> (${ord.passenger_phone})</div>
        </div>

        <!-- Timeline Stepper -->
        <div class="timeline-stepper">
          ${stepsHtml}
        </div>

        <!-- Assigned Delivery Executive Card -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-orange), #ff4500); display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
              👨‍🍳
            </div>
            <div>
              <div style="font-weight: 700; font-size: 1rem;">${ord.delivery_agent_name || 'Ramesh Kumar (IRCTC Delivery ID: #5821)'}</div>
              <div style="font-size: 0.82rem; color: var(--accent-emerald);">🟢 Station Platform Assigned (Ready at Door)</div>
            </div>
          </div>
          <a href="tel:${ord.delivery_agent_phone || '+919876543210'}" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 8px 16px; border-radius: var(--radius-full); font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            📞 Call Agent
          </a>
        </div>

        <!-- Order Items & Invoice Breakdown -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
          <h4 style="margin-bottom: 12px; font-size: 1rem;">Order Items from ${ord.restaurant_name}</h4>
          ${itemsHtml}
          <div style="border-top: 1px dashed var(--border-color); margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem;">
            <span>Total Paid (${ord.payment_method})</span>
            <span style="color: var(--accent-orange);">₹${ord.total}</span>
          </div>
        </div>

        <!-- Status Simulator Controls (For testing live delivery transitions) -->
        <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: var(--radius-md); padding: 16px; text-align: center;">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 10px; text-transform: uppercase;">
            🎮 Live Delivery Lifecycle Simulator
          </div>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button onclick="window.tracker.advanceStatus('CONFIRMED')" class="pnr-chip" style="font-size: 0.78rem;">1. Confirmed</button>
            <button onclick="window.tracker.advanceStatus('PREPARING')" class="pnr-chip" style="font-size: 0.78rem;">2. Cooking</button>
            <button onclick="window.tracker.advanceStatus('PACKED')" class="pnr-chip" style="font-size: 0.78rem;">3. Thermal Packed</button>
            <button onclick="window.tracker.advanceStatus('DISPATCHED')" class="pnr-chip" style="font-size: 0.78rem;">4. On Platform</button>
            <button onclick="window.tracker.advanceStatus('DELIVERED')" class="pnr-chip" style="font-size: 0.78rem; background: var(--accent-emerald); color: white;">5. Delivered to Berth</button>
          </div>
        </div>

        <!-- Print Thermal Bill Button -->
        <div style="margin-top: 18px; display: flex; justify-content: center; gap: 12px;">
          <button onclick="window.print()" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 10px 20px; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
            🖨️ Print / Save Receipt
          </button>
          <button onclick="window.app.switchView('search')" style="background: var(--accent-orange); color: white; padding: 10px 20px; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.9rem;">
            Order More Food
          </button>
        </div>
      </div>
    `;
  }
}

export const tracker = new OrderTracker();
window.tracker = tracker;
