'use client';

import { useState } from 'react';
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
import { activateLicense } from '@/lib/api/licenses';
import { Shield, AlertCircle, CheckCircle, BookOpen, Sparkles } from 'lucide-react';

type OnboardingStep = 'license' | 'instructions';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const t = useTranslations('auth.onboarding');
  const tProfile = useTranslations('profile');
  const { user, refreshUser, completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('license');
  const [licenseCode, setLicenseCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [licenseSuccess, setLicenseSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTranslatedErrorMessage = (errorMessage: string, code: string): string => {
    // Map backend error messages to translation keys
    if (errorMessage.includes('not found') || errorMessage.includes('не найдена')) {
      return tProfile('licenses.errors.notFound', { code });
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
    return t('licenseStep.error');
  };

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!licenseCode.trim()) {
      setError(t('licenseStep.error'));
      return;
    }

    if (!user) {
      setError(t('licenseStep.error'));
      return;
    }

    setIsLoading(true);

    try {
      await activateLicense({
        userId: user.id,
        licenseCode: licenseCode.trim(),
      });

      setLicenseSuccess(true);

      // Refresh user data
      await refreshUser();

      // Show success message briefly, then move to instructions
      setTimeout(() => {
        setCurrentStep('instructions');
        setLicenseSuccess(false);
      }, 1500);
    } catch (err: any) {
      // Only log technical errors (500+, network errors) to console
      // Business logic errors (400-499) are expected and should not be logged
      const statusCode = err.statusCode || 0;
      const isTechnicalError = statusCode === 0 || statusCode >= 500;

      if (isTechnicalError) {
        console.error('Failed to activate license:', err);
      }

      const translatedError = getTranslatedErrorMessage(err.message || '', licenseCode.trim());
      setError(translatedError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipLicense = () => {
    setCurrentStep('instructions');
  };

  const handleComplete = async () => {
    await completeOnboarding();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {currentStep === 'license' ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center">{t('licenseStep.title')}</DialogTitle>
              <DialogDescription className="text-center">
                {t('licenseStep.subtitle')}
              </DialogDescription>
            </DialogHeader>

            {licenseSuccess ? (
              <div className="py-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  {t('licenseStep.success')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleLicenseSubmit} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('licenseStep.description')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseCode">{t('licenseStep.label')}</Label>
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
                    onClick={handleSkipLicense}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {t('licenseStep.skip')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !licenseCode.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? '...' : t('licenseStep.submit')}
                  </Button>
                </DialogFooter>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  {t('licenseStep.skipWarning')}
                </p>
              </form>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center">{t('instructionsStep.title')}</DialogTitle>
              <DialogDescription className="text-center">
                {t('instructionsStep.subtitle')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{t('instructionsStep.step1.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('instructionsStep.step1.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{t('instructionsStep.step2.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('instructionsStep.step2.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{t('instructionsStep.step3.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('instructionsStep.step3.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {t('instructionsStep.tip')}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleComplete} className="w-full">
                {t('instructionsStep.getStarted')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
