import { Booking } from '../models/Booking.js';
import { isDbLive, memoryStore } from '../config/db.js';

export default async function bookingRoutes(fastify, options) {
  // GET bookings
  fastify.get('/bookings', async () => {
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

  // POST create booking
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

    // Lookup rates and CO2 factors
    const weight = parseFloat(estimatedWeightKg) || 1;
    const cat = memoryStore.categories.find(c => c.id === wasteCategory) || {};
    const rate = cat.avgMarketRatePerKg || 15;
    const co2PerKg = cat.carbonOffsetPerKg || 1.5;

    const estimatedReward = Math.round(weight * rate);
    const co2SavedKg = Math.round(weight * co2PerKg * 10) / 10;
    const bookingId = `ECO-TN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBookingData = {
      bookingId,
      collectorId,
      collectorName: collectorName || 'EcoVision Tamil Nadu Hub',
      type,
      wasteCategory,
      estimatedWeightKg: weight,
      userName,
      userPhone,
      userAddress: userAddress || 'Direct drop-off at center',
      district: district || 'Tamil Nadu',
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '10:00 AM - 01:00 PM',
      estimatedReward,
      co2SavedKg,
      status: 'confirmed',
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

    return reply.code(201).send({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: savedBooking
    });
  });
}
