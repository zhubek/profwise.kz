'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserProfile, UpdateUserDTO } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateUser, deleteUser } from '@/lib/api/users';

interface ProfilePageContentProps {
  profile: UserProfile;
}

export default function ProfilePageContent({ profile: initialProfile }: ProfilePageContentProps) {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');

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

  const handleChange = (field: keyof UpdateUserDTO, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const updatedUser = await updateUser(profile.id, formData);
      setProfile({ ...profile, ...updatedUser });
      setIsEditing(false);
      setMessage({ type: 'success', text: t('updateSuccess') });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: t('updateError') });
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
      // Redirect to logout or home page after deletion
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Failed to delete account:', error);
      setMessage({ type: 'error', text: t('deleteAccountError') });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
                      {new Date(profile.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
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
    </div>
  );
}
