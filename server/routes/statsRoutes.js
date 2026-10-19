import { getStats } from '../controllers/statsController.js';

export default async function statsRoutes(fastify, options) {
  fastify.get('/stats', getStats);
}
