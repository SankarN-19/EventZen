const EventRequest = require('../models/EventRequest');

// POST /event-requests — JWT required (any logged in user)
const createRequest = async (req, res, next) => {
    try {
        const request = await EventRequest.create(req.body);
        res.status(201).json({
            message: 'Event request submitted successfully. Admin will review it shortly.',
            data: request
        });
    } catch (error) {
        next(error);
    }
};

// GET /event-requests — Admin only
const getAllRequests = async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const requests = await EventRequest.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Event requests fetched successfully',
            data: requests
        });
    } catch (error) {
        next(error);
    }
};

// GET /event-requests/my — JWT required (get own requests)
const getMyRequests = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const requests = await EventRequest.find({ requestedBy: userId })
            .sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Your requests fetched successfully',
            data: requests
        });
    } catch (error) {
        next(error);
    }
};

// PUT /event-requests/:id/approve — Admin only
const approveRequest = async (req, res, next) => {
    try {
        const request = await EventRequest.findByIdAndUpdate(
            req.params.id,
            { status: 'APPROVED', adminNote: req.body.adminNote || '' },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ message: 'Request not found', data: null });
        }
        res.status(200).json({ message: 'Request approved', data: request });
    } catch (error) {
        next(error);
    }
};

// PUT /event-requests/:id/reject — Admin only
const rejectRequest = async (req, res, next) => {
    try {
        const request = await EventRequest.findByIdAndUpdate(
            req.params.id,
            { status: 'REJECTED', adminNote: req.body.adminNote || '' },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ message: 'Request not found', data: null });
        }
        res.status(200).json({ message: 'Request rejected', data: request });
    } catch (error) {
        next(error);
    }
};

// DELETE /event-requests/:id — Admin only
const deleteRequest = async (req, res, next) => {
    try {
        const request = await EventRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found', data: null });
        }
        res.status(200).json({ message: 'Request deleted', data: null });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRequest, getAllRequests, getMyRequests,
    approveRequest, rejectRequest, deleteRequest
};