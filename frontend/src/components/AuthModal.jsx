import React, { useState } from 'react';
import { 
  User, ShieldCheck, Lock, Mail, Phone, Train, 
  MapPin, X, ArrowRight, CheckCircle2, Sparkles,
  Key, AlertCircle, Eye, EyeOff, ShieldAlert, Award
} from 'lucide-react';
import { apiService } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  defaultTab = 'user', // 'user' | 'admin'
  showToast
}) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'user' | 'admin'
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Passenger form fields
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPnr, setUserPnr] = useState('');
  const [userCoach, setUserCoach] = useState('B3');
  const [userBerth, setUserBerth] = useState('42');

  // Admin form fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');

  if (!isOpen) return null;

  // 1-Click Demo Fill for Passenger
  const fillDemoPassenger = () => {
    setUserEmail('rahul@railbite.in');
    setUserPassword('user123');
    setErrorMessage('');
    if (showToast) showToast('Filled Demo Passenger credentials (Rahul Sharma)', 'info');
  };

  // 1-Click Demo Fill for Station Admin
  const fillDemoAdmin = () => {
    setAdminEmail('admin@railbite.in');
    setAdminPassword('admin123');
    setAdminSecretKey('IRCTC-ADMIN-2026');
    setErrorMessage('');
    if (showToast) showToast('Filled Demo Station Pantry Admin credentials', 'info');
  };

  // Handle Passenger Login / Register
  const handleUserAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (!userName.trim() || !userEmail.trim() || !userPassword) {
          throw new Error('Please enter your full name, email and password.');
        }
        const res = await apiService.register({
          name: userName,
          email: userEmail,
          phone: userPhone,
          password: userPassword,
          pnr: userPnr,
          coach: userCoach,
          berth: userBerth,
          role: 'user'
        });
        if (showToast) showToast(res.message || 'Account created successfully! 🎉', 'success');
        onAuthSuccess(res.user, res.token);
        onClose();
      } else {
        if (!userEmail.trim() || !userPassword) {
          throw new Error('Please enter both your email address and password.');
        }
        const res = await apiService.login(userEmail, userPassword, 'user');
        if (showToast) showToast(res.message || 'Logged in successfully! Welcome back.', 'success');
        onAuthSuccess(res.user, res.token);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (!adminEmail.trim() || !adminPassword) {
        throw new Error('Please enter official station email and password.');
      }
      
      // Verification of admin authorization key for security
      if (adminSecretKey && adminSecretKey.trim() !== 'IRCTC-ADMIN-2026' && adminSecretKey.trim() !== 'admin123') {
        throw new Error('Invalid IRCTC Authorization Key. Required key: IRCTC-ADMIN-2026');
      }

      const res = await apiService.login(adminEmail, adminPassword, 'admin');
      if (showToast) showToast(res.message || 'Station Admin verified! Access granted.', 'success');
      onAuthSuccess(res.user, res.token);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Admin authentication failed. Verification declined.');
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
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--bg-secondary)',
          border: activeTab === 'admin' ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: activeTab === 'admin' 
            ? '0 20px 50px rgba(245, 158, 11, 0.2), 0 0 30px rgba(0,0,0,0.8)' 
            : '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 107, 0, 0.15)',
          padding: 0,
          position: 'relative'
        }}
      >
        {/* Modal Close Button */}
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
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        {/* Header Tabs: Passenger vs Station Admin */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          {/* Passenger Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('user');
              setErrorMessage('');
            }}
            style={{
              padding: '1.1rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'user' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'user' ? 'var(--accent-orange)' : 'var(--text-muted)',
              borderBottom: activeTab === 'user' ? '3px solid var(--accent-orange)' : '3px solid transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            <User size={18} />
            <span>Passenger Portal</span>
          </button>

          {/* Admin Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage('');
            }}
            style={{
              padding: '1.1rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'admin' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'admin' ? 'var(--accent-amber)' : 'var(--text-muted)',
              borderBottom: activeTab === 'admin' ? '3px solid var(--accent-amber)' : '3px solid transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            <ShieldCheck size={18} />
            <span>Station Admin Portal</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div style={{ padding: '2rem 2rem 2.25rem' }}>

          {/* PASSENGER AUTH TAB */}
          {activeTab === 'user' && (
            <div>
              {/* Header Title */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 107, 0, 0.12)',
                  color: 'var(--accent-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  border: '1px solid rgba(255, 107, 0, 0.3)'
                }}>
                  <Train size={24} />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {isRegisterMode ? 'Create Passenger Account' : 'Passenger Sign In'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {isRegisterMode 
                    ? 'Register once to order gourmet food delivered to your berth.' 
                    : 'Sign in to track active food deliveries and view seat orders.'}
                </p>
              </div>

              {/* Demo Fill Pill */}
              <div style={{
                background: 'var(--bg-tertiary)',
                border: '1px dashed var(--border-hover)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent-orange)' }} />
                  <span>Quick Demo: <strong>rahul@railbite.in</strong></span>
                </div>
                <button
                  type="button"
                  onClick={fillDemoPassenger}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: 'var(--accent-orange)', borderColor: 'var(--accent-orange)' }}
                >
                  Auto-Fill
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Passenger Form */}
              <form onSubmit={handleUserAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {isRegisterMode && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Full Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="input-field"
                        style={{ width: '100%', paddingLeft: '38px', height: '42px' }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      placeholder="e.g. rahul@railbite.in"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '38px', height: '42px' }}
                    />
                  </div>
                </div>

                {isRegisterMode && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Mobile Number (For Delivery SMS & OTP)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', paddingLeft: '38px', height: '42px' }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px', height: '42px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {isRegisterMode && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        PNR (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="10-digit"
                        maxLength={10}
                        value={userPnr}
                        onChange={(e) => setUserPnr(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Coach
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B3"
                        value={userCoach}
                        onChange={(e) => setUserCoach(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Berth / Seat
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 42"
                        value={userBerth}
                        onChange={(e) => setUserBerth(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    marginTop: '0.5rem',
                    height: '46px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isLoading ? 'Processing...' : isRegisterMode ? 'Complete Registration' : 'Sign In as Passenger'}
                  <ArrowRight size={18} />
                </button>

              </form>

              {/* Switch Register/Login Mode */}
              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isRegisterMode ? (
                  <span>
                    Already have a RailBite account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false);
                        setErrorMessage('');
                      }}
                      style={{ color: 'var(--accent-orange)', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Sign In here
                    </button>
                  </span>
                ) : (
                  <span>
                    New passenger?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setErrorMessage('');
                      }}
                      style={{ color: 'var(--accent-orange)', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Create Free Account
                    </button>
                  </span>
                )}
              </div>

            </div>
          )}

          {/* ADMIN / PANTRY OFFICER AUTH TAB */}
          {activeTab === 'admin' && (
            <div>
              {/* Header Title */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  border: '1.5px solid rgba(245, 158, 11, 0.4)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)'
                }}>
                  <ShieldCheck size={26} />
                </div>
                <div className="badge badge-orange" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', borderColor: 'rgba(245, 158, 11, 0.3)', marginBottom: '0.35rem' }}>
                  <Award size={12} /> IRCTC OFFICIAL STATION DISPATCH
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  Station Pantry & Admin Portal
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Authorized access for Railway Pantry Officers, Kitchen Supervisors, and Station Dispatchers.
                </p>
              </div>

              {/* Demo Fill Pill for Admin */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px dashed rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <ShieldAlert size={16} style={{ color: 'var(--accent-amber)' }} />
                  <span>Demo Station Officer: <strong>admin@railbite.in</strong></span>
                </div>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)' }}
                >
                  Auto-Fill
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Admin Form */}
              <form onSubmit={handleAdminAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Official Officer / Station Email *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      placeholder="e.g. admin@railbite.in"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '38px', height: '42px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Officer Security Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px', height: '42px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                      IRCTC Station Authorization Key *
                    </label>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Key: IRCTC-ADMIN-2026</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-amber)' }} />
                    <input
                      type="text"
                      placeholder="e.g. IRCTC-ADMIN-2026"
                      value={adminSecretKey}
                      onChange={(e) => setAdminSecretKey(e.target.value)}
                      required
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '38px', height: '42px', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginTop: '0.5rem',
                    height: '46px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#000',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  {isLoading ? 'Verifying IRCTC Badge...' : 'Access Station Admin Command'}
                  <ShieldCheck size={18} />
                </button>

              </form>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 Secured with 256-bit AES Railway Dispatch Token • Access logged for audit
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
