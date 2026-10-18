import { Booking } from '../models/Booking.js';
import { isDbLive, memoryStore, logAudit } from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

export default async function bookingRoutes(fastify, options) {
  // GET bookings
  fastify.get('/bookings', async (request) => {
    let bookings = [];
    if (isDbLive()) {
      try {
        bookings = await Booking.find().sort({ createdAt: -1 }).limit(50).lean();
      } catch (e) {
        bookings = memoryStore.bookings;
      }
    } else {
      bookings = memoryStore.bookings;
    }

    return { success: true, count: bookings.length, bookings };
  });

  // POST create booking / pickup request
  fastify.post('/bookings', async (request, reply) => {
    const {
      collectorId,
      collectorName,
      type = 'dropoff',
      wasteCategory,
      estimatedWeightKg,
      userName,
      userPhone,
      userAddress,
      district,
      scheduledDate,
      timeSlot,
      notes = ''
    } = request.body || {};

    if (!collectorId || !userName || !userPhone || !wasteCategory || !estimatedWeightKg) {
      return reply.code(400).send({
        success: false,
        message: 'collectorId, userName, userPhone, wasteCategory, and estimatedWeightKg are required'
      });
    }

    // Try reading user from auth token if present
    const authHeader = request.headers.authorization;
    let customerId = 'usr_customer_1';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded && decoded.id) customerId = decoded.id;
    }

    // Lookup rates and CO2 factors
    const weight = parseFloat(estimatedWeightKg) || 1;
    const cat = memoryStore.categories.find(c => c.id === wasteCategory) || {};
    const rate = cat.avgMarketRatePerKg || 18;
    const co2PerKg = cat.carbonOffsetPerKg || 1.8;

    const estimatedReward = Math.round(weight * rate);
    const co2SavedKg = Math.round(weight * co2PerKg * 10) / 10;
    const bookingId = `ECO-TN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBookingData = {
      bookingId,
      customerId,
      collectorId,
      collectorName: collectorName || 'EcoVision Tamil Nadu Hub',
      type,
      wasteCategory,
      estimatedWeightKg: weight,
      actualWeightKg: 0,
      userName,
      userPhone,
      userAddress: userAddress || 'Direct drop-off at center',
      district: district || 'Tamil Nadu',
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '10:00 AM - 01:00 PM',
      estimatedReward,
      co2SavedKg,
      status: type === 'doorstep_pickup' ? 'pending' : 'confirmed',
      notes,
      createdAt: new Date()
    };

    let savedBooking = newBookingData;

    if (isDbLive()) {
      try {
        const doc = await Booking.create(newBookingData);
        savedBooking = doc.toObject();
      } catch (err) {
        memoryStore.bookings.unshift(newBookingData);
      }
    } else {
      memoryStore.bookings.unshift(newBookingData);
    }

    await logAudit({
      action: 'PICKUP_CREATED',
      category: 'PICKUP',
      actor: { id: customerId, name: userName, role: 'customer' },
      targetResource: 'Booking',
      targetId: bookingId,
      details: `Citizen ${userName} created ${type === 'doorstep_pickup' ? 'doorstep pickup' : 'dropoff'} request ${bookingId} for ~${weight} kg of ${wasteCategory.toUpperCase()} in ${district}.`
    });

    return reply.code(201).send({
      success: true,
      message: `${type === 'doorstep_pickup' ? 'Pickup request' : 'Drop-off'} confirmed successfully!`,
      booking: savedBooking
    });
  });
}
