const { supabase } = require('../config/supabase');

class TaskModel {
  static async create({ workflowId, title, description, assignedTo, createdBy, status = 'pending', priority = 'normal', dueDate, metadata = {} }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        workflow_id: workflowId,
        title,
        description,
        assigned_to: assignedTo,
        created_by: createdBy,
        status,
        priority,
        due_date: dueDate,
        metadata
      })
      .select(`
        *,
        workflows:workflow_id (name, status),
        assignee:assigned_to (name, email),
        creator:created_by (name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        workflows:workflow_id (name, status),
        assignee:assigned_to (name, email),
        creator:created_by (name, email)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findAll({ workflowId, assignedTo, createdBy, status }, userContext = null) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        workflows:workflow_id (name, status),
        assignee:assigned_to (name, email),
        creator:created_by (name, email)
      `)
      .order('created_at', { ascending: false });

    if (workflowId) query = query.eq('workflow_id', workflowId);
    if (assignedTo) query = query.eq('assigned_to', assignedTo);
    if (createdBy) query = query.eq('created_by', createdBy);
    if (status) query = query.eq('status', status);

    if (userContext && !['admin', 'manager'].includes(userContext.role)) {
      query = query.or(`created_by.eq.${userContext.id},assigned_to.eq.${userContext.id}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const updateData = { ...updates };
    
    // Map camelCase to snake_case for Supabase
    if (updateData.workflowId) { updateData.workflow_id = updateData.workflowId; delete updateData.workflowId; }
    if (updateData.assignedTo) { updateData.assigned_to = updateData.assignedTo; delete updateData.assignedTo; }
    if (updateData.dueDate) { updateData.due_date = updateData.dueDate; delete updateData.dueDate; }
    
    if (updateData.status === 'completed' && !updateData.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = TaskModel;
