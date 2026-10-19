import {
  getCollectors,
  getFactories,
  createCollector,
  deleteCollector,
  getCollectorById,
  getNearestCollectors,
  getDistricts
} from '../controllers/collectorController.js';

export { calculateDistance, estimateDriveDuration } from '../utils/geoUtils.js';

export default async function collectorRoutes(fastify, options) {
  fastify.get('/collectors', getCollectors);
  fastify.get('/factories', getFactories);
  fastify.post('/collectors', createCollector);
  fastify.delete('/collectors/:id', deleteCollector);
  fastify.get('/collectors/:id', getCollectorById);
  fastify.post('/collectors/nearest', getNearestCollectors);
  fastify.get('/districts', getDistricts);
}
