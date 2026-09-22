import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, X, Check, Share, PlusSquare, 
  Sparkles, Train, Zap, ShieldCheck, ArrowRight, MoreVertical
} from 'lucide-react';

export default function InstallPwaBanner({ onInstallSuccess }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone PWA mode (already installed)
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;
    setIsStandalone(checkStandalone);

    if (checkStandalone) return;

    // 2. Check if on iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Auto-show popup after 800ms on first load
    const dismissed = sessionStorage.getItem('railbite_pwa_dismissed');
    let timer = null;
    if (!dismissed) {
      timer = setTimeout(() => {
        setShowAutoPopup(true);
      }, 800);
    }

    // 4. Capture browser beforeinstallprompt event (Android / Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log('📱 beforeinstallprompt event captured!');
      setDeferredPrompt(e);
      // Auto open popup when prompt is ready if not dismissed
      if (!sessionStorage.getItem('railbite_pwa_dismissed')) {
        setShowAutoPopup(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Listen for successful installation
    const handleAppInstalled = () => {
      console.log('🎉 RailBite PWA installed successfully');
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowAutoPopup(false);
      setShowManualGuide(false);
      setShowIosGuide(false);
      if (onInstallSuccess) onInstallSuccess();
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. Listen for custom trigger from Navbar or buttons
    const handleOpenTrigger = () => {
      setIsDismissed(false);
      setShowAutoPopup(true);
    };

    window.addEventListener('open-pwa-install', handleOpenTrigger);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install', handleOpenTrigger);
    };
  }, [onInstallSuccess]);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowAutoPopup(false);
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA install prompt outcome: ${outcome}`);

        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setShowAutoPopup(false);
          setIsDismissed(true);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowAutoPopup(false);
        setShowManualGuide(true);
      }
    } else {
      // If browser doesn't support automatic prompt (e.g. HTTP on local network or Firefox)
      setShowAutoPopup(false);
      setShowManualGuide(true);
    }
  };

  const handleDismissModal = () => {
    setShowAutoPopup(false);
    sessionStorage.setItem('railbite_pwa_dismissed', 'true');
  };

  const handlePermanentDismiss = () => {
    setIsDismissed(true);
    setShowAutoPopup(false);
    sessionStorage.setItem('railbite_pwa_dismissed', 'true');
  };

  // If already installed, don't show prompt
  if (isStandalone) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes pwaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pwaScaleUp {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      {/* 1. AUTO POPUP MODAL */}
      {showAutoPopup && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 10, 20, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'pwaFadeIn 0.25s ease-out'
          }}
          onClick={handleDismissModal}
        >
          <div 
            style={{
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(255, 107, 0, 0.5)',
              borderRadius: '24px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px 24px 22px',
              color: '#ffffff',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 107, 0, 0.3)',
              textAlign: 'center',
              position: 'relative',
              animation: 'pwaScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleDismissModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            {/* Glowing App Icon */}
            <div style={{
              width: '84px',
              height: '84px',
              margin: '0 auto 16px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
              padding: '4px',
              boxShadow: '0 10px 30px rgba(255, 107, 0, 0.5)'
            }}>
              <img 
                src="/icons/icon-192.svg" 
                alt="RailBite App" 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '18px',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 107, 0, 0.15)',
              border: '1px solid rgba(255, 107, 0, 0.4)',
              color: '#ff6b00',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '10px'
            }}>
              <Sparkles size={13} />
              <span>OFFICIAL ANDROID & MOBILE APP</span>
            </div>

            {/* Title & Tagline */}
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Install <span style={{ color: '#ff6b00' }}>RailBite</span> App
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.4 }}>
              Install directly on your phone for lightning fast seat deliveries and live train food tracking!
            </p>

            {/* Features List */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '22px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                <Zap size={16} style={{ color: '#ff6b00', flexShrink: 0 }} />
                <span><strong>1-Tap Instant Ordering</strong> on your phone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                <Train size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <span><strong>Live Berth Delivery Tracking</strong> with ETA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                <ShieldCheck size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span><strong>FSSAI & IRCTC Approved</strong> catering</span>
              </div>
            </div>

            {/* Big Install Button */}
            <button
              onClick={handleInstallClick}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 20px',
                fontSize: '1.05rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 107, 0, 0.5)',
                transition: 'transform 0.15s ease'
              }}
            >
              <Download size={20} strokeWidth={2.5} />
              <span>Install App on Phone</span>
              <ArrowRight size={18} />
            </button>

            {/* Dismiss Option */}
            <button
              onClick={handleDismissModal}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '0.82rem',
                marginTop: '14px',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Continue in browser
            </button>
          </div>
        </div>
      )}

      {/* 2. FLOATING BOTTOM BAR (Shown when popup is closed) */}
      {!showAutoPopup && !isDismissed && (
        <div 
          className="pwa-install-banner"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '520px',
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 107, 0, 0.4)',
            borderRadius: '16px',
            padding: '12px 16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 107, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'pwaSlideUp 0.35s ease-out'
          }}
        >
          {/* App Icon & Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <img 
              src="/icons/icon-192.svg" 
              alt="RailBite Logo" 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
                flexShrink: 0
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '0.92rem', 
                  fontWeight: '800', 
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  RailBite Mobile App
                </h4>
                <span style={{
                  background: 'rgba(255, 107, 0, 0.2)',
                  color: '#ff6b00',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 107, 0, 0.3)'
                }}>
                  Free
                </span>
              </div>
              <p style={{ 
                margin: '2px 0 0', 
                fontSize: '0.74rem', 
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                1-tap seat food delivery
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={handleInstallClick}
              style={{
                background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.84rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)'
              }}
            >
              <Download size={14} />
              <span>Install</span>
            </button>

            <button
              onClick={handlePermanentDismiss}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}
              title="Dismiss"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* 3. ANDROID MANUAL INSTALL INSTRUCTION MODAL */}
      {showManualGuide && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'pwaFadeIn 0.25s ease-out'
          }}
          onClick={() => setShowManualGuide(false)}
        >
          <div 
            style={{
              background: '#1e293b',
              border: '1.5px solid rgba(255, 107, 0, 0.5)',
              borderRadius: '20px',
              maxWidth: '430px',
              width: '100%',
              padding: '24px',
              color: '#fff',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Smartphone size={22} style={{ color: '#ff6b00' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Install on your Phone</h3>
              </div>
              <button 
                onClick={() => setShowManualGuide(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '18px' }}>
              Install RailBite directly to your phone's home screen:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 107, 0, 0.2)',
                  color: '#ff6b00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  1
                </div>
                <div style={{ fontSize: '0.88rem' }}>
                  Tap the <strong style={{ color: '#38bdf8' }}><MoreVertical size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> 3-dots menu</strong> in the top-right corner of Google Chrome.
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 107, 0, 0.2)',
                  color: '#ff6b00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  2
                </div>
                <div style={{ fontSize: '0.88rem' }}>
                  Select <strong style={{ color: '#22c55e' }}><Download size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> "Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowManualGuide(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Check size={16} />
              <span>Got it</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. iOS INSTRUCTION MODAL */}
      {showIosGuide && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'pwaFadeIn 0.25s ease-out'
          }}
          onClick={() => setShowIosGuide(false)}
        >
          <div 
            style={{
              background: '#1e293b',
              border: '1.5px solid rgba(255, 107, 0, 0.5)',
              borderRadius: '20px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              color: '#fff',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Smartphone size={22} style={{ color: '#ff6b00' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Install on iPhone / iPad</h3>
              </div>
              <button 
                onClick={() => setShowIosGuide(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '18px' }}>
              Add RailBite to your home screen in 2 quick steps:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 107, 0, 0.2)',
                  color: '#ff6b00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  1
                </div>
                <div style={{ fontSize: '0.88rem' }}>
                  Tap the <strong style={{ color: '#38bdf8' }}><Share size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> Share</strong> button in Safari's bottom toolbar.
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 107, 0, 0.2)',
                  color: '#ff6b00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  2
                </div>
                <div style={{ fontSize: '0.88rem' }}>
                  Scroll down and select <strong style={{ color: '#22c55e' }}><PlusSquare size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> Add to Home Screen</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Check size={16} />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
