// ============================================
// AXIOS INSTANCE — Shared config for API calls
// ============================================

import axios from 'axios';

// SECTION 1: Create instance with baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000',           // Backend URL
});

// SECTION 2: Request interceptor
// Runs BEFORE every request. Adds the JWT if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Where we store JWT after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// SECTION 3: Response interceptor
// If backend returns 401, clear invalid token.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;