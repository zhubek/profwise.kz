'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Loader2, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { getUserResults } from '@/lib/api/results';
import type { TestResultListItem } from '@/types/test';

interface UserResultsDrawerProps {
  userId: string | null;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onViewResult: (resultId: string) => void;
}

export default function UserResultsDrawer({
  userId,
  userName,
  isOpen,
  onClose,
  onViewResult,
}: UserResultsDrawerProps) {
  const [results, setResults] = useState<TestResultListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('admin');

  useEffect(() => {
    if (userId && isOpen) {
      loadResults();
    }
  }, [userId, isOpen]);

  const loadResults = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getUserResults(userId);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load results');
      console.error('Error loading results:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTestTypeBadgeColor = (testType: string) => {
    const colors: Record<string, string> = {
      riasec: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      personality: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      career: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      skills: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      values: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    };
    return colors[testType] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('dashboard.userResults.title')}</SheetTitle>
          <SheetDescription>
            {t('dashboard.userResults.description', { name: userName })}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="mt-4 text-muted-foreground">{t('dashboard.userResults.loadingResults')}</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadResults} variant="outline">
                {t('dashboard.tryAgain')}
              </Button>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('dashboard.userResults.noResults')}</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="space-y-3">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Test Name and Type */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {result.testName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                              variant="secondary"
                              className={getTestTypeBadgeColor(result.testType)}
                            >
                              {result.testType}
                            </Badge>
                            {result.hollandCode && result.hollandCode !== 'XXX' && (
                              <Badge variant="outline">
                                {result.hollandCode}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Primary Interest */}
                      {result.primaryInterest && result.primaryInterest !== 'Unknown' && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{t('dashboard.userResults.primaryInterest')}</span>{' '}
                          {result.primaryInterest}
                        </div>
                      )}

                      {/* Completion Date */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(result.completedAt)}
                      </div>

                      {/* View Button */}
                      <Button
                        onClick={() => onViewResult(result.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t('dashboard.userResults.viewFullResult')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
