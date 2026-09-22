import React from 'react';
import { 
  Train, ShoppingBag, Clock, Moon, Sun, ShieldCheck, 
  MapPin, Search, User, LogIn, ChevronDown, Award, Smartphone, Download
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  selectedTrain,
  selectedStation,
  cartItemsCount,
  setIsCartOpen,
  activeOrdersCount,
  setIsMyOrdersOpen,
  theme,
  toggleTheme,
  onResetToHome,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAdminDashboard,
  onTriggerInstall
}) {
  return (
    <header className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 500,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'var(--transition-normal)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={onResetToHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)'
          }}>
            <Train size={24} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                Rail<strong style={{ color: 'var(--accent-orange)' }}>Bite</strong>
              </span>
              <span className="badge badge-orange" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                IRCTC Partner
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1 }}>
              Food Delivery at Train Berth
            </p>
          </div>
        </div>

        {/* Selected Train / Station Live Indicator Pill */}
        {selectedTrain && currentView !== 'admin' && (
          <div 
            onClick={() => setCurrentView('stations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-tertiary)',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
            title="Click to change station or view route"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-orange)' }}>
              <Train size={16} />
              <strong style={{ color: 'var(--text-primary)' }}>{selectedTrain.train_no}</strong>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} style={{ color: 'var(--veg-green)' }} />
              <span style={{ color: selectedStation ? 'var(--text-primary)' : 'var(--accent-amber)', fontWeight: 600 }}>
                {selectedStation ? selectedStation.name : 'Choose Delivery Station'}
              </span>
            </div>
          </div>
        )}

        {/* Right Action Icons & Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Install App Button */}
          {onTriggerInstall && (
            <button
              onClick={onTriggerInstall}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid rgba(255, 107, 0, 0.4)',
                background: 'rgba(255, 107, 0, 0.1)',
                color: 'var(--accent-orange)'
              }}
              title="Install RailBite App on your phone or PC"
            >
              <Download size={15} />
              <span>App</span>
            </button>
          )}

          {/* Quick Home / Search Button */}
          {currentView !== 'home' && currentView !== 'admin' && (
            <button 
              onClick={onResetToHome}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Search size={15} />
              <span className="hide-mobile">Search Train</span>
            </button>
          )}

          {/* Active Orders / Tracking Button */}
          {currentView !== 'admin' && (
            <button
              onClick={() => setIsMyOrdersOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title="View Active & Past Orders"
            >
              <Clock size={16} />
              <span className="hide-mobile">My Orders</span>
              {activeOrdersCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--accent-orange)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(255, 107, 0, 0.5)'
                }}>
                  {activeOrdersCount}
                </span>
              )}
            </button>
          )}

          {/* Cart Trigger Button */}
          {currentView !== 'admin' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-primary btn-sm"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem'
              }}
            >
              <ShoppingBag size={18} />
              <span style={{ fontWeight: 700 }}>Cart</span>
              {cartItemsCount > 0 && (
                <span style={{
                  background: '#ffffff',
                  color: '#ea580c',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          {/* USER / ADMIN AUTHENTICATION BUTTON / PILL */}
          {currentUser ? (
            currentUser.role === 'admin' ? (
              /* Admin Pill */
              <button
                onClick={onOpenAdminDashboard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1.5px solid rgba(245, 158, 11, 0.4)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--accent-amber)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)'
                }}
                title="Open IRCTC Station Admin Command Center"
              >
                <ShieldCheck size={16} />
                <span>Station Admin</span>
              </button>
            ) : (
              /* Passenger Profile Pill */
              <button
                onClick={onOpenProfileModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
                title="View Passenger Profile & Seat"
              >
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt={currentUser.name}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid var(--accent-orange)'
                  }}
                />
                <span className="hide-mobile">{currentUser.name.split(' ')[0]}</span>
                <span className="badge badge-orange" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                  {currentUser.coach || 'B3'}-{currentUser.berth || '42'}
                </span>
              </button>
            )
          ) : (
            /* Logged Out: Sign In Button with Quick Menu */
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => onOpenAuthModal('user')}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderColor: 'var(--accent-orange)',
                  color: 'var(--accent-orange)'
                }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('admin')}
                className="btn btn-secondary btn-sm hide-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  color: 'var(--accent-amber)',
                  padding: '0.4rem 0.6rem'
                }}
                title="Station Pantry / IRCTC Admin Portal"
              >
                <ShieldCheck size={14} />
                <span style={{ fontSize: '0.75rem' }}>Admin</span>
              </button>
            </div>
          )}

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
          </button>
        </div>
      </div>
    </header>
  );
}
