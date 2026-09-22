import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  platforms: { type: Number, default: 4 },
  icon: { type: String, default: '🚂' }
});

export const StationModel = mongoose.models.Station || mongoose.model('Station', stationSchema);
export default StationModel;
