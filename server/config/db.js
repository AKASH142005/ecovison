import mongoose from 'mongoose';
import { Collector } from '../models/Collector.js';
import { WasteCategory } from '../models/WasteCategory.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { DealerInventory } from '../models/DealerInventory.js';
import { MaterialRequirement } from '../models/MaterialRequirement.js';
import { PurchaseOrder } from '../models/PurchaseOrder.js';
import { AuditLog } from '../models/AuditLog.js';
import {
  SEED_CATEGORIES,
  SEED_COLLECTORS,
  SEED_USERS,
  SEED_INVENTORY,
  SEED_REQUIREMENTS,
  SEED_PURCHASE_ORDERS,
  SEED_AUDIT_LOGS,
  SEED_FACTORIES
} from '../data/seedData.js';

let isConnected = false;

// Sample initial bookings
const INITIAL_BOOKINGS = [
  {
    _id: 'book_sample_1',
    bookingId: 'ECO-TN-418902',
    customerId: 'usr_customer_1',
    collectorId: 'mem_col_1',
    collectorName: 'Guindy Eco-Recovery Industrial Hub',
    type: 'doorstep_pickup',
    wasteCategory: 'plastic',
    estimatedWeightKg: 25,
    actualWeightKg: 24.5,
    userName: 'Kavitha Ramachandran',
    userPhone: '+91 98401 23456',
    userAddress: '14, 2nd Main Road, Anna Nagar, Chennai 600040',
    district: 'Chennai',
    scheduledDate: new Date(Date.now() - 3600000 * 24).toISOString().split('T')[0],
    timeSlot: '10:00 AM - 01:00 PM',
    estimatedReward: 450,
    co2SavedKg: 45,
    status: 'completed',
    verifiedAt: new Date(Date.now() - 3600000 * 18),
    createdAt: new Date(Date.now() - 3600000 * 48)
  },
  {
    _id: 'book_sample_2',
    bookingId: 'ECO-TN-621844',
    customerId: 'usr_customer_1',
    collectorId: 'mem_col_1',
    collectorName: 'Guindy Eco-Recovery Industrial Hub',
    type: 'doorstep_pickup',
    wasteCategory: 'metal',
    estimatedWeightKg: 40,
    actualWeightKg: 0,
    userName: 'Kavitha Ramachandran',
    userPhone: '+91 98401 23456',
    userAddress: '14, 2nd Main Road, Anna Nagar, Chennai 600040',
    district: 'Chennai',
    scheduledDate: new Date().toISOString().split('T')[0],
    timeSlot: '02:00 PM - 05:00 PM',
    estimatedReward: 1600,
    co2SavedKg: 168,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 4)
  }
];

// In-memory storage fallback if MongoDB service is offline
export const memoryStore = {
  categories: [...SEED_CATEGORIES],
  collectors: SEED_COLLECTORS.map((c, idx) => ({ ...c, _id: c._id || `mem_col_${idx + 1}` })),
  factories: [...SEED_FACTORIES],
  users: [...SEED_USERS],
  inventory: [...SEED_INVENTORY],
  requirements: [...SEED_REQUIREMENTS],
  orders: [...SEED_PURCHASE_ORDERS],
  auditLogs: [...SEED_AUDIT_LOGS],
  bookings: [...INITIAL_BOOKINGS]
};

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecovision_tn';

  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully via Mongoose.');

    // Seed initial data if collections are empty
    await seedDatabaseIfEmpty();
  } catch (error) {
    isConnected = false;
    console.warn('⚠️ MongoDB connection not established:', error.message);
    console.log(
      '⚡ EcoVision is operating on high-performance In-Memory Engine (Pre-loaded with verified users, dealers, factories, inventory, and marketplace requirements).'
    );
  }
}

async function seedDatabaseIfEmpty() {
  try {
    const categoryCount = await WasteCategory.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding waste categories...');
      await WasteCategory.insertMany(SEED_CATEGORIES);
    }

    const collectorCount = await Collector.countDocuments();
    if (collectorCount === 0) {
      console.log('🌱 Seeding Tamil Nadu waste collectors...');
      await Collector.insertMany(SEED_COLLECTORS);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding users for Customer, Dealer, Factory, and Admin...');
      await User.insertMany(SEED_USERS);
    }

    const invCount = await DealerInventory.countDocuments();
    if (invCount === 0) {
      console.log('🌱 Seeding dealer inventory...');
      await DealerInventory.insertMany(SEED_INVENTORY);
    }

    const reqCount = await MaterialRequirement.countDocuments();
    if (reqCount === 0) {
      console.log('🌱 Seeding marketplace requirements...');
      await MaterialRequirement.insertMany(SEED_REQUIREMENTS);
    }

    const poCount = await PurchaseOrder.countDocuments();
    if (poCount === 0) {
      console.log('🌱 Seeding marketplace purchase orders...');
      await PurchaseOrder.insertMany(SEED_PURCHASE_ORDERS);
    }

    const logCount = await AuditLog.countDocuments();
    if (logCount === 0) {
      console.log('🌱 Seeding initial audit logs...');
      await AuditLog.insertMany(SEED_AUDIT_LOGS);
    }

    const bookCount = await Booking.countDocuments();
    if (bookCount === 0) {
      console.log('🌱 Seeding initial bookings...');
      await Booking.insertMany(INITIAL_BOOKINGS);
    }
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
}

export function isDbLive() {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Record an audit log entry in both DB and memoryStore
 */
export async function logAudit({ action, category = 'ADMIN', actor, targetResource, targetId, details, metadata = {} }) {
  const logEntry = {
    _id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    action,
    category,
    actorId: actor?.id || actor?._id || 'system',
    actorName: actor?.name || 'System',
    actorRole: actor?.role || 'system',
    targetResource: targetResource || '',
    targetId: targetId || '',
    details,
    metadata,
    timestamp: new Date()
  };

  memoryStore.auditLogs.unshift(logEntry);
  if (memoryStore.auditLogs.length > 500) memoryStore.auditLogs.pop();

  if (isDbLive()) {
    try {
      await AuditLog.create(logEntry);
    } catch (e) {
      console.warn('AuditLog db write warning:', e.message);
    }
  }
  return logEntry;
}
