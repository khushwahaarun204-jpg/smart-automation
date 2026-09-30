const NotificationService = require('../services/notificationService');

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const { unreadOnly } = req.query;
      const notifications = await NotificationService.getUserNotifications(req.user.id, {
        unreadOnly: unreadOnly === 'true'
      });
      
      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: { code: 500, details: error.message }
      });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.markAsRead(id, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: { code: 500, details: error.message }
      });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      await NotificationService.markAllAsRead(req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: { code: 500, details: error.message }
      });
    }
  }
}

module.exports = NotificationController;
