import mongoose from 'mongoose';

const dealerInventorySchema = new mongoose.Schema({
  _id: { type: String },
  dealerId: { type: String, required: true },
  dealerName: { type: String, required: true },
  category: { type: String, required: true },
  availableKg: { type: Number, default: 0 },
  totalCollectedKg: { type: Number, default: 0 },
  totalDispatchedKg: { type: Number, default: 0 },
  lastCollectedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

dealerInventorySchema.index({ dealerId: 1, category: 1 }, { unique: true });

export const DealerInventory =
  mongoose.models.DealerInventory || mongoose.model('DealerInventory', dealerInventorySchema);
