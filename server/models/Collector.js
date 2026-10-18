import mongoose from 'mongoose';

const collectorSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  district: { type: String, required: true, index: true },
  zone: { type: String, default: 'Chennai Central' },
  city: { type: String, default: 'Chennai' },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  tnpcbRegNo: { type: String, default: 'TNPCB/CHN/REG/2026' },
  rating: { type: Number, default: 4.8 },
  totalReviews: { type: Number, default: 42 },
  operatingHours: { type: String, default: '08:00 AM - 07:00 PM' },
  serviceRadiusKm: { type: Number, default: 8 }, // Dealer collection boundary radius in km
  serviceWards: [{ type: String }], // List of GCC wards/zones covered
  dealerUserId: { type: String, default: '' }, // Link to user if registered by dealer
  pointType: { type: String, enum: ['dealer', 'factory', 'mrf'], default: 'dealer' },
  acceptedWasteTypes: [{
    category: { type: String, required: true },
    ratePerKg: { type: Number, default: 0 },
    acceptsDropoff: { type: Boolean, default: true },
    acceptsPickup: { type: Boolean, default: true }
  }],
  capacityLoad: { type: Number, default: 45 },
  isVerified: { type: Boolean, default: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

collectorSchema.index({ lat: 1, lng: 1 });

export const Collector = mongoose.models.Collector || mongoose.model('Collector', collectorSchema);
