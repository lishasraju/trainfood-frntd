import mongoose from 'mongoose';

const pnrRecordSchema = new mongoose.Schema({
  pnr: { type: String, required: true, unique: true, index: true },
  train_no: { type: String, required: true },
  train_name: { type: String, required: true },
  passenger_name: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  coach: { type: String, required: true },
  berth: { type: String, required: true },
  berth_type: { type: String, default: 'Lower Berth' },
  boarding: { type: String, required: true },
  destination: { type: String, required: true },
  journey_date: { type: String, default: '' },
  status: { type: String, default: 'CNF' }
});

export const PnrRecordModel = mongoose.models.PnrRecord || mongoose.model('PnrRecord', pnrRecordSchema);
export default PnrRecordModel;
