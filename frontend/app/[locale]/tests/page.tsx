'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { getUserQuizzes, getUserTests } from '@/lib/api/tests';
import { useAuth } from '@/contexts/AuthContext';
import TestsPageContent from './TestsPageContent';
import type { Test } from '@/types/test';

export default function TestsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const t = useTranslations('tests');
  const locale = useLocale();
  const router = useRouter();

  const [tests, setTests] = useState<Test[]>([]);
  const [userTests, setUserTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  // Function to fetch/refresh test data
  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [testsData, userTestsData] = await Promise.all([
        getUserQuizzes(user.id, locale),
        getUserTests(user.id),
      ]);

      setTests(testsData || []);
      setUserTests(userTestsData || []);
    } catch (err) {
      console.error('Error fetching tests data:', err);
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user is available
  useEffect(() => {
    fetchData();
  }, [user, locale]);

  // Show loading state while checking authentication
  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // Show loading state while fetching data
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-bold md:text-4xl">{t('careerTest')}</h1>
            <p className="text-muted-foreground mt-1 md:mt-2">
              {t('subtitle')}
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tests...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-bold md:text-4xl">{t('careerTest')}</h1>
            <p className="text-muted-foreground mt-1 md:mt-2">
              {t('subtitle')}
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  // Safety check: ensure user exists before rendering
  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // Merge tests with user progress
  const testsWithProgress = tests.map((test) => {
    const userTest = userTests.find((ut) => ut.testId === test.id);
    return {
      ...test,
      userTest,
    };
  });

  // Extract license info from the first license-based test (if any)
  const licenseTest = testsWithProgress.find(test => test.source === 'license' && test.licenseInfo);
  const licenseInfo = licenseTest?.licenseInfo || null;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold md:text-4xl">{t('careerTest')}</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Test Selector and Detail View */}
        <TestsPageContent
          tests={testsWithProgress}
          licenseInfo={licenseInfo}
          userId={user.id}
          onRefreshTests={fetchData}
        />
      </div>
    </main>
  );
}
