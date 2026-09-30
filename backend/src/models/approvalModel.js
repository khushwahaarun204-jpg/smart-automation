const { supabase } = require('../config/supabase');

class ApprovalModel {
  static async create({ workflowId, taskId, approverId, stepNumber = 1, status = 'pending', comments }) {
    const { data, error } = await supabase
      .from('approvals')
      .insert({
        workflow_id: workflowId,
        task_id: taskId,
        approver_id: approverId,
        step_number: stepNumber,
        status,
        comments
      })
      .select(`
        *,
        workflows:workflow_id (name, status),
        tasks:task_id (title, status),
        approver:approver_id (name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('approvals')
      .select(`
        *,
        workflows:workflow_id (name, status),
        tasks:task_id (title, status),
        approver:approver_id (name, email)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findAll({ workflowId, taskId, approverId, status }, userContext = null) {
    let query = supabase
      .from('approvals')
      .select(`
        *,
        workflows:workflow_id (name, status),
        tasks:task_id (title, status),
        approver:approver_id (name, email)
      `)
      .order('created_at', { ascending: false });

    if (workflowId) query = query.eq('workflow_id', workflowId);
    if (taskId) query = query.eq('task_id', taskId);
    if (approverId) query = query.eq('approver_id', approverId);
    if (status) query = query.eq('status', status);

    if (userContext && !['admin', 'manager'].includes(userContext.role)) {
      query = query.eq('approver_id', userContext.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const updateData = { ...updates };
    
    // Map camelCase to snake_case
    if (updateData.status && updateData.status !== 'pending' && !updateData.approved_at) {
      updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('approvals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = ApprovalModel;
