'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // Redirect to dashboard if authenticated
      router.push('/admin/dashboard');
    } else {
      // Redirect to login if not authenticated
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
    </div>
  );
}
