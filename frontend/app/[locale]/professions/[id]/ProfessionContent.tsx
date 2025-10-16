'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getLocalizedText } from '@/lib/utils/i18n';
import type { ProfessionDetails } from '@/types/profession';

interface ProfessionContentProps {
  profession: ProfessionDetails;
  locale: string;
}

const categoryTranslations: Record<string, string> = {
  technology: 'Технологии',
  business: 'Бизнес',
  healthcare: 'Здравоохранение',
  science: 'Наука',
  design: 'Дизайн',
  communication: 'Коммуникация',
  education: 'Образование',
  arts: 'Искусство',
  other: 'Другое',
};

export default function ProfessionContent({ profession, locale }: ProfessionContentProps) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/professions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к профессиям
          </Button>
        </Link>
      </div>

      {/* Key Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ключевая информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Категория:
                </span>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {categoryTranslations[profession.category] || profession.category}
                  </Badge>
                </div>
              </div>
              {profession.popular && (
                <div>
                  <Badge variant="default">Популярная профессия</Badge>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Создано:
                </span>
                <p className="mt-1 text-sm">
                  {new Date(profession.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Обновлено:
                </span>
                <p className="mt-1 text-sm">
                  {new Date(profession.updatedAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Обзор</CardTitle>
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
            <CardTitle>Основные обязанности</CardTitle>
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
            <CardTitle>Необходимые навыки</CardTitle>
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
            <CardTitle>Рабочая среда</CardTitle>
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
            <CardTitle>Типичные ежедневные задачи</CardTitle>
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
            <CardTitle>Инструменты и технологии</CardTitle>
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
          Сохранить профессию
        </Button>
        <Button className="w-full sm:w-auto">
          Посмотреть похожие профессии
        </Button>
      </div>
    </div>
  );
}
