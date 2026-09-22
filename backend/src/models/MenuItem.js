import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  restaurant_id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  original_price: { type: Number },
  category: { type: String, required: true, index: true },
  is_veg: { type: Boolean, default: true },
  is_jain: { type: Boolean, default: false },
  is_bestseller: { type: Boolean, default: false },
  spicy_level: { type: String, default: 'Medium' },
  image: { type: String, default: '' },
  rating: { type: Number, default: 4.6 },
  in_stock: { type: Boolean, default: true }
});

export const MenuItemModel = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
export default MenuItemModel;
