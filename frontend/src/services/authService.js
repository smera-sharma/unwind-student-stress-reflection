import api from './api';

const authService = {
  /**
   * Log in user (mock/skeleton handler for backend integration)
   */
  login: async (email, password) => {
    // Under actual implementation, this will call:
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access_token: 'mock_jwt_token_payload',
          token_type: 'bearer',
          user: { id: 1, email, fullName: 'Jane Doe' },
        });
      }, 500);
    });
  },

  /**
   * Register a new user (mock/skeleton handler)
   */
  register: async (email, password, fullName) => {
    // Under actual implementation:
    // const response = await api.post('/auth/register', { email, password, full_name: fullName });
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          email,
          fullName,
        });
      }, 500);
    });
  },

  /**
   * Fetch details of currently authenticated user
   */
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export default authService;
