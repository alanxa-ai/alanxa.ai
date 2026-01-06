const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, googleAuth, verifyOtp } = require('../controllers/authController');

// Rate Limiter: 5 OTP requests per minute per IP
const otpLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { message: "Too many attempts, please try again in a minute" }
});

// General Auth Limiter: 20 requests per minute
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', googleAuth); // Google handles its own security mostly
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/forgot-password', otpLimiter, require('../controllers/authController').forgotPassword);
router.post('/reset-password', authLimiter, require('../controllers/authController').resetPassword);

module.exports = router;
