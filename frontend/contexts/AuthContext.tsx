'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginDTO, RegisterDTO } from '@/types/user';
import * as authAPI from '@/lib/api/auth';
import * as mockAuthAPI from '@/lib/api/mock/auth';
import * as usersAPI from '@/lib/api/users';
import { getAuthToken } from '@/lib/api/client';

// Toggle between mock and real API
const USE_MOCK = false;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  needsEmailVerification: boolean;
  registrationMessage: string | null;
  showOnboarding: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  clearRegistrationMessage: () => void;
  completeOnboarding: () => Promise<void>;
  setShowOnboarding: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          let currentUser: User;
          if (USE_MOCK) {
            currentUser = await mockAuthAPI.getCurrentUser(token);
          } else {
            currentUser = await authAPI.getCurrentUser();
          }
          setUser(currentUser);
        } catch (err) {
          authAPI.logout();
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

      let response;
      if (USE_MOCK) {
        response = await mockAuthAPI.login(credentials);
      } else {
        response = await authAPI.login(credentials);
      }

      setUser(response.user);

      // Check if onboarding is needed
      if (!response.user.onboardingCompleted) {
        setShowOnboarding(true);
      }

      // Redirect to tests page after successful login
      router.push('/tests');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterDTO) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (USE_MOCK) {
        response = await mockAuthAPI.register(data);
      } else {
        response = await authAPI.register(data);
      }

      setUser(response.user);

      // Check if email verification is needed
      if (!response.user.emailVerified) {
        setNeedsEmailVerification(true);
        setRegistrationMessage(
          response.message || 'Please check your email to verify your account.'
        );
        // Don't redirect - stay on registration page to show verification message
      } else {
        // Email already verified, redirect to tests
        router.push('/tests');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      let currentUser: User;
      if (USE_MOCK) {
        currentUser = await mockAuthAPI.getCurrentUser(token);
      } else {
        currentUser = await authAPI.getCurrentUser();
      }

      setUser(currentUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearRegistrationMessage = useCallback(() => {
    setRegistrationMessage(null);
    setNeedsEmailVerification(false);
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    try {
      await usersAPI.updateUser(user.id, { onboardingCompleted: true });
      await refreshUser();
      setShowOnboarding(false);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    }
  }, [user, refreshUser]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    needsEmailVerification,
    registrationMessage,
    showOnboarding,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    clearRegistrationMessage,
    completeOnboarding,
    setShowOnboarding,
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
