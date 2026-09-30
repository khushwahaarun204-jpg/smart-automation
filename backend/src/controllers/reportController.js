const ReportService = require('../services/reportService');

class ReportController {
  static async getDashboardStats(req, res) {
    try {
      const stats = await ReportService.getDashboardStats();
      
      res.status(200).json({
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: { code: 500, details: error.message }
      });
    }
  }

  static async exportCsv(req, res) {
    try {
      const stats = await ReportService.getDashboardStats();
      let csv = 'Task Title,Workflow,Status,Time\n';
      stats.recentActivity.forEach(activity => {
        csv += `"${activity.title}","${activity.workflows?.name || ''}","${activity.status}","${new Date(activity.updated_at).toLocaleString()}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
      res.status(200).send(csv);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: { code: 500, details: error.message } });
    }
  }

  static async exportPdf(req, res) {
    try {
      // Simulate PDF buffer return (In a real app this would use puppeteer or pdfkit)
      const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Smart Automation Report) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000223 00000 n \n0000000311 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n405\n%%EOF');
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
      res.status(200).send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: { code: 500, details: error.message } });
    }
  }
}

module.exports = ReportController;
