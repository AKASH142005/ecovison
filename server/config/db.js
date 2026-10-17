import mongoose from 'mongoose';
import { Collector } from '../models/Collector.js';
import { WasteCategory } from '../models/WasteCategory.js';
import { Booking } from '../models/Booking.js';
import { SEED_CATEGORIES, SEED_COLLECTORS } from '../data/seedData.js';

let isConnected = false;

// In-memory storage fallback if MongoDB service is offline
export const memoryStore = {
  categories: [...SEED_CATEGORIES],
  collectors: SEED_COLLECTORS.map((c, idx) => ({ ...c, _id: `mem_col_${idx + 1}` })),
  bookings: []
};

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecovision_tn';

  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500
    });

    isConnected = true;
    console.log(' MongoDB connected successfully via Mongoose.');

    // Seed initial data if collections are empty
    await seedDatabaseIfEmpty();
  } catch (error) {
    isConnected = false;
    console.warn('⚠️ MongoDB connection could not be established:', error.message);
    console.log('⚡ EcoVision is activating high-performance In-Memory Fallback Store (Pre-loaded with Tamil Nadu verified collectors & categories).');
    console.log('💡 To persist to MongoDB, ensure MongoDB service is started or set MONGODB_URI in server/.env');
  }
}

async function seedDatabaseIfEmpty() {
  try {
    const categoryCount = await WasteCategory.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding waste categories into MongoDB...');
      await WasteCategory.insertMany(SEED_CATEGORIES);
    }

    const collectorCount = await Collector.countDocuments();
    if (collectorCount === 0) {
      console.log('🌱 Seeding Tamil Nadu waste collectors into MongoDB...');
      await Collector.insertMany(SEED_COLLECTORS);
    }
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
}

export function isDbLive() {
  return isConnected && mongoose.connection.readyState === 1;
}
