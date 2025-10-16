'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/verify-email'];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Extract the path without locale (e.g., /en/login -> /login)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );

    // Redirect to login if not authenticated and not on a public route
    if (!isAuthenticated && !isPublicRoute) {
      // Extract locale from pathname
      const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Extract the path without locale for route checking
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
  );

  // Show children only if authenticated or on public route
  if (isAuthenticated || isPublicRoute) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
