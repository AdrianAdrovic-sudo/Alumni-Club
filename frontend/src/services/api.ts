// frontend/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api'; // Your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;