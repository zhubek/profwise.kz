'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Heart, Eye, Trash2, MoreVertical, Flame, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/dropdown-menu';
import type { ProfessionMatch } from '@/types/profession';
import { likeProfession } from '@/lib/api/professions';

interface ProfessionsListProps {
  professions: ProfessionMatch[];
}

export default function ProfessionsList({ professions: initialProfessions }: ProfessionsListProps) {
  const [professions] = useState(initialProfessions);
  const [sortBy, setSortBy] = useState<'matchScore' | 'title' | 'popularity'>('matchScore');
  const t = useTranslations('professions');

  const handleLike = async (professionId: string, isLiked: boolean) => {
    try {
      await likeProfession(professionId, !isLiked);
      // TODO: Refresh or optimistic update
    } catch (error) {
      console.error('Failed to like profession:', error);
    }
  };

  // Sort professions
  const sortedProfessions = [...professions].sort((a, b) => {
    switch (sortBy) {
      case 'matchScore':
        return b.matchScore - a.matchScore;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'popularity':
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('common.labels.showingResults', { count: professions.length })}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" className="justify-start">
            <Filter className="mr-2 h-4 w-4" />
            {t('filterBy')}: {t('category.all')}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start min-w-[180px]">
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
        {sortedProfessions.map((profession) => (
          <Card key={profession.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {profession.icon && <span className="text-2xl">{profession.icon}</span>}
                    <CardTitle className="text-lg">{profession.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {profession.matchScore}% {t('matchScore', { percent: '' }).replace('%', '')}
                    </Badge>
                    {profession.popular && (
                      <Badge variant="destructive" className="gap-1">
                        <Flame className="h-3 w-3" />
                        {t('popular')}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLike(profession.id, profession.isLiked || false)}>
                      <Heart
                        className={`mr-2 h-4 w-4 ${profession.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                      />
                      {profession.isLiked ? 'Unlike' : t('common.buttons.like')}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/professions/${profession.id}`} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        {t('common.buttons.viewDetails')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('common.buttons.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <CardDescription className="line-clamp-2">{profession.description}</CardDescription>

              {/* Match Breakdown */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {t('matchBreakdown')}
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Interests</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.interests}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Skills</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.skills}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Personality</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.personality}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Values</div>
                    <div className="text-sm font-semibold">{profession.matchBreakdown.values}%</div>
                  </div>
                </div>
              </div>

              {/* View Details Button - Mobile Full Width */}
              <Link href={`/professions/${profession.id}`}>
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  {t('common.buttons.viewDetails')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
