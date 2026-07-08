import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { safeStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (import.meta.env.DEV) {
      console.log("[Auth] Initiating profile request from backend API...");
    }
    try {
      const data = await apiService.profile.getProfile();
      if (import.meta.env.DEV) {
        console.log("[Auth] Profile request succeeded. User details:", data);
      }
      const emailPrefix = data.email.split('@')[0];
      const defaultName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      setUser({
        id: data.id,
        email: data.email,
        fullName: data.full_name || defaultName,
        displayName: data.display_name || defaultName,
        bio: data.bio || '',
        profilePicture: data.profile_picture || '🌱',
        preferredPronouns: data.preferred_pronouns || '',
      });
    } catch (e) {
      console.error("[Auth] fetchProfile API call failed:", e);
      setUser(null);
      throw e;
    }
  };

  useEffect(() => {
    const token = safeStorage.getItem('token');
    const hasToken = token && token !== 'null' && token !== 'undefined' && token !== '';
    if (import.meta.env.DEV) {
      console.log(`[Auth] Restoring session from safeStorage. Token loaded: "${token}". Session exists:`, !!hasToken);
    }
    if (hasToken) {
      if (import.meta.env.DEV) {
        console.log("[Auth] Session validation started (profile fetch request trigger).");
      }
      fetchProfile().catch(() => {}).finally(() => setIsLoading(false));
    } else {
      if (import.meta.env.DEV) {
        console.log("[Auth] Session validation skipped (no active storage token found).");
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      if (import.meta.env.DEV) {
        console.log(`[Auth] Attempting backend login for: ${email}`);
      }
      const res = await apiService.auth.login(email, password);
      if (res && res.access_token) {
        if (import.meta.env.DEV) {
          console.log("[Auth] Login success! Received JWT access token from backend.");
        }
        safeStorage.setItem('token', res.access_token);
        if (import.meta.env.DEV) {
          console.log("[Auth] Access token stored securely in safeStorage.");
        }
        await fetchProfile();
        setIsLoading(false);
        return { success: true };
      }
    } catch (e) {
      console.warn("Backend login failed:", e);
      const isValidationError = e.response && (e.response.status === 401 || e.response.status === 400);
      if (isValidationError) {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password.' };
      }
    }
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials or connection error' };
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    try {
      if (import.meta.env.DEV) {
        console.log(`[Auth] Attempting backend registration for: ${email}`);
      }
      const res = await apiService.auth.register(email, password, fullName);
      if (res) {
        if (import.meta.env.DEV) {
          console.log("[Auth] Backend registration succeeded. Proceeding to login automatically.");
        }
        return login(email, password);
      }
    } catch (e) {
      console.warn("Backend registration failed:", e);
    }
    setIsLoading(false);
    return { success: false, error: 'Registration failed' };
  };

  const logout = () => {
    if (import.meta.env.DEV) {
      console.log("[Auth] Logout triggered by user action.");
    }
    safeStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = safeStorage.getItem('token');
    const hasToken = token && token !== 'null' && token !== 'undefined' && token !== '';
    if (hasToken) {
      await fetchProfile();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
