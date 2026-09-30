const { supabase } = require('../config/supabase');

class WorkflowModel {
  static async create({ name, description, createdBy, status = 'draft', templateConfig = {} }) {
    const { data, error } = await supabase
      .from('workflows')
      .insert({
        name,
        description,
        created_by: createdBy,
        status,
        template_config: templateConfig
      })
      .select(`
        id, name, description, status, template_config, created_at, updated_at,
        created_by,
        users:created_by (name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('workflows')
      .select(`
        id, name, description, status, template_config, created_at, updated_at,
        created_by,
        users:created_by (name, email)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findAll({ status, createdBy }, userContext = null) {
    let query = supabase
      .from('workflows')
      .select(`
        id, name, description, status, template_config, created_at, updated_at,
        created_by,
        users:created_by (name, email)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (createdBy) {
      query = query.eq('created_by', createdBy);
    }

    if (userContext && !['admin', 'manager'].includes(userContext.role)) {
      query = query.eq('created_by', userContext.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const updateData = { ...updates };
    if (updateData.templateConfig) {
      updateData.template_config = updateData.templateConfig;
      delete updateData.templateConfig;
    }

    const { data, error } = await supabase
      .from('workflows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = WorkflowModel;
