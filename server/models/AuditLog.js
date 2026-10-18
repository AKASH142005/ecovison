import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  _id: { type: String },
  action: { type: String, required: true },
  category: {
    type: String,
    enum: ['AUTH', 'PICKUP', 'INVENTORY', 'MARKETPLACE', 'PAYMENT', 'ADMIN'],
    default: 'ADMIN'
  },
  actorId: { type: String, required: true },
  actorName: { type: String, default: 'System' },
  actorRole: { type: String, required: true },
  targetResource: { type: String, default: '' },
  targetId: { type: String, default: '' },
  details: { type: String, required: true },
  metadata: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
