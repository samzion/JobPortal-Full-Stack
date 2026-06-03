import api from './api';

export const jobService = {
  getJobs: (params = {}) => {
    return api.get('/jobs', { params });
  },

  getJob: (id) => {
    return api.get(`/jobs/${id}`);
  },

  createJob: (jobData) => {
    return api.post('/jobs', jobData);
  },

  updateJob: (id, jobData) => {
    return api.put(`/jobs/${id}`, jobData);
  },

  deleteJob: (id) => {
    return api.delete(`/jobs/${id}`);
  },

  voteJob: (id, voteType) => {
    return api.post(`/jobs/${id}/vote`, { voteType });
  },

  getCategories: () => {
    return api.get('/categories');
  },

  applyForJob: (jobId, applicationData) => {
    return api.post(`/applications/jobs/${jobId}`, applicationData);
  },

  getMyApplications: (params = {}) => {
    return api.get('/applications/my-applications', { params });
  },

  getCompanyApplications: (params = {}) => {
    return api.get('/applications/company-applications', { params });
  },

  updateApplicationStatus: (applicationId, status) => {
    return api.put(`/applications/${applicationId}/status`, null, {
      params: { status }
    });
  }
};