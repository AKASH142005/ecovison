import { getBookings, createBooking } from '../controllers/bookingController.js';

export default async function bookingRoutes(fastify, options) {
  fastify.get('/bookings', getBookings);
  fastify.post('/bookings', createBooking);
}
