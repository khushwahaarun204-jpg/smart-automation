const express = require('express');
const router = express.Router();
const ApprovalController = require('../controllers/approvalController');
const { authenticate } = require('../middleware/authMiddleware');

// All approval routes require authentication
router.use(authenticate);

// GET /api/approvals
router.get('/', ApprovalController.getApprovals);

// POST /api/approvals
router.post('/', ApprovalController.createApproval);

// GET /api/approvals/:id
router.get('/:id', ApprovalController.getApprovalById);

// PUT /api/approvals/:id (Process an approval)
router.put('/:id', ApprovalController.processApproval);

module.exports = router;
