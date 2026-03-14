const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Expense category is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be non-negative']
    },
    date: {
        type: Date,
        required: [true, 'Expense date is required']
    }
});

const budgetSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event ID is required'],
        unique: true
    },
    totalBudget: {
        type: Number,
        required: [true, 'Total budget is required'],
        min: [0, 'Budget must be non-negative']
    },
    expenses: [expenseSchema],
    totalSpent: {
        type: Number,
        default: 0
    },
    remaining: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Auto-calculate totalSpent and remaining before every save
budgetSchema.pre('save', async function () {
    this.totalSpent = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    this.remaining = this.totalBudget - this.totalSpent;
});

module.exports = mongoose.model('Budget', budgetSchema);