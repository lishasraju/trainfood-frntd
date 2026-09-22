import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  discount_type: { type: String, enum: ['PERCENTAGE', 'FLAT'], default: 'PERCENTAGE' },
  discount_percent: { type: Number, default: 0 },
  flat_discount: { type: Number, default: 0 },
  min_order_amount: { type: Number, default: 199 },
  max_discount_amount: { type: Number, default: 100 },
  is_active: { type: Boolean, default: true },
  valid_till: { type: String, default: '2026-12-31' }
});

export const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
export default CouponModel;
