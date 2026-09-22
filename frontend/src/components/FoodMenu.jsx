import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, MapPin, Train, Sparkles, UtensilsCrossed, 
  ShoppingBag, ArrowRight, CheckCircle2, ChevronRight, Store
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES, RESTAURANTS } from '../data/mockData';
import DishCard from './DishCard';
import CustomizationModal from './CustomizationModal';

export default function FoodMenu({
  train,
  station,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenCart,
  selectedCategory,
  setSelectedCategory,
  selectedRestaurantId,
  setSelectedRestaurantId,
  onChangeStation
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'nonveg' | 'jain'
  const [customizingDish, setCustomizingDish] = useState(null);

  // Available restaurants at this station
  const stationRestaurants = useMemo(() => {
    if (!station) return RESTAURANTS;
    return RESTAURANTS.filter(r => r.station_codes.includes(station.code));
  }, [station]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter(dish => {
      // Restaurant filter
      if (selectedRestaurantId && dish.restaurant_id !== selectedRestaurantId) {
        return false;
      }
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && dish.dietary !== 'veg' && dish.dietary !== 'jain') {
        return false;
      }
      if (dietaryFilter === 'nonveg' && dish.dietary !== 'nonveg') {
        return false;
      }
      if (dietaryFilter === 'jain' && !dish.is_jain_available && dish.dietary !== 'jain') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          dish.name.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedRestaurantId, selectedCategory, dietaryFilter, searchQuery]);

  // Cart total summary
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="food-menu-page" style={{ padding: '2rem 0 6rem' }}>
      <div className="container">
        
        {/* Delivery Station Header Banner */}
        <div className="glass-card" style={{
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(31, 41, 61, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
          border: '1.5px solid rgba(255, 107, 0, 0.35)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)'
            }}>
              <MapPin size={26} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-orange">Delivering At</span>
                <span className="badge badge-blue">Train #{train?.train_no} {train?.name.split(' ')[0]}</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
                {station?.name || 'Selected Station'} (Platform #{station?.platform || '1'})
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Scheduled Arrival: <strong style={{ color: 'var(--text-primary)' }}>{station?.arrival || '--:--'}</strong> • Hot delivery right at your coach berth
              </p>
            </div>
          </div>

          <button
            onClick={onChangeStation}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Train size={15} />
            <span>Change Station</span>
          </button>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '450px' }}>
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="Search dishes (e.g. Biryani, Thali, Pizza, Dosa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.75rem', height: '46px', borderRadius: 'var(--radius-full)' }}
            />
          </div>

          {/* Dietary Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDietaryFilter('all')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: dietaryFilter === 'all' ? 'var(--accent-orange)' : 'var(--bg-tertiary)',
                color: dietaryFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                transition: 'var(--transition-fast)'
              }}
            >
              All Delights
            </button>

            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: dietaryFilter === 'veg' ? 'var(--veg-green)' : 'var(--bg-tertiary)',
                color: dietaryFilter === 'veg' ? '#fff' : 'var(--veg-green)',
                border: '1px solid var(--veg-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'var(--transition-fast)'
              }}
            >
              <span className="food-dot veg" style={{ width: '12px', height: '12px' }}></span>
              Pure Veg
            </button>

            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'nonveg' ? 'all' : 'nonveg')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: dietaryFilter === 'nonveg' ? 'var(--nonveg-red)' : 'var(--bg-tertiary)',
                color: dietaryFilter === 'nonveg' ? '#fff' : 'var(--nonveg-red)',
                border: '1px solid var(--nonveg-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'var(--transition-fast)'
              }}
            >
              <span className="food-dot nonveg" style={{ width: '12px', height: '12px' }}></span>
              Non-Veg
            </button>

            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'jain' ? 'all' : 'jain')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: dietaryFilter === 'jain' ? 'var(--jain-purple)' : 'var(--bg-tertiary)',
                color: dietaryFilter === 'jain' ? '#fff' : 'var(--jain-purple)',
                border: '1px solid var(--jain-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'var(--transition-fast)'
              }}
            >
              <span className="food-dot jain" style={{ width: '12px', height: '12px' }}></span>
              Jain Satvik
            </button>
          </div>
        </div>

        {/* Restaurant Selector Chips (if multiple restaurants at this station) */}
        {stationRestaurants.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            scrollbarWidth: 'none'
          }}>
            <button
              onClick={() => setSelectedRestaurantId(null)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: !selectedRestaurantId ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                color: !selectedRestaurantId ? 'var(--accent-orange)' : 'var(--text-secondary)',
                border: !selectedRestaurantId ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Store size={15} /> All Partner Brands ({stationRestaurants.length})
            </button>

            {stationRestaurants.map(rest => (
              <button
                key={rest.id}
                onClick={() => setSelectedRestaurantId(selectedRestaurantId === rest.id ? null : rest.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: selectedRestaurantId === rest.id ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                  color: selectedRestaurantId === rest.id ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  border: selectedRestaurantId === rest.id ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{rest.name}</span>
                <span className="badge badge-orange" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{rest.rating}★</span>
              </button>
            ))}
          </div>
        )}

        {/* Category Horizontal Scroll Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          scrollbarWidth: 'none'
        }}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isSelected ? 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)' : 'var(--bg-secondary)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  border: isSelected ? 'none' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '0 4px 12px rgba(255, 107, 0, 0.35)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition-fast)'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid-responsive-3">
            {filteredDishes.map((dish) => {
              const cartItem = cartItems.find(item => item.id === dish.id);
              const quantityInCart = cartItem ? cartItem.quantity : 0;

              return (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  quantityInCart={quantityInCart}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateCartQuantity}
                  onOpenCustomize={(d) => setCustomizingDish(d)}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <UtensilsCrossed size={48} style={{ color: 'var(--accent-orange)', margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No dishes match your filters</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Try clearing your search query or changing dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setSelectedCategory('all');
                setSelectedRestaurantId(null);
              }}
              className="btn btn-secondary"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Floating Bottom Cart Bar for Quick Mobile Access */}
      {totalCartCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '560px',
          zIndex: 400,
          background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(255, 107, 0, 0.5)',
          color: '#fff',
          animation: 'modalIn 0.3s ease'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 600 }}>
              {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in Cart
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>
              ₹{cartSubtotal} <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(+ Taxes)</span>
            </div>
          </div>

          <button
            onClick={onOpenCart}
            style={{
              background: '#ffffff',
              color: '#ea580c',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <span>View Cart</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Customization Modal */}
      {customizingDish && (
        <CustomizationModal
          dish={customizingDish}
          onClose={() => setCustomizingDish(null)}
          onAddCustomizedDish={(customDish) => {
            onAddToCart(customDish);
          }}
        />
      )}

    </div>
  );
}
