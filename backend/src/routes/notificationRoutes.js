const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(authenticate);

// GET /api/notifications
router.get('/', NotificationController.getNotifications);

// PUT /api/notifications/read-all
router.put('/read-all', NotificationController.markAllAsRead);

// PUT /api/notifications/:id/read
router.put('/:id/read', NotificationController.markAsRead);

module.exports = router;
