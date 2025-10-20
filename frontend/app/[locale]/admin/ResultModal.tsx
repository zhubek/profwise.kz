'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getResultById } from '@/lib/api/results';
import type { RIASECResultDisplay } from '@/types/test';
import { getArchetypeDescription, getRIASECTrait, getLocalizedText } from '@/lib/riasec-descriptions-localized';

interface ResultModalProps {
  resultId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultModal({ resultId, isOpen, onClose }: ResultModalProps) {
  const [result, setResult] = useState<RIASECResultDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('results');
  const locale = useLocale();

  useEffect(() => {
    if (resultId && isOpen) {
      loadResult(resultId);
    }
  }, [resultId, isOpen]);

  const loadResult = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getResultById(id);
      setResult(data);
    } catch (error) {
      console.error('Error loading result:', error);
      setError('Failed to load result');
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalized = (text: any) => getLocalizedText(text, locale);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t('yourPersonalReport')}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading result...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && !isLoading && !error && (() => {
          // Get top 2 RIASEC codes
          const sortedScores = Object.entries(result.scores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2);

          const primaryCode = sortedScores[0][0];
          const secondaryCode = sortedScores[1][0];

          const archetypeDesc = getArchetypeDescription(primaryCode, secondaryCode);
          const primaryTrait = getRIASECTrait(primaryCode);
          const secondaryTrait = getRIASECTrait(secondaryCode);

          return (
            <div className="space-y-6">
          {/* Archetype Section */}
          {archetypeDesc && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border p-6">
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {t('yourArchetype', { name: getLocalized(archetypeDesc.name) })}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t('yourStrongestTraitsAre')}{' '}
                    <span className="font-semibold text-foreground">
                      {getLocalized(primaryTrait?.name)}
                    </span>{' '}
                    {t('and')}{' '}
                    <span className="font-semibold text-foreground">
                      {getLocalized(secondaryTrait?.name)}
                    </span>
                    .
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getLocalized(archetypeDesc.description)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RIASEC Traits Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryTrait && (
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="text-base px-3 py-1">
                    {primaryTrait.code}
                  </Badge>
                  <h3 className="text-lg font-semibold">{getLocalized(primaryTrait.name)}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {getLocalized(primaryTrait.fullDescription)}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('keyCharacteristics')}
                  </p>
                  <ul className="text-sm space-y-1">
                    {primaryTrait.characteristics.slice(0, 3).map((char, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{getLocalized(char)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {secondaryTrait && (
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {secondaryTrait.code}
                  </Badge>
                  <h3 className="text-lg font-semibold">{getLocalized(secondaryTrait.name)}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {getLocalized(secondaryTrait.fullDescription)}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('keyCharacteristics')}
                  </p>
                  <ul className="text-sm space-y-1">
                    {secondaryTrait.characteristics.slice(0, 3).map((char, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{getLocalized(char)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* RIASEC Scores */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">
              {t('riasecProfile')}
            </h2>
            <div className="space-y-4">
              {Object.entries(result.scores).map(([code, score]) => {
                const trait = getRIASECTrait(code);
                const percentage = Math.round((score / 10) * 100);

                return (
                  <div key={code}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={code === primaryCode ? 'default' : 'outline'}
                          className="w-8 h-8 flex items-center justify-center p-0"
                        >
                          {code}
                        </Badge>
                        <span className="text-sm font-medium">
                          {getLocalized(trait?.name)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Career Matches - Simplified */}
          {result.topProfessions.length > 0 && (
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('topCareerMatches')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.topProfessions.slice(0, 6).map((profession) => (
                  <div
                    key={profession.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{getLocalized(profession.title)}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {profession.matchScore}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}
