'use client';

import { useTranslations } from 'next-intl';
import { Lock, ChevronDown, Calendar, Shield, Building2, Globe } from 'lucide-react';
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

  // Check if selected test has license info
  const hasLicense = selectedTest?.licenseInfo;

  // Format expiration date from test license info or fallback to mock license info
  const expirationDate = hasLicense
    ? new Date(selectedTest.licenseInfo.expireDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(licenseInfo.expiresAt).toLocaleDateString('en-US', {
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
          <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] max-w-md">
            {tests.map((test) => {
              const isInactive = !test.isActive;
              const startDate = test.startDate ? new Date(test.startDate) : null;
              const formattedStartDate = startDate?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <DropdownMenuItem
                  key={test.id}
                  onClick={() => test.available && onTestSelect(test.id)}
                  disabled={!test.available}
                  className={`cursor-pointer ${
                    test.id === selectedTestId ? 'bg-accent' : ''
                  } ${!test.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    {/* Source Icon */}
                    {test.source === 'license' ? (
                      <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0" />
                    )}

                    {/* Title and Status */}
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{test.title}</div>
                      {isInactive && (
                        <div className="text-xs text-muted-foreground">
                          {startDate
                            ? t('availableFrom', { date: formattedStartDate })
                            : t('soon')
                          }
                        </div>
                      )}
                    </div>

                    {/* Coming Soon Badge */}
                    {!test.available && !isInactive && (
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <Lock className="h-3 w-3" />
                        <span className="text-xs">{t('comingSoon')}</span>
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* License Information Card or Public Test Message */}
      {hasLicense ? (
        <Card className="p-4 bg-muted/50">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t('licenseCode')}</p>
                <p className="text-sm text-muted-foreground font-mono">{selectedTest.licenseInfo.licenseCode}</p>
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
                <p className="text-sm text-muted-foreground">{selectedTest.licenseInfo.organizationName}</p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-500" />
            <p className="text-sm font-medium">{t('noLicenseRequired')}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
