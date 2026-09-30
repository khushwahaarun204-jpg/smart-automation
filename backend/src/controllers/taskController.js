const TaskService = require('../services/taskService');

class TaskController {
  static async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        error: {
          code: error.statusCode || 500,
          details: error.details || null
        }
      });
    }
  }

  static async getTasks(req, res) {
    try {
      const { workflowId, assignedTo, createdBy, status } = req.query;
      const tasks = await TaskService.getTasks({ workflowId, assignedTo, createdBy, status }, req.user);
      
      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: {
          code: 500,
          details: error.message
        }
      });
    }
  }

  static async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await TaskService.getTaskById(id);
      
      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        error: {
          code: error.statusCode || 500,
          details: null
        }
      });
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const task = await TaskService.updateTask(id, req.body, req.user.id, req.user.role);
      
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        error: {
          code: error.statusCode || 500,
          details: error.details || null
        }
      });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      await TaskService.deleteTask(id, req.user.id, req.user.role);
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        error: {
          code: error.statusCode || 500,
          details: null
        }
      });
    }
  }
}

module.exports = TaskController;
