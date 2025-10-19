'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import type { UNTPointsData } from '@/types/profession';
import { useTranslations } from 'next-intl';

interface UNTPointsChartProps {
  untPoints: UNTPointsData[];
  universityName: string;
}

export default function UNTPointsChart({ untPoints, universityName }: UNTPointsChartProps) {
  const t = useTranslations('professions.detail.education');

  // Get the most recent year's data
  const latestYear = Math.max(...untPoints.map(p => p.year));
  const latestData = untPoints.filter(p => p.year === latestYear);

  const generalGrant = latestData.find(p => p.grantType === 'general');
  const aulGrant = latestData.find(p => p.grantType === 'aul');

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        {t('untPointsDesc')} ({latestYear})
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* General Grant */}
        {generalGrant && (
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-blue-600 text-white text-xs">
                {t('generalGrant')}
              </Badge>
              {generalGrant.grantCount && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{generalGrant.grantCount} {t('grants')}</span>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {generalGrant.minPoints}
              </div>
              {generalGrant.maxPoints && (
                <>
                  <span className="text-muted-foreground">–</span>
                  <div className="text-3xl font-semibold text-blue-500 dark:text-blue-400">
                    {generalGrant.maxPoints}
                  </div>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('untPoints')}
            </div>
          </Card>
        )}

        {/* Aul Grant */}
        {aulGrant && (
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-green-600 text-white text-xs">
                {t('aulGrant')}
              </Badge>
              {aulGrant.grantCount && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{aulGrant.grantCount} {t('grants')}</span>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {aulGrant.minPoints}
              </div>
              {aulGrant.maxPoints && (
                <>
                  <span className="text-muted-foreground">–</span>
                  <div className="text-3xl font-semibold text-green-500 dark:text-green-400">
                    {aulGrant.maxPoints}
                  </div>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('untPoints')}
            </div>
          </Card>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs text-muted-foreground">
        <div className="font-medium mb-2">{t('untLegendTitle')}</div>
        <ul className="space-y-1">
          <li>• <strong>{t('generalGrant')}:</strong> {t('generalGrantDesc')}</li>
          <li>• <strong>{t('aulGrant')}:</strong> {t('aulGrantDesc')}</li>
        </ul>
      </div>
    </div>
  );
}
