const mongoose = require('mongoose');

const eventRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    expectedDate: {
        type: Date,
        required: [true, 'Expected date is required']
    },
    expectedCapacity: {
        type: Number,
        required: [true, 'Expected capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    venuePreference: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['CONFERENCE', 'WEDDING', 'CONCERT', 'CORPORATE', 'OTHER']
    },
    budgetRange: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    requestedBy: {
        type: Number,
        required: [true, 'Requester ID is required']
    },
    requesterName: {
        type: String,
        required: true
    },
    requesterEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    adminNote: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('EventRequest', eventRequestSchema);