class ApprovalValidator {
  static validateCreate(data) {
    const errors = [];
    if (!data.workflowId) {
      errors.push({ field: 'workflowId', message: 'Workflow ID is required' });
    }
    if (!data.taskId) {
      errors.push({ field: 'taskId', message: 'Task ID is required' });
    }
    if (!data.approverId) {
      errors.push({ field: 'approverId', message: 'Approver ID is required' });
    }
    
    if (data.status && !['pending', 'approved', 'rejected', 'auto_approved'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdate(data) {
    const errors = [];
    if (data.status && !['pending', 'approved', 'rejected', 'auto_approved'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' });
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = ApprovalValidator;
