import { apiService } from './api';
import { safeStorage } from '../utils/storage';

const authService = {
  login: async (email, password) => {
    const res = await apiService.auth.login(email, password);
    if (res && res.access_token) {
      safeStorage.setItem('token', res.access_token);
      return res;
    }
    throw new Error("Login failed");
  },

  register: async (email, password, fullName) => {
    return await apiService.auth.register(email, password, fullName);
  },

  logout: () => {
    safeStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    return await apiService.profile.getProfile();
  }
};

export default authService;
