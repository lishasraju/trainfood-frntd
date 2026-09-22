import React from 'react';
import { 
  Train, MapPin, Clock, ArrowRight, CheckCircle2, AlertCircle, 
  UtensilsCrossed, Sparkles, Navigation, Calendar, ShieldCheck
} from 'lucide-react';
import { STATIONS } from '../data/mockData';

export default function StationSelector({ 
  train, 
  selectedStation, 
  onSelectStation, 
  onBackToHome 
}) {
  if (!train) return null;

  return (
    <div className="station-selector-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Navigation Breadcrumb / Back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={onBackToHome}
            className="btn btn-secondary btn-sm"
          >
            ← Back to Trains
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select Delivery Station</span>
        </div>

        {/* Train Overview Banner Card */}
        <div className="glass-card" style={{
          padding: '2rem',
          marginBottom: '2.5rem',
          borderLeft: '4px solid var(--accent-orange)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-orange" style={{ fontSize: '0.85rem' }}>
                  <Train size={14} /> Train #{train.train_no}
                </span>
                <span className="badge badge-blue">
                  {train.train_type}
                </span>
                <span className="badge badge-green">
                  {train.running_days?.join(', ') || 'Daily'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {train.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span><strong>{train.source_station_name}</strong> ({train.source_station_code})</span>
                <ArrowRight size={16} style={{ color: 'var(--accent-orange)' }} />
                <span><strong>{train.dest_station_name}</strong> ({train.dest_station_code})</span>
                <span style={{ color: 'var(--text-muted)' }}>• Duration: {train.duration}</span>
              </p>
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coaches Available</div>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', justifyContent: 'center' }}>
                {train.coaches_available?.map((c) => (
                  <span key={c} style={{
                    padding: '0.2rem 0.5rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-subtle)'
                  }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
            <MapPin size={14} /> Step 2 of 4
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Choose Your Upcoming Delivery Station</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Pick any upcoming station on your journey route with adequate halt duration for fresh food delivery.
          </p>
        </div>

        {/* Interactive Station Halts Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {train.schedules?.map((halt, idx) => {
            const isEligible = halt.eligible;
            const isSelected = selectedStation?.code === halt.station_code;
            const isOrigin = idx === 0;
            const isDestination = idx === (train.schedules.length - 1);

            return (
              <div
                key={halt.station_code}
                className="glass-card"
                style={{
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  border: isSelected 
                    ? '2px solid var(--accent-orange)' 
                    : isEligible 
                      ? '1px solid var(--border-color)' 
                      : '1px solid var(--border-subtle)',
                  background: isSelected 
                    ? 'rgba(255, 107, 0, 0.08)' 
                    : !isEligible 
                      ? 'rgba(15, 23, 42, 0.4)' 
                      : 'var(--bg-card)',
                  opacity: (!isEligible && !isOrigin && !isDestination) ? 0.7 : 1,
                  transition: 'var(--transition-normal)'
                }}
              >
                {/* Station Info & Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '240px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: isOrigin ? 'var(--blue-bg)' : isDestination ? 'var(--nonveg-bg)' : isEligible ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                    border: isOrigin ? '1px solid rgba(59, 130, 246, 0.4)' : isDestination ? '1px solid var(--nonveg-border)' : isEligible ? '1px solid rgba(255, 107, 0, 0.4)' : '1px solid var(--border-color)',
                    color: isOrigin ? 'var(--blue-info)' : isDestination ? 'var(--nonveg-red)' : isEligible ? 'var(--accent-orange)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    {isOrigin ? 'SRC' : isDestination ? 'DST' : (idx + 1)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{halt.station_name}</h3>
                      <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>{halt.station_code}</span>
                      {isEligible && (
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                          <CheckCircle2 size={12} /> Food Delivery Active
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Platform #{halt.platform} • Distance: {halt.distance_km} km
                    </div>
                  </div>
                </div>

                {/* Timing & Halt Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Arrival</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {halt.arrival}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Departure</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {halt.departure}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Halt Duration</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isEligible ? 'var(--veg-green)' : 'var(--text-muted)' }}>
                      {halt.halt_mins > 0 ? `${halt.halt_mins} mins halt` : 'Start / End'}
                    </div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div>
                  {isEligible ? (
                    <button
                      onClick={() => onSelectStation({ code: halt.station_code, name: halt.station_name, platform: halt.platform, arrival: halt.arrival, departure: halt.departure })}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                      style={{ minWidth: '170px' }}
                    >
                      <UtensilsCrossed size={16} />
                      <span>{isSelected ? 'Station Selected ✓' : 'Order Food Here'}</span>
                    </button>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 1rem' }}>
                      {isOrigin ? 'Boarding Station' : isDestination ? 'Final Destination' : 'Halt too short (< 3m)'}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
