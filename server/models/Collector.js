import mongoose from 'mongoose';

const collectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, required: true, index: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  tnpcbRegNo: { type: String, required: true }, // Tamil Nadu Pollution Control Board Reg
  rating: { type: Number, default: 4.8 },
  totalReviews: { type: Number, default: 42 },
  operatingHours: { type: String, default: '08:00 AM - 07:00 PM' },
  acceptedWasteTypes: [{
    category: { type: String, required: true }, // plastic, ewaste, organic, etc.
    ratePerKg: { type: Number, default: 0 },
    acceptsDropoff: { type: Boolean, default: true },
    acceptsPickup: { type: Boolean, default: true }
  }],
  capacityLoad: { type: Number, default: 45 }, // percentage load
  isVerified: { type: Boolean, default: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

collectorSchema.index({ lat: 1, lng: 1 });

export const Collector = mongoose.models.Collector || mongoose.model('Collector', collectorSchema);
