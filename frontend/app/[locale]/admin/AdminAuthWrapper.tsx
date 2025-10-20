'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Extract the path without locale (e.g., /en/admin/login -> /admin/login)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

    // Allow login page without authentication
    if (pathWithoutLocale === '/admin/login') return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Extract locale from pathname
      const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      router.push(`/${locale}/admin/login`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  // Extract the path without locale
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

  // Show login page without checks
  if (pathWithoutLocale === '/admin/login') {
    return <>{children}</>;
  }

  // Show children only if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
