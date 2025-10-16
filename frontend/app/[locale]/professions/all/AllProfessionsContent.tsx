'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryGrid from './CategoryGrid';
import CategoryProfessions from './CategoryProfessions';
import type { Category, CategoryWithProfessions } from '@/types/category';
import { getCategory } from '@/lib/api/categories';

interface AllProfessionsContentProps {
  initialCategories: Category[];
}

export default function AllProfessionsContent({ initialCategories }: AllProfessionsContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithProfessions | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('professions');

  const handleSelectCategory = async (category: Category) => {
    setLoading(true);
    try {
      const categoryWithProfessions = await getCategory(category.id);
      setSelectedCategory(categoryWithProfessions);
    } catch (error) {
      console.error('Failed to fetch category professions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <CategoryProfessions
        category={selectedCategory}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold md:text-2xl">
          {t('allProfessions.browseByCategory')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('allProfessions.selectCategory')}
        </p>
      </div>

      <CategoryGrid
        categories={initialCategories}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
