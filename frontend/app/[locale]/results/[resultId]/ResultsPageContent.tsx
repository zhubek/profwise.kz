'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RIASECResultDisplay } from '@/types/test';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Target,
  FileText,
  Layers,
  RotateCcw,
  Eye,
  Heart,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getArchetypeDescription, getRIASECTrait, getLocalizedText } from '@/lib/riasec-descriptions-localized';

interface ResultsPageContentProps {
  result: RIASECResultDisplay;
}

export default function ResultsPageContent({
  result,
}: ResultsPageContentProps) {
  const router = useRouter();
  const t = useTranslations();
  const tResults = useTranslations('results');
  const locale = useLocale();

  const handleBackToTests = () => {
    router.push('/tests');
  };

  const handleViewArchetypes = () => {
    router.push('/archetypes');
  };

  const handleRetakeTest = () => {
    router.push('/tests/holland');
  };

  const handleViewDetailedReport = () => {
    // TODO: Implement detailed report view
    console.log('View detailed report');
  };

  // Get top 2 RIASEC codes
  const sortedScores = Object.entries(result.scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  const primaryCode = sortedScores[0][0];
  const secondaryCode = sortedScores[1][0];

  const archetypeDesc = getArchetypeDescription(primaryCode, secondaryCode);
  const primaryTrait = getRIASECTrait(primaryCode);
  const secondaryTrait = getRIASECTrait(secondaryCode);

  // Helper to get localized RIASEC text
  const getLocalized = (text: any) => getLocalizedText(text, locale);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                {tResults('yourPersonalReport')}
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                {tResults('riasecInterestProfile')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToTests}
              className="hidden md:flex"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {tResults('backToTests')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToTests}
              className="md:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-6 md:space-y-8">
          {/* Archetype Section */}
          {archetypeDesc && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 md:text-3xl">
                    {tResults('yourArchetype', { name: getLocalized(archetypeDesc.name) })}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4 md:text-lg">
                    {tResults('yourStrongestTraitsAre')}{' '}
                    <span className="font-semibold text-foreground">
                      {getLocalized(primaryTrait?.name)}
                    </span>{' '}
                    {tResults('and')}{' '}
                    <span className="font-semibold text-foreground">
                      {getLocalized(secondaryTrait?.name)}
                    </span>
                    .
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed md:text-base">
                    {getLocalized(archetypeDesc.description)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RIASEC Traits Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryTrait && (
              <div className="bg-card rounded-lg border p-4 md:p-6">
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
                    {tResults('keyCharacteristics')}
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
              <div className="bg-card rounded-lg border p-4 md:p-6">
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
                    {tResults('keyCharacteristics')}
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

          {/* RIASEC Scores as Percentages */}
          <div className="bg-card rounded-lg border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 md:text-2xl">
              {tResults('riasecProfile')}
            </h2>
            <div className="space-y-4">
              {Object.entries(result.scores).map(([code, score]) => {
                const trait = getRIASECTrait(code);
                // Scores are already percentages (0-100), no need to convert
                const percentage = Math.round(score);

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
                        <span className="text-sm font-medium md:text-base">
                          {getLocalized(trait?.name)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold md:text-base">
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2 md:h-3" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 20 Career Matches */}
          <div className="bg-card rounded-lg border p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold md:text-2xl">
                {tResults('topCareerMatches')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tResults('basedOnYourProfile', { count: result.topProfessions.length })}
              </p>
            </div>

            {/* Professions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {result.topProfessions.map((profession) => (
                <Card key={profession.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {profession.icon && (
                            <span className="text-2xl">{profession.icon}</span>
                          )}
                          <CardTitle className="text-base md:text-lg">
                            {getLocalized(profession.title)}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            {tResults('matchPercentage', { percent: profession.matchScore })}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          >
                            {typeof profession.category === 'object' && profession.category?.name
                              ? getLocalized(profession.category.name)
                              : t(`professions.category.${profession.category}`, profession.category as string)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}
                    <CardDescription className="line-clamp-2 text-sm">
                      {getLocalized(profession.description)}
                    </CardDescription>

                    {/* View Details Button */}
                    <div className="pt-2">
                      <Link href={`/professions/${profession.id}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          {t('professions.common.buttons.viewDetails')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t md:flex-row md:justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetailedReport}
              className="w-full md:w-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              {tResults('viewDetailedReport')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewArchetypes}
              className="w-full md:w-auto"
            >
              <Layers className="w-4 h-4 mr-2" />
              {tResults('seeAllArchetypes')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetakeTest}
              className="w-full md:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {tResults('retakeTest')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
