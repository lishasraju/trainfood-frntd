import React, { useState } from 'react';
import { 
  QrCode, CreditCard, Landmark, Wallet, Banknote, ShieldCheck, 
  Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles, Copy, Check
} from 'lucide-react';

export default function PaymentPage({
  billSummary,
  passengerDetails,
  train,
  station,
  onPaymentSuccess,
  onBackToSummary
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod' | 'wallet'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card form state
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8921',
    name: passengerDetails?.name || 'PASSENGER NAME',
    expiry: '09/28',
    cvv: '•••'
  });

  // Selected Bank for Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Selected Wallet
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('railbite.irctc@okhdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2); // Authorizing
      setTimeout(() => {
        setProcessingStep(3); // Confirmed
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess({
            paymentMethod,
            transactionId: 'TXN-' + Math.floor(100000000 + Math.random() * 900000000),
            amountPaid: billSummary?.grandTotal || 0,
            paidAt: new Date().toISOString()
          });
        }, 800);
      }, 1000);
    }, 1200);
  };

  const banks = [
    { id: 'HDFC', name: 'HDFC Bank', icon: '🏦' },
    { id: 'SBI', name: 'State Bank of India', icon: '🏛️' },
    { id: 'ICICI', name: 'ICICI Bank', icon: '🏢' },
    { id: 'AXIS', name: 'Axis Bank', icon: '💳' },
    { id: 'KOTAK', name: 'Kotak Mahindra', icon: '🏧' },
    { id: 'PNB', name: 'Punjab National Bank', icon: '🛡️' }
  ];

  return (
    <div className="payment-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={onBackToSummary}
            className="btn btn-secondary btn-sm"
            disabled={isProcessing}
          >
            ← Back to Passenger Details
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Secure Payment Gateway</span>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--veg-green)', fontWeight: 700, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> 1. Station
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--veg-green)', fontWeight: 700, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> 2. Menu
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--veg-green)', fontWeight: 700, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> 3. Coach & Seat ({passengerDetails?.coach || 'B4'}-{passengerDetails?.berth || '42'})
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', fontWeight: 800, fontSize: '0.85rem' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>4</div>
            4. Payment (₹{billSummary?.grandTotal})
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Payment Methods Selector */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Choose Payment Method</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All payments are 100% encrypted & protected.</p>
              </div>
              <div className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                <Lock size={12} /> 256-Bit SSL Encrypted
              </div>
            </div>

            {/* Payment Method Radio Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                style={{
                  padding: '1rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'upi' ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                  border: paymentMethod === 'upi' ? '2px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  color: paymentMethod === 'upi' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'var(--transition-fast)'
                }}
              >
                <QrCode size={24} />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '1rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'card' ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                  border: paymentMethod === 'card' ? '2px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  color: paymentMethod === 'card' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'var(--transition-fast)'
                }}
              >
                <CreditCard size={24} />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                style={{
                  padding: '1rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'netbanking' ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                  border: paymentMethod === 'netbanking' ? '2px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  color: paymentMethod === 'netbanking' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Landmark size={24} />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                style={{
                  padding: '1rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: paymentMethod === 'cod' ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                  border: paymentMethod === 'cod' ? '2px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  color: paymentMethod === 'cod' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Banknote size={24} />
                <span>Cash on Seat</span>
              </button>

            </div>

            {/* TAB CONTENT: UPI */}
            {paymentMethod === 'upi' && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{
                  background: '#ffffff',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'inline-block',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  marginBottom: '1rem'
                }}>
                  {/* Dynamic stylized QR code SVG */}
                  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="180" height="180" fill="white" rx="12"/>
                    {/* QR Finder patterns */}
                    <rect x="15" y="15" width="45" height="45" rx="8" fill="#111827"/>
                    <rect x="23" y="23" width="29" height="29" fill="white" rx="4"/>
                    <rect x="29" y="29" width="17" height="17" fill="#ea580c" rx="2"/>

                    <rect x="120" y="15" width="45" height="45" rx="8" fill="#111827"/>
                    <rect x="128" y="23" width="29" height="29" fill="white" rx="4"/>
                    <rect x="134" y="29" width="17" height="17" fill="#ea580c" rx="2"/>

                    <rect x="15" y="120" width="45" height="45" rx="8" fill="#111827"/>
                    <rect x="23" y="128" width="29" height="29" fill="white" rx="4"/>
                    <rect x="29" y="134" width="17" height="17" fill="#ea580c" rx="2"/>

                    {/* QR Data Matrix Bits */}
                    <rect x="70" y="20" width="10" height="10" fill="#111827"/>
                    <rect x="90" y="20" width="10" height="10" fill="#111827"/>
                    <rect x="70" y="40" width="10" height="20" fill="#ea580c"/>
                    <rect x="90" y="40" width="15" height="10" fill="#111827"/>
                    
                    <rect x="20" y="70" width="20" height="10" fill="#111827"/>
                    <rect x="50" y="70" width="10" height="30" fill="#111827"/>
                    <rect x="70" y="70" width="40" height="40" rx="4" fill="#ea580c"/>
                    <rect x="120" y="70" width="20" height="10" fill="#111827"/>
                    <rect x="150" y="70" width="10" height="20" fill="#111827"/>

                    <rect x="20" y="90" width="10" height="20" fill="#111827"/>
                    <rect x="120" y="90" width="20" height="20" fill="#111827"/>
                    <rect x="150" y="100" width="10" height="10" fill="#111827"/>

                    <rect x="70" y="120" width="15" height="20" fill="#111827"/>
                    <rect x="95" y="120" width="15" height="10" fill="#111827"/>
                    <rect x="120" y="120" width="40" height="10" fill="#ea580c"/>
                    <rect x="70" y="150" width="30" height="10" fill="#111827"/>
                    <rect x="110" y="140" width="20" height="20" fill="#111827"/>
                    <rect x="140" y="140" width="20" height="20" fill="#ea580c"/>
                  </svg>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Scan & Pay ₹{billSummary?.grandTotal} via any UPI App
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Google Pay • PhonePe • Paytm • BHIM • Cred
                </p>

                {/* Copy UPI ID */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }} onClick={handleCopyUpi}>
                  <span>UPI ID: <strong>railbite.irctc@okhdfcbank</strong></span>
                  {copiedUpi ? <Check size={14} style={{ color: 'var(--veg-green)' }} /> : <Copy size={14} />}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CARDS */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Visual Debit/Credit Card Mockup */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.8 }}>RAILBITE PAY</div>
                    <div style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '1.1rem', color: '#ff8533' }}>RuPay / VISA</div>
                  </div>

                  <div style={{ fontSize: '1.25rem', letterSpacing: '0.15em', fontWeight: 600, fontFamily: 'monospace', marginBottom: '1.25rem' }}>
                    {cardData.number || '•••• •••• •••• ••••'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ opacity: 0.6, fontSize: '0.65rem' }}>CARD HOLDER</div>
                      <div style={{ fontWeight: 700, textTransform: 'uppercase' }}>{cardData.name || 'PASSENGER'}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.6, fontSize: '0.65rem' }}>EXPIRES</div>
                      <div style={{ fontWeight: 700 }}>{cardData.expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* Card input fields */}
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="16-digit card number"
                    defaultValue="4532 8901 2345 8921"
                    onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="09/28"
                      defaultValue="09/28"
                      onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      className="form-input"
                      placeholder="•••"
                      defaultValue="892"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: NET BANKING */}
            {paymentMethod === 'netbanking' && (
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Select Your Bank:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {banks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBank(b.id)}
                      style={{
                        padding: '0.85rem 0.6rem',
                        borderRadius: 'var(--radius-md)',
                        background: selectedBank === b.id ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                        border: selectedBank === b.id ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                        color: selectedBank === b.id ? 'var(--accent-orange)' : 'var(--text-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{b.icon}</span>
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CASH ON DELIVERY (COD) */}
            {paymentMethod === 'cod' && (
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <Banknote size={44} style={{ color: 'var(--veg-green)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Pay ₹{billSummary?.grandTotal} at Your Train Seat
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                  Hand over cash or scan delivery agent's handheld UPI QR terminal when your hot meal is delivered to Coach <strong>{passengerDetails?.coach || 'B4'}</strong>, Berth <strong>{passengerDetails?.berth || '42'}</strong>.
                </p>
              </div>
            )}

            {/* Pay Now Button */}
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', position: 'relative' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin-fast" />
                    <span>
                      {processingStep === 1 ? 'Connecting to Banking Gateway...' : processingStep === 2 ? 'Verifying OTP & Authorizing...' : 'Payment Successful! Generating Ticket...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>
                      {paymentMethod === 'cod' ? `Confirm Seat Delivery Order (₹${billSummary?.grandTotal})` : `Pay ₹${billSummary?.grandTotal} Securely`}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Order & Passenger Berth Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
                <ShieldCheck size={13} /> Final Verification
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Order Payable Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Train</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{train?.train_no} {train?.name.split(' ')[0]}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery Station</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{station?.name} (Plat #{station?.platform})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Coach & Berth</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-orange)' }}>
                    Coach {passengerDetails?.coach}, Seat {passengerDetails?.berth} ({passengerDetails?.berth_type || 'Lower'})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Passenger Name</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{passengerDetails?.name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Mobile OTP Delivery</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{passengerDetails?.phone}</span>
                </div>

                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 900
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--accent-orange)' }}>₹{billSummary?.grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Official Gateway Badges */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem', color: 'var(--accent-orange)' }}>
                <ShieldCheck size={24} />
                <Lock size={24} />
                <CheckCircle2 size={24} />
              </div>
              <div>Authorized IRCTC e-Catering Payment Partner</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Instant auto-refund in case of train delays over 2 hours.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
