import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage (JWT-ready skeleton)
    const token = localStorage.getItem('token');
    if (token) {
      // Stub authenticated user data
      setUser({
        id: 1,
        email: 'user@unwind.com',
        fullName: 'Jane Doe',
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    // JWT-ready authentication stub: always succeeds for demonstration if fields filled
    if (email && password) {
      const mockToken = 'mock_jwt_token_payload';
      localStorage.setItem('token', mockToken);
      setUser({
        id: 1,
        email: email,
        fullName: 'Jane Doe',
      });
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    // JWT-ready registration stub
    if (email && password && fullName) {
      const mockToken = 'mock_jwt_token_payload';
      localStorage.setItem('token', mockToken);
      setUser({
        id: 1,
        email: email,
        fullName: fullName,
      });
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
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
