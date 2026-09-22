import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Train, MapPin, Clock, CheckCircle2, 
  UtensilsCrossed, PackageCheck, Truck, Home, Search, 
  Filter, RefreshCw, AlertCircle, Phone, ArrowUpRight, 
  Eye, Check, X, DollarSign, Award, LogOut, ChevronRight,
  TrendingUp, Users, Play, Navigation
} from 'lucide-react';
import { apiService } from '../services/api';
import { STATIONS, RESTAURANTS, MENU_ITEMS } from '../data/mockData';

export default function AdminDashboard({
  user,
  onLogout,
  onBackToApp,
  onTrackOrderOnMap,
  showToast
}) {
  const [selectedStationFilter, setSelectedStationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'analytics'
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);

  // Fetch orders on mount
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await apiService.getAllOrders();
      setOrders(fetchedOrders);
    } catch {
      setOrders(apiService.getLocalOrders());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => {
        if (o.order_id === orderId || o.id === orderId) {
          return { ...o, status: newStatus, order_status: newStatus };
        }
        return o;
      }));
      if (showToast) showToast(`Order #${orderId} marked as ${newStatus}! 🚂`, 'success');
    } catch (err) {
      if (showToast) showToast('Failed to update status', 'error');
    }
  };

  // Toggle Menu item availability
  const handleToggleDishAvailability = (dishId) => {
    setMenuItems(prev => prev.map(dish => {
      if (dish.id === dishId) {
        const updated = { ...dish, in_stock: dish.in_stock === false ? true : false };
        if (showToast) showToast(`"${dish.name}" is now ${updated.in_stock ? 'IN STOCK' : 'OUT OF STOCK'}!`, updated.in_stock ? 'success' : 'warning');
        return updated;
      }
      return dish;
    }));
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Station filter
    if (selectedStationFilter !== 'ALL') {
      const stationCode = order.station?.code || '';
      if (stationCode.toUpperCase() !== selectedStationFilter.toUpperCase()) return false;
    }
    // Status filter
    if (statusFilter !== 'ALL') {
      const currentStatus = order.status || order.order_status || 'CONFIRMED';
      if (statusFilter === 'ACTIVE') {
        if (currentStatus === 'DELIVERED') return false;
      } else if (currentStatus !== statusFilter) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (order.order_id || '').toLowerCase().includes(q);
      const matchName = (order.passenger?.name || '').toLowerCase().includes(q);
      const matchTrain = (order.train?.train_no || '').toLowerCase().includes(q) || (order.train?.name || '').toLowerCase().includes(q);
      const matchCoach = (order.passenger?.coach || '').toLowerCase().includes(q);
      if (!matchId && !matchName && !matchTrain && !matchCoach) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(o => (o.status || o.order_status) !== 'DELIVERED').length;
  const deliveredCount = orders.filter(o => (o.status || o.order_status) === 'DELIVERED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.billSummary?.grandTotal || o.total_amount || 450), 0);

  const statusList = ['CONFIRMED', 'PREPARING', 'PACKED', 'DISPATCHED', 'DELIVERED'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      paddingBottom: '4rem'
    }}>
      
      {/* Top Station Admin Control Bar */}
      <header style={{
        background: 'linear-gradient(90deg, #111827 0%, #1f293d 100%)',
        borderBottom: '2px solid var(--accent-amber)',
        position: 'sticky',
        top: 0,
        zIndex: 400,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {/* Logo & Officer Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              <ShieldCheck size={26} strokeWidth={2.5} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>IRCTC Station Pantry Admin</span>
                <span className="badge badge-orange" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', borderColor: 'rgba(245, 158, 11, 0.4)', fontSize: '0.65rem' }}>
                  OFFICER PORTAL
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Logged in as <strong>{user?.name || 'Vikram Malhotra'}</strong> • Vadodara Jn Hub (BRC)
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={loadOrders}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title="Refresh live orders"
            >
              <RefreshCw size={15} className={isLoading ? 'spin-icon' : ''} />
              <span className="hide-mobile">Refresh</span>
            </button>

            <button
              onClick={onBackToApp}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--accent-orange)' }}
            >
              <Train size={15} style={{ color: 'var(--accent-orange)' }} />
              <span>Customer Storefront</span>
            </button>

            <button
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={15} />
              <span className="hide-mobile">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <div className="container" style={{ marginTop: '2rem' }}>

        {/* Dashboard Tabs & Station Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          {/* Main Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: activeTab === 'orders' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'orders' ? '#000' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'var(--transition-fast)'
              }}
            >
              <PackageCheck size={16} />
              <span>Live Train Orders ({activeOrdersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: activeTab === 'menu' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'menu' ? '#000' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'var(--transition-fast)'
              }}
            >
              <UtensilsCrossed size={16} />
              <span>Kitchen Menu & Stock</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: activeTab === 'analytics' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'analytics' ? '#000' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'var(--transition-fast)'
              }}
            >
              <TrendingUp size={16} />
              <span>Station Analytics</span>
            </button>
          </div>

          {/* Station Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Station Node:</span>
            <select
              value={selectedStationFilter}
              onChange={(e) => setSelectedStationFilter(e.target.value)}
              className="input-field"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                borderColor: 'var(--accent-amber)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="ALL">🌐 All Stations Network</option>
              <option value="BRC">🏛️ Vadodara Jn (BRC)</option>
              <option value="ST">🏭 Surat (ST)</option>
              <option value="KOTA">📚 Kota Jn (KOTA)</option>
              <option value="CNB">🏭 Kanpur Central (CNB)</option>
              <option value="NDLS">🚩 New Delhi (NDLS)</option>
              <option value="AGC">🕌 Agra Cantt (AGC)</option>
              <option value="NGP">🍊 Nagpur Jn (NGP)</option>
            </select>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Kitchen Orders</span>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '0.35rem', borderRadius: '8px' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent-amber)' }}>
              {activeOrdersCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              In prep & platform delivery
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Deliveries</span>
              <div style={{ background: 'var(--veg-bg)', color: 'var(--veg-green)', padding: '0.35rem', borderRadius: '8px' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--veg-green)' }}>
              {deliveredCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              100% on-time at train berths
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Station Revenue Today</span>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--blue-info)', padding: '0.35rem', borderRadius: '8px' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--veg-green)', marginTop: '0.2rem' }}>
              +18.4% vs yesterday
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Platform Execs Active</span>
              <div style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--jain-purple)', padding: '0.35rem', borderRadius: '8px' }}>
                <Truck size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              14 Agents
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              FSSAI & IRCTC Badged
            </div>
          </div>

        </div>

        {/* TAB 1: LIVE TRAIN ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <div>
            {/* Search & Status Filters Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'var(--bg-secondary)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}>
              {/* Search input */}
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by Order ID, Train #, Passenger, Coach..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', height: '38px', fontSize: '0.85rem' }}
                />
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['ALL', 'ACTIVE', 'CONFIRMED', 'PREPARING', 'PACKED', 'DISPATCHED', 'DELIVERED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      background: statusFilter === st ? 'var(--accent-orange)' : 'var(--bg-tertiary)',
                      color: statusFilter === st ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                <Train size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Orders Found Matching Filters</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', margin: '0.25rem auto 1.5rem' }}>
                  Orders placed by passengers on trains will automatically stream into this live station dispatch console.
                </p>
                <button
                  onClick={() => { setStatusFilter('ALL'); setSelectedStationFilter('ALL'); setSearchQuery(''); }}
                  className="btn btn-secondary btn-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.map(order => {
                  const currentStatus = order.status || order.order_status || 'CONFIRMED';
                  const isDelivered = currentStatus === 'DELIVERED';
                  const stationName = order.station?.name || 'Vadodara Jn';
                  const platformNo = order.station?.platform || '2';
                  const trainNo = order.train?.train_no || '12951';
                  const trainName = order.train?.name || 'Rajdhani Express';

                  return (
                    <div 
                      key={order.order_id || order.id}
                      className="glass-card"
                      style={{
                        padding: '1.5rem',
                        borderLeft: isDelivered 
                          ? '5px solid var(--veg-green)' 
                          : currentStatus === 'DISPATCHED' 
                            ? '5px solid var(--accent-orange)' 
                            : '5px solid var(--accent-amber)',
                        background: 'var(--bg-secondary)',
                        transition: 'var(--transition-normal)'
                      }}
                    >
                      {/* Order Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
                              #{order.order_id || order.id}
                            </span>
                            <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                              OTP: {order.order_otp || '4892'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              • {new Date(order.placed_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.9rem' }}>
                              <Train size={16} style={{ color: 'var(--accent-orange)' }} />
                              <span>Train #{trainNo} - {trainName}</span>
                            </div>
                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--veg-green)', fontWeight: 600 }}>
                              <MapPin size={15} />
                              <span>{stationName} (Platform #{platformNo})</span>
                            </div>
                          </div>
                        </div>

                        {/* Passenger Seat Pill & Map Tracking Trigger */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            background: 'var(--bg-tertiary)',
                            padding: '0.5rem 0.9rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            textAlign: 'right'
                          }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Delivery Berth</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              Coach {order.passenger?.coach || 'B3'} • Seat {order.passenger?.berth || '42'}
                            </div>
                          </div>

                          <button
                            onClick={() => onTrackOrderOnMap(order)}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', borderColor: 'var(--accent-orange)' }}
                            title="Open Google Maps Live Tracking"
                          >
                            <Navigation size={15} />
                            <span>Live GPS Map</span>
                          </button>
                        </div>
                      </div>

                      {/* Items & Customer Info */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.25rem',
                        background: 'var(--bg-tertiary)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.25rem'
                      }}>
                        {/* Ordered Food Items */}
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Order Items ({(order.items || []).length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>
                                  <strong style={{ color: 'var(--accent-orange)' }}>{item.quantity}x</strong> {item.name}
                                </span>
                                <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Passenger Details & Payment */}
                        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Passenger & Payment
                          </div>
                          <div style={{ fontSize: '0.85rem' }}>
                            <div><strong>{order.passenger?.name || 'Rahul Sharma'}</strong></div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{order.passenger?.phone || '+91 98765 43210'}</div>
                            <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                                Total: ₹{(order.billSummary?.grandTotal || order.total_amount || 450).toFixed(0)}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                ({order.paymentDetails?.method || 'PAID ONLINE'})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Stepper Progression Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            Update Station Status:
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {statusList.map(st => {
                            const isCurrent = currentStatus === st;
                            return (
                              <button
                                key={st}
                                onClick={() => handleUpdateStatus(order.order_id || order.id, st)}
                                className="btn btn-sm"
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  borderRadius: 'var(--radius-sm)',
                                  background: isCurrent 
                                    ? (st === 'DELIVERED' ? 'var(--veg-green)' : 'var(--accent-orange)') 
                                    : 'var(--bg-tertiary)',
                                  color: isCurrent ? '#fff' : 'var(--text-secondary)',
                                  border: isCurrent ? 'none' : '1px solid var(--border-color)',
                                  boxShadow: isCurrent ? '0 2px 8px rgba(255, 107, 0, 0.4)' : 'none'
                                }}
                              >
                                {isCurrent && <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KITCHEN MENU & STOCK MANAGER */}
        {activeTab === 'menu' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Station Kitchen Menu & Live Stock Control</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Toggle dish availability in real-time when kitchen runs out of ingredients.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}>
              {menuItems.map(dish => {
                const inStock = dish.in_stock !== false;
                return (
                  <div 
                    key={dish.id} 
                    className="glass-card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      opacity: inStock ? 1 : 0.6,
                      border: inStock ? '1px solid var(--border-color)' : '1px dashed rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover'
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          border: dish.is_veg ? '2px solid var(--veg-green)' : '2px solid var(--nonveg-red)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1px'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: dish.is_veg ? 'var(--veg-green)' : 'var(--nonveg-red)'
                          }} />
                        </span>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dish.name}</h4>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-orange)', marginTop: '0.2rem' }}>
                        ₹{dish.price}
                      </div>

                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => handleToggleDishAvailability(dish.id)}
                          style={{
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            background: inStock ? 'var(--veg-bg)' : 'rgba(239, 68, 68, 0.15)',
                            color: inStock ? 'var(--veg-green)' : '#ef4444',
                            border: inStock ? '1px solid var(--veg-border)' : '1px solid rgba(239, 68, 68, 0.3)',
                            cursor: 'pointer'
                          }}
                        >
                          {inStock ? '🟢 In Stock (Available)' : '🔴 Out of Stock (86\'d)'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STATION ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              IRCTC Station Performance Report & Metrics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Top Ordered Express Dishes</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>1. Maharaja Veg Thali (Haldiram's)</span>
                    <strong>482 orders</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>2. Paneer Butter Masala Combo</span>
                    <strong>310 orders</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>3. Farmhouse Cheese Pizza (Domino's)</span>
                    <strong>265 orders</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>4. Masala Dosa with Sambar</span>
                    <strong>195 orders</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Station Punctuality & SLA</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Average Kitchen Cooking Time</span>
                    <strong style={{ color: 'var(--veg-green)' }}>8.4 mins</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Platform Handover Before Departure</span>
                    <strong style={{ color: 'var(--veg-green)' }}>100% on-time</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Passenger Rating Score</span>
                    <strong style={{ color: 'var(--accent-amber)' }}>4.8 ★ / 5.0</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>FSSAI Hygiene Audit Compliance</span>
                    <strong style={{ color: 'var(--veg-green)' }}>Grade A+ (Certified)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
