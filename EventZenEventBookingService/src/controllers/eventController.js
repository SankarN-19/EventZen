const Event = require('../models/Event');

// POST /events — Admin only
const createEvent = async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// GET /events — Public (with optional filters)
const getAllEvents = async (req, res, next) => {
    try {
        const { category, status, page = 0, size = 10 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;

        const skip = page * size;
        const [events, total] = await Promise.all([
            Event.find(filter).skip(skip).limit(Number(size)).sort({ date: 1 }),
            Event.countDocuments(filter)
        ]);

        res.status(200).json({
            message: 'Events fetched successfully',
            data: {
                content: events,
                totalElements: total,
                totalPages: Math.ceil(total / size),
                currentPage: Number(page)
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /events/:id — Public
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found', data: null });
        }
        res.status(200).json({ message: 'Event fetched successfully', data: event });
    } catch (error) {
        next(error);
    }
};

// PUT /events/:id — Admin only
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found', data: null });
        }
        res.status(200).json({ message: 'Event updated successfully', data: event });
    } catch (error) {
        next(error);
    }
};

// DELETE /events/:id — Admin only
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found', data: null });
        }
        res.status(200).json({ message: 'Event deleted successfully', data: null });
    } catch (error) {
        next(error);
    }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };