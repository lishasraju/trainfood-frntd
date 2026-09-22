import React, { useState } from 'react';
import { 
  User, Mail, Phone, Train, MapPin, X, Award, 
  Clock, ShieldCheck, LogOut, Edit3, Check, Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onOpenMyOrders,
  showToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [coach, setCoach] = useState(user?.coach || '');
  const [berth, setBerth] = useState(user?.berth || '');
  const [pnr, setPnr] = useState(user?.pnr || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await apiService.updateProfile({ name, phone, coach, berth, pnr });
      onUpdateUser(updated);
      setIsEditing(false);
      if (showToast) showToast('Profile updated successfully! ✨', 'success');
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* User Avatar & Badge Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            position: 'relative',
            width: '76px',
            height: '76px',
            margin: '0 auto 1rem'
          }}>
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
              alt={user.name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-orange)',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: 'var(--veg-green)',
              color: '#fff',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-secondary)',
              fontSize: '0.7rem'
            }}>
              <Check size={14} strokeWidth={3} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
            <span className="badge badge-orange" style={{ fontSize: '0.75rem' }}>
              <Award size={12} /> {user.role === 'admin' ? 'Station Pantry Officer' : 'Gold Passenger Member'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</span>
          </div>
        </div>

        {/* Passenger Seat & Journey Details Card */}
        {user.role !== 'admin' && (
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assigned Coach</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
                {user.coach || 'B3'}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Seat / Berth</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {user.berth || '42'} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({user.berth_type || 'LB'})</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Linked PNR</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--veg-green)' }}>
                {user.pnr || '2485961034'}
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Form / Read-only details */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
                style={{ width: '100%', height: '38px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                style={{ width: '100%', height: '38px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Coach
                </label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', height: '38px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Berth / Seat
                </label>
                <input
                  type="text"
                  value={berth}
                  onChange={(e) => setBerth(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', height: '38px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
                style={{ flex: 1, height: '38px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ flex: 1, height: '38px', fontSize: '0.85rem' }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Phone size={15} style={{ color: 'var(--accent-orange)' }} />
                <span>{user.phone || '+91 98765 43210'}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--veg-green)', fontWeight: 600 }}>Verified</span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', height: '38px', fontSize: '0.85rem' }}
            >
              <Edit3 size={15} />
              <span>Edit Passenger Details</span>
            </button>
          </div>
        )}

        {/* Action Buttons: My Orders & Logout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button
            onClick={() => {
              onClose();
              if (onOpenMyOrders) onOpenMyOrders();
            }}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
          >
            <Clock size={16} />
            <span>View My Food Orders & Invoices</span>
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>

      </div>
    </div>
  );
}
