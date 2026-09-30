import api from './api';

const WorkflowService = {
  getWorkflows: async () => {
    const response = await api.get('/workflows');
    return response.data;
  },

  getWorkflowById: async (id) => {
    const response = await api.get(`/workflows/${id}`);
    return response.data;
  },

  createWorkflow: async (workflowData) => {
    const response = await api.post('/workflows', workflowData);
    return response.data;
  },

  updateWorkflow: async (id, workflowData) => {
    const response = await api.put(`/workflows/${id}`, workflowData);
    return response.data;
  },

  deleteWorkflow: async (id) => {
    const response = await api.delete(`/workflows/${id}`);
    return response.data;
  }
};

export default WorkflowService;
