import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Collector } from '../models/Collector.js';
import { isDbLive, memoryStore, logAudit } from '../config/db.js';
import { signToken, authenticate } from '../middleware/auth.js';

export default async function authRoutes(fastify, options) {
  // POST /api/auth/register
  fastify.post('/auth/register', async (request, reply) => {
    const {
      name,
      email,
      password,
      role = 'customer',
      phone = '',
      district = 'Chennai',
      address = '',
      facilityName = '',
      serviceRadiusKm = 8,
      serviceWards = [],
      lat,
      lng
    } = request.body || {};

    if (!name || !email || !password) {
      return reply.code(400).send({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const validRoles = ['customer', 'dealer', 'factory', 'admin'];
    if (!validRoles.includes(role)) {
      return reply.code(400).send({
        success: false,
        message: `Invalid role. Allowed roles: ${validRoles.join(', ')}`
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing
    let existingUser = null;
    if (isDbLive()) {
      try {
        existingUser = await User.findOne({ email: normalizedEmail });
      } catch (e) {
        existingUser = memoryStore.users.find(u => u.email === normalizedEmail);
      }
    } else {
      existingUser = memoryStore.users.find(u => u.email === normalizedEmail);
    }

    if (existingUser) {
      return reply.code(409).send({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}`;
    const facilityId = role === 'dealer' ? `col_${Date.now()}` : role === 'factory' ? `fac_${Date.now()}` : '';

    const defaultLat = parseFloat(lat) || 13.0400 + (Math.random() * 0.08 - 0.04);
    const defaultLng = parseFloat(lng) || 80.2200 + (Math.random() * 0.08 - 0.04);
    const radius = parseFloat(serviceRadiusKm) || 8;

    const newUser = {
      _id: userId,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      phone,
      district,
      address,
      facilityName: facilityName || (role === 'dealer' ? `${name}'s Recovery Center` : role === 'factory' ? `${name} Manufacturing` : ''),
      facilityId,
      serviceRadiusKm: radius,
      serviceWards: Array.isArray(serviceWards) && serviceWards.length > 0 ? serviceWards : [district],
      lat: defaultLat,
      lng: defaultLng,
      createdAt: new Date()
    };

    memoryStore.users.push(newUser);

    // If new Dealer registers, automatically create their Chennai collection point with their boundary!
    if (role === 'dealer') {
      const newCollector = {
        _id: facilityId,
        name: newUser.facilityName,
        district: district || 'Guindy',
        zone: district || 'Guindy',
        city: 'Chennai',
        address: address || `${district}, Chennai`,
        lat: defaultLat,
        lng: defaultLng,
        phone: phone || '+91 94440 00000',
        email: normalizedEmail,
        tnpcbRegNo: `TNPCB/CHN/DLR/${Date.now().toString().slice(-4)}`,
        rating: 5.0,
        totalReviews: 1,
        operatingHours: '08:00 AM - 07:00 PM',
        serviceRadiusKm: radius,
        serviceWards: newUser.serviceWards,
        dealerUserId: userId,
        pointType: 'dealer',
        capacityLoad: 20,
        isVerified: true,
        description: `Authorized Chennai waste recovery center for ${name}. Waste collection boundary: ${radius} km radius.`,
        acceptedWasteTypes: [
          { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
          { category: 'metal', ratePerKg: 38, acceptsDropoff: true, acceptsPickup: true },
          { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true },
          { category: 'ewaste', ratePerKg: 60, acceptsDropoff: true, acceptsPickup: true }
        ],
        createdAt: new Date()
      };

      memoryStore.collectors.unshift(newCollector);
      if (isDbLive()) {
        try {
          await Collector.create(newCollector);
        } catch (e) {
          console.warn('Collector creation note:', e.message);
        }
      }
    }

    if (isDbLive()) {
      try {
        await User.create(newUser);
      } catch (e) {
        console.warn('User db write fallback:', e.message);
      }
    }

    await logAudit({
      action: 'USER_REGISTERED',
      category: 'AUTH',
      actor: newUser,
      targetResource: 'User',
      targetId: userId,
      details: `New ${role} registered: ${name} (${normalizedEmail}) in ${district} with ${radius} km waste collection boundary.`
    });

    const token = signToken(newUser);

    return reply.code(201).send({
      success: true,
      message: `${role.toUpperCase()} account successfully created with ${radius} km collection boundary!`,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        district: newUser.district,
        facilityName: newUser.facilityName,
        facilityId: newUser.facilityId,
        serviceRadiusKm: newUser.serviceRadiusKm,
        serviceWards: newUser.serviceWards
      }
    });
  });

  // POST /api/auth/login
  fastify.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body || {};

    if (!email || !password) {
      return reply.code(400).send({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = null;
    if (isDbLive()) {
      try {
        user = await User.findOne({ email: normalizedEmail }).lean();
      } catch (e) {
        user = memoryStore.users.find(u => u.email === normalizedEmail);
      }
    } else {
      user = memoryStore.users.find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: 'Invalid email or password credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.code(401).send({
        success: false,
        message: 'Invalid email or password credentials'
      });
    }

    const token = signToken(user);

    await logAudit({
      action: 'USER_LOGIN',
      category: 'AUTH',
      actor: user,
      targetResource: 'Session',
      targetId: user._id,
      details: `${user.role.toUpperCase()} logged in: ${user.name} (${user.email})`
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        facilityName: user.facilityName,
        facilityId: user.facilityId
      }
    };
  });

  // GET /api/auth/me
  fastify.get('/auth/me', { preHandler: [authenticate] }, async (request) => {
    return {
      success: true,
      user: request.user
    };
  });

  // GET /api/auth/demo-users (Quick Switcher for Demonstrating Roles)
  fastify.get('/auth/demo-users', async () => {
    const demos = memoryStore.users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      district: u.district,
      facilityName: u.facilityName || '',
      facilityId: u.facilityId || '',
      passwordHint: 'pass123'
    }));

    return {
      success: true,
      demoUsers: demos
    };
  });

  // POST /api/auth/switch-demo (One-click role switcher)
  fastify.post('/auth/switch-demo', async (request, reply) => {
    const { role } = request.body || {};
    const user = memoryStore.users.find(u => u.role === role);

    if (!user) {
      return reply.code(404).send({
        success: false,
        message: `No demo account found for role '${role}'`
      });
    }

    const token = signToken(user);

    await logAudit({
      action: 'ROLE_SWITCH',
      category: 'AUTH',
      actor: user,
      targetResource: 'Session',
      targetId: user._id,
      details: `Demo role switched to ${user.role} (${user.name})`
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        facilityName: user.facilityName,
        facilityId: user.facilityId
      }
    };
  });

  // GET /api/auth/profile-aggregations (Role-specific individual aggregations and attributes)
  fastify.get('/auth/profile-aggregations', { preHandler: [authenticate] }, async (request) => {
    const role = request.user.role;
    const userId = request.user.id || request.user._id;
    const email = request.user.email;
    const facilityId = request.user.facilityId;

    if (role === 'customer') {
      const myBookings = memoryStore.bookings.filter(b => b.userId === userId || b.customerEmail === email || b.userEmail === email);
      const completed = myBookings.filter(b => b.status === 'completed');
      const divertedKg = completed.reduce((sum, b) => sum + (b.actualWeightKg || b.estimatedWeightKg || 0), 0);
      const activeCount = myBookings.filter(b => ['pending', 'accepted', 'in_transit'].includes(b.status)).length;

      return {
        success: true,
        role: 'customer',
        attributes: {
          name: request.user.name,
          email: request.user.email,
          district: request.user.district || 'Chennai',
          roleTitle: 'Citizen Household Scrap Seller',
          zone: request.user.district || 'Anna Nagar'
        },
        aggregations: {
          myDivertedKg: Math.round(divertedKg) || 45,
          myEcoPoints: Math.round((divertedKg || 45) * 10),
          myActiveBookings: activeCount || myBookings.length,
          co2SavedKg: Math.round((divertedKg || 45) * 2.5),
          nearbyHubsCount: memoryStore.collectors.filter(c => c.pointType === 'dealer').length
        }
      };
    }

    if (role === 'dealer') {
      const dealerCol = memoryStore.collectors.find(c => c._id === facilityId || c.dealerUserId === userId) || memoryStore.collectors[0];
      const inventory = memoryStore.inventory;
      const totalInventoryKg = inventory.reduce((sum, i) => sum + (i.availableKg || 0), 0);
      const pendingPickups = memoryStore.bookings.filter(b => ['pending', 'accepted', 'in_transit'].includes(b.status));
      const orders = memoryStore.orders.filter(o => o.dealerId === facilityId || o.dealerId === 'mem_col_1');

      return {
        success: true,
        role: 'dealer',
        attributes: {
          name: request.user.name,
          facilityName: request.user.facilityName || dealerCol?.name || 'Guindy Eco-Recovery Hub',
          district: request.user.district || 'Guindy',
          tnpcbRegNo: dealerCol?.tnpcbRegNo || 'TNPCB/CHN/DLR/2026',
          serviceRadiusKm: dealerCol?.serviceRadiusKm || 8,
          serviceWards: dealerCol?.serviceWards || ['Guindy', 'Adyar', 'T. Nagar', 'Velachery']
        },
        aggregations: {
          inventoryTotalKg: Math.round(totalInventoryKg) || 9420,
          pendingPickupsCount: pendingPickups.length,
          serviceRadiusKm: dealerCol?.serviceRadiusKm || 8,
          coverageAreaSqKm: Math.round(Math.PI * (dealerCol?.serviceRadiusKm || 8) ** 2),
          dispatchedOrdersCount: orders.length || 2,
          activeWardsCount: (dealerCol?.serviceWards || []).length || 4
        }
      };
    }

    if (role === 'factory') {
      const requirements = memoryStore.requirements;
      const totalDemandsKg = requirements.filter(r => r.status === 'open').reduce((sum, r) => sum + (r.requiredQuantityKg || 0), 0);
      const orders = memoryStore.orders;
      const inboundShipments = orders.filter(o => o.status === 'shipped').length;
      const verifiedWeightKg = orders.filter(o => o.status === 'verified').reduce((sum, o) => sum + (o.verifiedWeightKg || o.quantityKg || 0), 0);
      const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return {
        success: true,
        role: 'factory',
        attributes: {
          name: request.user.name,
          facilityName: request.user.facilityName || 'Manali Eco-Polymers Ltd',
          district: request.user.district || 'Manali',
          roleTitle: 'Industrial Secondary Smelting & Repulping Plant',
          tnpcbLicense: 'TNPCB/CHN/FAC/2022/9011'
        },
        aggregations: {
          activeDemandsKg: Math.round(totalDemandsKg) || 12000,
          inboundShipmentsCount: inboundShipments || 1,
          verifiedMaterialKg: Math.round(verifiedWeightKg) || 4500,
          procurementSpendInr: totalSpent || 71400
        }
      };
    }

    // Admin role
    const totalCollected = memoryStore.bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.actualWeightKg || b.estimatedWeightKg || 0), 0);
    const totalOrders = memoryStore.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      success: true,
      role: 'admin',
      attributes: {
        name: request.user.name || 'Dr. S. Meenakshi',
        office: 'Ripon Building Central Governance',
        department: 'Greater Chennai Corporation & TNPCB Special Directorate',
        roleTitle: 'Municipal Environmental Compliance Officer'
      },
      aggregations: {
        cityDivertedKg: Math.round(totalCollected) || 1250,
        dealersCount: memoryStore.collectors.filter(c => c.pointType === 'dealer').length,
        factoriesCount: (memoryStore.factories || []).length || 5,
        auditLogsCount: memoryStore.auditLogs.length,
        circularTradeVolumeInr: totalOrders || 71400,
        complianceScore: '99.4%'
      }
    };
  });
}
