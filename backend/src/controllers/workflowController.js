const WorkflowService = require('../services/workflowService');

class WorkflowController {
  static async createWorkflow(req, res) {
    try {
      const workflow = await WorkflowService.createWorkflow(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Workflow created successfully',
        data: workflow
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

  static async getWorkflows(req, res) {
    try {
      // Optional query filters
      const { status, createdBy } = req.query;
      const workflows = await WorkflowService.getWorkflows({ status, createdBy }, req.user);
      
      res.status(200).json({
        success: true,
        message: 'Workflows retrieved successfully',
        data: workflows
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

  static async getWorkflowById(req, res) {
    try {
      const { id } = req.params;
      const workflow = await WorkflowService.getWorkflowById(id, req.user);
      
      res.status(200).json({
        success: true,
        message: 'Workflow retrieved successfully',
        data: workflow
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

  static async updateWorkflow(req, res) {
    try {
      const { id } = req.params;
      const workflow = await WorkflowService.updateWorkflow(id, req.body, req.user.id, req.user.role);
      
      res.status(200).json({
        success: true,
        message: 'Workflow updated successfully',
        data: workflow
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

  static async deleteWorkflow(req, res) {
    try {
      const { id } = req.params;
      await WorkflowService.deleteWorkflow(id, req.user.id, req.user.role);
      
      res.status(200).json({
        success: true,
        message: 'Workflow deleted successfully'
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

module.exports = WorkflowController;
