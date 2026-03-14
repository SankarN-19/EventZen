const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access denied — no token provided',
            data: null
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { sub: email, role: 'ADMIN'/'ATTENDEE', ... }
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            data: null
        });
    }
};

module.exports = authMiddleware;