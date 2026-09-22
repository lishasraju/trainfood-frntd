import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  station_codes: [{ type: String, uppercase: true, index: true }],
  cuisine: { type: String, default: '' },
  rating: { type: Number, default: 4.5 },
  reviews_count: { type: Number, default: 100 },
  delivery_time: { type: String, default: '15-20 min before arrival' },
  min_order: { type: Number, default: 149 },
  is_pure_veg: { type: Boolean, default: false },
  jain_available: { type: Boolean, default: false },
  fssai_no: { type: String, default: '' },
  image: { type: String, default: '' },
  banner: { type: String, default: '' },
  badge: { type: String, default: 'IRCTC Partner' },
  prep_time: { type: String, default: '15 mins' }
});

export const RestaurantModel = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
export default RestaurantModel;
