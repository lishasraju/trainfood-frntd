import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  salt: { type: String, required: true },
  password_hash: { type: String, required: true },
  pnr: { type: String, default: '' },
  coach: { type: String, default: '' },
  berth: { type: String, default: '' },
  berth_type: { type: String, default: 'Seat' },
  designation: { type: String, default: '' },
  station_code: { type: String, default: '' },
  station_name: { type: String, default: '' },
  permissions: [{ type: String }],
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;
