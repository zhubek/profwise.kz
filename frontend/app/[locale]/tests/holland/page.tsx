import { getTranslations } from 'next-intl/server';
import { getQuizSections } from '@/lib/api/quizzes';
import HollandTestContent from './HollandTestContent';

export default async function HollandTestPage() {
  const t = await getTranslations('tests.holland');

  // Mock user ID - in production, get from auth session
  const userId = '1';

  // Quiz ID for Holland test
  const quizId = 'holand-1';

  // Fetch test sections from backend API (dynamically split into sections of 6)
  const sections = await getQuizSections(quizId, 6);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold md:text-4xl">Holland Test (RIASEC)</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">
            Discover your career interests based on Holland&apos;s theory
          </p>
        </div>

        {/* Test Content */}
        <HollandTestContent userId={userId} sections={sections} />
      </div>
    </main>
  );
}
