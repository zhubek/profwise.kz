'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Briefcase, User2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { UserArchetypeProfile } from '@/types/archetype';

interface ArchetypeTabsProps {
  profile: UserArchetypeProfile;
}

type TabType = 'interests' | 'skills' | 'personality' | 'values' | 'all';

export default function ArchetypeTabs({ profile }: ArchetypeTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('interests');
  const t = useTranslations('archetypes');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'interests', label: t('interests') },
    { key: 'skills', label: t('skills') },
    { key: 'personality', label: t('personality') },
    { key: 'values', label: t('values') },
    { key: 'all', label: t('all') },
  ];

  const getArchetypesForTab = () => {
    if (activeTab === 'all') {
      return [
        ...profile.interests,
        ...profile.skills,
        ...profile.personality,
        ...profile.values,
      ];
    }
    return profile[activeTab] || [];
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
        {!hasData ? (
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
                <Card key={archetypeScore.archetypeId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {archetypeScore.archetype.icon && (
                            <span className="text-3xl">{archetypeScore.archetype.icon}</span>
                          )}
                          <div>
                            <CardTitle>{archetypeScore.archetype.name}</CardTitle>
                            <CardDescription className="text-xs uppercase tracking-wide">
                              {archetypeScore.archetype.category}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        {archetypeScore.score}%
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {archetypeScore.archetype.description}
                    </p>

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
