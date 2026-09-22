import React, { useState } from 'react';
import { X, Plus, Check, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function CustomizationModal({ dish, onClose, onAddCustomizedDish }) {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialNote, setSpecialNote] = useState('');

  if (!dish) return null;

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
  const finalPrice = dish.price + addonsTotal;

  const handleConfirm = () => {
    onAddCustomizedDish({
      ...dish,
      customAddons: selectedAddons,
      specialNote: specialNote.trim(),
      calculatedPrice: finalPrice
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '520px', width: '100%', padding: '1.75rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
              <SlidersHorizontal size={13} /> Customize Meal
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dish.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Base Price: ₹{dish.price}</p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Addons List */}
        {dish.customizations && dish.customizations.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Choose Add-ons & Preparations:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {dish.customizations.map((addon) => {
                const isChecked = selectedAddons.some(a => a.name === addon.name);
                return (
                  <div
                    key={addon.name}
                    onClick={() => toggleAddon(addon)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChecked ? 'var(--accent-orange-glow)' : 'var(--bg-tertiary)',
                      border: isChecked ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: isChecked ? 'none' : '2px solid var(--text-muted)',
                        background: isChecked ? 'var(--accent-orange)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{addon.name}</span>
                    </div>

                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: addon.price > 0 ? 'var(--accent-orange)' : 'var(--veg-green)' }}>
                      {addon.price > 0 ? `+ ₹${addon.price}` : 'FREE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
            Special Cooking Instructions (Optional):
          </label>
          <textarea
            className="form-input"
            rows={2}
            placeholder="e.g., Less spicy, no onion-garlic, pack extra tissues..."
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

        {/* Action Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-orange)' }}>
              ₹{finalPrice}
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <span>Add Customized Item</span>
          </button>
        </div>

      </div>
    </div>
  );
}
