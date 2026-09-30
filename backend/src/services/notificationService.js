const NotificationModel = require('../models/notificationModel');

class NotificationService {
  static async getUserNotifications(userId, options = {}) {
    return await NotificationModel.findByUserId(userId, options);
  }

  static async markAsRead(id, userId) {
    return await NotificationModel.markAsRead(id, userId);
  }

  static async markAllAsRead(userId) {
    return await NotificationModel.markAllAsRead(userId);
  }

  // Utility to be called internally by other services (not directly via API)
  static async sendNotification({ userId, title, message, type, link, metadata }) {
    if (!userId) return null;
    return await NotificationModel.create({
      userId,
      title,
      message,
      type,
      link,
      metadata
    });
  }
}

module.exports = NotificationService;
