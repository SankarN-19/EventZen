const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    venueId: {
        type: Number,
        required: [true, 'Venue ID is required']
    },
    venueName: {
        type: String,
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['CONFERENCE', 'WEDDING', 'CONCERT', 'CORPORATE', 'OTHER']
    },
    organizerId: {
        type: Number,
        required: [true, 'Organizer ID is required']
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
        default: 'UPCOMING'
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);