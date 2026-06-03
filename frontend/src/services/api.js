import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add visitor ID for non-authenticated requests
api.interceptors.request.use((config) => {
  if (!config.headers['Authorization']) {
    const visitorId = localStorage.getItem('visitorId') || generateVisitorId();
    config.headers['X-Visitor-ID'] = visitorId;
  }
  return config;
});

const generateVisitorId = () => {
  const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem('visitorId', id);
  return id;
};

export default api;