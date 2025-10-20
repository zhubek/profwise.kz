'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { getMatchedProfessions } from '@/lib/api/professions';
import ProfessionsList from './ProfessionsList';

export default function ProfessionsPage() {
  const t = useTranslations('professions');
  const { user, loading: authLoading } = useAuth();
  const [professions, setProfessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfessions() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMatchedProfessions(user.id);
        setProfessions(data);
      } catch (error) {
        console.error('Error fetching matched professions:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadProfessions();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-bold md:text-4xl">{t('topMatches')}</h1>
            <p className="text-muted-foreground mt-1 md:mt-2">{t('exploreDescription')}</p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold md:text-4xl">{t('topMatches')}</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">{t('exploreDescription')}</p>
        </div>

        {/* Professions List or Empty State */}
        {professions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <p className="text-lg text-muted-foreground mb-2">{t('noProfessionsAvailable')}</p>
            <p className="text-sm text-muted-foreground">{t('completeTakeTestsToGetMatches')}</p>
          </div>
        ) : (
          <ProfessionsList professions={professions} userId={user?.id || ''} />
        )}
      </div>
    </main>
  );
}
