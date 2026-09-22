import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import StationSelector from './components/StationSelector';
import FoodMenu from './components/FoodMenu';
import CartDrawer from './components/CartDrawer';
import OrderSummary from './components/OrderSummary';
import PaymentPage from './components/PaymentPage';
import OrderConfirmation from './components/OrderConfirmation';
import InvoiceModal from './components/InvoiceModal';
import MyOrdersModal from './components/MyOrdersModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import AdminDashboard from './components/AdminDashboard';
import FoodTrackerMap from './components/FoodTrackerMap';
import InstallPwaBanner from './components/InstallPwaBanner';
import { apiService } from './services/api';
import { TRAINS, STATIONS, RESTAURANTS, MOCK_PNRS } from './data/mockData';
import { X, Navigation } from 'lucide-react';

export default function App() {
  // Navigation View State: 'home' | 'stations' | 'menu' | 'summary' | 'payment' | 'confirmation' | 'admin'
  const [currentView, setCurrentView] = useState('home');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => apiService.getLocalAuthUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('user'); // 'user' | 'admin'
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Standalone Google Map Tracker Modal
  const [mapTrackingOrder, setMapTrackingOrder] = useState(null);

  // Selected State
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('railbite_cart') || '[]');
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Passenger & Seat Details
  const [passengerDetails, setPassengerDetails] = useState(() => {
    const authUser = apiService.getLocalAuthUser();
    if (authUser && authUser.role !== 'admin') {
      return {
        name: authUser.name || 'Rahul Sharma',
        phone: authUser.phone || '9876543210',
        email: authUser.email || 'rahul@railbite.in',
        coach: authUser.coach || 'B3',
        berth: authUser.berth || '42',
        berth_type: authUser.berth_type || 'Lower Berth',
        pnr: authUser.pnr || '2485961034'
      };
    }
    try {
      return JSON.parse(localStorage.getItem('railbite_passenger') || '{"name":"Rahul Sharma","phone":"9876543210","email":"rahul@railbite.in","coach":"B3","berth":"42","berth_type":"Lower Berth","pnr":"2485961034"}');
    } catch {
      return {
        name: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul@railbite.in',
        coach: 'B3',
        berth: '42',
        berth_type: 'Lower Berth',
        pnr: '2485961034'
      };
    }
  });

  // Orders State
  const [orders, setOrders] = useState(() => apiService.getLocalOrders());
  const [currentOrder, setCurrentOrder] = useState(null);
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState(null);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // Bill Summary calculation transfer
  const [latestBillSummary, setLatestBillSummary] = useState(null);

  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('railbite_theme') || 'dark';
  });

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Sync theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('railbite_theme', theme);
  }, [theme]);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('railbite_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync passenger to local storage
  useEffect(() => {
    localStorage.setItem('railbite_passenger', JSON.stringify(passengerDetails));
  }, [passengerDetails]);

  // Check current auth user on initial mount
  useEffect(() => {
    apiService.getMe().then(user => {
      if (user) {
        setCurrentUser(user);
        if (user.role !== 'admin') {
          setPassengerDetails(prev => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            coach: user.coach || prev.coach,
            berth: user.berth || prev.berth,
            pnr: user.pnr || prev.pnr
          }));
        }
      }
    });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Authentication Handlers
  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
      showToast(`Welcome Station Pantry Officer ${user.name}! 🛡️`, 'success');
    } else {
      setPassengerDetails(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        coach: user.coach || prev.coach,
        berth: user.berth || prev.berth,
        pnr: user.pnr || prev.pnr
      }));
      showToast(`Welcome back, ${user.name}! 🚂`, 'success');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    if (currentView === 'admin') {
      setCurrentView('home');
    }
    showToast('You have been signed out successfully.', 'info');
  };

  const handleOpenAuthModal = (tab = 'user') => {
    setAuthDefaultTab(tab);
    setIsAuthModalOpen(true);
  };

  // 1. Train Selection from Home
  const handleSelectTrain = (train) => {
    setSelectedTrain(train);
    const firstEligible = train.schedules?.find(s => s.eligible);
    if (firstEligible) {
      setSelectedStation({
        code: firstEligible.station_code,
        name: firstEligible.station_name,
        platform: firstEligible.platform,
        arrival: firstEligible.arrival,
        departure: firstEligible.departure
      });
    }
    setCurrentView('stations');
    showToast(`Loaded route for Train #${train.train_no} ${train.name}`, 'success');
  };

  // 2. PNR Lookup from Home
  const handlePnrLookup = async (pnr) => {
    showToast('Fetching train & passenger details from IRCTC...', 'info');
    const pnrData = await apiService.lookupPnr(pnr);
    if (pnrData) {
      const train = TRAINS.find(t => t.train_no === pnrData.train_no) || TRAINS[0];
      setSelectedTrain(train);

      const firstEligible = train.schedules?.find(s => s.eligible);
      if (firstEligible) {
        setSelectedStation({
          code: firstEligible.station_code,
          name: firstEligible.station_name,
          platform: firstEligible.platform,
          arrival: firstEligible.arrival,
          departure: firstEligible.departure
        });
      }

      setPassengerDetails({
        name: pnrData.passenger_name || 'Passenger',
        phone: pnrData.phone || '9876543210',
        email: pnrData.email || 'passenger@example.com',
        coach: pnrData.coach || 'B4',
        berth: pnrData.berth || '42',
        berth_type: pnrData.berth_type || 'Lower Berth',
        pnr: pnrData.pnr
      });

      setCurrentView('stations');
      showToast(`Welcome ${pnrData.passenger_name}! Seat ${pnrData.coach}-${pnrData.berth} loaded.`, 'success');
    }
  };

  // 3. Category Selection from Home
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (!selectedTrain) {
      setSelectedTrain(TRAINS[0]);
      setSelectedStation({
        code: "KOTA",
        name: "Kota Jn",
        platform: "1A",
        arrival: "03:15",
        departure: "03:20"
      });
    }
    setCurrentView('menu');
  };

  // 4. Restaurant Selection from Home
  const handleSelectRestaurant = (rest) => {
    setSelectedRestaurantId(rest.id);
    if (!selectedTrain) {
      setSelectedTrain(TRAINS[0]);
      setSelectedStation({
        code: rest.station_codes[0] || "ST",
        name: "Surat",
        platform: "1",
        arrival: "19:43",
        departure: "19:48"
      });
    }
    setCurrentView('menu');
  };

  // 5. Station Selection
  const handleSelectStation = (station) => {
    setSelectedStation(station);
    setCurrentView('menu');
    showToast(`Delivery station set to ${station.name} (Platform #${station.platform})`, 'success');
  };

  // Cart Operations
  const handleAddToCart = (dish) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === dish.id && !item.customAddons);
      if (existing) {
        return prev.map(item =>
          item.id === dish.id && !item.customAddons
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
    showToast(`Added "${dish.name}" to cart! 🍽️`, 'success');
  };

  const handleUpdateCartQuantity = (dishId, newQty) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== dishId));
      showToast('Item removed from cart', 'info');
    } else {
      setCartItems(prev => prev.map(item =>
        item.id === dishId ? { ...item, quantity: newQty } : item
      ));
    }
  };

  const handleRemoveCartItem = (dishId) => {
    setCartItems(prev => prev.filter(item => item.id !== dishId));
    showToast('Item removed from cart', 'info');
  };

  // Proceed from Cart to Summary
  const handleProceedToSummary = () => {
    if (cartItems.length === 0) {
      showToast('Please add at least one item to cart', 'warning');
      return;
    }
    setCurrentView('summary');
  };

  // Proceed from Summary to Payment
  const handleProceedToPayment = (billSummary) => {
    setLatestBillSummary(billSummary);
    setCurrentView('payment');
  };

  // Payment Success & Order Creation
  const handlePaymentSuccess = async (paymentDetails) => {
    const newOrderPayload = {
      train: selectedTrain,
      station: selectedStation,
      passenger: passengerDetails,
      items: cartItems,
      billSummary: latestBillSummary,
      paymentDetails,
      specialInstructions
    };

    const savedOrder = await apiService.createOrder(newOrderPayload);
    setCurrentOrder(savedOrder);
    setOrders(prev => [savedOrder, ...prev]);

    // Clear cart
    setCartItems([]);
    setAppliedCoupon(null);
    setSpecialInstructions('');

    setCurrentView('confirmation');
    showToast('🎉 Order placed successfully! Live Google Maps tracking active.', 'success');
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Toast Notifications Stack */}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{
            borderLeft: t.type === 'success' ? '4px solid var(--veg-green)' : t.type === 'warning' ? '4px solid var(--accent-amber)' : '4px solid var(--accent-orange)'
          }}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedTrain={selectedTrain}
        selectedStation={selectedStation}
        cartItemsCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        setIsCartOpen={setIsCartOpen}
        activeOrdersCount={orders.length}
        setIsMyOrdersOpen={setIsMyOrdersOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        onResetToHome={() => setCurrentView('home')}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdminDashboard={() => setCurrentView('admin')}
        onTriggerInstall={() => window.dispatchEvent(new CustomEvent('open-pwa-install'))}
      />

      {/* Main Dynamic View Content */}
      <main style={{ flex: 1 }}>
        
        {/* ADMIN DASHBOARD VIEW */}
        {currentView === 'admin' && (
          <AdminDashboard
            user={currentUser}
            onLogout={handleLogout}
            onBackToApp={() => setCurrentView('home')}
            onTrackOrderOnMap={(order) => setMapTrackingOrder(order)}
            showToast={showToast}
          />
        )}

        {/* PASSENGER STOREFRONT VIEWS */}
        {currentView === 'home' && (
          <HomePage
            onSelectTrain={handleSelectTrain}
            onPnrLookup={handlePnrLookup}
            onSelectCategory={handleSelectCategory}
            onSelectRestaurant={handleSelectRestaurant}
          />
        )}

        {currentView === 'stations' && (
          <StationSelector
            train={selectedTrain}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'menu' && (
          <FoodMenu
            train={selectedTrain}
            station={selectedStation}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onOpenCart={() => setIsCartOpen(true)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedRestaurantId={selectedRestaurantId}
            setSelectedRestaurantId={setSelectedRestaurantId}
            onChangeStation={() => setCurrentView('stations')}
          />
        )}

        {currentView === 'summary' && (
          <OrderSummary
            train={selectedTrain}
            station={selectedStation}
            cartItems={cartItems}
            appliedCoupon={appliedCoupon}
            specialInstructions={specialInstructions}
            passengerDetails={passengerDetails}
            setPassengerDetails={setPassengerDetails}
            onProceedToPayment={handleProceedToPayment}
            onBackToMenu={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'payment' && (
          <PaymentPage
            billSummary={latestBillSummary}
            passengerDetails={passengerDetails}
            train={selectedTrain}
            station={selectedStation}
            onPaymentSuccess={handlePaymentSuccess}
            onBackToSummary={() => setCurrentView('summary')}
          />
        )}

        {currentView === 'confirmation' && (
          <OrderConfirmation
            order={currentOrder || orders[0]}
            onOpenInvoice={() => setViewingInvoiceOrder(currentOrder || orders[0])}
            onNewOrder={() => {
              setCurrentView('menu');
            }}
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        train={selectedTrain}
        station={selectedStation}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(coupon) => {
          setAppliedCoupon(coupon);
          showToast(`Applied promo coupon "${coupon.code}"!`, 'success');
        }}
        onRemoveCoupon={() => {
          setAppliedCoupon(null);
          showToast('Coupon removed', 'info');
        }}
        specialInstructions={specialInstructions}
        setSpecialInstructions={setSpecialInstructions}
        onProceedToOrderSummary={handleProceedToSummary}
      />

      {/* Official Tax Invoice Modal */}
      {viewingInvoiceOrder && (
        <InvoiceModal
          order={viewingInvoiceOrder}
          onClose={() => setViewingInvoiceOrder(null)}
        />
      )}

      {/* My Orders Modal */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={orders}
        onTrackOrder={(order) => {
          setCurrentOrder(order);
          setCurrentView('confirmation');
        }}
        onOpenInvoice={(order) => {
          setViewingInvoiceOrder(order);
        }}
      />

      {/* Auth Modal (User & Admin Portals) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={authDefaultTab}
        showToast={showToast}
      />

      {/* Passenger Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          setPassengerDetails(prev => ({
            ...prev,
            name: updated.name || prev.name,
            phone: updated.phone || prev.phone,
            coach: updated.coach || prev.coach,
            berth: updated.berth || prev.berth,
            pnr: updated.pnr || prev.pnr
          }));
        }}
        onLogout={handleLogout}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        showToast={showToast}
      />

      {/* Standalone Live Google Maps Tracking Modal (Opened from Admin or My Orders) */}
      {mapTrackingOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '900px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-hover)',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              background: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Navigation size={18} style={{ color: 'var(--accent-orange)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  Live Google Map Dispatch • Order #{mapTrackingOrder.order_id || mapTrackingOrder.id}
                </h3>
              </div>

              <button
                onClick={() => setMapTrackingOrder(null)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Map Container */}
            <div style={{ padding: '1rem' }}>
              <FoodTrackerMap order={mapTrackingOrder} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {currentView !== 'admin' && (
        <footer style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '2.5rem 0 1.5rem',
          marginTop: 'auto'
        }}>
          <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Rail<span style={{ color: 'var(--accent-orange)' }}>Bite</span></span>
              <span>•</span>
              <span>Official IRCTC e-Catering Partner</span>
              <span>•</span>
              <span>FSSAI Certified Seat Delivery</span>
            </div>
            <p style={{ maxWidth: '600px', margin: '0 auto 0.75rem', lineHeight: 1.5 }}>
              Providing hygienic, contactless and warm culinary experiences to railway passengers across Indian Railways.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <span>© {new Date().getFullYear()} RailBite Technologies Pvt. Ltd.</span>
              <span>•</span>
              <button 
                onClick={() => handleOpenAuthModal('admin')} 
                style={{ color: 'var(--accent-amber)', textDecoration: 'underline', fontSize: '0.75rem' }}
              >
                IRCTC Station Pantry Admin Login
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* PWA 1-Click Installation Banner & Modal */}
      <InstallPwaBanner 
        onInstallSuccess={() => showToast('🎉 RailBite app installed on your device!', 'success')} 
      />

    </div>
  );
}
