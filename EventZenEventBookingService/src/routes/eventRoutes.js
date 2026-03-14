const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateEvent } = require('../validators/eventValidator');

router.post('/', authMiddleware, roleMiddleware('ADMIN'), ...validateEvent, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), updateEvent);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deleteEvent);

module.exports = router;