import { notFound } from 'next/navigation';
import { getProfessionLaborMarket, getProfessionSalary } from '@/lib/api/professions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  DollarSign,
  MapPin,
  Building2,
  Users,
  Briefcase,
  Target,
  Lightbulb,
} from 'lucide-react';
import { getLocalizedText } from '@/lib/utils/i18n';
import { getTranslations } from 'next-intl/server';

// Cache this page for 24 hours (86400 seconds)
export const revalidate = 86400;

interface MarketPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const demandLevelColors: Record<string, { bg: string; text: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-800' },
  moderate: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  high: { bg: 'bg-green-100', text: 'text-green-800' },
  'very-high': { bg: 'bg-blue-100', text: 'text-blue-800' },
};

const formatSalary = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default async function MarketPage({ params }: MarketPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations('professions.detail.market');

  const getDemandLabel = (level: string): string => {
    switch (level) {
      case 'low':
        return t('demandLevel.low');
      case 'moderate':
        return t('demandLevel.moderate');
      case 'high':
        return t('demandLevel.high');
      case 'very-high':
        return t('demandLevel.veryHigh');
      default:
        return t('demandLevel.moderate');
    }
  };

  try {
    const [laborMarket, salary] = await Promise.all([
      getProfessionLaborMarket(id),
      getProfessionSalary(id),
    ]);

    const demandInfo = demandLevelColors[laborMarket.demandLevel] || demandLevelColors.moderate;

    return (
      <div className="space-y-6">
        {/* Market Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('laborMarketOverview')}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('marketOverviewDesc')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('marketDemand')}</span>
                  <div className="mt-2">
                    <Badge className={`${demandInfo.bg} ${demandInfo.text} px-3 py-1`}>
                      {getDemandLabel(laborMarket.demandLevel)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('jobGrowth')}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-green-700">{laborMarket.jobGrowth}</span>
                    <span className="text-sm text-muted-foreground">{t('jobGrowthSuffix')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('annualJobOpenings')}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span className="text-xl font-bold">
                      {laborMarket.annualOpenings.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">{t('positionsPerYear')}</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('lastUpdated')}</span>
                  <p className="mt-2 text-sm">
                    {new Date(laborMarket.updatedAt).toLocaleDateString(locale)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {t('salaryInsights')}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('salaryDesc', { currency: salary.currency })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Entry Level */}
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900 mb-2">{t('entryLevel')}</div>
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {formatSalary((salary.entryLevel.min + salary.entryLevel.max) / 2, salary.currency)}
                </div>
                <div className="text-xs text-green-700">
                  {formatSalary(salary.entryLevel.min, salary.currency)} -{' '}
                  {formatSalary(salary.entryLevel.max, salary.currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">{t('entryYears')}</div>
              </div>

              {/* Mid Career */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">{t('midCareer')}</div>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {formatSalary((salary.midCareer.min + salary.midCareer.max) / 2, salary.currency)}
                </div>
                <div className="text-xs text-blue-700">
                  {formatSalary(salary.midCareer.min, salary.currency)} -{' '}
                  {formatSalary(salary.midCareer.max, salary.currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">{t('midYears')}</div>
              </div>

              {/* Senior Level */}
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900 mb-2">{t('seniorLevel')}</div>
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {formatSalary((salary.seniorLevel.min + salary.seniorLevel.max) / 2, salary.currency)}
                </div>
                <div className="text-xs text-purple-700">
                  {formatSalary(salary.seniorLevel.min, salary.currency)} -{' '}
                  {formatSalary(salary.seniorLevel.max, salary.currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">{t('seniorYears')}</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{t('note')}</strong> {t('salaryNote')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Industry Sectors */}
        {laborMarket.industrySectors && laborMarket.industrySectors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t('industrySectors')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('industrySectorsDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {laborMarket.industrySectors.map((sector, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                  >
                    <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{getLocalizedText(sector, locale)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geographic Hotspots */}
        {laborMarket.geographicHotspots && laborMarket.geographicHotspots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t('geographicHotspots')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('geographicDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {laborMarket.geographicHotspots.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{getLocalizedText(location, locale)}</div>
                      <div className="text-xs text-muted-foreground">{t('highJobAvailability')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Search Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('jobSearchStrategy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {t('applicationStrategy')}
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('appTip1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('appTip2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('appTip3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('appTip4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('appTip5')}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {t('careerDevelopment')}
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('devTip1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('devTip2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('devTip3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('devTip4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('devTip5')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Lightbulb className="w-5 h-5" />
              {t('marketInsights')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {t('insight1', { growth: laborMarket.jobGrowth })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {t('insight2', { openings: laborMarket.annualOpenings.toLocaleString() })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {t('insight3')}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {t('insight4')}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching profession market data:', error);
    notFound();
  }
}
