'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginDTO, RegisterDTO } from '@/types/user';
import * as userAPI from '@/lib/api/users';
import { setAuthToken, clearAuthToken, getAuthToken, setRefreshToken } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const currentUser = await userAPI.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          clearAuthToken();
          console.error('Failed to load user:', err);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginDTO) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.login(credentials);

      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }

      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterDTO) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.register(data);

      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }

      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await userAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthToken();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await userAPI.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
