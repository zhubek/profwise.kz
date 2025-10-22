import { notFound } from 'next/navigation';
import { getProfessionDetails } from '@/lib/api/professions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Briefcase, Wrench } from 'lucide-react';
import { getLocalizedText } from '@/lib/utils/i18n';
import { getTranslations } from 'next-intl/server';

// Enable Cloudflare caching - cache for 24 hours
export const revalidate = 86400;
export const dynamicParams = true;

interface DescriptionPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function DescriptionPage({ params }: DescriptionPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations('professions.detail.description');

  try {
    const profession = await getProfessionDetails(id);

    return (
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{t('overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {getLocalizedText(profession.overview || profession.description, locale)}
            </p>
          </CardContent>
        </Card>

        {/* Key Responsibilities */}
        {profession.keyResponsibilities && profession.keyResponsibilities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {t('keyResponsibilities')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('responsibilitiesDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profession.keyResponsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{getLocalizedText(responsibility, locale)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Typical Tasks */}
        {profession.typicalTasks && profession.typicalTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('typicalTasks')}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('tasksDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profession.typicalTasks.map((task, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span className="text-sm text-muted-foreground">{getLocalizedText(task, locale)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tools & Technologies */}
        {profession.toolsAndTechnologies && profession.toolsAndTechnologies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                {t('toolsAndTech')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('toolsDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profession.toolsAndTechnologies.map((tool, index) => (
                  <Badge key={index} variant="secondary">
                    {getLocalizedText(tool, locale)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Required Skills */}
        {profession.requiredSkills && profession.requiredSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('essentialSkills')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profession.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {getLocalizedText(skill, locale)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Work Environment */}
        {profession.workEnvironment && (
          <Card>
            <CardHeader>
              <CardTitle>{t('workEnvironment')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {getLocalizedText(profession.workEnvironment, locale)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching profession details:', error);
    notFound();
  }
}
