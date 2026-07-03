import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (tokenVal) => {
    try {
      const response = await fetch('http://localhost:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${tokenVal}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser({
          id: 1,
          email: data.email,
          fullName: data.full_name || 'Student User',
          displayName: data.display_name || 'Eshniie',
          bio: data.bio || '',
          profilePicture: data.profile_picture || '',
          preferredPronouns: data.preferred_pronouns || '',
        });
      } else {
        // Fallback stub if backend error
        setUser({
          id: 1,
          email: 'user@unwind.com',
          fullName: 'Jane Doe',
          displayName: 'Eshniie',
        });
      }
    } catch (e) {
      // Offline fallback
      setUser({
        id: 1,
        email: 'user@unwind.com',
        fullName: 'Jane Doe',
        displayName: 'Eshniie',
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    if (email && password) {
      const mockToken = `mock_jwt_token_payload_for_${email}`;
      localStorage.setItem('token', mockToken);
      await fetchProfile(mockToken);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    if (email && password && fullName) {
      const mockToken = `mock_jwt_token_payload_for_${email}`;
      localStorage.setItem('token', mockToken);
      
      // Call register backend endpoint (if server is running)
      try {
        await fetch('http://localhost:8000/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: fullName })
        });
      } catch (e) {
        console.warn("Backend register API unavailable, registering locally");
      }

      await fetchProfile(mockToken);
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

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await fetchProfile(token);
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
