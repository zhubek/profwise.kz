import { getTranslations } from 'next-intl/server';
import { getCategories } from '@/lib/api/categories';
import AllProfessionsContent from './AllProfessionsContent';

export default async function AllProfessionsPage() {
  const t = await getTranslations('professions');

  // Fetch categories server-side
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold md:text-4xl">{t('allProfessions.title')}</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">{t('allProfessions.subtitle')}</p>
        </div>

        {/* Content */}
        <AllProfessionsContent initialCategories={categories} />
      </div>
    </main>
  );
}
