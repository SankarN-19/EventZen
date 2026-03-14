const express = require('express');
const router = express.Router();
const {
    createBooking, getMyBookings, getBookingById,
    cancelBooking, getAllBookings, approveBooking, rejectBooking
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateBooking } = require('../validators/bookingValidator');

// Customer routes
router.post('/', authMiddleware, ...validateBooking, createBooking);
router.get('/', authMiddleware, getMyBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id/cancel', authMiddleware, cancelBooking);

// Admin routes
router.get('/admin/bookings', authMiddleware, roleMiddleware('ADMIN'), getAllBookings);
router.put('/admin/bookings/:id/approve', authMiddleware, roleMiddleware('ADMIN'), approveBooking);
router.put('/admin/bookings/:id/reject', authMiddleware, roleMiddleware('ADMIN'), rejectBooking);

module.exports = router;