import api from './api';

const ReportService = {
  getDashboardStats: async () => {
    const response = await api.get('/reports/stats');
    return response.data;
  }
};

export default ReportService;
