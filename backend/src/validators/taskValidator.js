class TaskValidator {
  static validateCreate(data) {
    const errors = [];
    if (!data.workflowId) {
      errors.push({ field: 'workflowId', message: 'Workflow ID is required' });
    }
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title is required' });
    }
    
    if (data.status && !['pending', 'in_progress', 'completed', 'rejected', 'cancelled'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' });
    }

    if (data.priority && !['low', 'normal', 'high', 'urgent'].includes(data.priority)) {
      errors.push({ field: 'priority', message: 'Invalid priority' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdate(data) {
    const errors = [];
    if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length === 0)) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    }

    if (data.status && !['pending', 'in_progress', 'completed', 'rejected', 'cancelled'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' });
    }

    if (data.priority && !['low', 'normal', 'high', 'urgent'].includes(data.priority)) {
      errors.push({ field: 'priority', message: 'Invalid priority' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = TaskValidator;
