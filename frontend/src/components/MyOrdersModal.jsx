import React from 'react';
import { X, Clock, Train, MapPin, CheckCircle2, ChevronRight, FileText, ShoppingBag, Navigation, Radio } from 'lucide-react';

export default function MyOrdersModal({
  isOpen,
  onClose,
  orders,
  onTrackOrder,
  onOpenInvoice
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 950 }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '640px', width: '100%', padding: '1.75rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={20} style={{ color: 'var(--accent-orange)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Train Food Orders</h2>
            <span className="badge badge-orange" style={{ fontSize: '0.75rem' }}>
              {orders.length}
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <ShoppingBag size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>No Orders Placed Yet</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Order from delicious restaurant partners delivered hot to your train berth.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {orders.map((ord) => (
              <div
                key={ord.order_id || ord.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent-orange)' }}>
                        #{ord.order_id || ord.id}
                      </span>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                        OTP: {ord.order_otp || '4892'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Placed: {new Date(ord.placed_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                    <Radio size={10} style={{ marginRight: '3px', animation: 'pulse 1.5s infinite' }} />
                    {ord.status || ord.order_status || 'CONFIRMED'}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Train size={14} style={{ color: 'var(--accent-orange)' }} />
                    <span>Train #{ord.train?.train_no || '12951'} • <strong>{ord.station?.name || 'Vadodara Jn'} (Plat #{ord.station?.platform || '2'})</strong></span>
                  </div>
                  <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={13} style={{ color: 'var(--veg-green)' }} />
                    <span>Seat: <strong>Coach {ord.passenger?.coach || 'B3'}, Berth {ord.passenger?.berth || '42'}</strong> ({ord.passenger?.name || 'Rahul Sharma'})</span>
                  </div>
                </div>

                {/* Items summary */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Items: {ord.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                {/* Bottom Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    ₹{(ord.billSummary?.grandTotal || ord.paymentDetails?.amountPaid || 450).toFixed(0)}
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenInvoice(ord);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    >
                      <FileText size={13} /> Invoice
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onTrackOrder(ord);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Navigation size={13} />
                      <span>Live Google Map</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
