import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tamilName: { type: String, default: '' },
  icon: { type: String, default: 'Trash2' },
  color: { type: String, default: '#10b981' },
  badgeBg: { type: String, default: 'rgba(16, 185, 129, 0.15)' },
  description: { type: String, required: true },
  recyclingMethod: { type: String, default: '' },
  carbonOffsetPerKg: { type: Number, default: 1.5 }, // kg CO2 saved per kg recycled
  avgMarketRatePerKg: { type: Number, default: 12 }, // INR per kg
  guidelines: [{ type: String }],
  commonExamples: [{ type: String }]
});

export const WasteCategory = mongoose.models.WasteCategory || mongoose.model('WasteCategory', wasteCategorySchema);
