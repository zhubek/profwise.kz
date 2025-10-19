'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const { register, error, clearError, needsEmailVerification, registrationMessage } = useAuth();

  // Map locale to user language format
  const getLanguageFromLocale = (locale: string): 'EN' | 'RU' | 'KZ' => {
    if (locale === 'en') return 'EN';
    if (locale === "kz") return 'KZ';
    return 'RU';
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    language: getLanguageFromLocale(locale),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    // Surname validation
    if (!formData.surname.trim()) {
      newErrors.surname = t('validation.surnameRequired');
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('validation.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('validation.passwordMinLength');
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        language: formData.language,
      });
      // Navigation is handled by AuthContext
    } catch (err) {
      console.error('Registration error:', err);
      // Error is set in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl text-center">
            {t('createAccount')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('registerSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email Verification Success Message */}
          {needsEmailVerification && registrationMessage ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary font-medium mb-2">
                  {registrationMessage}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('emailVerificationInstructions')}
                </p>
              </div>
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                {t('goToLogin')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Global error message */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

            {/* Name field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t('namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.name ? 'border-destructive' : ''}
                autoComplete="given-name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Surname field */}
            <div className="space-y-2">
              <Label htmlFor="surname">
                {t('surname')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="surname"
                name="surname"
                type="text"
                placeholder={t('surnamePlaceholder')}
                value={formData.surname}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.surname ? 'border-destructive' : ''}
                autoComplete="family-name"
              />
              {errors.surname && (
                <p className="text-sm text-destructive">{errors.surname}</p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {t('email')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.email ? 'border-destructive' : ''}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">
                {t('password')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.password ? 'border-destructive' : ''}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('confirmPassword')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.confirmPassword ? 'border-destructive' : ''}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Language field */}
            <div className="space-y-2">
              <Label htmlFor="language">
                {t('language') || 'Preferred Language'}
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value as 'EN' | 'RU' | 'KZ' }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="RU">Русский</SelectItem>
                  <SelectItem value="KZ">Қазақша</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">...</span>
                  {t('signUp')}
                </>
              ) : (
                t('signUp')
              )}
            </Button>

            {/* Login link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t('haveAccount')} </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                {t('signIn')}
              </Link>
            </div>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
