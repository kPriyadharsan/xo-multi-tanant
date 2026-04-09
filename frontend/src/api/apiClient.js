import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Real API services
export const authApi = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  signup: async (userData) => {
    return api.post('/auth/register', userData);
  }
};

export const taskApi = {
  getAll: () => api.get('/tasks'),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`)
};

export const logApi = {
  getAll: () => api.get('/logs')
};

export default api;
