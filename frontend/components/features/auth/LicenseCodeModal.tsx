'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import * as authAPI from '@/lib/api/auth';
import * as mockAuthAPI from '@/lib/api/mock/auth';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

// Toggle between mock and real API
const USE_MOCK = true;

interface LicenseCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LicenseCodeModal({ open, onOpenChange }: LicenseCodeModalProps) {
  const t = useTranslations('auth.licenseCodeModal');
  const router = useRouter();
  const { refreshUser, setNeedsLicenseCode } = useAuth();

  const [licenseCode, setLicenseCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!licenseCode.trim()) {
      setError(t('error'));
      return;
    }

    setIsLoading(true);

    try {
      if (USE_MOCK) {
        await mockAuthAPI.addLicenseCode({ code: licenseCode });
      } else {
        await authAPI.addLicenseCode({ code: licenseCode });
      }

      setSuccess(true);

      // Refresh user data
      await refreshUser();

      // Show success message briefly, then close and redirect
      setTimeout(() => {
        setNeedsLicenseCode(false);
        onOpenChange(false);
        router.push('/tests');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setNeedsLicenseCode(false);
    onOpenChange(false);
    router.push('/tests');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">{t('title')}</DialogTitle>
          <DialogDescription className="text-center">
            {t('subtitle')}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-green-600 dark:text-green-400 font-medium">
              {t('success')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t('description')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseCode">License Code</Label>
              <Input
                id="licenseCode"
                type="text"
                placeholder="LIC-2024-SCHOOL1"
                value={licenseCode}
                onChange={(e) => {
                  setLicenseCode(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                className={error ? 'border-destructive' : ''}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {t('skip')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !licenseCode.trim()}
                className="w-full sm:w-auto"
              >
                {isLoading ? '...' : t('submit')}
              </Button>
            </DialogFooter>

            <p className="text-xs text-muted-foreground text-center pt-2">
              {t('skipWarning')}
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
