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
import type { ProfessionArchetypes } from '@/types/profession';

interface ArchetypesContentProps {
  archetypes: ProfessionArchetypes;
}

const riasecInfo = {
  realistic: {
    name: 'Realistic',
    icon: User,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    description: 'Practical, hands-on work with tools, machines, and outdoor activities',
  },
  investigative: {
    name: 'Investigative',
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    description: 'Analytical work, research, and problem-solving with data',
  },
  artistic: {
    name: 'Artistic',
    icon: Palette,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    description: 'Creative work, self-expression, and aesthetic activities',
  },
  social: {
    name: 'Social',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    description: 'Helping others, teaching, and collaborative work',
  },
  enterprising: {
    name: 'Enterprising',
    icon: TrendingUp,
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    description: 'Leadership, persuasion, and business-oriented activities',
  },
  conventional: {
    name: 'Conventional',
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500',
    description: 'Organized work with data, records, and established procedures',
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

const getLevelInfo = (level: LevelType) => {
  switch (level) {
    case 'high':
      return {
        label: 'Высокое соответствие',
        icon: TrendingUpIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        badgeVariant: 'default' as const,
      };
    case 'medium':
      return {
        label: 'Среднее соответствие',
        icon: MinusIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500',
        badgeVariant: 'secondary' as const,
      };
    case 'low':
      return {
        label: 'Низкое соответствие',
        icon: TrendingDownIcon,
        color: 'text-gray-600',
        bgColor: 'bg-gray-400',
        badgeVariant: 'outline' as const,
      };
  }
};

export default function ArchetypesContent({ archetypes }: ArchetypesContentProps) {
  // Group interests by level
  const groupedInterests = groupByLevel(archetypes.archetypeScores.interests);
  const groupedSkills = groupByLevel(archetypes.archetypeScores.skills);
  const groupedPersonality = groupByLevel(archetypes.archetypeScores.personality);
  const groupedValues = groupByLevel(archetypes.archetypeScores.values);

  const renderGroupedSection = (
    grouped: Record<LevelType, GroupedItem[]>,
    renderItem: (item: GroupedItem) => React.ReactNode
  ) => {
    return (
      <div className="space-y-6">
        {(['high', 'medium', 'low'] as LevelType[]).map((level) => {
          if (grouped[level].length === 0) return null;
          const levelInfo = getLevelInfo(level);
          const LevelIcon = levelInfo.icon;

          return (
            <div key={level} className="space-y-3">
              <div className="flex items-center gap-2">
                <LevelIcon className={`w-5 h-5 ${levelInfo.color}`} />
                <h4 className="font-medium">{levelInfo.label}</h4>
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
          <CardTitle>Профиль карьерных интересов</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            На основе модели RIASEC
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Эта профессия соответствует определенным областям интересов на основе модели Holland Codes (RIASEC).
            Понимание этих интересов поможет вам определить, соответствует ли эта карьера вашим предпочтениям
            и стилю работы.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm font-medium">Коды RIASEC:</span>
            {archetypes.riasecCodes.map((code, index) => (
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
          <CardTitle>Области интересов RIASEC</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Шесть областей интересов, описывающих рабочую деятельность и среду
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedInterests, (item) => {
            const info = riasecInfo[item.key as keyof typeof riasecInfo];
            const Icon = info.icon;
            const levelInfo = getLevelInfo(item.level);

            return (
              <div key={item.key} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${info.bgColor} text-white flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{info.name}</h3>
                      <Badge variant={levelInfo.badgeVariant} className="text-xs">
                        {levelInfo.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
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
            Профиль навыков
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Ключевые области навыков, необходимые для этой профессии
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedSkills, (item) => (
            <div key={item.key} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{item.key}</span>
                <Badge variant={getLevelInfo(item.level).badgeVariant} className="text-xs">
                  {getLevelInfo(item.level).label}
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
            Личностные черты
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Измерения личности "Большой пятерки", соответствующие этой карьере
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedPersonality, (item) => (
            <div key={item.key} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{item.key}</span>
                <Badge variant={getLevelInfo(item.level).badgeVariant} className="text-xs">
                  {getLevelInfo(item.level).label}
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
            Рабочие ценности
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Ценности, которые обычно важны в этой профессии
          </p>
        </CardHeader>
        <CardContent>
          {renderGroupedSection(groupedValues, (item) => (
            <div key={item.key} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">
                  {item.key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <Badge variant={getLevelInfo(item.level).badgeVariant} className="text-xs">
                  {getLevelInfo(item.level).label}
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
            Основные архетипы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Интересы</h4>
            <div className="flex flex-wrap gap-2">
              {archetypes.primaryArchetypes.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Навыки</h4>
            <div className="flex flex-wrap gap-2">
              {archetypes.primaryArchetypes.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Личность</h4>
            <div className="flex flex-wrap gap-2">
              {archetypes.primaryArchetypes.personality.map((trait, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Ценности</h4>
            <div className="flex flex-wrap gap-2">
              {archetypes.primaryArchetypes.values.map((value, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
