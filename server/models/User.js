import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'dealer', 'factory', 'admin'],
    default: 'customer'
  },
  phone: { type: String, default: '' },
  district: { type: String, default: 'Chennai' },
  address: { type: String, default: '' },
  facilityName: { type: String, default: '' },
  facilityId: { type: String, default: '' },
  serviceRadiusKm: { type: Number, default: 8 }, // Dealer waste collection boundary radius
  serviceWards: [{ type: String }],
  lat: { type: Number },
  lng: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
