import axios from 'axios';

// Get API base URL from Vite environment variables (fallback to localhost:8000/api/v1)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token to every request header if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error handler (e.g. redirect on 401 unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto-logout user or purge storage if token is invalid/expired
      localStorage.removeItem('token');
      // optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
