'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Info,
  FileText,
  User,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

interface ProfessionNavProps {
  professionId: string;
}

export default function ProfessionNav({ professionId }: ProfessionNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Overview',
      href: `/professions/${professionId}`,
      icon: Info,
      exact: true,
    },
    {
      label: 'Description',
      href: `/professions/${professionId}/description`,
      icon: FileText,
    },
    {
      label: 'Archetypes',
      href: `/professions/${professionId}/archetypes`,
      icon: User,
    },
    {
      label: 'Education',
      href: `/professions/${professionId}/education`,
      icon: GraduationCap,
    },
    {
      label: 'Market',
      href: `/professions/${professionId}/market`,
      icon: TrendingUp,
    },
  ];

  return (
    <nav className="mt-6 border-b overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href || pathname?.endsWith(item.href)
            : pathname?.includes(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
