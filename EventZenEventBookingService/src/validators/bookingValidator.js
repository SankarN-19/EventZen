const { body, validationResult } = require('express-validator');

const validateBooking = [
    body('eventId').notEmpty().withMessage('Event ID is required'),
    body('userId').notEmpty().isNumeric().withMessage('User ID must be a number'),
    body('attendeeName').notEmpty().withMessage('Attendee name is required'),
    body('attendeeEmail').notEmpty().isEmail().withMessage('Valid email is required'),

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

module.exports = { validateBooking };