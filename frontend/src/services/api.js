import axios from 'axios';

// Use environment variable if set, otherwise use relative path for production or localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postsAPI = {
  getAll: (params = {}) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  delete: (id) => api.delete(`/posts/${id}`)
};

export const tagsAPI = {
  getAll: () => api.get('/tags')
};

export const reactionsAPI = {
  add: (postId, type) => api.post('/react', { postId, type })
};

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  verify: () => api.get('/admin/verify'),
  analytics: () => api.get('/admin/analytics')
};

export default api;

