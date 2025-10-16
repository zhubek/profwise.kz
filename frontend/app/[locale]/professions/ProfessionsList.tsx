'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Heart, Eye, Flame } from 'lucide-react';
import { getLocalizedText } from '@/lib/utils/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProfessionMatch, ProfessionCategory } from '@/types/profession';
import { likeProfession } from '@/lib/api/professions';

interface ProfessionsListProps {
  professions: ProfessionMatch[];
}

type LikedFilter = 'all' | 'liked';

export default function ProfessionsList({ professions: initialProfessions }: ProfessionsListProps) {
  const [professions, setProfessions] = useState(initialProfessions);
  const [sortBy, setSortBy] = useState<'matchScore' | 'title' | 'popularity'>('matchScore');
  const [categoryFilter, setCategoryFilter] = useState<ProfessionCategory | 'all'>('all');
  const [likedFilter, setLikedFilter] = useState<LikedFilter>('all');
  const t = useTranslations('professions');
  const locale = useLocale();

  const handleLike = async (professionId: string, isLiked: boolean) => {
    try {
      await likeProfession(professionId, !isLiked);
      // Optimistic update
      setProfessions(prev =>
        prev.map(p => (p.id === professionId ? { ...p, isLiked: !isLiked } : p))
      );
    } catch (error) {
      console.error('Failed to like profession:', error);
    }
  };

  // Filter and sort professions
  const filteredProfessions = useMemo(() => {
    let filtered = professions;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by liked
    if (likedFilter === 'liked') {
      filtered = filtered.filter(p => p.isLiked);
    }

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'matchScore':
          return b.matchScore - a.matchScore;
        case 'title':
          return getLocalizedText(a.title, locale).localeCompare(getLocalizedText(b.title, locale));
        case 'popularity':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [professions, categoryFilter, likedFilter, sortBy, locale]);

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('common.labels.showingResults', { count: filteredProfessions.length })}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Liked Filter */}
          <div className="flex gap-2">
            <Button
              variant={likedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLikedFilter('all')}
            >
              {t('category.all')}
            </Button>
            <Button
              variant={likedFilter === 'liked' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLikedFilter('liked')}
            >
              <Heart className="mr-2 h-4 w-4" />
              {t('liked')}
            </Button>
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-w-[180px] justify-start">
                {t('filterBy')}: {categoryFilter === 'all' ? t('category.all') : t(`category.${categoryFilter}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                {t('category.all')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('technology')}>
                {t('category.technology')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('business')}>
                {t('category.business')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('healthcare')}>
                {t('category.healthcare')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('science')}>
                {t('category.science')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('design')}>
                {t('category.design')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('communication')}>
                {t('category.communication')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('education')}>
                {t('category.education')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('arts')}>
                {t('category.arts')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-w-[180px] justify-start">
                {t('common.labels.sortBy')}: {t(`sortBy${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('matchScore')}>
                {t('sortByMatch')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                {t('sortByAlphabetical')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('popularity')}>
                {t('sortByPopularity')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Professions Grid - Mobile: 1 col, Desktop: 2 cols */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredProfessions.map((profession) => (
          <Card key={profession.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {profession.icon && <span className="text-2xl">{profession.icon}</span>}
                    <CardTitle className="text-lg">{getLocalizedText(profession.title, locale)}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {profession.matchScore}% {t('matchScore', { percent: '' }).replace('%', '')}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {t(`category.${profession.category}`)}
                    </Badge>
                    {profession.popular && (
                      <Badge variant="destructive" className="gap-1">
                        <Flame className="h-3 w-3" />
                        {t('popular')}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Like/Dislike Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  {profession.isLiked ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleLike(profession.id, profession.isLiked || false)}
                    >
                      <Heart className="h-4 w-4 fill-red-500" />
                      <span className="sr-only">{t('unlike')}</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleLike(profession.id, profession.isLiked || false)}
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">{t('like')}</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <CardDescription className="line-clamp-2">{getLocalizedText(profession.description, locale)}</CardDescription>

              {/* Match Breakdown */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {t('matchBreakdown')}
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{t('interests')}</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.interests}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{t('skills')}</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.skills}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{t('personality')}</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.personality}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{t('values')}</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.values}%</div>
                  </div>
                </div>
              </div>

              {/* View Details Button - More spacing above */}
              <div className="pt-2">
                <Link href={`/professions/${profession.id}`}>
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

      {/* Empty State */}
      {filteredProfessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('noProfessionsFound')}</p>
          <Button
            variant="link"
            onClick={() => {
              setCategoryFilter('all');
              setLikedFilter('all');
            }}
            className="mt-2"
          >
            {t('clearFilters')}
          </Button>
        </div>
      )}
    </div>
  );
}
