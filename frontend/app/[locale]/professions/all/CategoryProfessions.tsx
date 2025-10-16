'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLocalizedText } from '@/lib/utils/i18n';
import type { CategoryWithProfessions } from '@/types/category';

interface CategoryProfessionsProps {
  category: CategoryWithProfessions;
  onBack: () => void;
}

export default function CategoryProfessions({ category, onBack }: CategoryProfessionsProps) {
  const locale = useLocale();
  const t = useTranslations('professions');

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2 hover:bg-transparent p-0 h-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('allProfessions.backToCategories')}
          </Button>
          <h2 className="text-2xl font-bold md:text-3xl">
            {getLocalizedText(category.name, locale)}
          </h2>
          <p className="text-muted-foreground">
            {t('allProfessions.professionsInCategory', { count: category.professions.length })}
          </p>
        </div>
      </div>

      {/* Professions Grid */}
      {category.professions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {category.professions.map((profession) => (
            <Card key={profession.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">
                      {getLocalizedText(profession.name, locale)}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <Badge variant="outline" className="text-xs">
                        {profession.code}
                      </Badge>
                      {profession.featured && (
                        <Badge variant="destructive" className="text-xs">
                          {t('popular')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <CardDescription className="line-clamp-3">
                  {getLocalizedText(profession.description, locale)}
                </CardDescription>

                {/* View Details Button */}
                <div className="pt-2">
                  <Link href={`/${locale}/professions/${profession.id}`}>
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      {t('common.buttons.viewDetails')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t('allProfessions.noProfessionsInCategory')}
          </p>
          <Button
            variant="link"
            onClick={onBack}
            className="mt-2"
          >
            {t('allProfessions.backToCategories')}
          </Button>
        </div>
      )}
    </div>
  );
}
