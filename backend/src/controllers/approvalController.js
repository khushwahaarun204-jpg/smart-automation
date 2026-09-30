const ApprovalService = require('../services/approvalService');

class ApprovalController {
  static async createApproval(req, res) {
    try {
      const approval = await ApprovalService.createApproval(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Approval step created successfully',
        data: approval
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

  static async getApprovals(req, res) {
    try {
      const { workflowId, taskId, approverId, status } = req.query;
      const approvals = await ApprovalService.getApprovals({ workflowId, taskId, approverId, status }, req.user);
      
      res.status(200).json({
        success: true,
        message: 'Approvals retrieved successfully',
        data: approvals
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

  static async getApprovalById(req, res) {
    try {
      const { id } = req.params;
      const approval = await ApprovalService.getApprovalById(id, req.user);
      
      res.status(200).json({
        success: true,
        message: 'Approval retrieved successfully',
        data: approval
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

  static async processApproval(req, res) {
    try {
      const { id } = req.params;
      const approval = await ApprovalService.processApproval(id, req.body, req.user.id, req.user.role);
      
      res.status(200).json({
        success: true,
        message: `Approval processed successfully (${approval.status})`,
        data: approval
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
}

module.exports = ApprovalController;
