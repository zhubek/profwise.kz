'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { FileText, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TestResultListItem } from '@/types/test';
import { getUserResults } from '@/lib/api/results';
import { useAuth } from '@/contexts/AuthContext';

export default function ResultsDrawer() {
  const t = useTranslations('tests');
  const tCommon = useTranslations('common');
  const tResults = useTranslations('results');
  const locale = useLocale();
  const { user } = useAuth();
  const [results, setResults] = useState<TestResultListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch results when drawer opens
  useEffect(() => {
    if (isOpen && user) {
      setIsLoading(true);

      getUserResults(user.id, locale)
        .then((data) => {
          setResults(data);
        })
        .catch((error) => {
          console.error('Error fetching results:', error);
          setResults([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, user, locale]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          {t('common.buttons.viewResults')}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('common.buttons.viewResults')}</SheetTitle>
          <SheetDescription>
            {tResults('viewPreviousResults')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">{tCommon('labels.loading')}</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {tResults('noResultsFound')}
                </p>
              </div>
            </div>
          ) : (
            results.map((result) => (
              <Link
                key={result.id}
                href={`/results/${result.id}`}
                onClick={() => setIsOpen(false)}
              >
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Test name and Holland code */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base truncate">
                            {result.testName}
                          </h3>
                          {result.primaryInterest && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {tResults('primary')}: {result.primaryInterest}
                            </p>
                          )}
                        </div>
                        {result.hollandCode && (
                          <Badge variant="secondary" className="shrink-0">
                            {result.hollandCode}
                          </Badge>
                        )}
                      </div>

                      {/* Completion date */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(result.completedAt)}</span>
                      </div>

                      {/* View action hint */}
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Award className="h-3 w-3" />
                        <span>{tResults('viewDetailedResults')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
