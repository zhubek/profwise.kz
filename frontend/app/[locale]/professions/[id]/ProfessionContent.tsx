'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getLocalizedText } from '@/lib/utils/i18n';
import type { ProfessionDetails } from '@/types/profession';

interface ProfessionContentProps {
  profession: ProfessionDetails;
  locale: string;
}

export default function ProfessionContent({ profession, locale }: ProfessionContentProps) {
  const t = useTranslations('professions.detail.overview');
  const tCategory = useTranslations('professions.category');

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/professions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToProfessions')}
          </Button>
        </Link>
      </div>

      {/* Key Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('keyInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  {t('category')}
                </span>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {profession.category ? getLocalizedText(profession.category.name, locale) : 'N/A'}
                  </Badge>
                </div>
              </div>
              {profession.featured && (
                <div>
                  <Badge variant="default">{t('popularProfession')}</Badge>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {profession.createdAt && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('created')}
                  </span>
                  <p className="mt-1 text-sm">
                    {new Date(profession.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>
              )}
              {profession.updatedAt && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('updated')}
                  </span>
                  <p className="mt-1 text-sm">
                    {new Date(profession.updatedAt).toLocaleDateString(locale)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Card */}
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
            <CardTitle>{t('keyResponsibilities')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {profession.keyResponsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{getLocalizedText(responsibility, locale)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Required Skills */}
      {profession.requiredSkills && profession.requiredSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('requiredSkills')}</CardTitle>
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
            <p className="text-muted-foreground">{getLocalizedText(profession.workEnvironment, locale)}</p>
          </CardContent>
        </Card>
      )}

      {/* Typical Tasks */}
      {profession.typicalTasks && profession.typicalTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('typicalTasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {profession.typicalTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span className="text-sm text-muted-foreground">{getLocalizedText(task, locale)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tools and Technologies */}
      {profession.toolsAndTechnologies && profession.toolsAndTechnologies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('toolsAndTechnologies')}</CardTitle>
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <Button variant="outline" className="w-full sm:w-auto">
          <Heart className="w-4 h-4 mr-2" />
          {t('saveProfession')}
        </Button>
        <Button className="w-full sm:w-auto">
          {t('viewSimilarProfessions')}
        </Button>
      </div>
    </div>
  );
}
