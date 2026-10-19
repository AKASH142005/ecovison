import { authenticate, requireRole } from '../middleware/auth.js';
import {
  getRequirements,
  createRequirement,
  createOrder,
  getOrders,
  shipOrder,
  verifyOrder,
  payOrder,
  getMarketplaceStats
} from '../controllers/marketplaceController.js';

export default async function marketplaceRoutes(fastify, options) {
  // Public/Authenticated list of requirements and stats
  fastify.get('/marketplace/stats', getMarketplaceStats);
  fastify.get('/marketplace/requirements', getRequirements);

  // Factory publishes a material requirement
  fastify.post(
    '/marketplace/requirements',
    { preHandler: [requireRole('factory', 'admin')] },
    createRequirement
  );

  // Dealer creates a purchase order / supply commitment to a factory requirement
  fastify.post(
    '/marketplace/orders',
    { preHandler: [requireRole('dealer', 'admin')] },
    createOrder
  );

  // GET orders (filtered by role)
  fastify.get('/marketplace/orders', { preHandler: [authenticate] }, getOrders);

  // Dealer marks shipment dispatched (deducts from dealer availableKg inventory)
  fastify.patch(
    '/marketplace/orders/:id/ship',
    { preHandler: [requireRole('dealer', 'admin')] },
    shipOrder
  );

  // Factory verifies incoming shipment & quality
  fastify.patch(
    '/marketplace/orders/:id/verify',
    { preHandler: [requireRole('factory', 'admin')] },
    verifyOrder
  );

  // Factory or Admin clears and releases payment
  fastify.patch(
    '/marketplace/orders/:id/payment',
    { preHandler: [requireRole('factory', 'admin')] },
    payOrder
  );
}
