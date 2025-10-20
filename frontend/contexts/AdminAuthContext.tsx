'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  type: string;
  region?: {
    name: Record<string, string>;
  };
}

interface AdminAuthContextType {
  organization: Organization | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is already logged in
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://172.26.195.243:4000';
      const response = await fetch(`${API_URL}/admin-auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
      } else {
        // Invalid token, clear it
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (login: string, password: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://172.26.195.243:4000';
      const response = await fetch(`${API_URL}/admin-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('adminToken', data.accessToken);
      setOrganization(data.organization);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setOrganization(null);
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        organization,
        loading,
        login,
        logout,
        isAuthenticated: !!organization,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
