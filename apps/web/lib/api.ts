// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',              // proxy use kar rahe hain
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

export default api;