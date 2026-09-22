import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Train, MapPin, Clock, Phone, FileText, 
  ShieldCheck, Share2, Sparkles, Navigation, ChevronRight,
  UtensilsCrossed, PackageCheck, Truck, Home, Play, Pause,
  Layers, Map, Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FoodTrackerMap from './FoodTrackerMap';

export default function OrderConfirmation({
  order,
  onOpenInvoice,
  onNewOrder,
  onBackToHome
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // 0 to 4
  const [activeTrackingView, setActiveTrackingView] = useState('map'); // 'map' | 'timeline'

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  }, []);

  if (!order) return null;

  const trackingSteps = [
    { title: 'Order Confirmed', desc: 'Sent to station kitchen partner', icon: CheckCircle2, time: 'Just now' },
    { title: 'Kitchen Preparing Meal', desc: 'Freshly cooked & packaged', icon: UtensilsCrossed, time: 'In 5 mins' },
    { title: 'Thermal Sealed & Packed', desc: 'Passed hygiene & quality check', icon: PackageCheck, time: 'In 12 mins' },
    { title: 'Executive at Platform', desc: `Waiting at Plat #${order.station?.platform || '1'}`, icon: Truck, time: 'Train Arrival' },
    { title: 'Delivered to Seat', desc: `Handed over at Coach ${order.passenger?.coach || 'B3'}, Seat ${order.passenger?.berth || '42'}`, icon: Home, time: 'Completed' }
  ];

  return (
    <div className="order-confirmation-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container-narrow">
        
        {/* Celebration Header Card */}
        <div className="glass-card" style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid var(--veg-border)',
          background: 'radial-gradient(ellipse at 50% 10%, rgba(16, 185, 129, 0.15) 0%, rgba(17, 24, 39, 0.95) 80%)'
        }}>
          
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--veg-bg)',
            color: 'var(--veg-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '2px solid var(--veg-green)',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
          }}>
            <CheckCircle2 size={38} strokeWidth={2.5} />
          </div>

          <div className="badge badge-green" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <Sparkles size={14} /> ORDER CONFIRMED & DISPATCHED
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Delicious Meals on the Way to Your Berth!
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
            Your meal is assigned for delivery to <strong>Coach {order.passenger?.coach || 'B3'}</strong>, <strong>Seat {order.passenger?.berth || '42'}</strong> at <strong>{order.station?.name || 'Vadodara Jn'}</strong>.
          </p>

          {/* Order ID & Delivery OTP Highlight Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            maxWidth: '520px',
            margin: '0 auto',
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
                {order.order_id || 'RB-849204'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivery OTP (For Agent)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--veg-green)', letterSpacing: '0.1em' }}>
                {order.order_otp || '4892'}
              </div>
            </div>
          </div>

        </div>

        {/* Live Tracking Header with View Toggle (Google Maps vs Timeline) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={18} style={{ color: 'var(--accent-orange)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Live Train & Food Tracking</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTrackingView('map')}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeTrackingView === 'map' ? 'var(--accent-orange)' : 'transparent',
                color: activeTrackingView === 'map' ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Map size={14} />
              <span>Google Maps Live</span>
            </button>

            <button
              onClick={() => setActiveTrackingView('timeline')}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeTrackingView === 'timeline' ? 'var(--accent-orange)' : 'transparent',
                color: activeTrackingView === 'timeline' ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Clock size={14} />
              <span>Step Timeline</span>
            </button>
          </div>
        </div>

        {/* 1. GOOGLE MAP LIVE TRACKING VIEW */}
        {activeTrackingView === 'map' && (
          <div style={{ marginBottom: '2rem' }}>
            <FoodTrackerMap order={order} />
          </div>
        )}

        {/* 2. STEP TIMELINE VIEW */}
        {activeTrackingView === 'timeline' && (
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Delivery Timeline</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step {currentStepIndex + 1} of 5
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              
              {/* Connecting Vertical Track Line */}
              <div style={{
                position: 'absolute',
                top: '20px',
                bottom: '20px',
                left: '19px',
                width: '3px',
                background: 'var(--bg-tertiary)',
                zIndex: 1
              }} />

              {trackingSteps.map((step, idx) => {
                const isDone = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
                    
                    {/* Step Icon Bubble */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isDone ? (isCurrent ? 'var(--accent-orange)' : 'var(--veg-green)') : 'var(--bg-tertiary)',
                      border: isDone ? 'none' : '2px solid var(--border-color)',
                      color: isDone ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isCurrent ? '0 0 15px rgba(255, 107, 0, 0.6)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <StepIcon size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: isDone ? 'var(--text-primary)' : 'var(--text-muted)'
                        }}>
                          {step.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: isCurrent ? 'var(--accent-orange)' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 400 }}>
                          {step.time}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: isDone ? 'var(--text-secondary)' : 'var(--text-muted)', marginTop: '2px' }}>
                        {step.desc}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Interactive Step Simulator Controls */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulate Delivery Progress:</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {trackingSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStepIndex(i)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.75rem',
                      background: currentStepIndex === i ? 'var(--accent-orange)' : 'var(--bg-tertiary)',
                      color: currentStepIndex === i ? '#fff' : 'inherit'
                    }}
                  >
                    Step {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delivery Executive Details Card */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                RK
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Ramesh Kumar</h4>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>FSSAI Certified</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Delivery Partner • Rating 4.9 ★ (1,240+ Train deliveries)
                </div>
              </div>
            </div>

            <a
              href="tel:+919876543210"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--veg-green)', borderColor: 'var(--veg-green)' }}
            >
              <Phone size={15} />
              <span>Call Delivery Agent</span>
            </a>
          </div>
        </div>

        {/* Action Buttons: Invoice, New Order, Home */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onOpenInvoice}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FileText size={18} style={{ color: 'var(--accent-orange)' }} />
            <span>Download / Print Tax Invoice</span>
          </button>

          <button
            onClick={onNewOrder}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UtensilsCrossed size={18} />
            <span>Order Another Meal</span>
          </button>
        </div>

      </div>
    </div>
  );
}
