const Booking = require('../models/Booking');
const Event = require('../models/Event');

// POST /bookings — JWT required
const createBooking = async (req, res, next) => {
    try {
        const event = await Event.findById(req.body.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found', data: null });
        }
        if (event.status === 'CANCELLED') {
            return res.status(400).json({ message: 'Cannot book a cancelled event', data: null });
        }

        const confirmedCount = await Booking.countDocuments({
            eventId: req.body.eventId,
            status: 'CONFIRMED'
        });

        // If full → WAITLISTED instead of error
        const bookingStatus = confirmedCount >= event.capacity ? 'WAITLISTED' : 'CONFIRMED';

        const booking = await Booking.create({
            ...req.body,
            status: bookingStatus
        });

        const message = bookingStatus === 'WAITLISTED'
            ? 'Event is full — you have been added to the waitlist'
            : 'Booking confirmed successfully';

        res.status(201).json({ message, data: booking });
    } catch (error) {
        next(error);
    }
};

// GET /bookings — JWT required (get MY bookings)
const getMyBookings = async (req, res, next) => {
    try {
        const { userId } = req.query;
        const bookings = await Booking.find({ userId }).populate('eventId');
        res.status(200).json({ message: 'Bookings fetched successfully', data: bookings });
    } catch (error) {
        next(error);
    }
};

// GET /bookings/:id — JWT required
const getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('eventId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found', data: null });
        }
        res.status(200).json({ message: 'Booking fetched successfully', data: booking });
    } catch (error) {
        next(error);
    }
};

// PUT /bookings/:id/cancel — JWT required
const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found', data: null });
        }
        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ message: 'Booking is already cancelled', data: null });
        }
        booking.status = 'CANCELLED';
        await booking.save();
        res.status(200).json({ message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
        next(error);
    }
};

// GET /admin/bookings — Admin only
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate('eventId');
        res.status(200).json({ message: 'All bookings fetched successfully', data: bookings });
    } catch (error) {
        next(error);
    }
};

// PUT /admin/bookings/:id/approve — Admin only
const approveBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'CONFIRMED' },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found', data: null });
        }
        res.status(200).json({ message: 'Booking approved successfully', data: booking });
    } catch (error) {
        next(error);
    }
};

// PUT /admin/bookings/:id/reject — Admin only
const rejectBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'CANCELLED' },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found', data: null });
        }
        res.status(200).json({ message: 'Booking rejected successfully', data: booking });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking, getMyBookings, getBookingById,
    cancelBooking, getAllBookings, approveBooking, rejectBooking
};