'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, FileText, Play, CheckCircle2, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Test, UserTest } from '@/types/test';
import { hasHollandTestInProgress, getHollandTestProgress } from '@/lib/utils/testStorage';
import { HOLLAND_TEST_ID } from '@/lib/api/mock/holland';
import ResultsDrawer from './ResultsDrawer';
import ContentBlockRenderer from '@/components/features/tests/ContentBlockRenderer';
import { useQuizInstructions } from '@/lib/hooks/useQuizInstructions';

interface TestDetailViewProps {
  test: Test;
  userTest?: UserTest;
}

export default function TestDetailView({ test, userTest }: TestDetailViewProps) {
  const t = useTranslations('tests');
  const th = useTranslations('tests.holland');
  const locale = useLocale();
  const [localStorageProgress, setLocalStorageProgress] = useState<number | null>(null);
  const [hasLocalTest, setHasLocalTest] = useState(false);

  // Fetch quiz instructions with caching
  const { instructions, loading: instructionsLoading } = useQuizInstructions(test.id);

  // Check localStorage for Holland test on mount
  useEffect(() => {
    if (test.id === HOLLAND_TEST_ID) {
      const inProgress = hasHollandTestInProgress();
      setHasLocalTest(inProgress);
      if (inProgress) {
        setLocalStorageProgress(getHollandTestProgress());
      }
    }
  }, [test.id]);

  // Get status badge
  const getStatusBadge = () => {
    // For Holland test, check localStorage first
    if (test.id === HOLLAND_TEST_ID && hasLocalTest) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          {t('inProgress')} - {localStorageProgress}%
        </Badge>
      );
    }

    if (userTest?.status === 'completed') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {t('completed')}
        </Badge>
      );
    }
    if (userTest?.status === 'in_progress') {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          {t('inProgress')} - {userTest.progress}%
        </Badge>
      );
    }
    return <Badge variant="outline">{t('notStarted')}</Badge>;
  };

  // Get action button
  const getActionButton = () => {
    // Get the correct test URL - Holland test has special route
    const testUrl = test.id === HOLLAND_TEST_ID ? '/tests/holland' : `/tests/${test.id}`;

    // For Holland test, check localStorage first
    if (test.id === HOLLAND_TEST_ID && hasLocalTest) {
      return (
        <Link href={testUrl}>
          <Button className="w-full">
            <Play className="mr-2 h-4 w-4" />
            {t('common.buttons.continueTest')}
          </Button>
        </Link>
      );
    }

    if (userTest?.status === 'completed') {
      return (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <ResultsDrawer />
          </div>
          <Link href={testUrl} className="flex-1">
            <Button className="w-full">
              <Play className="mr-2 h-4 w-4" />
              {t('common.buttons.retakeTest')}
            </Button>
          </Link>
        </div>
      );
    }
    if (userTest?.status === 'in_progress') {
      return (
        <Link href={testUrl}>
          <Button className="w-full">
            <Play className="mr-2 h-4 w-4" />
            {t('common.buttons.continueTest')}
          </Button>
        </Link>
      );
    }
    return (
      <Link href={testUrl}>
        <Button className="w-full" size="lg">
          <Play className="mr-2 h-5 w-5" />
          {t('common.buttons.startTest')}
        </Button>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl md:text-3xl mb-2">{test.title}</CardTitle>
              <CardDescription className="text-base">{test.description}</CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Metadata */}
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{t('duration', { minutes: test.duration })}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>{t('questions', { count: test.totalQuestions })}</span>
            </div>
            {userTest?.completedAt && (
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  {t('completedOn', { date: new Date(userTest.completedAt).toLocaleDateString() })}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar (if in progress) */}
          {((test.id === HOLLAND_TEST_ID && hasLocalTest) || userTest?.status === 'in_progress') && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {test.id === HOLLAND_TEST_ID && hasLocalTest
                    ? t('testInProgress')
                    : t('section', { current: userTest?.currentSection || 1, total: test.totalSections })}
                </span>
                <span className="font-medium">
                  {test.id === HOLLAND_TEST_ID && hasLocalTest ? localStorageProgress : userTest?.progress}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${test.id === HOLLAND_TEST_ID && hasLocalTest ? localStorageProgress : userTest?.progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">{getActionButton()}</div>
        </CardContent>
      </Card>

      {/* Dynamic Instructions Content */}
      {instructionsLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <div className="text-muted-foreground">Loading instructions...</div>
            </div>
          </CardContent>
        </Card>
      ) : instructions?.blocks && instructions.blocks.length > 0 ? (
        <ContentBlockRenderer blocks={instructions.blocks} locale={locale} />
      ) : (
        // Fallback to hardcoded content for backward compatibility (should rarely be used now)
        <>
          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('aboutThisTest')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{th('overview')}</p>
            </CardContent>
          </Card>

          {/* What It Measures */}
          <Card>
            <CardHeader>
              <CardTitle>{th('whatItMeasures.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{th('whatItMeasures.description')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-medium mb-1">R - {th('whatItMeasures.realistic').split(':')[0]}</h4>
                  <p className="text-sm text-muted-foreground">{th('whatItMeasures.realistic').split(': ')[1]}</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <h4 className="font-medium mb-1">I - {th('whatItMeasures.investigative').split(':')[0]}</h4>
                  <p className="text-sm text-muted-foreground">{th('whatItMeasures.investigative').split(': ')[1]}</p>
                </div>
                <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950">
                  <h4 className="font-medium mb-1">A - {th('whatItMeasures.artistic').split(':')[0]}</h4>
                  <p className="text-muted-foreground">{th('whatItMeasures.artistic').split(': ')[1]}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-medium mb-1">S - {th('whatItMeasures.social').split(':')[0]}</h4>
                  <p className="text-sm text-muted-foreground">{th('whatItMeasures.social').split(': ')[1]}</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <h4 className="font-medium mb-1">E - {th('whatItMeasures.enterprising').split(':')[0]}</h4>
                  <p className="text-sm text-muted-foreground">{th('whatItMeasures.enterprising').split(': ')[1]}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-medium mb-1">C - {th('whatItMeasures.conventional').split(':')[0]}</h4>
                  <p className="text-sm text-muted-foreground">{th('whatItMeasures.conventional').split(': ')[1]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>{th('howItWorks.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    1
                  </span>
                  <p className="text-muted-foreground pt-0.5">{th('howItWorks.step1')}</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    2
                  </span>
                  <p className="text-muted-foreground pt-0.5">{th('howItWorks.step2')}</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    3
                  </span>
                  <p className="text-muted-foreground pt-0.5">{th('howItWorks.step3')}</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    4
                  </span>
                  <p className="text-muted-foreground pt-0.5">{th('howItWorks.step4')}</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>{th('instructions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{th('instructions.intro')}</p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>{th('instructions.point1')}</li>
                <li>{th('instructions.point2')}</li>
                <li>{th('instructions.point3')}</li>
                <li>{th('instructions.point4')}</li>
                <li>{th('instructions.point5')}</li>
              </ul>
            </CardContent>
          </Card>

          {/* What You'll Learn */}
          <Card>
            <CardHeader>
              <CardTitle>{th('resultsInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>{th('resultsInfo.point1')}</li>
                <li>{th('resultsInfo.point2')}</li>
                <li>{th('resultsInfo.point3')}</li>
                <li>{th('resultsInfo.point4')}</li>
                <li>{th('resultsInfo.point5')}</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* Bottom Action Button */}
      <div className="pt-4">{getActionButton()}</div>
    </div>
  );
}
