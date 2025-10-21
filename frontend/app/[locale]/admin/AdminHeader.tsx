'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe, LogOut, School, Home } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminHeader() {
  const { organization, logout } = useAdminAuth();
  const pathname = usePathname();
  const t = useTranslations();

  const handleLogout = async () => {
    await logout();
  };

  // Function to get language-switched URL
  const getLocalizedPath = (newLocale: string) => {
    if (!pathname) return `/${newLocale}/admin`;
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    return `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-slate-900 text-white shadow-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Back Button */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <School className="w-5 h-5 text-slate-900" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">ProfWise Admin</h1>
              <p className="text-xs text-slate-400">{t('admin.header.subtitle')}</p>
            </div>
          </div>

          {/* Back to Home Button */}
          <Link
            href={`/${pathname?.split('/')[1]}`}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-slate-800 transition-colors border border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t('admin.header.backToHome')}</span>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-slate-800">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('common.labels.language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={getLocalizedPath('en')}>English</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getLocalizedPath('ru')}>Русский</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getLocalizedPath('kz')}>Қазақша</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Organization Name & Sign Out */}
          {organization && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">{organization.name}</p>
                <p className="text-xs text-slate-400">{organization.type}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-slate-800 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('admin.header.signOut')}</span>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
