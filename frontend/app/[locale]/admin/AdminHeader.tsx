'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Globe, User, LogOut, School } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const t = useTranslations();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-slate-900 text-white shadow-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 p-2 rounded-lg">
            <School className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-lg font-bold">ProfWise Admin</h1>
            <p className="text-xs text-slate-400">{t('admin.header.subtitle')}</p>
          </div>
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
                <Link href="/en/admin">English</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ru/admin">Русский</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/kz/admin">Қазақша</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-slate-800">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t('navigation.profile')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}
