const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const eventRoutes = require('./src/routes/eventRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);
app.use('/budgets', budgetRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Event & Booking Service is running', data: 'OK' });
});

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;