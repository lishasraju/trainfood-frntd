import React, { useState } from 'react';
import { 
  Train, Search, Ticket, Sparkles, MapPin, Clock, ShieldCheck, 
  ChevronRight, Star, UtensilsCrossed, Award, CheckCircle, ArrowRight,
  Flame, HeartHandshake, Zap, Smile
} from 'lucide-react';
import { TRAINS, CATEGORIES, RESTAURANTS, MOCK_PNRS } from '../data/mockData';

export default function HomePage({ 
  onSelectTrain, 
  onPnrLookup, 
  onSelectCategory,
  onSelectRestaurant 
}) {
  const [searchTab, setSearchTab] = useState('train'); // 'train' | 'pnr'
  const [trainQuery, setTrainQuery] = useState('');
  const [pnrQuery, setPnrQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  // Filter trains for auto-suggestions
  const filteredTrains = trainQuery.trim()
    ? TRAINS.filter(t => 
        t.train_no.includes(trainQuery.trim()) || 
        t.name.toLowerCase().includes(trainQuery.toLowerCase()) ||
        t.source_station_name.toLowerCase().includes(trainQuery.toLowerCase()) ||
        t.dest_station_name.toLowerCase().includes(trainQuery.toLowerCase())
      )
    : [];

  const handleTrainSubmit = (e) => {
    e?.preventDefault();
    setSearchError('');
    if (!trainQuery.trim()) {
      setSearchError('Please enter a train number or train name (e.g. 12951, Rajdhani, Vande Bharat)');
      return;
    }
    const matched = TRAINS.find(t => 
      t.train_no === trainQuery.trim() || 
      t.name.toLowerCase().includes(trainQuery.toLowerCase())
    );
    if (matched) {
      onSelectTrain(matched);
    } else {
      setSearchError(`Train "${trainQuery}" not found. Try 12951, 22436, 12002, 12628 or select from popular trains below.`);
    }
  };

  const handlePnrSubmit = (e) => {
    e?.preventDefault();
    setSearchError('');
    const clean = pnrQuery.trim().replace(/\D/g, '');
    if (clean.length < 10) {
      setSearchError('Please enter a valid 10-digit PNR number or click one of the sample PNRs below.');
      return;
    }
    onPnrLookup(clean);
  };

  return (
    <div className="homepage" style={{ paddingBottom: '5rem' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '3.5rem 0 4.5rem',
        background: 'radial-gradient(ellipse at 50% 20%, rgba(255, 107, 0, 0.15) 0%, rgba(10, 14, 23, 0) 70%)',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        
        {/* Decorative background grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          
          {/* Top highlight pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-orange-glow)',
            border: '1px solid rgba(255, 107, 0, 0.4)',
            color: 'var(--accent-orange)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={16} />
            <span>Official IRCTC e-Catering Partner • 100% Seat Delivery Guarantee</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: '920px',
            margin: '0 auto 1.25rem'
          }}>
            Craving Fresh Restaurant Food on Your <span className="gradient-text">Train Journey?</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Get hot, hygienic & delicious meals from top brands like Haldiram's, Domino's & Behrouz delivered right to your train seat & berth across 500+ railway stations!
          </p>

          {/* Search Box Card */}
          <div className="glass-card" style={{
            maxWidth: '780px',
            margin: '0 auto',
            padding: '1.75rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 107, 0, 0.15)',
            border: '1.5px solid rgba(255, 107, 0, 0.3)'
          }}>
            
            {/* Search Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.75rem'
            }}>
              <button
                type="button"
                onClick={() => { setSearchTab('train'); setSearchError(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: searchTab === 'train' ? 'var(--accent-orange)' : 'var(--bg-tertiary)',
                  color: searchTab === 'train' ? '#fff' : 'var(--text-secondary)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Train size={18} />
                <span>Search by Train No / Name</span>
              </button>

              <button
                type="button"
                onClick={() => { setSearchTab('pnr'); setSearchError(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: searchTab === 'pnr' ? 'var(--accent-orange)' : 'var(--bg-tertiary)',
                  color: searchTab === 'pnr' ? '#fff' : 'var(--text-secondary)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Ticket size={18} />
                <span>Search by 10-Digit PNR</span>
              </button>
            </div>

            {/* Train Search Form */}
            {searchTab === 'train' ? (
              <form onSubmit={handleTrainSubmit} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--accent-orange)',
                      pointerEvents: 'none'
                    }}>
                      <Train size={20} />
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter Train Number (e.g. 12951) or Name (e.g. Rajdhani)"
                      value={trainQuery}
                      onChange={(e) => { setTrainQuery(e.target.value); setSearchError(''); }}
                      style={{
                        paddingLeft: '3rem',
                        height: '54px',
                        fontSize: '1rem',
                        borderRadius: 'var(--radius-md)'
                      }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ height: '54px', padding: '0 2rem', fontSize: '1.05rem' }}
                  >
                    <Search size={20} />
                    <span>Find Food</span>
                  </button>
                </div>

                {/* Auto Suggestions Dropdown */}
                {filteredTrains.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-hover)',
                    borderRadius: 'var(--radius-md)',
                    zIndex: 100,
                    maxHeight: '260px',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-lg)',
                    textAlign: 'left'
                  }}>
                    {filteredTrains.map((train) => (
                      <div
                        key={train.train_no}
                        onClick={() => onSelectTrain(train)}
                        style={{
                          padding: '0.85rem 1.25rem',
                          borderBottom: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ color: 'var(--accent-orange)' }}>{train.train_no}</strong>
                            <span style={{ fontWeight: 600 }}>{train.name}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {train.source_station_name} ➔ {train.dest_station_name} • {train.train_type}
                          </div>
                        </div>
                        <ArrowRight size={18} style={{ color: 'var(--accent-orange)' }} />
                      </div>
                    ))}
                  </div>
                )}
              </form>
            ) : (
              /* PNR Search Form */
              <form onSubmit={handlePnrSubmit}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--accent-orange)',
                      pointerEvents: 'none'
                    }}>
                      <Ticket size={20} />
                    </div>
                    <input
                      type="text"
                      maxLength={10}
                      className="form-input"
                      placeholder="Enter 10-Digit PNR Number"
                      value={pnrQuery}
                      onChange={(e) => { setPnrQuery(e.target.value); setSearchError(''); }}
                      style={{
                        paddingLeft: '3rem',
                        height: '54px',
                        fontSize: '1.05rem',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-md)'
                      }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ height: '54px', padding: '0 2rem', fontSize: '1.05rem' }}
                  >
                    <Search size={20} />
                    <span>Auto-Fetch Details</span>
                  </button>
                </div>

                {/* Sample PNRs for instant testing */}
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try Sample PNR:</span>
                  {Object.keys(MOCK_PNRS).map(pnrKey => (
                    <button
                      key={pnrKey}
                      type="button"
                      onClick={() => onPnrLookup(pnrKey)}
                      className="badge badge-orange"
                      style={{ cursor: 'pointer', border: '1px dashed var(--accent-orange)' }}
                    >
                      {pnrKey} ({MOCK_PNRS[pnrKey].passenger_name.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </form>
            )}

            {/* Error Message banner */}
            {searchError && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--nonveg-bg)',
                border: '1px solid var(--nonveg-border)',
                color: 'var(--nonveg-red)',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                {searchError}
              </div>
            )}
          </div>

          {/* Popular Superfast Trains Quick Chips */}
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Popular Express Trains:
            </span>
            {TRAINS.map((train) => (
              <button
                key={train.train_no}
                onClick={() => onSelectTrain(train)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem'
                }}
              >
                <Train size={13} style={{ color: 'var(--accent-orange)' }} />
                <span><strong>{train.train_no}</strong> {train.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginTop: '3.5rem',
            maxWidth: '900px',
            margin: '3.5rem auto 0'
          }}>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-orange)' }}>500+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Railway Stations Covered</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--veg-green)' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FSSAI Certified Hygiene</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>45,000+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hot Meals Delivered Daily</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>4.8 ★</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Passenger Satisfaction</div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Brands & Top Restaurants */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
                <Award size={14} /> Official Brand Partners
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Order from Verified Premium Kitchens</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Prepared fresh upon train arrival and delivered directly to your berth.</p>
            </div>
          </div>

          <div className="grid-responsive-3">
            {RESTAURANTS.map((rest) => (
              <div 
                key={rest.id} 
                className="glass-card glass-card-hover"
                onClick={() => onSelectRestaurant(rest)}
                style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '160px' }}>
                  <img 
                    src={rest.image} 
                    alt={rest.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#fff',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
                    <span>{rest.rating} ({rest.reviews_count}+)</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: rest.is_pure_veg ? 'var(--veg-bg)' : 'rgba(0, 0, 0, 0.75)',
                    border: rest.is_pure_veg ? '1px solid var(--veg-green)' : '1px solid var(--border-color)',
                    color: rest.is_pure_veg ? 'var(--veg-green)' : '#fff',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {rest.is_pure_veg ? '🌿 100% Pure Veg' : '🍗 Veg & Non-Veg'}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{rest.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {rest.cuisine}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} style={{ color: 'var(--accent-orange)' }} /> {rest.prep_time}
                    </span>
                    <span style={{ color: 'var(--accent-orange)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      View Menu <ChevronRight size={15} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Food Categories */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            <div className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
              <UtensilsCrossed size={14} /> Mouthwatering Cuisines
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Explore What Passengers Love</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>From traditional North Indian Thalis to steaming South Indian Idli Sambars.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1rem'
          }}>
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="glass-card glass-card-hover"
                style={{
                  padding: '1.25rem 0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How RailBite Works in 4 Steps */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <div className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
              <Zap size={14} /> Seamless 4-Step Process
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>How Food Reaches Your Train Berth</h2>
            <p style={{ color: 'var(--text-muted)' }}>Never step out of the train for unhygienic platform food again.</p>
          </div>

          <div className="grid-responsive-4">
            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--accent-orange-glow)',
                color: 'var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>1</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Enter Train / PNR</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Provide your train number or 10-digit PNR to auto-fetch route and upcoming halt timings.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--accent-orange-glow)',
                color: 'var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>2</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Select Delivery Station</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Choose any upcoming station on your route with sufficient halt time for food handover.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--accent-orange-glow)',
                color: 'var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>3</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Pick Favorite Dishes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Browse menus from Domino's, Haldiram's, Behrouz, and regional pure veg/Jain partners.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--accent-orange-glow)',
                color: 'var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>4</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Delivery at Your Seat</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Delivery executive boards your coach and hands over fresh, steaming food with zero hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Highlights */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 61, 0.8) 0%, rgba(17, 24, 39, 0.95) 100%)',
            border: '1px solid rgba(255, 107, 0, 0.25)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--veg-green)', flexShrink: 0 }}>
                  <ShieldCheck size={36} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>100% FSSAI Certified</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Strict hygiene standards, clean kitchen audits, and contactless thermal packaging.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--accent-orange)', flexShrink: 0 }}>
                  <Clock size={36} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>On-Time Train Handover</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Delivery agent arrives at the platform 15 minutes before your train pulls into the station.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--accent-amber)', flexShrink: 0 }}>
                  <HeartHandshake size={36} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>100% Train Delay Refund</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    If your train schedule shifts or misses the station, receive an instant 100% refund.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
