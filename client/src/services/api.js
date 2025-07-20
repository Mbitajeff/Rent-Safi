// api.js - API service for making requests to the backend

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Property API services
export const propertyService = {
  // Get all properties with optional pagination and filters
  getAllProperties: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    const response = await api.get(`/properties?${params}`);
    return response.data;
  },

  // Get a single property by ID
  getProperty: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create a new property
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  // Update an existing property
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete a property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Search properties
  searchProperties: async (searchParams) => {
    const params = new URLSearchParams(searchParams);
    const response = await api.get(`/properties/search?${params}`);
    return response.data;
  },

  // Upload property images
  uploadImages: async (propertyId, formData) => {
    const response = await api.put(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Add property to favorites
  addToFavorites: async (propertyId) => {
    const response = await api.post(`/properties/${propertyId}/favorite`);
    return response.data;
  },

  // Remove property from favorites
  removeFromFavorites: async (propertyId) => {
    const response = await api.delete(`/properties/${propertyId}/favorite`);
    return response.data;
  },

  // Report a property
  reportProperty: async (propertyId, reportData) => {
    const response = await api.post(`/properties/${propertyId}/report`, reportData);
    return response.data;
  },
};

// Auth API services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user details
  updateUserDetails: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  },
};

// Message API services
export const messageService = {
  // Get user messages
  getMessages: async (page = 1, limit = 20) => {
    const response = await api.get(`/messages?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },

  // Get conversation with a user
  getConversation: async (userId, propertyId) => {
    const response = await api.get(`/messages/conversation/${userId}/${propertyId}`);
    return response.data;
  },
};

// User API services
export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/updatedetails', profileData);
    return response.data;
  },

  // Get user's properties (for landlords)
  getUserProperties: async () => {
    const response = await api.get('/users/properties');
    return response.data;
  },

  // Get user's favorites (for tenants)
  getUserFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },
};

export default api; 