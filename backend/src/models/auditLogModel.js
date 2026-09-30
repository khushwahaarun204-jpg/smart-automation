const { supabase } = require('../config/supabase');

class AuditLogModel {
  /**
   * Log an audit event
   */
  static async log({ userId = null, action, resource, resourceId = null, metadata = {} }) {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action,
          resource,
          resource_id: resourceId,
          metadata
        });

      if (error) {
        console.warn('[Audit Log Warning]:', error.message);
      }
    } catch (err) {
      console.warn('[Audit Log Exception]:', err.message);
    }
  }
}

module.exports = AuditLogModel;
