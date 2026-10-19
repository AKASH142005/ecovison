import { requireRole } from '../middleware/auth.js';
import {
  getOverview,
  getAuditLogs,
  getUsers,
  getSystemStatus,
  runTestSuite
} from '../controllers/adminController.js';

export default async function adminRoutes(fastify, options) {
  // Admin overview and audit logs
  fastify.get('/admin/overview', { preHandler: [requireRole('admin')] }, getOverview);
  fastify.get('/admin/audit-logs', { preHandler: [requireRole('admin')] }, getAuditLogs);
  fastify.get('/admin/users', { preHandler: [requireRole('admin')] }, getUsers);
  fastify.get('/admin/system-status', getSystemStatus);
  fastify.get('/admin/test-suite', runTestSuite);
}
