'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Clock, Play, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Test, UserTest } from '@/types/test';

interface TestWithProgress extends Test {
  userTest?: UserTest;
}

interface TestsListProps {
  tests: TestWithProgress[];
}

export default function TestsList({ tests }: TestsListProps) {
  const t = useTranslations('tests');

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'completed':
        return {
          badge: (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {t('completed')}
            </Badge>
          ),
          buttonText: t('common.buttons.viewResults'),
          buttonVariant: 'outline' as const,
          showRetake: true,
        };
      case 'in_progress':
        return {
          badge: (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
              {t('inProgress')}
            </Badge>
          ),
          buttonText: t('common.buttons.continueTest'),
          buttonVariant: 'default' as const,
          showRetake: false,
        };
      default:
        return {
          badge: <Badge variant="outline">{t('notStarted')}</Badge>,
          buttonText: t('common.buttons.startTest'),
          buttonVariant: 'default' as const,
          showRetake: false,
        };
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {tests.map((test) => {
        const statusInfo = getStatusInfo(test.userTest?.status);

        return (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl mb-2">{test.title}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </div>
                {statusInfo.badge}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Test Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{t('duration', { minutes: test.duration })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{t('questions', { count: test.totalQuestions })}</span>
                </div>
                {test.userTest?.completedAt && (
                  <span className="text-xs">
                    Completed {new Date(test.userTest.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Progress Bar (if in progress) */}
              {test.userTest?.status === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('section', { current: test.userTest.currentSection || 1, total: test.totalSections })}
                    </span>
                    <span className="font-medium">{test.userTest.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${test.userTest.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 pt-2">
                {test.userTest?.status === 'completed' ? (
                  <>
                    <Link href={`/tests/${test.id}/results`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        {t('common.buttons.viewResults')}
                      </Button>
                    </Link>
                    <Link href={`/tests/${test.id}`} className="flex-1">
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        {t('common.buttons.retakeTest')}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href={`/tests/${test.id}`} className="w-full">
                    <Button className="w-full" variant={statusInfo.buttonVariant}>
                      <Play className="mr-2 h-4 w-4" />
                      {statusInfo.buttonText}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
