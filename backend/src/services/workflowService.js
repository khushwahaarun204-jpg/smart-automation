const WorkflowModel = require('../models/workflowModel');
const AuditLogModel = require('../models/auditLogModel');
const WorkflowValidator = require('../validators/workflowValidator');

class WorkflowService {
  static async createWorkflow(data, userId) {
    const validation = WorkflowValidator.validateCreate(data);
    if (!validation.isValid) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const workflowData = {
      ...data,
      createdBy: userId
    };

    const workflow = await WorkflowModel.create(workflowData);

    await AuditLogModel.log({
      userId,
      action: 'WORKFLOW_CREATED',
      resource: 'workflows',
      resourceId: workflow.id,
      metadata: { name: workflow.name }
    });

    return workflow;
  }

  static async getWorkflows(filters = {}, userContext = null) {
    return await WorkflowModel.findAll(filters, userContext);
  }

  static async getWorkflowById(id, userContext = null) {
    const workflow = await WorkflowModel.findById(id);
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    if (userContext && !['admin', 'manager'].includes(userContext.role)) {
      if (workflow.created_by !== userContext.id) {
        const error = new Error('Unauthorized access to this workflow');
        error.statusCode = 403;
        throw error;
      }
    }

    return workflow;
  }

  static async updateWorkflow(id, updates, userId, userRole) {
    const validation = WorkflowValidator.validateUpdate(updates);
    if (!validation.isValid) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const existing = await WorkflowModel.findById(id);
    if (!existing) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    // Role-based access logic: Only admin or the creator can update
    if (userRole !== 'admin' && existing.created_by !== userId) {
      const error = new Error('Unauthorized to update this workflow');
      error.statusCode = 403;
      throw error;
    }

    const updatedWorkflow = await WorkflowModel.update(id, updates);

    await AuditLogModel.log({
      userId,
      action: 'WORKFLOW_UPDATED',
      resource: 'workflows',
      resourceId: id,
      metadata: { updates }
    });

    return updatedWorkflow;
  }

  static async deleteWorkflow(id, userId, userRole) {
    const existing = await WorkflowModel.findById(id);
    if (!existing) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    if (userRole !== 'admin' && existing.created_by !== userId) {
      const error = new Error('Unauthorized to delete this workflow');
      error.statusCode = 403;
      throw error;
    }

    await WorkflowModel.delete(id);

    await AuditLogModel.log({
      userId,
      action: 'WORKFLOW_DELETED',
      resource: 'workflows',
      resourceId: id,
      metadata: { name: existing.name }
    });

    return true;
  }
}

module.exports = WorkflowService;
