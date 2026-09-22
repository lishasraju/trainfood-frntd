import mongoose from 'mongoose';

const trainScheduleSchema = new mongoose.Schema({
  station_code: { type: String, required: true },
  station_name: { type: String, required: true },
  arrival: { type: String, default: '--:--' },
  departure: { type: String, default: '--:--' },
  halt_mins: { type: Number, default: 0 },
  platform: { type: String, default: '1' },
  distance_km: { type: Number, default: 0 },
  eligible: { type: Boolean, default: true }
}, { _id: false });

const trainSchema = new mongoose.Schema({
  train_no: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  train_type: { type: String, default: 'Express' },
  source_station_code: { type: String, required: true },
  source_station_name: { type: String, required: true },
  dest_station_code: { type: String, required: true },
  dest_station_name: { type: String, required: true },
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  duration: { type: String, default: '' },
  speed_kmh: { type: Number, default: 110 },
  coaches_available: [{ type: String }],
  running_days: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  schedules: [trainScheduleSchema]
});

export const TrainModel = mongoose.models.Train || mongoose.model('Train', trainSchema);
export default TrainModel;
