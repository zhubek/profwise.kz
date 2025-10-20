'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { User, UpdateUserDTO } from '@/types/user';
import { UserLicense } from '@/types/license';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser, deleteUser } from '@/lib/api/users';
import { activateLicense, getUserLicenses } from '@/lib/api/licenses';
import { useAuth } from '@/contexts/AuthContext';
import MyLicensesDrawer from './MyLicensesDrawer';
import { Award, CheckCircle } from 'lucide-react';

interface ProfilePageContentProps {
  profile: User;
}

export default function ProfilePageContent({ profile: initialProfile }: ProfilePageContentProps) {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { refreshUser, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState<UpdateUserDTO>({
    name: profile.name,
    surname: profile.surname,
    grade: profile.grade || '',
    age: profile.age,
    schoolId: profile.schoolId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // License state
  const [licenseCode, setLicenseCode] = useState('');
  const [isActivatingLicense, setIsActivatingLicense] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userLicenses, setUserLicenses] = useState<UserLicense[]>([]);
  const [showLicensesDrawer, setShowLicensesDrawer] = useState(false);
  const [loadingLicenses, setLoadingLicenses] = useState(false);

  const handleChange = (field: keyof UpdateUserDTO, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const updatedUser = await updateUser(profile.id, formData);
      setProfile(updatedUser);
      await refreshUser(); // Refresh user in AuthContext
      setIsEditing(false);
      setMessage({ type: 'success', text: t('updateSuccess') });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: error.message || t('updateError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      surname: profile.surname,
      grade: profile.grade || '',
      age: profile.age,
      schoolId: profile.schoolId,
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(profile.id);
      setMessage({ type: 'success', text: t('deleteAccountSuccess') });
      // Logout and redirect to home after deletion
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      setMessage({ type: 'error', text: error.message || t('deleteAccountError') });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Load user licenses
  useEffect(() => {
    loadUserLicenses();
  }, [profile.id]);

  const loadUserLicenses = async () => {
    try {
      setLoadingLicenses(true);
      const licenses = await getUserLicenses(profile.id);
      setUserLicenses(licenses);
    } catch (error) {
      console.error('Failed to load licenses:', error);
    } finally {
      setLoadingLicenses(false);
    }
  };

  const getTranslatedErrorMessage = (errorMessage: string, code: string): string => {
    // Map backend error messages to translation keys
    if (errorMessage.includes('not found') || errorMessage.includes('не найдена')) {
      return t('licenses.errors.notFound', { code });
    }
    // Check for "already have an active license" - must come before "already activated"
    if (errorMessage.includes('already have an active license') || errorMessage.includes('уже есть активная лицензия')) {
      return t('licenses.errors.alreadyHaveSimilar');
    }
    // Check for "already activated by another user" before checking just "already activated"
    if (errorMessage.includes('another user') || errorMessage.includes('другим пользователем')) {
      return t('licenses.errors.alreadyActivatedByAnotherUser');
    }
    if (errorMessage.includes('already activated') || errorMessage.includes('уже активирована')) {
      return t('licenses.errors.alreadyActivated');
    }
    if (errorMessage.includes('expired') || errorMessage.includes('истек')) {
      return t('licenses.errors.expired');
    }
    if (errorMessage.includes('invalid') || errorMessage.includes('неверный')) {
      return t('licenses.errors.invalidCode');
    }
    // Default to generic error message
    return t('licenses.activationError');
  };

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseCode.trim()) return;

    setIsActivatingLicense(true);
    setLicenseMessage(null);

    try {
      const response = await activateLicense({
        userId: profile.id,
        licenseCode: licenseCode.trim(),
      });

      setLicenseMessage({
        type: 'success',
        text: t('licenses.activationSuccess')
      });
      setLicenseCode('');

      // Reload licenses
      await loadUserLicenses();
    } catch (error: any) {
      // Only log technical errors (500+, network errors) to console
      // Business logic errors (400-499) are expected and should not be logged
      const statusCode = error.statusCode || 0;
      const isTechnicalError = statusCode === 0 || statusCode >= 500;

      if (isTechnicalError) {
        console.error('Failed to activate license:', error);
      }

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
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>{t('personalInfo')}</CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto">
              {t('editProfile')}
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('name')}</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('surname')}</p>
                  <p className="font-medium">{profile.surname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('email')}</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
                {profile.grade && (
                  <div>
                    <p className="text-sm text-gray-500">{t('grade')}</p>
                    <p className="font-medium">{profile.grade}</p>
                  </div>
                )}
                {profile.age && (
                  <div>
                    <p className="text-sm text-gray-500">{t('age')}</p>
                    <p className="font-medium">{profile.age}</p>
                  </div>
                )}
                {profile.schoolId && (
                  <div>
                    <p className="text-sm text-gray-500">{t('school')}</p>
                    <p className="font-medium">{profile.schoolId}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('joinedDate')}</p>
                    <p className="font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {profile.language && (
                    <div>
                      <p className="text-sm text-gray-500">{t('language')}</p>
                      <p className="font-medium">
                        {profile.language === 'EN' ? 'English' : profile.language === 'RU' ? 'Русский' : 'Қазақша'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('surname')}</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => handleChange('surname', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('grade')}</label>
                  <input
                    type="text"
                    value={formData.grade || ''}
                    onChange={(e) => handleChange('grade', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="10A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('age')}</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                    min="1"
                    max="150"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">{t('school')}</label>
                  <input
                    type="text"
                    value={formData.schoolId || ''}
                    onChange={(e) => handleChange('schoolId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="school-157"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? tCommon('labels.loading') : tCommon('buttons.save')}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="w-full sm:w-auto">
                  {tCommon('buttons.cancel')}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* License Activation Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {t('licenses.title')}
              </CardTitle>
              <CardDescription className="mt-1">
                {t('licenses.description')}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLicensesDrawer(true)}
              disabled={loadingLicenses}
              className="hidden sm:flex"
            >
              {t('licenses.myLicenses')} {userLicenses.length > 0 && `(${userLicenses.length})`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {licenseMessage && (
            <div className={`mb-4 p-3 rounded ${licenseMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
              <div className="flex items-center gap-2">
                {licenseMessage.type === 'success' && <CheckCircle className="h-4 w-4" />}
                {licenseMessage.text}
              </div>
            </div>
          )}

          <form onSubmit={handleActivateLicense} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="licenseCode">{t('licenses.licenseCode')}</Label>
              <div className="flex gap-2">
                <Input
                  id="licenseCode"
                  type="text"
                  placeholder="SCHOOL-2024-ABC123"
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value)}
                  disabled={isActivatingLicense}
                  className="font-mono"
                />
                <Button
                  type="submit"
                  disabled={isActivatingLicense || !licenseCode.trim()}
                  className="whitespace-nowrap"
                >
                  {isActivatingLicense ? tCommon('labels.loading') : t('licenses.activate')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('licenses.codeHint')}
              </p>
            </div>
          </form>

          {/* Mobile: My Licenses Button */}
          <div className="mt-4 sm:hidden">
            <Button
              variant="outline"
              onClick={() => setShowLicensesDrawer(true)}
              disabled={loadingLicenses}
              className="w-full"
            >
              {t('licenses.myLicenses')} {userLicenses.length > 0 && `(${userLicenses.length})`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Card */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">{t('deleteAccount')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {t('deleteAccountWarning')}
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
            >
              {t('deleteAccount')}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800">
                  {t('deleteAccountConfirm')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting ? tCommon('labels.loading') : t('deleteAccount')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  {tCommon('buttons.cancel')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Licenses Drawer */}
      <MyLicensesDrawer
        open={showLicensesDrawer}
        onOpenChange={setShowLicensesDrawer}
        licenses={userLicenses}
      />
    </div>
  );
}
