const express = require('express');
const router = express.Router();
const {
    createRequest, getAllRequests, getMyRequests,
    approveRequest, rejectRequest, deleteRequest
} = require('../controllers/eventRequestController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Customer routes
router.post('/', authMiddleware, createRequest);
router.get('/my', authMiddleware, getMyRequests);

// Admin routes
router.get('/', authMiddleware, roleMiddleware('ADMIN'), getAllRequests);
router.put('/:id/approve', authMiddleware, roleMiddleware('ADMIN'), approveRequest);
router.put('/:id/reject', authMiddleware, roleMiddleware('ADMIN'), rejectRequest);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deleteRequest);

module.exports = router;