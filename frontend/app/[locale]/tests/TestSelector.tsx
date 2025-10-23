'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lock, ChevronDown, Calendar, Shield, Building2, Globe, CheckCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { activateLicense } from '@/lib/api/licenses';
import type { Test } from '@/types/test';
import type { UserLicenseInfo } from '@/types/organization';

interface TestSelectorProps {
  tests: Test[];
  selectedTestId: string;
  onTestSelect: (testId: string) => void;
  licenseInfo: UserLicenseInfo | null;
  userId: string;
  onLicenseActivated: () => void; // Callback to refresh tests
}

export default function TestSelector({ tests, selectedTestId, onTestSelect, licenseInfo, userId, onLicenseActivated }: TestSelectorProps) {
  const t = useTranslations('tests');
  const tCommon = useTranslations('common');
  const tProfile = useTranslations('profile');
  const selectedTest = tests.find(test => test.id === selectedTestId);

  // License activation state
  const [licenseCode, setLicenseCode] = useState('');
  const [isActivatingLicense, setIsActivatingLicense] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Map backend error messages to translation keys
  const getTranslatedErrorMessage = (errorMessage: string, code: string): string => {
    // Map backend error messages to translation keys
    if (errorMessage.includes('not found') || errorMessage.includes('не найдена')) {
      return tProfile('licenses.errors.notFound', { code });
    }
    // Check for "already have an active license" - must come before "already activated"
    if (errorMessage.includes('already have an active license') || errorMessage.includes('уже есть активная лицензия')) {
      return tProfile('licenses.errors.alreadyHaveSimilar');
    }
    // Check for "already activated by another user" before checking just "already activated"
    if (errorMessage.includes('another user') || errorMessage.includes('другим пользователем')) {
      return tProfile('licenses.errors.alreadyActivatedByAnotherUser');
    }
    if (errorMessage.includes('already activated') || errorMessage.includes('уже активирована')) {
      return tProfile('licenses.errors.alreadyActivated');
    }
    if (errorMessage.includes('expired') || errorMessage.includes('истек')) {
      return tProfile('licenses.errors.expired');
    }
    if (errorMessage.includes('invalid') || errorMessage.includes('неверный')) {
      return tProfile('licenses.errors.invalidCode');
    }
    // Default to generic error message
    return t('licenseActivationError');
  };

  // Check if selected test has license info
  const hasLicense = selectedTest?.licenseInfo;

  // Check if test is not free and not available (needs license)
  const needsLicense = selectedTest && !selectedTest.isFree && !selectedTest.available;

  // Format expiration date from test license info (only used when hasLicense is true)
  const expirationDate = hasLicense
    ? new Date(selectedTest.licenseInfo.expireDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseCode.trim()) return;

    setIsActivatingLicense(true);
    setLicenseMessage(null);

    try {
      await activateLicense({
        userId,
        licenseCode: licenseCode.trim(),
      });

      setLicenseMessage({
        type: 'success',
        text: t('licenseActivationSuccess')
      });
      setLicenseCode('');

      // Refresh tests after successful activation
      setTimeout(() => {
        onLicenseActivated();
        setLicenseMessage(null);
      }, 2000);
    } catch (error: any) {
      const translatedError = getTranslatedErrorMessage(error.message || '', licenseCode.trim());
      setLicenseMessage({
        type: 'error',
        text: translatedError
      });
    } finally {
      setIsActivatingLicense(false);
    }
  };

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

              // Check if test needs license (not free and not available)
              const requiresLicense = !test.isFree && !test.available;

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
                    {/* Source/Status Icon */}
                    {requiresLicense ? (
                      <Key className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                    ) : test.source === 'license' ? (
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
                      {requiresLicense && (
                        <div className="text-xs text-orange-600 dark:text-orange-400">
                          {t('licenseRequired')}
                        </div>
                      )}
                    </div>

                    {/* License Required Badge */}
                    {requiresLicense && (
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <Lock className="h-3 w-3" />
                        <span className="text-xs">{t('locked')}</span>
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
      ) : selectedTest?.isFree ? (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-500" />
            <p className="text-sm font-medium">{t('noLicenseRequired')}</p>
          </div>
        </Card>
      ) : null}

      {/* License Activation Card - shown for non-free tests without license */}
      {needsLicense && (
        <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Key className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  {t('licenseRequiredTitle')}
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  {t('licenseRequiredDescription')}
                </p>
              </div>
            </div>

            {licenseMessage && (
              <div className={`p-3 rounded ${licenseMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                <div className="flex items-center gap-2 text-sm">
                  {licenseMessage.type === 'success' && <CheckCircle className="h-4 w-4" />}
                  {licenseMessage.text}
                </div>
              </div>
            )}

            <form onSubmit={handleActivateLicense} className="space-y-2">
              <Label htmlFor="testLicenseCode" className="text-sm">
                {t('enterLicenseCode')}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="testLicenseCode"
                  type="text"
                  placeholder={t('enterLicenseCode')}
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value)}
                  disabled={isActivatingLicense}
                  className="font-mono text-sm"
                />
                <Button
                  type="submit"
                  disabled={isActivatingLicense || !licenseCode.trim()}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {isActivatingLicense ? tCommon('labels.loading') : t('activate')}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
