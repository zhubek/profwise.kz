import { getTranslations } from 'next-intl/server';
import { getUserArchetypeProfile } from '@/lib/api/archetypes';
import ArchetypeTabs from './ArchetypeTabs';

export default async function ArchetypesPage() {
  const t = await getTranslations('archetypes');

  // Mock user ID
  const userId = '1';

  // Fetch archetype profile server-side
  const profile = await getUserArchetypeProfile(userId);

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
        <ArchetypeTabs profile={profile} />
      </div>
    </main>
  );
}
