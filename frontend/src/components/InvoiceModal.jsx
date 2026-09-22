import React from 'react';
import { X, Printer, Download, Train, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = 'INV-' + (order.order_id ? order.order_id.replace('RB-', '') : '849204');
  const invoiceDate = order.placed_at ? new Date(order.placed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString();

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '640px', width: '100%', padding: '2rem', background: '#ffffff', color: '#0f172a' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ff6b00',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Train size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                Rail<span style={{ color: '#ff6b00' }}>Bite</span> e-Catering
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>IRCTC Authorized Seat Delivery Partner</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                background: '#ff6b00',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Printer size={15} /> Print / Save PDF
            </button>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>TAX INVOICE NUMBER</div>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{invoiceNo}</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.4rem' }}>DATE & TIME</div>
            <div style={{ fontWeight: 600 }}>{invoiceDate}</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.4rem' }}>FSSAI LICENSE NO</div>
            <div style={{ fontWeight: 600 }}>10014011001890</div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>PASSENGER BERTH DETAILS</div>
            <div style={{ fontWeight: 800, color: '#ff6b00', fontSize: '1rem' }}>
              Coach {order.passenger?.coach || 'B4'} • Seat {order.passenger?.berth || '42'} ({order.passenger?.berth_type || 'Lower'})
            </div>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{order.passenger?.name || 'Aakash Sharma'}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Mob: {order.passenger?.phone || '9876543210'}</div>
            <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.8rem', marginTop: '4px' }}>
              Train #{order.train?.train_no} at {order.station?.name} (Plat #{order.station?.platform})
            </div>
          </div>
        </div>

        {/* Table of Items */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ textAlign: 'left', padding: '8px 10px', color: '#475569' }}>Item Description</th>
              <th style={{ textAlign: 'center', padding: '8px 10px', color: '#475569' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '8px 10px', color: '#475569' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: '8px 10px', color: '#475569' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px' }}>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  {item.customAddons && item.customAddons.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      + {item.customAddons.map(a => a.name).join(', ')}
                    </div>
                  )}
                </td>
                <td style={{ textAlign: 'center', padding: '8px 10px', fontWeight: 600 }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '8px 10px' }}>₹{item.calculatedPrice || item.price}</td>
                <td style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 700 }}>
                  ₹{(item.calculatedPrice || item.price) * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Item Total</span>
              <span>₹{order.billSummary?.itemTotal || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Fee</span>
              <span>{order.billSummary?.deliveryFee === 0 ? 'FREE' : `₹${order.billSummary?.deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>GST Taxes & Convenience</span>
              <span>₹{(order.billSummary?.taxes || 0) + (order.billSummary?.irctcFee || 0)}</span>
            </div>
            {order.billSummary?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700 }}>
                <span>Coupon Discount</span>
                <span>- ₹{order.billSummary?.discount}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '2px solid #0f172a',
              paddingTop: '0.4rem',
              fontSize: '1.1rem',
              fontWeight: 900,
              color: '#0f172a'
            }}>
              <span>Total Paid</span>
              <span style={{ color: '#ea580c' }}>₹{order.billSummary?.grandTotal || order.paymentDetails?.amountPaid || 0}</span>
            </div>
          </div>
        </div>

        {/* Security & Footer */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '0.75rem',
          fontSize: '0.75rem',
          color: '#64748b',
          textAlign: 'center'
        }}>
          Thank you for ordering with RailBite e-Catering! Have a pleasant and safe train journey.
        </div>

      </div>
    </div>
  );
}
