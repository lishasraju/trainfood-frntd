import React from 'react';
import { Star, Plus, Minus, Flame, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function DishCard({ 
  dish, 
  quantityInCart, 
  onAddToCart, 
  onUpdateQuantity, 
  onOpenCustomize 
}) {
  const isVeg = dish.dietary === 'veg';
  const isJain = dish.dietary === 'jain';
  const isNonVeg = dish.dietary === 'nonveg';

  const dotClass = isJain ? 'jain' : isVeg ? 'veg' : 'nonveg';

  return (
    <div className="glass-card glass-card-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Dish Image Banner */}
      <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Dietary Tag & Bestseller Badges */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            padding: '3px 7px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span className={`food-dot ${dotClass}`} style={{ width: '14px', height: '14px' }}></span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
              {isJain ? 'Jain Satvik' : isVeg ? 'Pure Veg' : 'Non-Veg'}
            </span>
          </div>

          {dish.is_bestseller && (
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}>
              <Sparkles size={11} /> BESTSELLER
            </div>
          )}
        </div>

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          padding: '2px 7px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
          <span>{dish.rating} ({dish.reviews_count})</span>
        </div>
      </div>

      {/* Dish Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>{dish.name}</h3>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
              ₹{dish.price}
            </span>
          </div>

          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {dish.description}
          </p>

          {/* Portion, Calories & Spice Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span>🍽️ {dish.portion}</span>
            <span>•</span>
            <span>⚡ {dish.calories}</span>
            {dish.spice_level > 1 && (
              <>
                <span>•</span>
                <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Flame size={12} /> {dish.spice_level === 3 ? 'Extra Spicy' : 'Medium Spice'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Bottom Row: Add to Cart / Quantity Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          gap: '0.5rem'
        }}>
          {dish.customizations && dish.customizations.length > 0 ? (
            <button
              onClick={() => onOpenCustomize(dish)}
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent-orange)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <SlidersHorizontal size={12} /> Customizable
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Freshly Packed</span>
          )}

          {quantityInCart > 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--accent-orange-glow)',
              border: '1.5px solid var(--accent-orange)',
              borderRadius: 'var(--radius-md)',
              padding: '0.2rem 0.4rem'
            }}>
              <button
                onClick={() => onUpdateQuantity(dish.id, quantityInCart - 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-orange)',
                  fontWeight: 800
                }}
                title="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <span style={{ fontWeight: 800, fontSize: '0.95rem', minWidth: '18px', textAlign: 'center', color: 'var(--accent-orange)' }}>
                {quantityInCart}
              </span>

              <button
                onClick={() => onUpdateQuantity(dish.id, quantityInCart + 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--accent-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800
                }}
                title="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(dish)}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.45rem 1.1rem', fontWeight: 700 }}
            >
              <Plus size={16} />
              <span>ADD</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
