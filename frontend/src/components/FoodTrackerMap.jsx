import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, Train, MapPin, Clock, Phone, 
  ShieldCheck, CheckCircle2, Play, Pause, FastForward, 
  RotateCcw, Maximize2, Minimize2, Compass, Layers, 
  Sparkles, Radio, Zap, AlertCircle, UtensilsCrossed,
  PackageCheck, Truck, Home
} from 'lucide-react';

export default function FoodTrackerMap({
  order,
  isModal = false,
  onClose = null
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' | 'satellite' | 'google-light'
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x | 2x | 4x
  const [simulationProgress, setSimulationProgress] = useState(0.35); // 0.0 (Kitchen) to 1.0 (Seat)
  const [activeFocus, setActiveFocus] = useState('agent'); // 'agent' | 'train' | 'station'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  // Train & Delivery partner details
  const trainNo = order?.train?.train_no || '12951';
  const trainName = order?.train?.name || 'Mumbai Central - New Delhi Rajdhani Express';
  const stationName = order?.station?.name || 'Vadodara Jn (BRC)';
  const platformNo = order?.station?.platform || '2';
  const coachNo = order?.passenger?.coach || 'B3';
  const berthNo = order?.passenger?.berth || '42';
  const deliveryOtp = order?.order_otp || '4892';
  const restaurantName = order?.items?.[0]?.restaurant_name || "Haldiram's Express";

  // Real-time GPS Simulation Timer
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 1.0) {
          return 1.0;
        }
        const step = 0.008 * simulationSpeed;
        return Math.min(1.0, prev + step);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  // Derived telemetry metrics
  const totalDistanceKm = 2.4; // 2.4 km from station kitchen to platform
  const distanceRemainingMeters = Math.max(0, Math.round((1 - simulationProgress) * totalDistanceKm * 1000));
  const etaMins = Math.max(0, Math.ceil((1 - simulationProgress) * 12));
  const trainSpeedKmh = simulationProgress >= 0.85 ? 0 : Math.round(115 - (simulationProgress * 80));
  const agentSpeedKmh = simulationProgress >= 1.0 ? 0 : 28 + Math.round(Math.sin(Date.now() / 1000) * 4);

  // Route Waypoints (Canvas Coordinates: 0 to 100 relative)
  const kitchenPos = { x: 18, y: 72 };
  const routeWaypoints = [
    { x: 18, y: 72 }, // Kitchen
    { x: 30, y: 64 }, // Main Station Road
    { x: 45, y: 55 }, // Station Gate 1 / Parking
    { x: 62, y: 48 }, // Concourse & Platform Overbridge
    { x: 78, y: 38 }, // Platform #2
    { x: 86, y: 32 }  // Coach B3 Door
  ];

  // Train Railway Track Coordinates
  const trainStartPos = { x: 5, y: 15 };
  const trainStationPos = { x: 86, y: 32 };
  const trainEndPos = { x: 95, y: 38 };

  // Current Delivery Agent Position interpolated along waypoints
  const getCurrentAgentPos = () => {
    const totalSegments = routeWaypoints.length - 1;
    const scaledProgress = simulationProgress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    const p1 = routeWaypoints[segmentIndex];
    const p2 = routeWaypoints[segmentIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress
    };
  };

  // Current Train Position interpolated along tracks
  const getCurrentTrainPos = () => {
    // Train reaches station around progress 0.8
    const trainProgress = Math.min(1.0, simulationProgress * 1.25);
    return {
      x: trainStartPos.x + (trainStationPos.x - trainStartPos.x) * trainProgress,
      y: trainStartPos.y + (trainStationPos.y - trainStartPos.y) * trainProgress
    };
  };

  const agentPos = getCurrentAgentPos();
  const trainPos = getCurrentTrainPos();

  // Determine active delivery stage based on progress
  let currentStageTitle = 'Cooking & Packaging in Station Kitchen';
  let currentStageIcon = UtensilsCrossed;
  if (simulationProgress >= 0.98) {
    currentStageTitle = `Delivered at Seat ${coachNo}-${berthNo}!`;
    currentStageIcon = CheckCircle2;
  } else if (simulationProgress >= 0.75) {
    currentStageTitle = `Agent on Platform #${platformNo}, Approaching Coach ${coachNo}`;
    currentStageIcon = Truck;
  } else if (simulationProgress >= 0.45) {
    currentStageTitle = 'En route to Railway Station Platform Gate';
    currentStageIcon = Navigation;
  } else if (simulationProgress >= 0.2) {
    currentStageTitle = 'Order Packed & Handed to Delivery Executive';
    currentStageIcon = PackageCheck;
  }

  const StageIcon = currentStageIcon;

  return (
    <div 
      ref={containerRef}
      className={`food-tracker-map-wrapper ${isFullscreen ? 'fullscreen-map' : ''}`}
      style={{
        position: 'relative',
        borderRadius: isFullscreen ? 0 : 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1.5px solid var(--border-hover)',
        background: mapTheme === 'google-light' ? '#e5e3df' : mapTheme === 'satellite' ? '#0b1320' : '#0a0e17',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Top Map HUD Overlay Header */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '0.75rem',
        pointerEvents: 'none'
      }}>
        {/* Live Delivery Status Badge */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'auto'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: simulationProgress >= 0.98 ? 'var(--veg-green)' : 'var(--accent-orange)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(255, 107, 0, 0.5)'
          }}>
            <StageIcon size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                <Radio size={10} style={{ animation: 'pulse 1.5s infinite' }} /> LIVE GOOGLE GPS
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Order #{order?.order_id || 'RB-849204'}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
              {currentStageTitle}
            </div>
          </div>
        </div>

        {/* Top Right Delivery OTP Pill */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--veg-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.9rem',
          textAlign: 'right',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'auto'
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Delivery OTP</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--veg-green)', letterSpacing: '0.08em' }}>
            {deliveryOtp}
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage (SVG & Canvas Styled like Google Maps) */}
      <div style={{
        width: '100%',
        height: isFullscreen ? 'calc(100vh - 120px)' : '420px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'grab'
      }}>
        
        {/* Map Background Tiles Grid / Terrain Texture */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          {/* Base Background */}
          <rect 
            width="100" 
            height="100" 
            fill={mapTheme === 'google-light' ? '#f2efe9' : mapTheme === 'satellite' ? '#08101e' : '#0d131f'} 
          />

          {/* Urban Grid Lines (City Streets) */}
          <g stroke={mapTheme === 'google-light' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)'} strokeWidth="1.2">
            <line x1="0" y1="25" x2="100" y2="25" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="75" x2="100" y2="75" />
            <line x1="25" y1="0" x2="25" y2="100" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="75" y1="0" x2="75" y2="100" />
          </g>

          {/* Major Railway Track Corridor (Silver / Gold with Ties) */}
          <path
            d="M 0 10 Q 50 25 100 35"
            fill="none"
            stroke={mapTheme === 'google-light' ? '#94a3b8' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth="2.5"
            strokeDasharray="1.5 1.5"
          />
          <path
            d="M 0 10 Q 50 25 100 35"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.8"
            opacity="0.7"
          />

          {/* Station Platform Outline Area */}
          <rect 
            x="72" 
            y="28" 
            width="22" 
            height="15" 
            rx="2"
            fill={mapTheme === 'google-light' ? '#cbd5e1' : 'rgba(30, 41, 59, 0.8)'}
            stroke="rgba(245, 158, 11, 0.5)"
            strokeWidth="0.8"
          />
          <text 
            x="83" 
            y="36" 
            fontSize="2.2" 
            fontWeight="bold"
            fill={mapTheme === 'google-light' ? '#334155' : '#94a3b8'} 
            textAnchor="middle"
          >
            {stationName} (Plat #{platformNo})
          </text>

          {/* Animated Delivery Route Polyline */}
          <polyline
            points={routeWaypoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255, 107, 0, 0.3)"
            strokeWidth="2.2"
          />
          <polyline
            points={routeWaypoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#ff6b00"
            strokeWidth="1.2"
            strokeDasharray="2 1.5"
            strokeLinecap="round"
          />

          {/* Traveled Route Solid Path */}
          {simulationProgress > 0 && (
            <line
              x1={kitchenPos.x}
              y1={kitchenPos.y}
              x2={agentPos.x}
              y2={agentPos.y}
              stroke="var(--veg-green)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}

        </svg>

        {/* PIN 1: Station Kitchen / Restaurant Pin */}
        <div style={{
          position: 'absolute',
          left: `${kitchenPos.x}%`,
          top: `${kitchenPos.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '2px solid var(--accent-orange)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-orange)',
            boxShadow: '0 0 15px rgba(255, 107, 0, 0.4)',
            margin: '0 auto'
          }}>
            <UtensilsCrossed size={16} />
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            marginTop: '3px',
            whiteSpace: 'nowrap',
            border: '1px solid var(--border-color)'
          }}>
            {restaurantName}
          </div>
        </div>

        {/* PIN 2: Approaching Train Pin */}
        <div style={{
          position: 'absolute',
          left: `${trainPos.x}%`,
          top: `${trainPos.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 12,
          textAlign: 'center',
          transition: 'all 0.5s linear'
        }}>
          <div style={{
            background: '#3b82f6',
            color: '#fff',
            borderRadius: '8px',
            padding: '0.2rem 0.5rem',
            fontSize: '0.65rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)',
            border: '1.5px solid #60a5fa'
          }}>
            <Train size={12} />
            <span>#{trainNo} ({trainSpeedKmh} km/h)</span>
          </div>
        </div>

        {/* PIN 3: LIVE Moving Delivery Partner (Agent) */}
        <div style={{
          position: 'absolute',
          left: `${agentPos.x}%`,
          top: `${agentPos.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          textAlign: 'center',
          transition: 'all 0.5s linear'
        }}>
          {/* Pulsing Beacon Ring */}
          <div style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            background: 'rgba(255, 107, 0, 0.3)',
            animation: 'pulse 1.5s infinite'
          }} />

          {/* Agent Avatar Pin */}
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
            border: '2.5px solid #fff',
            boxShadow: '0 4px 15px rgba(255, 107, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Truck size={20} />
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            marginTop: '4px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 107, 0, 0.4)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}>
            Ramesh K. ({agentSpeedKmh} km/h)
          </div>
        </div>

        {/* PIN 4: Target Berth / Coach Drop-off Pin */}
        <div style={{
          position: 'absolute',
          left: '86%',
          top: '32%',
          transform: 'translate(-50%, -50%)',
          zIndex: 11,
          textAlign: 'center'
        }}>
          <div style={{
            background: 'var(--veg-green)',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)',
            border: '2px solid #fff',
            margin: '0 auto'
          }}>
            <MapPin size={16} />
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            color: 'var(--veg-green)',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            marginTop: '3px',
            whiteSpace: 'nowrap',
            border: '1px solid var(--veg-border)'
          }}>
            Seat: Coach {coachNo}-{berthNo}
          </div>
        </div>

      </div>

      {/* Floating Map Controls Toolbar (Right Edge) */}
      <div style={{
        position: 'absolute',
        right: '1rem',
        top: '4.5rem',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '0.35rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Layer / Theme Toggle */}
        <button
          onClick={() => setMapTheme(prev => prev === 'dark' ? 'satellite' : prev === 'satellite' ? 'google-light' : 'dark')}
          title="Toggle Google Map Styles (Dark / Satellite / Road)"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: 'transparent'
          }}
        >
          <Layers size={16} />
        </button>

        {/* Center on Delivery Agent */}
        <button
          onClick={() => setActiveFocus('agent')}
          title="Center GPS on Delivery Partner"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeFocus === 'agent' ? 'var(--accent-orange)' : 'var(--text-secondary)',
            background: activeFocus === 'agent' ? 'rgba(255, 107, 0, 0.15)' : 'transparent'
          }}
        >
          <Truck size={16} />
        </button>

        {/* Center on Train */}
        <button
          onClick={() => setActiveFocus('train')}
          title="Center GPS on Train"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeFocus === 'train' ? '#3b82f6' : 'var(--text-secondary)',
            background: activeFocus === 'train' ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
          }}
        >
          <Train size={16} />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle Fullscreen Map"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: 'transparent'
          }}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Bottom Live Telemetry Dashboard & Simulation Bar */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        alignItems: 'center'
      }}>
        
        {/* Metric 1: Distance to Berth */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Distance to Coach</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-orange)' }}>
            {distanceRemainingMeters > 0 ? `${distanceRemainingMeters} m` : 'Arrived at Seat!'}
          </div>
        </div>

        {/* Metric 2: Estimated ETA */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated Delivery</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--veg-green)' }}>
            {etaMins > 0 ? `~${etaMins} mins` : 'Just Now'}
          </div>
        </div>

        {/* Metric 3: Delivery Partner Contact */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Executive</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Ramesh K.</div>
          </div>
          <a
            href="tel:+919876543210"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem 0.6rem', color: 'var(--veg-green)', borderColor: 'var(--veg-green)' }}
            title="Call Delivery Partner"
          >
            <Phone size={14} />
          </a>
        </div>

        {/* Metric 4: GPS Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
          >
            {isSimulating ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Resume</>}
          </button>

          <button
            onClick={() => setSimulationSpeed(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem', color: 'var(--accent-orange)' }}
          >
            <FastForward size={13} /> {simulationSpeed}x
          </button>

          <button
            onClick={() => setSimulationProgress(0)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
            title="Restart Route"
          >
            <RotateCcw size={13} />
          </button>
        </div>

      </div>

    </div>
  );
}
