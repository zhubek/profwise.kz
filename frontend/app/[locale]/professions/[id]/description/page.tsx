import { notFound } from 'next/navigation';
import { getProfessionDetails } from '@/lib/api/mock/professions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Briefcase, Wrench } from 'lucide-react';
import { getLocalizedText } from '@/lib/utils/i18n';

interface DescriptionPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function DescriptionPage({ params }: DescriptionPageProps) {
  const { id, locale } = await params;

  try {
    const profession = await getProfessionDetails(id);

    return (
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
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
                Key Responsibilities
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                What you'll be doing in this role on a regular basis
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
              <CardTitle>Typical Daily Tasks</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Common activities you'll perform in this profession
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
                Tools & Technologies
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Software, platforms, and tools commonly used in this profession
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
              <CardTitle>Essential Skills</CardTitle>
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
              <CardTitle>Work Environment</CardTitle>
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
