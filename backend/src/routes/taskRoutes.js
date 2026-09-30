const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(authenticate);

// GET /api/tasks
router.get('/', TaskController.getTasks);

// POST /api/tasks
router.post('/', TaskController.createTask);

// GET /api/tasks/:id
router.get('/:id', TaskController.getTaskById);

// PUT /api/tasks/:id
router.put('/:id', TaskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
