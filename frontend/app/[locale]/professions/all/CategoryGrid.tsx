'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLocalizedText } from '@/lib/utils/i18n';
import type { Category } from '@/types/category';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export default function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onSelectCategory(category)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">
                {getLocalizedText(category.name, locale)}
              </CardTitle>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <CardDescription className="line-clamp-2 min-h-[40px]">
              {getLocalizedText(category.description, locale)}
            </CardDescription>

            {category._count && (
              <div className="pt-2">
                <Badge variant="secondary" className="text-sm">
                  {category._count.professions} профессий
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
