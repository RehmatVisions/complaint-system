import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 400:
          if (response.data.errors && Array.isArray(response.data.errors)) {
            response.data.errors.forEach(err => toast.error(err));
          } else {
            toast.error(response.data.message || 'Bad Request');
          }
          break;
        case 401:
          toast.error('Session expired. Please login again.');
          // Clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access forbidden. Insufficient permissions.');
          break;
        case 409:
          toast.error(response.data.message || 'Email already exists');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(response.data.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API Functions
export const authAPI = {
  // User signup
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  }
};

export const complaintAPI = {
  // Create complaint
  create: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },

  // Get user's complaints
  getUserComplaints: async (params = {}) => {
    const response = await api.get('/complaints/my-complaints', { params });
    return response.data;
  },

  // Get all complaints (admin only)
  getAllComplaints: async (params = {}) => {
    const response = await api.get('/complaints/all', { params });
    return response.data;
  },

  // Get single complaint
  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // Update complaint (admin only)
  update: async (id, updateData) => {
    const response = await api.put(`/complaints/${id}`, updateData);
    return response.data;
  },

  // Add comment
  addComment: async (id, commentData) => {
    const response = await api.post(`/complaints/${id}/comments`, commentData);
    return response.data;
  },

  // Delete complaint (admin only)
  delete: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/complaints/dashboard/stats');
    return response.data;
  }
};

export default api;