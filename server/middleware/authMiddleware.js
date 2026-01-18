const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        // Handle specific JWT errors cleanly without stack traces
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please login again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please login again.' });
        }
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// Client or Admin middleware
exports.clientOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'client')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Clients and Admins only.' });
    }
};
