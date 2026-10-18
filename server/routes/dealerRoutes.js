import { Booking } from '../models/Booking.js';
import { DealerInventory } from '../models/DealerInventory.js';
import { Collector } from '../models/Collector.js';
import { User } from '../models/User.js';
import { memoryStore, isDbLive, logAudit } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function dealerRoutes(fastify, options) {
  // All dealer routes require dealer role (or admin)
  fastify.addHook('preHandler', requireRole('dealer', 'admin'));

  // GET /api/dealer/pickups
  fastify.get('/dealer/pickups', async (request) => {
    const dealerId = request.user.facilityId || request.user.id;
    const dealerDistrict = request.user.district;

    let pickups = [];
    if (isDbLive()) {
      try {
        pickups = await Booking.find({
          $or: [
            { collectorId: dealerId },
            { collectorId: 'mem_col_1' },
            { district: new RegExp(`^${dealerDistrict}$`, 'i') }
          ]
        }).sort({ createdAt: -1 }).lean();
      } catch (e) {
        pickups = memoryStore.bookings;
      }
    } else {
      pickups = memoryStore.bookings;
    }

    return {
      success: true,
      count: pickups.length,
      pickups
    };
  });

  // PATCH /api/dealer/pickups/:id/accept
  fastify.patch('/dealer/pickups/:id/accept', async (request, reply) => {
    const { id } = request.params;
    const dealerId = request.user.facilityId || request.user.id;
    const dealerName = request.user.facilityName || request.user.name;

    let booking = null;
    if (isDbLive()) {
      try {
        booking = await Booking.findOne({ $or: [{ _id: id }, { bookingId: id }] });
      } catch (e) {
        booking = memoryStore.bookings.find(b => b._id === id || b.bookingId === id);
      }
    } else {
      booking = memoryStore.bookings.find(b => b._id === id || b.bookingId === id);
    }

    if (!booking) {
      return reply.code(404).send({ success: false, message: 'Pickup request not found' });
    }

    booking.status = 'accepted';
    booking.collectorId = dealerId;
    booking.collectorName = dealerName;

    if (isDbLive() && typeof booking.save === 'function') {
      await booking.save();
    }

    await logAudit({
      action: 'PICKUP_ACCEPTED',
      category: 'PICKUP',
      actor: request.user,
      targetResource: 'Booking',
      targetId: booking.bookingId || id,
      details: `Dealer ${dealerName} accepted pickup ${booking.bookingId || id} (${booking.wasteCategory}, ~${booking.estimatedWeightKg} kg)`
    });

    return {
      success: true,
      message: `Pickup ${booking.bookingId || id} accepted by ${dealerName}`,
      booking
    };
  });

  // PATCH /api/dealer/pickups/:id/status (e.g. in_transit)
  fastify.patch('/dealer/pickups/:id/status', async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body || {};

    if (!['pending', 'accepted', 'in_transit', 'completed', 'cancelled'].includes(status)) {
      return reply.code(400).send({ success: false, message: 'Invalid pickup status' });
    }

    let booking = memoryStore.bookings.find(b => b._id === id || b.bookingId === id);
    if (!booking && isDbLive()) {
      booking = await Booking.findOne({ $or: [{ _id: id }, { bookingId: id }] });
    }

    if (!booking) {
      return reply.code(404).send({ success: false, message: 'Pickup request not found' });
    }

    booking.status = status;
    if (isDbLive() && typeof booking.save === 'function') {
      await booking.save();
    }

    await logAudit({
      action: `PICKUP_${status.toUpperCase()}`,
      category: 'PICKUP',
      actor: request.user,
      targetResource: 'Booking',
      targetId: booking.bookingId || id,
      details: `Pickup ${booking.bookingId || id} updated to ${status}`
    });

    return {
      success: true,
      booking
    };
  });

  // PATCH /api/dealer/pickups/:id/complete
  // Verifies weight, marks completed, and automatically credits dealer inventory!
  fastify.patch('/dealer/pickups/:id/complete', async (request, reply) => {
    const { id } = request.params;
    const { actualWeightKg, notes = '' } = request.body || {};
    const dealerId = request.user.facilityId || request.user.id || 'mem_col_1';
    const dealerName = request.user.facilityName || request.user.name;

    let booking = memoryStore.bookings.find(b => b._id === id || b.bookingId === id);
    if (!booking && isDbLive()) {
      booking = await Booking.findOne({ $or: [{ _id: id }, { bookingId: id }] });
    }

    if (!booking) {
      return reply.code(404).send({ success: false, message: 'Pickup request not found' });
    }

    const verifiedWeight = Math.max(0.5, parseFloat(actualWeightKg) || booking.estimatedWeightKg);
    const category = booking.wasteCategory;

    // Recompute reward based on actual verified weight
    const cat = memoryStore.categories.find(c => c.id === category) || {};
    const rate = cat.avgMarketRatePerKg || 18;
    const co2PerKg = cat.carbonOffsetPerKg || 1.8;

    booking.actualWeightKg = verifiedWeight;
    booking.estimatedReward = Math.round(verifiedWeight * rate);
    booking.co2SavedKg = Math.round(verifiedWeight * co2PerKg * 10) / 10;
    booking.status = 'completed';
    booking.verifiedAt = new Date();
    booking.notes = notes ? `${booking.notes ? booking.notes + ' | ' : ''}${notes}` : booking.notes;

    if (isDbLive() && typeof booking.save === 'function') {
      await booking.save();
    }

    // --- AUTOMATIC DEALER INVENTORY UPDATE ---
    let invRecord = memoryStore.inventory.find(
      inv => inv.dealerId === dealerId && inv.category === category
    );

    if (!invRecord) {
      invRecord = {
        _id: `inv_${Date.now()}`,
        dealerId,
        dealerName,
        category,
        availableKg: 0,
        totalCollectedKg: 0,
        totalDispatchedKg: 0,
        lastCollectedAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.inventory.push(invRecord);
    }

    invRecord.availableKg = Math.round((invRecord.availableKg + verifiedWeight) * 10) / 10;
    invRecord.totalCollectedKg = Math.round((invRecord.totalCollectedKg + verifiedWeight) * 10) / 10;
    invRecord.lastCollectedAt = new Date();
    invRecord.updatedAt = new Date();

    if (isDbLive()) {
      try {
        await DealerInventory.findOneAndUpdate(
          { dealerId, category },
          {
            $inc: { availableKg: verifiedWeight, totalCollectedKg: verifiedWeight },
            $set: { dealerName, lastCollectedAt: new Date(), updatedAt: new Date() }
          },
          { upsert: true, new: true }
        );
      } catch (e) {
        console.warn('Inventory db write fallback:', e.message);
      }
    }

    // Audit logs for collection & inventory increment
    await logAudit({
      action: 'PICKUP_COMPLETED',
      category: 'PICKUP',
      actor: request.user,
      targetResource: 'Booking',
      targetId: booking.bookingId || id,
      details: `Completed pickup ${booking.bookingId || id}. Verified weight: ${verifiedWeight} kg of ${category}. Payout: ₹${booking.estimatedReward}.`
    });

    await logAudit({
      action: 'INVENTORY_CREDITED',
      category: 'INVENTORY',
      actor: request.user,
      targetResource: 'DealerInventory',
      targetId: invRecord._id,
      details: `Inventory credited +${verifiedWeight} kg [${category.toUpperCase()}]. Current stock: ${invRecord.availableKg} kg.`
    });

    return {
      success: true,
      message: `Pickup verified! Added ${verifiedWeight} kg of ${category} to dealer inventory.`,
      booking,
      updatedInventory: invRecord
    };
  });

  // GET /api/dealer/inventory
  fastify.get('/dealer/inventory', async (request) => {
    const dealerId = request.user.facilityId || request.user.id || 'mem_col_1';

    let inventory = memoryStore.inventory.filter(i => i.dealerId === dealerId || i.dealerId === 'mem_col_1');

    if (isDbLive()) {
      try {
        const dbItems = await DealerInventory.find({
          $or: [{ dealerId }, { dealerId: 'mem_col_1' }]
        }).lean();
        if (dbItems && dbItems.length > 0) inventory = dbItems;
      } catch (e) {
        // fallback to memory
      }
    }

    const totalAvailableKg = inventory.reduce((acc, curr) => acc + (curr.availableKg || 0), 0);
    const totalCollectedKg = inventory.reduce((acc, curr) => acc + (curr.totalCollectedKg || 0), 0);

    return {
      success: true,
      dealerId,
      totalAvailableKg: Math.round(totalAvailableKg),
      totalCollectedKg: Math.round(totalCollectedKg),
      inventory
    };
  });

  // GET /api/dealer/boundary
  fastify.get('/dealer/boundary', async (request) => {
    const dealerId = request.user.facilityId || request.user.id || 'mem_col_1';
    const user = memoryStore.users.find(u => u._id === request.user.id || u.email === request.user.email);
    const collector = memoryStore.collectors.find(c => c._id === dealerId || c.dealerUserId === request.user.id || c._id === 'mem_col_1');

    return {
      success: true,
      boundary: {
        serviceRadiusKm: collector?.serviceRadiusKm || user?.serviceRadiusKm || 8,
        serviceWards: collector?.serviceWards || user?.serviceWards || [request.user.district || 'Guindy'],
        address: collector?.address || user?.address || 'Plot 42, SIDCO Industrial Estate, Guindy, Chennai',
        lat: collector?.lat || user?.lat || 13.0067,
        lng: collector?.lng || user?.lng || 80.2012,
        facilityName: collector?.name || user?.facilityName || 'Guindy Eco-Recovery Industrial Hub',
        district: collector?.district || user?.district || 'Guindy'
      }
    };
  });

  // PATCH /api/dealer/boundary
  fastify.patch('/dealer/boundary', async (request, reply) => {
    const { serviceRadiusKm, serviceWards, address, lat, lng, facilityName, district } = request.body || {};
    const dealerId = request.user.facilityId || request.user.id || 'mem_col_1';

    const radius = parseFloat(serviceRadiusKm);
    if (isNaN(radius) || radius <= 0) {
      return reply.code(400).send({ success: false, message: 'Valid service radius in km is required' });
    }

    // Update memoryStore user
    const user = memoryStore.users.find(u => u._id === request.user.id || u.email === request.user.email);
    if (user) {
      user.serviceRadiusKm = radius;
      if (serviceWards) user.serviceWards = Array.isArray(serviceWards) ? serviceWards : [serviceWards];
      if (address) user.address = address;
      if (lat) user.lat = parseFloat(lat);
      if (lng) user.lng = parseFloat(lng);
      if (facilityName) user.facilityName = facilityName;
      if (district) user.district = district;
    }

    // Update matching collector point in memoryStore
    let collector = memoryStore.collectors.find(c => c._id === dealerId || c.dealerUserId === request.user.id || c._id === 'mem_col_1');
    if (collector) {
      collector.serviceRadiusKm = radius;
      if (serviceWards) collector.serviceWards = Array.isArray(serviceWards) ? serviceWards : [serviceWards];
      if (address) collector.address = address;
      if (lat) collector.lat = parseFloat(lat);
      if (lng) collector.lng = parseFloat(lng);
      if (facilityName) collector.name = facilityName;
      if (district) {
        collector.district = district;
        collector.zone = district;
      }
    }

    // If live MongoDB, update DB documents
    if (isDbLive()) {
      try {
        await User.findByIdAndUpdate(request.user.id, {
          serviceRadiusKm: radius,
          serviceWards: user?.serviceWards,
          address: user?.address,
          lat: user?.lat,
          lng: user?.lng
        });
        if (collector) {
          await Collector.findByIdAndUpdate(collector._id, {
            serviceRadiusKm: radius,
            serviceWards: collector.serviceWards,
            address: collector.address,
            lat: collector.lat,
            lng: collector.lng,
            name: collector.name,
            district: collector.district
          });
        }
      } catch (e) {
        console.warn('DB boundary update fallback:', e.message);
      }
    }

    await logAudit({
      action: 'DEALER_BOUNDARY_UPDATED',
      category: 'INVENTORY',
      actor: request.user,
      targetResource: 'DealerBoundary',
      targetId: dealerId,
      details: `Dealer ${request.user.name} updated waste collection boundary to ${radius} km radius across wards: ${(collector?.serviceWards || []).join(', ')}.`
    });

    return {
      success: true,
      message: `Waste collection boundary successfully updated to ${radius} km!`,
      boundary: {
        serviceRadiusKm: radius,
        serviceWards: collector?.serviceWards || user?.serviceWards,
        address: collector?.address || user?.address,
        lat: collector?.lat || user?.lat,
        lng: collector?.lng || user?.lng,
        facilityName: collector?.name || user?.facilityName,
        district: collector?.district || user?.district
      }
    };
  });
}
