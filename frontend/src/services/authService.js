import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

/**
 * Auth Service
 * Handles authentication API calls
 */

/**
 * Register new user
 */
export const register = async (username, email, password, fullName) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
    fullName
  });
  return response.data;
};

/**
 * Login user
 */
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password
  });
  
  if (response.data.token) {
    // Save token and user info to localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      fullName: response.data.fullName
    }));
  }
  
  return response.data;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

/**
 * Get auth token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get current user info from server
 */
export const getMe = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token');
  }
  
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};
