'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { getUserArchetypeProfile, getArchetypeTypes } from '@/lib/api/archetypes';
import { Loader2 } from 'lucide-react';
import ArchetypeTabs from './ArchetypeTabs';
import type { UserArchetypeProfile, ArchetypeType } from '@/types/archetype';

export default function CharacteristicsPage() {
  const t = useTranslations('characteristics');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserArchetypeProfile | null>(null);
  const [archetypeTypes, setArchetypeTypes] = useState<ArchetypeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch data when user is available
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [profileData, typesData] = await Promise.all([
            getUserArchetypeProfile(user.id),
            getArchetypeTypes(),
          ]);
          setProfile(profileData);
          setArchetypeTypes(typesData);
        } catch (err: any) {
          setError(err.message || 'Failed to load characteristics');
          console.error('Failed to load characteristics:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !archetypeTypes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold md:text-4xl">{t('title')}</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Archetype Tabs */}
        <ArchetypeTabs profile={profile} archetypeTypes={archetypeTypes} />
      </div>
    </main>
  );
}
