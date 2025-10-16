import { getTranslations } from 'next-intl/server';
import { getCurrentUser, getUserProfile } from '@/lib/api/users';
import ProfilePageContent from './ProfilePageContent';

export default async function ProfilePage() {
  const t = await getTranslations('profile');

  try {
    const user = await getCurrentUser();
    const profile = await getUserProfile(user.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <ProfilePageContent profile={profile} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <p className="text-red-500">{t('failedToLoadProfile')}</p>
      </div>
    );
  }
}
