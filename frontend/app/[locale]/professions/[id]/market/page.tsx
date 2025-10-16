import { notFound } from 'next/navigation';
import { getProfessionLaborMarket, getProfessionSalary } from '@/lib/api/mock/professions';
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

interface MarketPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const demandLevelColors: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low Demand' },
  moderate: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Moderate Demand' },
  high: { bg: 'bg-green-100', text: 'text-green-800', label: 'High Demand' },
  'very-high': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Very High Demand' },
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
              Labor Market Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Current market conditions and outlook for this profession
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Market Demand</span>
                  <div className="mt-2">
                    <Badge className={`${demandInfo.bg} ${demandInfo.text} px-3 py-1`}>
                      {demandInfo.label}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Job Growth</span>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-green-700">{laborMarket.jobGrowth}</span>
                    <span className="text-sm text-muted-foreground">over next 5 years</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Annual Job Openings
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span className="text-xl font-bold">
                      {laborMarket.annualOpenings.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">positions per year</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                  <p className="mt-2 text-sm">
                    {new Date(laborMarket.updatedAt).toLocaleDateString()}
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
              Salary Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Typical salary ranges by experience level in {salary.currency}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Entry Level */}
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900 mb-2">Entry Level</div>
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {formatSalary((salary.entryLevel.min + salary.entryLevel.max) / 2, salary.currency)}
                </div>
                <div className="text-xs text-green-700">
                  {formatSalary(salary.entryLevel.min, salary.currency)} -{' '}
                  {formatSalary(salary.entryLevel.max, salary.currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">0-2 years experience</div>
              </div>

              {/* Mid Career */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">Mid Career</div>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {formatSalary((salary.midCareer.min + salary.midCareer.max) / 2, salary.currency)}
                </div>
                <div className="text-xs text-blue-700">
                  {formatSalary(salary.midCareer.min, salary.currency)} -{' '}
                  {formatSalary(salary.midCareer.max, salary.currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">3-7 years experience</div>
              </div>

              {/* Senior Level */}
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900 mb-2">Senior Level</div>
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {formatSalary((salary.seniorLevel.min + salary.seniorLevel.max) / 2, salary.currency)}
                </div>
                <div className="text-xs text-purple-700">
                  {formatSalary(salary.seniorLevel.min, salary.currency)} -{' '}
                  {formatSalary(salary.seniorLevel.max, salary.currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-2">8+ years experience</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Salaries vary based on experience, location, company size, and
                specific skills. These ranges represent typical compensation in the current market.
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
                Industry Sectors
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Key industries actively hiring for this profession
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
                Geographic Hotspots
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Cities and regions with high demand for this profession
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
                      <div className="text-xs text-muted-foreground">High job availability</div>
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
              Job Search Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Application Strategy
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Tailor your resume and cover letter for each application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Highlight relevant projects and quantifiable achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Prepare thoroughly for technical and behavioral interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Network actively on LinkedIn and professional forums</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Follow up with recruiters and hiring managers</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Career Development
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Build a strong portfolio showcasing your best work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Stay updated with latest industry trends and technologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Pursue relevant certifications and advanced training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Seek mentorship from experienced professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Contribute to open-source projects or community initiatives</span>
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
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  With {laborMarket.jobGrowth} projected growth, this profession shows strong career
                  prospects
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Approximately {laborMarket.annualOpenings.toLocaleString()} new positions open
                  annually, indicating healthy job availability
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Geographic mobility can significantly impact earning potential - consider relocating
                  to high-demand areas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Salary growth is typically strong with experience - senior professionals can earn 3-4x
                  entry-level compensation
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
