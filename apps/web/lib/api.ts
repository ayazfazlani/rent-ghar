// lib/api.ts
import axios from 'axios';

const getBaseURL = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(apiUrl)
  if (!apiUrl) return '/api';
  const baseURL = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
  console.log('🌐 API BaseURL:', baseURL);
  return baseURL;
};

const api = axios.create({
  baseURL: getBaseURL(),
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

    // Skip refresh logic for the refresh endpoint itself or if we're already on the login page
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');
    const isProfileRequest = originalRequest.url?.includes('/auth/profile');
    const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest && !isOnLoginPage) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        console.warn('Refresh token expired or missing → session ended');
        
        // Redirect to login ONLY if it's not a profile check (where we just want to know if logged in or not)
        if (typeof window !== 'undefined' && !isProfileRequest) {
          window.location.href = '/login?sessionExpired=true';
        }
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

  // Get property by slug
  getPropertyBySlug: async (params: {slug: string}) => {
    const response = await api.get(`/properties/slug/${params.slug}`);
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

  // Upload image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/properties/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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