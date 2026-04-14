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

// Response interceptor — handle auth and server errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error — can't reach backend at all
      console.error('Network error: Cannot reach the server.');
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      // Token invalid/expired — log out and redirect to login
      console.warn('Unauthorized request. Clearing session...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (status === 429) {
      // Rate limit hit
      console.warn('Rate limit exceeded:', error.response.data?.message);
      // We can use a custom error or just append info
      error.message = error.response.data?.message || 'Wait a moment, too many requests.';
    }

    // 503 = DB temporarily unavailable — don't log out, let component handle it
    return Promise.reject(error);
  }
);

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
