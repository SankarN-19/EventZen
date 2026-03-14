const express = require('express');
const router = express.Router();
const { createBudget, getBudgetByEvent, addExpense, deleteExpense } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateBudget, validateExpense } = require('../validators/budgetValidator');

router.post('/',
    authMiddleware,
    roleMiddleware('ADMIN'),
    ...validateBudget,
    createBudget
);

router.get('/event/:eventId',
    authMiddleware,
    roleMiddleware('ADMIN'),
    getBudgetByEvent
);

router.post('/:id/expenses',
    authMiddleware,
    roleMiddleware('ADMIN'),
    ...validateExpense,
    addExpense
);

router.delete('/:id/expenses/:expenseId',
    authMiddleware,
    roleMiddleware('ADMIN'),
    deleteExpense
);

module.exports = router;