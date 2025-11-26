import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api'; // Adjust to your backend URL

class AdminService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: false,
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // User Management
  async getUsers(filters = {}, page = 1, limit = 10) {
    const params = { ...filters, page, limit };
    const response = await this.api.get('/admin/users', { params });
    return response.data;
  }

  async getUserById(userId) {
    const response = await this.api.get(`/admin/users/${userId}`);
    return response.data;
  }

  async createUser(userData) {
    const response = await this.api.post('/admin/users', userData);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await this.api.put(`/admin/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await this.api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  async deactivateUser(userId) {
    const response = await this.api.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  }

  async activateUser(userId) {
    const response = await this.api.patch(`/admin/users/${userId}/activate`);
    return response.data;
  }

  // Content Management
  async getPosts(page = 1, limit = 10) {
    const response = await this.api.get('/admin/posts', { params: { page, limit } });
    return response.data;
  }

  async deletePost(postId) {
    const response = await this.api.delete(`/admin/posts/${postId}`);
    return response.data;
  }

  async getEvents(page = 1, limit = 10) {
    const response = await this.api.get('/admin/events', { params: { page, limit } });
    return response.data;
  }

  // Analytics
  async getStats() {
    const response = await this.api.get('/admin/stats');
    return response.data;
  }
}

export default new AdminService();