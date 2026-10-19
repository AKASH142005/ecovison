import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  _id: { type: String },
  poNumber: { type: String, required: true, unique: true },
  requirementId: { type: String, required: true },
  factoryId: { type: String, required: true },
  factoryName: { type: String, required: true },
  dealerId: { type: String, required: true },
  dealerName: { type: String, required: true },
  category: { type: String, required: true },
  quantityKg: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['created', 'shipped', 'delivered', 'verified', 'rejected'],
    default: 'created'
  },
  vehicleNumber: { type: String, default: '' },
  dispatchDate: { type: String, default: '' },
  verifiedWeightKg: { type: Number, default: 0 },
  qualityGrade: { type: String, default: 'Pending Inspection' },
  verificationNotes: { type: String, default: '' },
  verifiedAt: { type: Date, default: null },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'processing', 'paid'],
    default: 'unpaid'
  },
  paymentRef: { type: String, default: '' },
  paymentReleasedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const PurchaseOrder =
  mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema);
