const TaskModel = require('../models/taskModel');
const WorkflowModel = require('../models/workflowModel');
const AuditLogModel = require('../models/auditLogModel');
const TaskValidator = require('../validators/taskValidator');
const NotificationService = require('./notificationService');

class TaskService {
  static async createTask(data, userId) {
    const validation = TaskValidator.validateCreate(data);
    if (!validation.isValid) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    // Verify workflow exists
    const workflow = await WorkflowModel.findById(data.workflowId);
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    const taskData = {
      ...data,
      createdBy: userId
    };

    const task = await TaskModel.create(taskData);

    await AuditLogModel.log({
      userId,
      action: 'TASK_CREATED',
      resource: 'tasks',
      resourceId: task.id,
      metadata: { title: task.title, workflowId: task.workflow_id }
    });

    // Notify assignee if someone else assigned them
    if (task.assigned_to && task.assigned_to !== userId) {
      await NotificationService.sendNotification({
        userId: task.assigned_to,
        title: 'New Task Assigned',
        message: `You have been assigned to: ${task.title}`,
        type: 'task_assigned',
        link: `/tasks`
      });
    }

    return task;
  }

  static async getTasks(filters = {}, userContext = null) {
    return await TaskModel.findAll(filters, userContext);
  }

  static async getTaskById(id) {
    const task = await TaskModel.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  static async updateTask(id, updates, userId, userRole) {
    const validation = TaskValidator.validateUpdate(updates);
    if (!validation.isValid) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const existing = await TaskModel.findById(id);
    if (!existing) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    // Role-based access logic:
    // Only admin, task creator, or task assignee can update a task.
    if (userRole !== 'admin' && existing.created_by !== userId && existing.assigned_to !== userId) {
      const error = new Error('Unauthorized to update this task');
      error.statusCode = 403;
      throw error;
    }

    const updatedTask = await TaskModel.update(id, updates);

    await AuditLogModel.log({
      userId,
      action: 'TASK_UPDATED',
      resource: 'tasks',
      resourceId: id,
      metadata: { updates }
    });

    // Notify task creator if someone else completes it
    if (updates.status === 'completed' && existing.created_by !== userId) {
      await NotificationService.sendNotification({
        userId: existing.created_by,
        title: 'Task Completed',
        message: `Your task "${existing.title}" has been completed.`,
        type: 'task_completed',
        link: `/tasks`
      });
    }

    return updatedTask;
  }

  static async deleteTask(id, userId, userRole) {
    const existing = await TaskModel.findById(id);
    if (!existing) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (userRole !== 'admin' && existing.created_by !== userId) {
      const error = new Error('Unauthorized to delete this task');
      error.statusCode = 403;
      throw error;
    }

    await TaskModel.delete(id);

    await AuditLogModel.log({
      userId,
      action: 'TASK_DELETED',
      resource: 'tasks',
      resourceId: id,
      metadata: { title: existing.title }
    });

    return true;
  }
}

module.exports = TaskService;
