'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Briefcase, User2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { UserArchetypeProfile, ArchetypeType } from '@/types/archetype';

interface ArchetypeTabsProps {
  profile: UserArchetypeProfile;
  archetypeTypes: ArchetypeType[];
}

type TabType = string; // Can be any archetype type ID or 'all'

export default function ArchetypeTabs({ profile, archetypeTypes }: ArchetypeTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('interest'); // Default to first type
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const t = useTranslations('characteristics');
  const locale = useLocale() as 'en' | 'ru' | "kz";

  // Create tabs from archetype types + "all" tab
  const tabs: { key: TabType; label: string }[] = [
    ...archetypeTypes.map(type => ({
      key: type.id,
      label: type.name[locale] || type.name.en,
    })),
    { key: 'all', label: t('all') },
  ];

  const getArchetypesForTab = () => {
    if (activeTab === 'all') {
      // Return all archetypes from all types
      return Object.values(profile.groupedArchetypes).flat();
    }
    // Return archetypes for the specific type
    return profile.groupedArchetypes[activeTab] || [];
  };

  const archetypes = getArchetypesForTab();
  const hasData = archetypes.length > 0;

  return (
    <div className="space-y-6">
      {/* Tabs - Mobile: Scrollable, Desktop: Full width */}
      <div className="border-b overflow-x-auto">
        <div className="flex min-w-max md:min-w-0 md:grid md:grid-cols-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {!hasData && activeTab === 'all' ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{t('notCompleted')}</p>
                <Link href="/tests">
                  <Button>
                    {t('takeAssessment')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : !hasData && activeTab !== 'all' ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground">No related test is passed yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Category Header */}
            {activeTab !== 'all' && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  {t('topTraits', { category: tabs.find((t) => t.key === activeTab)?.label })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Based on your completed assessments
                </p>
              </div>
            )}

            {/* Archetypes Grid - Mobile: 1 col, Tablet: 2 cols */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {archetypes.map((archetypeScore) => (
                <Card
                  key={archetypeScore.archetypeId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {archetypeScore.archetype.icon && (
                          <span className="text-3xl">{archetypeScore.archetype.icon}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{archetypeScore.archetype.name[locale] || archetypeScore.archetype.name.en}</CardTitle>
                            <button
                              onClick={() => setExpandedCard(
                                expandedCard === archetypeScore.archetypeId ? null : archetypeScore.archetypeId
                              )}
                              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                              aria-label="Show description"
                            >
                              <Info className="h-4 w-4" />
                            </button>
                          </div>
                          {archetypeScore.archetype.archetypeType && (
                            <CardDescription className="text-xs">
                              {archetypeScore.archetype.archetypeType.name[locale] || archetypeScore.archetype.archetypeType.name.en}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-base flex-shrink-0">
                        {archetypeScore.score}%
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description - shown when info icon is clicked */}
                    {expandedCard === archetypeScore.archetypeId && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm text-foreground">
                          {archetypeScore.archetype.description[locale] || archetypeScore.archetype.description.en}
                        </p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Progress value={archetypeScore.score} className="h-2" />
                      {archetypeScore.percentile && (
                        <p className="text-xs text-muted-foreground">
                          Higher than {archetypeScore.percentile}% of users
                        </p>
                      )}
                    </div>

                    {/* Key Traits */}
                    {archetypeScore.archetype.keyTraits.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Traits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {archetypeScore.archetype.keyTraits.map((trait) => (
                            <Badge key={trait} variant="outline" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {hasData && (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-6 border-t">
          <Link href="/professions">
            <Button size="lg" className="w-full sm:w-auto">
              <Briefcase className="mr-2 h-4 w-4" />
              {t('viewAllMatches')}
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <User2 className="mr-2 h-4 w-4" />
              {t('updateProfile')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
