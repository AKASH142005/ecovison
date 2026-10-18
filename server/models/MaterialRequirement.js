import mongoose from 'mongoose';

const materialRequirementSchema = new mongoose.Schema({
  requirementId: { type: String, required: true, unique: true },
  factoryId: { type: String, required: true },
  factoryName: { type: String, required: true },
  category: { type: String, required: true },
  grade: { type: String, default: 'Standard Industrial Grade' },
  quantityNeededKg: { type: Number, required: true },
  fulfilledKg: { type: Number, default: 0 },
  offeredPricePerKg: { type: Number, required: true },
  district: { type: String, required: true },
  deliveryAddress: { type: String, default: '' },
  deadline: { type: String, default: '' },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'fulfilled', 'closed'],
    default: 'open'
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const MaterialRequirement =
  mongoose.models.MaterialRequirement ||
  mongoose.model('MaterialRequirement', materialRequirementSchema);
