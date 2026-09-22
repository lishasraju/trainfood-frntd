import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, 
  MapPin, Train, ShieldCheck, Check, Sparkles, AlertCircle 
} from 'lucide-react';
import { COUPONS } from '../data/mockData';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  train,
  station,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  specialInstructions,
  setSpecialInstructions,
  onProceedToOrderSummary
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Bill Calculations
  const itemTotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.calculatedPrice || item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const deliveryFee = itemTotal >= 199 ? 0 : 35;
  const irctcFee = 15;
  const taxes = Math.round(itemTotal * 0.05); // 5% GST

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') {
      discount = appliedCoupon.discount;
    } else if (appliedCoupon.type === 'percentage') {
      discount = Math.min(
        Math.round((itemTotal * appliedCoupon.discount) / 100),
        appliedCoupon.max_discount || 100
      );
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + irctcFee + taxes - discount);

  const handleApplyCouponCode = (codeToApply) => {
    setCouponError('');
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const found = COUPONS.find(c => c.code === code);
    
    if (!found) {
      setCouponError('Invalid promo code. Try RAILBITE50, FIRSTMEAL, or VANDE100.');
      return;
    }

    if (itemTotal < found.min_order) {
      setCouponError(`Minimum order amount of ₹${found.min_order} required for coupon ${found.code}.`);
      return;
    }

    onApplyCoupon(found);
    setCouponInput('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 900 }}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '480px',
          background: 'var(--bg-secondary)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          borderLeft: '1px solid var(--border-color)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-orange)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Your Meal Cart</h2>
            <span className="badge badge-orange" style={{ fontSize: '0.75rem' }}>
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Train & Delivery Station Banner */}
        {station && (
          <div style={{
            padding: '0.85rem 1.5rem',
            background: 'var(--accent-orange-glow)',
            borderBottom: '1px solid rgba(255, 107, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem'
          }}>
            <MapPin size={18} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
            <div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                Delivering at {station.name} (Plat #{station.platform})
              </span>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                Train #{train?.train_no} • Arrival: {station.arrival}
              </span>
            </div>
          </div>
        )}

        {/* Cart Body: Items List & Details */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <ShoppingBag size={56} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Add delicious dishes from our restaurant partner menu!
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Explore Menu
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Itemized List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartItems.map((item) => {
                  const unitPrice = item.calculatedPrice || item.price;
                  return (
                    <div
                      key={item.id + (item.specialNote || '')}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        gap: '0.85rem'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            style={{ color: 'var(--text-muted)', padding: '2px' }}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Custom Addons badge if any */}
                        {item.customAddons && item.customAddons.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', marginTop: '2px' }}>
                            + {item.customAddons.map(a => a.name).join(', ')}
                          </div>
                        )}

                        {item.specialNote && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            "{item.specialNote}"
                          </div>
                        )}

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '0.75rem'
                        }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            ₹{unitPrice * item.quantity}
                          </span>

                          {/* Quantity control */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '6px',
                            padding: '2px 4px',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', minWidth: '16px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)' }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Delivery Note */}
              <div className="form-group">
                <label className="form-label">Cooking & Delivery Request:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Extra napkins, less spicy, call before coach entry"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {/* Coupon Applicator */}
              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px dashed var(--border-hover)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <Tag size={16} style={{ color: 'var(--accent-orange)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Coupons & Offers</span>
                </div>

                {appliedCoupon ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--veg-bg)',
                    border: '1px solid var(--veg-border)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} style={{ color: 'var(--veg-green)' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--veg-green)' }}>{appliedCoupon.code} Applied!</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          Saved ₹{discount} with this promo
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      style={{ color: 'var(--nonveg-red)', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                        style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                      />
                      <button
                        onClick={() => handleApplyCouponCode()}
                        className="btn btn-secondary btn-sm"
                        style={{ fontWeight: 700 }}
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--nonveg-red)', marginTop: '0.4rem' }}>
                        {couponError}
                      </div>
                    )}

                    {/* Quick Available Promo Badges */}
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {COUPONS.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCouponCode(c.code)}
                          className="badge badge-orange"
                          style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                        >
                          {c.code} (₹{c.discount} off)
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Details Breakup */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Bill Details</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Item Total</span>
                    <span>₹{itemTotal}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Delivery Partner Fee</span>
                    <span style={{ color: deliveryFee === 0 ? 'var(--veg-green)' : 'inherit', fontWeight: deliveryFee === 0 ? 700 : 400 }}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>IRCTC Platform Convenience</span>
                    <span>₹{irctcFee}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>GST & Restaurant Taxes (5%)</span>
                    <span>₹{taxes}</span>
                  </div>

                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--veg-green)', fontWeight: 700 }}>
                      <span>Coupon Discount</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    marginTop: '0.25rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: 'var(--text-primary)'
                  }}>
                    <span>To Pay</span>
                    <span style={{ color: 'var(--accent-orange)' }}>₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Free delivery prompt if under 199 */}
              {itemTotal < 199 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  💡 Add items worth ₹{199 - itemTotal} more to unlock <strong>FREE Delivery</strong>!
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Checkout Action */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grand Total</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-orange)' }}>
                ₹{grandTotal}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToOrderSummary();
              }}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem 1.25rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
