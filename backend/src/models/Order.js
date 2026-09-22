import mongoose from 'mongoose';

const statusStepSchema = new mongoose.Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  time: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  desc: { type: String, default: '' }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  restaurant_name: { type: String },
  is_veg: { type: Boolean, default: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, index: true },
  order_id: { type: String, required: true, unique: true, index: true },
  order_number: { type: String, index: true },
  user_id: { type: String, index: true },
  order_otp: { type: String, required: true },
  delivery_otp: { type: String },
  status: { type: String, enum: ['CONFIRMED', 'PREPARING', 'PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'], default: 'CONFIRMED' },
  order_status: { type: String, default: 'CONFIRMED' },
  payment_status: { type: String, default: 'PAID' },
  payment_method: { type: String, default: 'UPI' },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  
  train: {
    train_no: { type: String },
    name: { type: String },
    speed_kmh: { type: Number }
  },
  station: {
    code: { type: String, index: true },
    name: { type: String },
    platform: { type: String }
  },
  passenger: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    coach: { type: String },
    berth: { type: String },
    berth_type: { type: String },
    pnr: { type: String }
  },
  
  items: [orderItemSchema],
  billSummary: {
    itemTotal: { type: Number },
    gst: { type: Number },
    deliveryFee: { type: Number, default: 0 },
    packagingFee: { type: Number, default: 15 },
    couponDiscount: { type: Number, default: 0 },
    grandTotal: { type: Number }
  },
  
  specialInstructions: { type: String, default: '' },
  delivery_agent_name: { type: String, default: 'Ramesh Kumar (IRCTC Delivery ID: #5821)' },
  delivery_agent_phone: { type: String, default: '+91 98765 43210' },
  
  status_timeline: [statusStepSchema],
  tracking_timeline: [statusStepSchema],
  placed_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default OrderModel;
