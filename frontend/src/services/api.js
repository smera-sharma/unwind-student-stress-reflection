import axios from 'axios';
import { safeStorage } from '../utils/storage';

// Get API base URL from Vite environment variables (fallback to localhost:8001/api/v1)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout limit
});

// Helper to trigger a global floating notification toast
const triggerToast = (title, message) => {
  window.dispatchEvent(new CustomEvent('unwind-toast', { detail: { title, message } }));
};

// Request interceptor: Attach JWT token and enforce network connection availability check
api.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      const error = new Error("No internet connection available.");
      error.isOffline = true;
      return Promise.reject(error);
    }
    const token = safeStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.DEV) {
        console.log(`[Auth] Attaching Authorization token header: Bearer ${token.slice(0, 15)}...`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error handler, automatic transient retry, and response unpacking
api.interceptors.response.use(
  (response) => {
    // Automatically unpack our standardized success wrapper structure
    if (response.data && response.data.success === true && response.data.hasOwnProperty('data')) {
      return {
        ...response,
        data: response.data.data,
        success: response.data.success,
        message: response.data.message,
      };
    }
    return response;
  },
  async (error) => {
    if (error.isOffline) {
      triggerToast("Offline Mode", "You are currently offline. Running in local backup.");
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const isTransient = !error.response || (error.response.status >= 500 && error.response.status <= 599);

    // Retry transient server failures exactly once
    if (isTransient && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Transient API failure detected. Retrying request once...");
        const res = await api(originalRequest);
        return res;
      } catch (retryError) {
        error = retryError;
      }
    }

    let title = "API Connection Error";
    let message = "We're having trouble connecting to the Unwind server right now. Running in local fallback.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const backendMsg = (data && data.message) || error.response.statusText;

      if (status === 401) {
        // If it's a login or register endpoint, do NOT show Session Expired toast or force logout
        const isAuthEndpoint = error.config && (
          error.config.url.includes('/auth/login') || 
          error.config.url.includes('/auth/register')
        );
        
        // Also check if we have any active token before triggering "Session Expired"
        const token = safeStorage.getItem('token');
        const hasToken = token && token !== 'null' && token !== 'undefined' && token !== '';
        
        if (hasToken && !isAuthEndpoint) {
          title = "Session Expired";
          message = "Your session has expired. Please log in again.";
          if (import.meta.env.DEV) {
            console.log("[Auth] Logout reason: Received 401 Unauthorized from backend endpoint with active session.");
          }
          safeStorage.removeItem('token');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          triggerToast(title, message);
        } else {
          if (import.meta.env.DEV) {
            console.log("[Auth] 401 Unauthorized received. Validation skipped (no active session token or auth endpoint).");
          }
          return Promise.reject(error);
        }
      } else if (status === 403) {
        title = "Access Denied";
        message = "You don't have permission to perform this action.";
        triggerToast(title, message);
      } else if (status === 404) {
        title = "Not Found";
        message = "The requested resource could not be found.";
        triggerToast(title, message);
      } else if (status >= 500) {
        title = "Server Error";
        message = "The server encountered an error. Please try again in a few moments.";
        triggerToast(title, message);
      } else {
        title = `Error (${status})`;
        message = backendMsg || "An unexpected error occurred.";
        triggerToast(title, message);
      }
    } else if (error.code === 'ECONNABORTED') {
      title = "Request Timeout";
      message = "The request took too long. Please check your connection and try again.";
      triggerToast(title, message);
    } else {
      triggerToast(title, message);
    }
    return Promise.reject(error);
  }
);

// Centralized reusable API methods
export const apiService = {
  auth: {
    login: async (email, password) => {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      const response = await api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    },
    register: async (email, password, fullName) => {
      const response = await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      return response.data;
    },
  },
  profile: {
    getProfile: async () => {
      const response = await api.get('/profile');
      return response.data;
    },
    updateProfile: async (data) => {
      const response = await api.put('/profile', data);
      return response.data;
    },
    getSettings: async () => {
      const response = await api.get('/settings');
      return response.data;
    },
    updateSettings: async (data) => {
      const response = await api.put('/settings', data);
      return response.data;
    },
  },
  ai: {
    getReflection: async (journal, mood) => {
      const response = await api.post('/ai/reflection', { journal, mood });
      return response.data;
    },
    chat: async (messages, mood, memory) => {
      const response = await api.post('/ai/chat', { messages, mood, memory });
      return response.data;
    },
    getMonthlySummary: async (reflections) => {
      const response = await api.post('/ai/monthly-summary', { reflections });
      return response.data;
    },
  },
};

export default api;
