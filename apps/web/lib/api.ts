// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',              // Next.js proxy will rewrite to http://localhost:3001
  withCredentials: true,        // ← cookie (refresh_token) automatic bhejo
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 aaya aur yeh refresh request nahi hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // infinite loop se bachne ke liye

      try {
        // Refresh token call (cookie apne aap jayegi)
        await api.post('/auth/refresh'); // ← body mein kuch nahi chahiye, cookie se refresh ho jayega
        // Naya access token aa gaya (NestJS naye access token ko body mein dega ya cookie update karega)

        // Original request phir se try karo
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh bhi fail → logout
        console.error('Refresh token expired → logout');
        // Yahan logout logic daal sakte ho (localStorage clear + redirect /login)
        window.location.href = '/login?sessionExpired=true';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Property API functions
export const propertyApi = {
  // Get all approved properties
  getAll: async (filters?: { cityId?: string; areaId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.cityId) params.append('cityId', filters.cityId);
    if (filters?.areaId) params.append('areaId', filters.areaId);
    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';
    const response = await api.get(url);
    return response.data;
  },

  // get property by id 
  getPropertyById: async (params: {id: string}) => {
    const response = await api.get(`/properties/${params.id}`);
    return response.data;
  },
  // Get all properties (for dashboard - includes pending, approved, rejected)
  getAllProperties: async () => {
    const response = await api.get('/properties/all');
    return response.data;
  },

  updateStatus: async (propertyId: string) => {
    const response = await api.patch(`/properties/${propertyId}/update-status`);
    return response.data;
  },
  // Create a new property
  create: async (data: FormData) => {
    const response = await api.post('/properties', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update a property
  update: async (propertyId: string, data: FormData) => {
    const response = await api.put(`/properties/${propertyId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a property
  delete: async (propertyId: string) => {
    const response = await api.delete(`/properties/${propertyId}`);
    return response.data;
  },
};

// Blog API functions
export const blogApi = {
  // Get all published blogs (for public frontend)
  getPublishedBlogs: async () => {
    const response = await api.get('/blog/published');
    return response.data;
  },

  // Get all blogs (for admin dashboard - can filter by status)
  getAllBlogs: async (status?: string) => {
    const url = status ? `/blog?status=${status}` : '/blog';
    const response = await api.get(url);
    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id: string) => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },

  // Get blog by slug (SEO-friendly URL)
  getBlogBySlug: async (slug: string) => {
    const response = await api.get(`/blog/slug/${slug}`);
    return response.data;
  },

  // Increment blog views (for analytics)
  incrementViews: async (id: string) => {
    await api.post(`/blog/${id}/views`);
  },
};

export default api;