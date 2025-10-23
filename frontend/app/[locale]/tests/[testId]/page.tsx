import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getQuizWithQuestions } from '@/lib/api/tests';
import TestTakingContent from './TestTakingContent';

// Cache this page for 1 hour (3600 seconds)
export const revalidate = 3600;

interface TestPageProps {
  params: Promise<{
    locale: string;
    testId: string;
  }>;
}

export default async function TestPage({ params }: TestPageProps) {
  const { locale, testId } = await params;
  const t = await getTranslations('tests');

  try {
    // Fetch quiz and questions from backend
    const { quiz, questions } = await getQuizWithQuestions(testId, locale);

    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-3xl">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-bold md:text-4xl">{quiz.title}</h1>
            <p className="text-muted-foreground mt-1 md:mt-2">
              {quiz.description}
            </p>
          </div>

          {/* Test Content */}
          <TestTakingContent quiz={quiz} questions={questions} locale={locale} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Failed to load quiz:', error);
    notFound();
  }
}
