const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event ID is required']
    },
    userId: {
        type: Number,
        required: [true, 'User ID is required']
    },
    attendeeName: {
        type: String,
        required: [true, 'Attendee name is required'],
        trim: true
    },
    attendeeEmail: {
        type: String,
        required: [true, 'Attendee email is required'],
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['CONFIRMED', 'CANCELLED', 'WAITLISTED'],
        default: 'CONFIRMED'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);