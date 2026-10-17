import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { connectDB, isDbLive } from './config/db.js';
import collectorRoutes from './routes/collectorRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const fastify = Fastify({
  logger: true
});

// Enable CORS
await fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
});

// Health check endpoint
fastify.get('/api/health', async () => {
  return {
    status: 'online',
    project: 'EcoVision Waste Management Tamil Nadu',
    framework: 'Fastify',
    database: isDbLive() ? 'MongoDB (Connected via Mongoose)' : 'Resilient In-Memory Tamil Nadu Store',
    timestamp: new Date().toISOString()
  };
});

// Register feature routes under /api
await fastify.register(collectorRoutes, { prefix: '/api' });
await fastify.register(categoryRoutes, { prefix: '/api' });
await fastify.register(bookingRoutes, { prefix: '/api' });
await fastify.register(statsRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await connectDB();
    const port = Number(process.env.PORT) || 5000;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🌿 EcoVision Fastify Server running at http://localhost:${port}`);
    console.log(`📍 Tamil Nadu Waste Management API ready at http://localhost:${port}/api`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
