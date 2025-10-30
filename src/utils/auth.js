import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/v1/Login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/v1/Logout');
    return true;
  } catch (error) {
    throw error;
  }
};

export const checkAuth = () => {
  // Check if user is authenticated by checking cookies
  // This is a simple check - you might want to add more robust validation
  return document.cookie.includes('token');
};

export const getUserRole = () => {
  // Get user role from localStorage or cookies
  return localStorage.getItem('userRole') || 'guest';
};

export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

export const clearUserData = () => {
  localStorage.removeItem('userRole');
};
