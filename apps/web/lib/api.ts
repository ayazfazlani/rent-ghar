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

  // Get location statistics
  getLocationStats: async (city: string, listingType?: string, propertyType?: string) => {
    const params = new URLSearchParams();
    params.append('city', city);
    if (listingType) params.append('listingType', listingType);
    if (propertyType) params.append('propertyType', propertyType);
    
    const response = await api.get(`/properties/stats/locations?${params.toString()}`);
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

// Package API functions
export const packageApi = {
  getAll: async () => {
    const response = await api.get('/packages');
    return response.data;
  },

  getAllIncludingInactive: async () => {
    const response = await api.get('/packages/all');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  create: async (dto: any) => {
    const response = await api.post('/packages', dto);
    return response.data;
  },

  update: async (id: string, dto: any) => {
    const response = await api.put(`/packages/${id}`, dto);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
};

// Subscription API functions
export const subscriptionApi = {
  purchase: async (packageId: string) => {
    const response = await api.post('/subscriptions/purchase', { packageId });
    return response.data;
  },

  getMySubscriptions: async () => {
    const response = await api.get('/subscriptions/my-subscriptions');
    return response.data;
  },

  getActiveSubscription: async () => {
    const response = await api.get('/subscriptions/active');
    return response.data;
  },

  canCreateProperty: async () => {
    const response = await api.get('/subscriptions/can-create-property');
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  activate: async (id: string) => {
    const response = await api.put(`/subscriptions/${id}/activate`);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.put(`/subscriptions/${id}/cancel`);
    return response.data;
  },
};

// City API functions
export const cityApi = {
  getAll: async () => {
    const response = await api.get('/cities');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  },
};

// Area API functions
export const areaApi = {
  getAll: async () => {
    const response = await api.get('/areas');
    return response.data;
  },
  getAreasByCity: async (cityId: string) => {
    const response = await api.get(`/areas?cityId=${cityId}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  },
};

// User API functions
export const userApi = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;