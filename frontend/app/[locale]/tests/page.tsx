import { getTranslations } from 'next-intl/server';
import { getTests, getUserTests } from '@/lib/api/tests';
import { getUserLicenseInfo } from '@/lib/api/mock/users';
import TestsPageContent from './TestsPageContent';

export default async function TestsPage() {
  const t = await getTranslations('tests');

  // Mock user ID - in production, get from auth session
  const userId = '1';

  // Fetch data server-side
  const [tests, userTests, licenseInfo] = await Promise.all([
    getTests(),
    getUserTests(userId),
    getUserLicenseInfo(userId),
  ]);

  // Merge tests with user progress
  const testsWithProgress = tests.map((test) => {
    const userTest = userTests.find((ut) => ut.testId === test.id);
    return {
      ...test,
      userTest,
    };
  });

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
        <TestsPageContent tests={testsWithProgress} licenseInfo={licenseInfo} />
      </div>
    </main>
  );
}
