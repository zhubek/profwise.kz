import { getTranslations } from 'next-intl/server';
import { getMatchedProfessions } from '@/lib/api/professions';
import ProfessionsList from './ProfessionsList';

export default async function ProfessionsPage() {
  const t = await getTranslations('professions');

  // Mock user ID
  const userId = '1';

  // Fetch matched professions server-side
  const professions = await getMatchedProfessions(userId);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold md:text-4xl">{t('topMatches')}</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">{t('exploreDescription')}</p>
        </div>

        {/* Professions List */}
        <ProfessionsList professions={professions} />
      </div>
    </main>
  );
}
