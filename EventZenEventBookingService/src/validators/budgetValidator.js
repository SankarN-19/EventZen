const { body, validationResult } = require('express-validator');

const validateBudget = [
    body('eventId').notEmpty().withMessage('Event ID is required'),
    body('totalBudget')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('Total budget must be a non-negative number'),

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

const validateExpense = [
    body('category').notEmpty().withMessage('Expense category is required'),
    body('amount')
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('Amount must be a non-negative number'),
    body('date').notEmpty().isISO8601().withMessage('Valid date is required'),

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

module.exports = { validateBudget, validateExpense };