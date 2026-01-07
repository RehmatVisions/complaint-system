import axios from 'axios';
import toast from 'react-hot-toast';

// Set base URL
axios.defaults.baseURL = 'http://localhost:3000/api';

// Request interceptor to add token
axios.interceptors.request.use(
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
axios.interceptors.response.use(
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
          toast.error('Unauthorized access. Please login again.');
          // Clear token and redirect to login
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access forbidden. Insufficient permissions.');
          break;
        case 409:
          toast.error(response.data.message || 'Conflict error');
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

export default axios;