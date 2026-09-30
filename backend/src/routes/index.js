const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const workflowRoutes = require('./workflowRoutes');
const taskRoutes = require('./taskRoutes');
const approvalRoutes = require('./approvalRoutes');
const notificationRoutes = require('./notificationRoutes');
const reportRoutes = require('./reportRoutes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/workflows', workflowRoutes);
router.use('/tasks', taskRoutes);
router.use('/approvals', approvalRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
// router.use('/reports', reportRoutes);
// router.use('/notifications', notificationRoutes);

module.exports = router;

