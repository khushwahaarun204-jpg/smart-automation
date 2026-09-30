const express = require('express');
const router = express.Router();
const WorkflowController = require('../controllers/workflowController');
const { authenticate } = require('../middleware/authMiddleware');

// All workflow routes require authentication
router.use(authenticate);

// GET /api/workflows
router.get('/', WorkflowController.getWorkflows);

// POST /api/workflows (Any authenticated user can create, or maybe limit to admin/manager?)
// The spec didn't restrict who can create a workflow, so we let any authenticated user do it for now.
router.post('/', WorkflowController.createWorkflow);

// GET /api/workflows/:id
router.get('/:id', WorkflowController.getWorkflowById);

// PUT /api/workflows/:id (Handled internally: only admin or creator)
router.put('/:id', WorkflowController.updateWorkflow);

// DELETE /api/workflows/:id (Handled internally: only admin or creator)
router.delete('/:id', WorkflowController.deleteWorkflow);

module.exports = router;
