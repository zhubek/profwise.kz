'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Brain,
  Palette,
  Users,
  TrendingUp,
  FileText,
  Lightbulb,
  Target,
  Heart,
  TrendingUpIcon,
  MinusIcon,
  TrendingDownIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ProfessionArchetypes } from '@/types/profession';

interface ArchetypesContentProps {
  archetypes: ProfessionArchetypes;
}

const riasecIconInfo = {
  realistic: {
    icon: User,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
  },
  investigative: {
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  artistic: {
    icon: Palette,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
  },
  social: {
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
  },
  enterprising: {
    icon: TrendingUp,
    color: 'text-red-600',
    bgColor: 'bg-red-500',
  },
  conventional: {
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500',
  },
};

type LevelType = 'high' | 'medium' | 'low';

interface GroupedItem {
  key: string;
  value: number;
  level: LevelType;
}

const groupByLevel = (items: Record<string, number>): Record<LevelType, GroupedItem[]> => {
  const grouped: Record<LevelType, GroupedItem[]> = {
    high: [],
    medium: [],
    low: [],
  };

  Object.entries(items).forEach(([key, value]) => {
    let level: LevelType;
    if (value >= 70) level = 'high';
    else if (value >= 40) level = 'medium';
    else level = 'low';

    grouped[level].push({ key, value, level });
  });

  // Sort each group by value (descending)
  Object.keys(grouped).forEach((level) => {
    grouped[level as LevelType].sort((a, b) => b.value - a.value);
  });

  return grouped;
};

const getLevelIconInfo = (level: LevelType) => {
  switch (level) {
    case 'high':
      return {
        icon: TrendingUpIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        badgeVariant: 'default' as const,
      };
    case 'medium':
      return {
        icon: MinusIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500',
        badgeVariant: 'secondary' as const,
      };
    case 'low':
      return {
        icon: TrendingDownIcon,
        color: 'text-gray-600',
        bgColor: 'bg-gray-400',
        badgeVariant: 'outline' as const,
      };
  }
};

export default function ArchetypesContent({ archetypes }: ArchetypesContentProps) {
  const t = useTranslations('professions.detail.archetypes');

  // Group interests by level with null checks
  const groupedInterests = groupByLevel(archetypes.archetypeScores?.interests || {});
  const groupedSkills = groupByLevel(archetypes.archetypeScores?.skills || {});
  const groupedPersonality = groupByLevel(archetypes.archetypeScores?.personality || {});
  const groupedValues = groupByLevel(archetypes.archetypeScores?.values || {});

  const getLevelLabel = (level: LevelType): string => {
    switch (level) {
      case 'high':
        return t('highMatch');
      case 'medium':
        return t('mediumMatch');
      case 'low':
        return t('lowMatch');
    }
  };

  const getRiasecName = (key: string): string => {
    return t(key);
  };

  const getRiasecDescription = (key: string): string => {
    return t(`${key}Desc`);
  };

  const getSkillName = (key: string): string => {
    return t(key);
  };

  const getPersonalityName = (key: string): string => {
    return t(key);
  };

  const getValueName = (key: string): string => {
    return t(key);
  };

  const renderGroupedSection = (
    grouped: Record<LevelType, GroupedItem[]>,
    renderItem: (item: GroupedItem) => React.ReactNode
  ) => {
    return (
      <div className="space-y-6">
        {(['high', 'medium', 'low'] as LevelType[]).map((level) => {
          if (grouped[level].length === 0) return null;
          const levelInfo = getLevelIconInfo(level);
          const LevelIcon = levelInfo.icon;

          return (
            <div key={level} className="space-y-3">
              <div className="flex items-center gap-2">
                <LevelIcon className={`w-5 h-5 ${levelInfo.color}`} />
                <h4 className="font-medium">{getLevelLabel(level)}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {grouped[level].map((item) => renderItem(item))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('careerInterestProfile')}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t('basedOnRiasec')}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {t('riasecDescription')}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm font-medium">{t('riasecCodes')}</span>
            {(archetypes.riasecCodes || []).map((code, index) => (
              <Badge key={index} variant="secondary">
                {code}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RIASEC Interest Areas */}
      <Card>
        <CardHeader>
          <CardTitle>{t('riasecAreas')}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t('riasecDesc')}
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedInterests, (item) => {
            const iconInfo = riasecIconInfo[item.key as keyof typeof riasecIconInfo];
            const Icon = iconInfo.icon;
            const levelInfo = getLevelIconInfo(item.level);

            return (
              <div key={item.key} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${iconInfo.bgColor} text-white flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{getRiasecName(item.key)}</h3>
                      <Badge variant={levelInfo.badgeVariant} className="text-xs">
                        {getLevelLabel(item.level)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{getRiasecDescription(item.key)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Skills Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            {t('skillsProfile')}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t('skillsDesc')}
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedSkills, (item) => (
            <div key={item.key} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{getSkillName(item.key)}</span>
                <Badge variant={getLevelIconInfo(item.level).badgeVariant} className="text-xs">
                  {getLevelLabel(item.level)}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Personality Traits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('personalityTraits')}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t('personalityDesc')}
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedPersonality, (item) => (
            <div key={item.key} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{getPersonalityName(item.key)}</span>
                <Badge variant={getLevelIconInfo(item.level).badgeVariant} className="text-xs">
                  {getLevelLabel(item.level)}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Work Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {t('workValues')}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t('workValuesDesc')}
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedValues, (item) => (
            <div key={item.key} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{getValueName(item.key)}</span>
                <Badge variant={getLevelIconInfo(item.level).badgeVariant} className="text-xs">
                  {getLevelLabel(item.level)}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Primary Archetypes Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {t('primaryArchetypes')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">{t('interests')}</h4>
            <div className="flex flex-wrap gap-2">
              {(archetypes.primaryArchetypes?.interests || []).map((interest, index) => (
                <Badge key={index} variant="outline">
                  {getRiasecName(interest)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">{t('skills')}</h4>
            <div className="flex flex-wrap gap-2">
              {(archetypes.primaryArchetypes?.skills || []).map((skill, index) => (
                <Badge key={index} variant="outline">
                  {getSkillName(skill)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">{t('personality')}</h4>
            <div className="flex flex-wrap gap-2">
              {(archetypes.primaryArchetypes?.personality || []).map((trait, index) => (
                <Badge key={index} variant="outline">
                  {getPersonalityName(trait)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">{t('values')}</h4>
            <div className="flex flex-wrap gap-2">
              {(archetypes.primaryArchetypes?.values || []).map((value, index) => (
                <Badge key={index} variant="outline">
                  {getValueName(value)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
