import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  collectorId: { type: String, required: true },
  collectorName: { type: String, required: true },
  type: { type: String, enum: ['dropoff', 'doorstep_pickup'], default: 'dropoff' },
  wasteCategory: { type: String, required: true },
  estimatedWeightKg: { type: Number, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  userAddress: { type: String, required: true },
  district: { type: String, required: true },
  scheduledDate: { type: String, required: true },
  timeSlot: { type: String, default: '10:00 AM - 01:00 PM' },
  estimatedReward: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  status: { type: String, enum: ['confirmed', 'in_transit', 'completed', 'cancelled'], default: 'confirmed' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
