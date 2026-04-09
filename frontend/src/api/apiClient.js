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

// Mock API responses for development
const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (credentials) => {
    // Simulate API call
    await mockDelay(1000);
    if (credentials.email === 'admin@demo.com' && credentials.password === 'password') {
      return {
        data: {
          user: { id: 1, name: 'Admin User', email: credentials.email, tenantId: 'tenant-1' },
          token: 'mock-jwt-token-xyz'
        }
      };
    }
    throw new Error('Invalid credentials');
  },
  
  signup: async (userData) => {
    await mockDelay(1000);
    return {
      data: {
        user: { id: Date.now(), ...userData, tenantId: `tenant-${Date.now()}` },
        token: 'mock-jwt-token-new'
      }
    };
  }
};

export default api;
