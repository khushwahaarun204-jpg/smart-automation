import api from './api';

const ApprovalService = {
  getApprovals: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/approvals?${params}`);
    return response.data;
  },

  getApprovalById: async (id) => {
    const response = await api.get(`/approvals/${id}`);
    return response.data;
  },

  createApproval: async (approvalData) => {
    const response = await api.post('/approvals', approvalData);
    return response.data;
  },

  processApproval: async (id, approvalData) => {
    // approvalData usually contains { status: 'approved' | 'rejected', comments: '...' }
    const response = await api.put(`/approvals/${id}`, approvalData);
    return response.data;
  }
};

export default ApprovalService;
