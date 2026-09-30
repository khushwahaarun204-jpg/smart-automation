const { supabase } = require('../config/supabase');

class NotificationModel {
  static async create({ userId, title, message, type, link = null, metadata = {} }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link,
        metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId, { unreadOnly = false, limit = 50 } = {}) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async markAsRead(id, userId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId) // Security: only mark own notification as read
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markAllAsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return true;
  }
}

module.exports = NotificationModel;
