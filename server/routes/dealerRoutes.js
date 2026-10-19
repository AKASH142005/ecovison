import { requireRole } from '../middleware/auth.js';
import {
  getPickups,
  acceptPickup,
  updatePickupStatus,
  completePickup,
  getInventory,
  getBoundary,
  updateBoundary,
  getDealerStats
} from '../controllers/dealerController.js';

export default async function dealerRoutes(fastify, options) {
  // All dealer routes require dealer role (or admin)
  fastify.addHook('preHandler', requireRole('dealer', 'admin'));

  fastify.get('/dealer/stats', getDealerStats);
  fastify.get('/dealer/pickups', getPickups);
  fastify.patch('/dealer/pickups/:id/accept', acceptPickup);
  fastify.patch('/dealer/pickups/:id/status', updatePickupStatus);
  fastify.patch('/dealer/pickups/:id/complete', completePickup);
  fastify.get('/dealer/inventory', getInventory);
  fastify.get('/dealer/boundary', getBoundary);
  fastify.patch('/dealer/boundary', updateBoundary);
}
