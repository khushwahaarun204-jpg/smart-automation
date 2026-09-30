class WorkflowValidator {
  static validateCreate(data) {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name is required' });
    }
    
    if (data.status && !['draft', 'active', 'paused', 'archived'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' });
    }

    if (data.templateConfig && typeof data.templateConfig !== 'object') {
      errors.push({ field: 'templateConfig', message: 'templateConfig must be an object' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdate(data) {
    const errors = [];
    if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
      errors.push({ field: 'name', message: 'Name cannot be empty' });
    }

    if (data.status && !['draft', 'active', 'paused', 'archived'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = WorkflowValidator;
