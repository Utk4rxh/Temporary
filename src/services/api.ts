// src/services/api.ts
import axios from 'axios';

// Create a configured Axios instance ready for REST backend integration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.aischolarships.org/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request. Redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default api;
