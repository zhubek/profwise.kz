'use client';

import { useTranslations } from 'next-intl';
import { Lock, ChevronDown, Calendar, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Test } from '@/types/test';
import type { UserLicenseInfo } from '@/types/organization';

interface TestSelectorProps {
  tests: Test[];
  selectedTestId: string;
  onTestSelect: (testId: string) => void;
  licenseInfo: UserLicenseInfo;
}

export default function TestSelector({ tests, selectedTestId, onTestSelect, licenseInfo }: TestSelectorProps) {
  const t = useTranslations('tests');
  const selectedTest = tests.find(test => test.id === selectedTestId);

  // Format expiration date
  const expirationDate = new Date(licenseInfo.expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-6 md:mb-8 space-y-4">
      {/* Test Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('selectTest')}</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between md:w-auto md:min-w-[300px]">
              <span className="truncate">{selectedTest?.title || t('selectTest')}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
            {tests.map((test) => (
              <DropdownMenuItem
                key={test.id}
                onClick={() => test.available && onTestSelect(test.id)}
                disabled={!test.available}
                className={`cursor-pointer ${
                  test.id === selectedTestId ? 'bg-accent' : ''
                } ${!test.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{test.title}</span>
                  {!test.available && (
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <Lock className="h-3 w-3" />
                      <span className="text-xs">{t('comingSoon')}</span>
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* License Information Card */}
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t('licenseCode')}</p>
              <p className="text-sm text-muted-foreground font-mono">{licenseInfo.licenseCode}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t('expires')}</p>
              <p className="text-sm text-muted-foreground">{expirationDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t('school')}</p>
              <p className="text-sm text-muted-foreground">{licenseInfo.organizationName}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
