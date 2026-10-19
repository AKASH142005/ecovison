import { authenticate } from '../middleware/auth.js';
import {
  register,
  login,
  getMe,
  getDemoUsers,
  switchDemo,
  getProfileAggregations
} from '../controllers/authController.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/auth/register', register);
  fastify.post('/auth/login', login);
  fastify.get('/auth/me', { preHandler: [authenticate] }, getMe);
  fastify.get('/auth/demo-users', getDemoUsers);
  fastify.post('/auth/switch-demo', switchDemo);
  fastify.get('/auth/profile-aggregations', { preHandler: [authenticate] }, getProfileAggregations);
}
