const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// All report routes require authentication
router.use(authenticate);

// Reports are only for admins and managers
router.use(requireRole('admin', 'manager'));

// GET /api/reports/stats
router.get('/stats', ReportController.getDashboardStats);

// GET /api/reports/export/csv
router.get('/export/csv', ReportController.exportCsv);

// GET /api/reports/export/pdf
router.get('/export/pdf', ReportController.exportPdf);

module.exports = router;
