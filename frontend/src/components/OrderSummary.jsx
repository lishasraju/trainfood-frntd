import React, { useState } from 'react';
import { 
  User, Phone, Mail, Train, MapPin, ShieldCheck, 
  ArrowRight, AlertCircle, Sparkles, CheckCircle2, 
  Layers, CreditCard, ChevronLeft
} from 'lucide-react';

export default function OrderSummary({
  train,
  station,
  cartItems,
  appliedCoupon,
  specialInstructions,
  passengerDetails,
  setPassengerDetails,
  onProceedToPayment,
  onBackToMenu
}) {
  const [errors, setErrors] = useState({});

  // Calculations
  const itemTotal = cartItems.reduce((sum, item) => {
    const p = item.calculatedPrice || item.price;
    return sum + (p * item.quantity);
  }, 0);

  const deliveryFee = itemTotal >= 199 ? 0 : 35;
  const irctcFee = 15;
  const taxes = Math.round(itemTotal * 0.05);

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

  const handleInputChange = (field, value) => {
    setPassengerDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!passengerDetails.name?.trim()) {
      newErrors.name = 'Please enter passenger name';
    }
    if (!passengerDetails.phone?.trim() || !/^\d{10}$/.test(passengerDetails.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!passengerDetails.coach?.trim()) {
      newErrors.coach = 'Please enter coach number (e.g. B4, A1, S3)';
    }
    if (!passengerDetails.berth?.trim()) {
      newErrors.berth = 'Please enter berth/seat number (e.g. 42)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onProceedToPayment({
        itemTotal,
        deliveryFee,
        irctcFee,
        taxes,
        discount,
        grandTotal
      });
    }
  };

  return (
    <div className="order-summary-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={onBackToMenu}
            className="btn btn-secondary btn-sm"
          >
            ← Back to Menu
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Passenger & Delivery Details</span>
        </div>

        {/* Multi-Step Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--veg-green)', fontWeight: 700, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> 1. Route & Station
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--veg-green)', fontWeight: 700, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> 2. Menu & Cart
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', fontWeight: 800, fontSize: '0.85rem' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</div>
            3. Passenger Berth Details
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
            4. Payment
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Passenger & Seat Form */}
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
                <User size={13} /> Coach & Seat Details
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Where Should We Deliver?</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Our delivery partner will board this exact coach to hand over your meal.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Passenger Name */}
              <div className="form-group">
                <label className="form-label">Passenger Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Aakash Sharma"
                    value={passengerDetails.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--nonveg-red)' }}>{errors.name}</span>}
              </div>

              {/* Mobile Number & Alternate Mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number * (For Delivery OTP)</label>
                  <input
                    type="tel"
                    maxLength={10}
                    className="form-input"
                    placeholder="10-digit mobile"
                    value={passengerDetails.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.phone && <span style={{ fontSize: '0.75rem', color: 'var(--nonveg-red)' }}>{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (For Invoice)</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@email.com"
                    value={passengerDetails.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              {/* Coach & Berth details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Coach Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. B4, A1, S3, C2"
                    value={passengerDetails.coach || ''}
                    onChange={(e) => handleInputChange('coach', e.target.value.toUpperCase())}
                    style={{ textTransform: 'uppercase', fontWeight: 700 }}
                  />
                  {errors.coach && <span style={{ fontSize: '0.75rem', color: 'var(--nonveg-red)' }}>{errors.coach}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Berth / Seat No *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 42"
                    value={passengerDetails.berth || ''}
                    onChange={(e) => handleInputChange('berth', e.target.value)}
                    style={{ fontWeight: 700 }}
                  />
                  {errors.berth && <span style={{ fontSize: '0.75rem', color: 'var(--nonveg-red)' }}>{errors.berth}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Berth Type</label>
                  <select
                    className="form-input"
                    value={passengerDetails.berth_type || 'Lower Berth'}
                    onChange={(e) => handleInputChange('berth_type', e.target.value)}
                  >
                    <option value="Lower Berth">Lower Berth</option>
                    <option value="Middle Berth">Middle Berth</option>
                    <option value="Upper Berth">Upper Berth</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                    <option value="Window Seat">Window Seat</option>
                    <option value="Aisle Seat">Aisle Seat</option>
                  </select>
                </div>
              </div>

              {/* PNR Number (Optional) */}
              <div className="form-group">
                <label className="form-label">PNR Number (Optional)</label>
                <input
                  type="text"
                  maxLength={10}
                  className="form-input"
                  placeholder="10-digit IRCTC PNR"
                  value={passengerDetails.pnr || ''}
                  onChange={(e) => handleInputChange('pnr', e.target.value.replace(/\D/g, ''))}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                <span>Proceed to Payment (₹{grandTotal})</span>
                <ArrowRight size={20} />
              </button>

            </div>

          </form>

          {/* Right Column: Delivery Station Card & Order Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Delivery Station Verification Box */}
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <MapPin size={22} style={{ color: 'var(--accent-orange)' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Delivery Station: {station?.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Platform #{station?.platform} • Scheduled Arrival: <strong>{station?.arrival}</strong>
                  </p>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Train size={16} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
                <span>Train: <strong>#{train?.train_no}</strong> {train?.name}</span>
              </div>
            </div>

            {/* Order Items Recap */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Order Summary ({cartItems.length} items)</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-orange)', cursor: 'pointer' }} onClick={onBackToMenu}>Edit Cart</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id + (item.specialNote || '')} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{item.quantity}x</span> {item.name}
                      {item.customAddons && item.customAddons.length > 0 && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-orange)' }}>
                          + {item.customAddons.map(a => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <span style={{ fontWeight: 700 }}>₹{(item.calculatedPrice || item.price) * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill totals */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Item Total</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery Fee</span>
                  <span style={{ color: deliveryFee === 0 ? 'var(--veg-green)' : 'inherit', fontWeight: deliveryFee === 0 ? 700 : 400 }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Taxes & IRCTC Fee</span>
                  <span>₹{taxes + irctcFee}</span>
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
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.75rem',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--accent-orange)'
                }}>
                  <span>Final Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Delay & Refund Guarantee */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <ShieldCheck size={28} style={{ color: 'var(--veg-green)', flexShrink: 0 }} />
              <span>
                <strong>100% On-Time Seat Delivery:</strong> If train arrival delays exceed schedule or misses halt, full payment is automatically refunded back to your account.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
