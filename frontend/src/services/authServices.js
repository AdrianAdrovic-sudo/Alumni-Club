import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // backend base URL

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class AuthService {
  // Register new user
  async register(userData) {
    try {
      // Adjust endpoint if your backend uses something different
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Registration failed'
      );
    }
  }

  // Login user
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed'
      );
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user object
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Get raw token
  getToken() {
    return localStorage.getItem('token');
  }

  // Is user authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Update user profile
  async updateProfile(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      // Optionally refresh local user if backend returns it
      if (response.data && typeof response.data === 'object') {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem(
            'user',
            JSON.stringify({ ...currentUser, ...response.data })
          );
        }
      }
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Profile update failed'
      );
    }
  }

  // STEP 1: check username + email for password reset
  async resetCheck(username, email) {
    try {
      const response = await api.post('/auth/reset-check', { username, email });
      return response.data; // { message, userId? }
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Provjera podataka nije uspjela'
      );
    }
  }

  // STEP 2: confirm new password
  async resetConfirm(username, email, newPassword) {
    try {
      const response = await api.post('/auth/reset-confirm', {
        username,
        email,
        newPassword,
      });
      return response.data; // { message }
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Promjena šifre nije uspjela'
      );
    }
  }
}

export default new AuthService();
