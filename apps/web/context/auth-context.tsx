'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  // Add other fields as needed
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      // Trying to fetch the user profile using the existing token (in cookie)
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      // If 401, the interceptor might have handled it or it failed.
      // We just set user to null.
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data: any) => {
    const response = await api.post('/auth/login', data);
    // Assuming backend returns user object or we fetch it after
    // If backend returns just access_token and sets cookie, we might need to fetch profile.
    // Based on apps/web/app/(auth)/login/page.tsx, it seems login returns data.
    // Let's assume we need to fetch profile or set it from response if available.
    // Ideally, consistent behavior is to fetch profile or have login return it.

    // For now, let's fetch profile to be sure or use response.data.user if it exists
    if (response.data.user) {
      setUser(response.data.user);
    } else {
      await fetchUser();
    }

    router.refresh();
  };

  const register = async (data: any) => {
    await api.post('/auth/register', data);
    // Auto login after register? Or redirect to login?
    // Let's assume redirect to login or auto-login.
    // For now, doing nothing, let the calling component handle navigation
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      console.error("Logout failed", e);
    }
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
