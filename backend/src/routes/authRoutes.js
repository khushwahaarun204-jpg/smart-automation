const express = require('express');
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/authValidator');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Rate limiter for authentication endpoints: max 30 requests per 15 minutes in dev/prod
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    error: { code: 'RATE_LIMIT_EXCEEDED' }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication routes
router.post('/signup', authLimiter, validateSignup, AuthController.signup);
router.post('/login', authLimiter, validateLogin, AuthController.login);
router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
