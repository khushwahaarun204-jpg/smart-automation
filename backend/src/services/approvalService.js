const ApprovalModel = require('../models/approvalModel');
const TaskModel = require('../models/taskModel');
const WorkflowModel = require('../models/workflowModel');
const AuditLogModel = require('../models/auditLogModel');
const ApprovalValidator = require('../validators/approvalValidator');
const NotificationService = require('./notificationService');

class ApprovalService {
  static async createApproval(data, userId) {
    const validation = ApprovalValidator.validateCreate(data);
    if (!validation.isValid) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    // Verify task exists
    const task = await TaskModel.findById(data.taskId);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const approval = await ApprovalModel.create(data);

    await AuditLogModel.log({
      userId,
      action: 'APPROVAL_CREATED',
      resource: 'approvals',
      resourceId: approval.id,
      metadata: { taskId: approval.task_id, workflowId: approval.workflow_id }
    });

    // Notify the approver that they have a new pending approval
    if (approval.approver_id && approval.approver_id !== userId) {
      await NotificationService.sendNotification({
        userId: approval.approver_id,
        title: 'Approval Required',
        message: `You have been requested to approve: ${task.title}`,
        type: 'approval_requested',
        link: `/approvals`
      });
    }

    return approval;
  }

  static async getApprovals(filters = {}, userContext = null) {
    return await ApprovalModel.findAll(filters, userContext);
  }

  static async getApprovalById(id, userContext = null) {
    const approval = await ApprovalModel.findById(id);
    if (!approval) {
      const error = new Error('Approval not found');
      error.statusCode = 404;
      throw error;
    }

    if (userContext && !['admin', 'manager'].includes(userContext.role)) {
      if (approval.approver_id !== userContext.id) {
        const error = new Error('Unauthorized access to this approval record');
        error.statusCode = 403;
        throw error;
      }
    }

    return approval;
  }

  static async processApproval(id, updates, userId, userRole) {
    const validation = ApprovalValidator.validateUpdate(updates);
    if (!validation.isValid) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const existing = await ApprovalModel.findById(id);
    if (!existing) {
      const error = new Error('Approval not found');
      error.statusCode = 404;
      throw error;
    }

    // Access logic:
    // Only the assigned approver, or an admin, can process (approve/reject) this request.
    if (userRole !== 'admin' && existing.approver_id !== userId) {
      const error = new Error('Unauthorized: You are not the assigned approver');
      error.statusCode = 403;
      throw error;
    }

    const task = await TaskModel.findById(existing.task_id);
    
    // Self-approval restriction
    if (task && task.created_by === userId && userRole === 'employee') {
      const workflow = await WorkflowModel.findById(existing.workflow_id);
      const allowSelfApproval = workflow?.template_config?.allowSelfApproval === true;
      
      if (!allowSelfApproval) {
        const error = new Error('Unauthorized: You cannot approve your own request');
        error.statusCode = 403;
        throw error;
      }
    }

    const updatedApproval = await ApprovalModel.update(id, updates);

    // Side effect: If the approval is processed, update the task status automatically
    if (['approved', 'rejected', 'auto_approved'].includes(updates.status)) {
      const taskStatusMap = {
        'approved': 'completed',
        'auto_approved': 'completed',
        'rejected': 'rejected'
      };
      
      const newTaskStatus = taskStatusMap[updates.status];
      if (newTaskStatus) {
        await TaskModel.update(existing.task_id, { status: newTaskStatus });
      }
    }

    await AuditLogModel.log({
      userId,
      action: 'APPROVAL_PROCESSED',
      resource: 'approvals',
      resourceId: id,
      metadata: { status: updates.status, comments: updates.comments }
    });

    // We can also notify the task creator that their task was approved/rejected
    if (task && task.created_by !== userId) {
      await NotificationService.sendNotification({
        userId: task.created_by,
        title: `Approval ${updates.status === 'approved' ? 'Granted' : 'Rejected'}`,
        message: `Your task "${task.title}" has been ${updates.status}.`,
        type: `approval_${updates.status}`,
        link: `/tasks`
      });
    }

    return updatedApproval;
  }
}

module.exports = ApprovalService;
