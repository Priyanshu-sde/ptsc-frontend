import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // Check localStorage for authentication state
    const authToken = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (authToken === 'true' && userRole) {
      setIsAuthenticated(true);
      setUser({ role: userRole, name: userName });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/v1/Login', credentials);
      
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      
      if (response.data) {
        // Store user data
        if (response.data.role) {
          localStorage.setItem('userRole', response.data.role);
        }
        if (response.data.name || response.data.userName) {
          localStorage.setItem('userName', response.data.name || response.data.userName);
        }
        
        setUser(response.data);
        setIsAuthenticated(true);
      }
      
      return response.data;
    } catch (error) {
      // Clear any existing auth data on login failure
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/v1/Logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
