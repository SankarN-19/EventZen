const Budget = require('../models/Budget');
const Event = require('../models/Event');

// POST /budgets — Admin only
const createBudget = async (req, res, next) => {
    try {
        const event = await Event.findById(req.body.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found', data: null });
        }

        const existing = await Budget.findOne({ eventId: req.body.eventId });
        if (existing) {
            return res.status(409).json({
                message: 'Budget already exists for this event',
                data: null
            });
        }

        const budget = await Budget.create({
            eventId: req.body.eventId,
            totalBudget: req.body.totalBudget,
            expenses: [],
            totalSpent: 0,
            remaining: req.body.totalBudget
        });

        res.status(201).json({ message: 'Budget created successfully', data: budget });
    } catch (error) {
        next(error);
    }
};

// GET /budgets/event/:eventId — Admin only
const getBudgetByEvent = async (req, res, next) => {
    try {
        const budget = await Budget.findOne({ eventId: req.params.eventId })
            .populate('eventId');
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found for this event', data: null });
        }
        res.status(200).json({ message: 'Budget fetched successfully', data: budget });
    } catch (error) {
        next(error);
    }
};

// POST /budgets/:id/expenses — Admin only
const addExpense = async (req, res, next) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found', data: null });
        }

        budget.expenses.push(req.body);
        await budget.save(); // pre('save') hook auto-calculates totalSpent & remaining

        res.status(200).json({ message: 'Expense added successfully', data: budget });
    } catch (error) {
        next(error);
    }
};

// DELETE /budgets/:id/expenses/:expenseId — Admin only
const deleteExpense = async (req, res, next) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found', data: null });
        }

        const expenseIndex = budget.expenses.findIndex(
            e => e._id.toString() === req.params.expenseId
        );
        if (expenseIndex === -1) {
            return res.status(404).json({ message: 'Expense not found', data: null });
        }

        budget.expenses.splice(expenseIndex, 1);
        await budget.save(); // recalculates automatically

        res.status(200).json({ message: 'Expense deleted successfully', data: budget });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBudget, getBudgetByEvent, addExpense, deleteExpense };