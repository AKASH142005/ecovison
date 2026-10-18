import jwt from 'jsonwebtoken';
import { memoryStore, isDbLive } from '../config/db.js';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecovision_tamilnadu_super_secret_jwt_key_2026';

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      facilityId: user.facilityId,
      facilityName: user.facilityName,
      district: user.district
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Fastify preHandler to authenticate request
 */
export async function authenticate(request, reply) {
  const authHeader = request.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (request.query && request.query.token) {
    token = request.query.token;
  }

  // Quick testing header support (allows switching roles easily in demos)
  const demoRole = request.headers['x-demo-role'];
  if (!token && demoRole) {
    const demoUser = memoryStore.users.find(u => u.role === demoRole);
    if (demoUser) {
      request.user = {
        id: demoUser._id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        facilityId: demoUser.facilityId,
        facilityName: demoUser.facilityName,
        district: demoUser.district
      };
      return;
    }
  }

  if (!token) {
    return reply.code(401).send({
      success: false,
      message: 'Authentication token required'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return reply.code(401).send({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  request.user = decoded;
}

/**
 * Role-Based Access Control Middleware Factory
 */
export function requireRole(...allowedRoles) {
  return async (request, reply) => {
    await authenticate(request, reply);
    if (reply.sent) return;

    if (!allowedRoles.includes(request.user.role)) {
      return reply.code(403).send({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Your role is '${request.user.role}'.`
      });
    }
  };
}
