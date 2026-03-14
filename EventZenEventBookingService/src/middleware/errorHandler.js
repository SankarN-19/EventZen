const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = {};
        Object.keys(err.errors).forEach(key => {
            errors[key] = err.errors[key].message;
        });
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            message: 'Validation failed',
            errors
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(409).json({
            timestamp: new Date().toISOString(),
            status: 409,
            message: 'Duplicate entry — resource already exists',
            data: null
        });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            message: 'Invalid ID format',
            data: null
        });
    }

    // Generic
    res.status(500).json({
        timestamp: new Date().toISOString(),
        status: 500,
        message: 'Internal server error: ' + err.message,
        data: null
    });
};

module.exports = errorHandler;