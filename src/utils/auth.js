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

export const checkAuth = async () => {
  try {
    // Try to fetch current user to verify authentication
    const response = await api.get('/v1/me');
    return response.data ? true : false;
  } catch (error) {
    // If API call fails, check localStorage as fallback
    const role = localStorage.getItem('userRole');
    return role && role !== 'guest';
  }
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
