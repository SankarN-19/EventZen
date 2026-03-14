const { body, validationResult } = require('express-validator');

const validateEvent = [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').notEmpty().isISO8601().withMessage('Valid date is required'),
    body('venueId').notEmpty().isNumeric().withMessage('Venue ID must be a number'),
    body('capacity').notEmpty().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('category')
        .notEmpty()
        .isIn(['CONFERENCE', 'WEDDING', 'CONCERT', 'CORPORATE', 'OTHER'])
        .withMessage('Invalid category'),
    body('organizerId').notEmpty().isNumeric().withMessage('Organizer ID must be a number'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                status: 400,
                message: 'Validation failed',
                errors: errors.mapped()
            });
        }
        next();
    }
];

module.exports = { validateEvent };