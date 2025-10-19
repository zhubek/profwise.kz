'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  Building2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ProfessionEducation } from '@/types/profession';
import UNTPointsChart from './UNTPointsChart';

interface EducationContentProps {
  education: ProfessionEducation;
  locale: string;
}

export default function EducationContent({ education, locale }: EducationContentProps) {
  const t = useTranslations('professions.detail.education');
  return (
    <div className="space-y-6">
      <Tabs defaultValue="universities" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="colleges" disabled>
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('tabColleges')}</span>
            <span className="sm:hidden">{t('tabCollegesMobile')}</span>
            {education.colleges && education.colleges.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {education.colleges.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="universities">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('tabUniversities')}</span>
            <span className="sm:hidden">{t('tabUniversitiesMobile')}</span>
            {education.specializations && education.specializations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {education.specializations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="courses" disabled>
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('tabCourses')}</span>
            <span className="sm:hidden">{t('tabCourses')}</span>
            {education.courses && education.courses.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {education.courses.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Colleges Tab */}
        <TabsContent value="colleges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('collegesTitle')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('collegesDesc')}
              </p>
            </CardHeader>
            <CardContent>
              {education.colleges && education.colleges.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {education.colleges.map((college, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{college.name}</h3>
                            <Badge variant="outline" className="mt-1">
                              {college.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{college.duration}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium mb-2">{t('availableSpecs')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {college.specializations.map((spec, specIndex) => (
                              <Badge key={specIndex} variant="secondary">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <strong>{t('focus')}</strong> {t('focusDesc')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t('collegesComingSoon')}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Universities Tab */}
        <TabsContent value="universities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('specializationsTitle')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('specializationsDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {t('untSystemTitle')}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t('untSystemDesc')}
                </p>
              </div>

              {education.specializations && education.specializations.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {education.specializations.map((spec, index) => (
                    <AccordionItem key={index} value={`spec-${index}`} className="border rounded-lg mb-3 px-2">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-left flex-1 pr-4">
                          <div className="flex-1">
                            <div className="font-semibold text-base">
                              {spec.name[locale as 'en' | 'ru' | "kz"] || spec.name.en}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {spec.description[locale as 'en' | 'ru' | "kz"] || spec.description.en}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {spec.code}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Building2 className="w-3 h-3 mr-1" />
                              {spec.universities.length} {spec.universities.length === 1 ? t('university') : t('universities')}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-6">
                        <div className="space-y-4">
                          {/* Specialization Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">{t('groupName')}</div>
                              <div className="font-medium">
                                {spec.groupName[locale as 'en' | 'ru' | "kz"] || spec.groupName.en}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">{t('requiredSubjects')}</div>
                              <div className="font-medium">
                                {spec.subjects[locale as 'en' | 'ru' | "kz"] || spec.subjects.en}
                              </div>
                            </div>
                          </div>

                          {/* Universities offering this specialization */}
                          <div>
                            <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
                              {t('universitiesOffering')}
                            </h4>
                            <div className="space-y-4">
                              {spec.universities.map((university, uniIndex) => (
                                <Card key={uniIndex} className="border-l-4 border-l-blue-500">
                                  <CardContent className="p-4">
                                    <div className="flex flex-col gap-4">
                                      {/* University Header */}
                                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="flex-1">
                                          <h3 className="font-semibold text-base mb-2">{university.name}</h3>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline">{university.type}</Badge>
                                            {university.scholarships && (
                                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                <Star className="w-3 h-3 mr-1" />
                                                {t('scholarships')}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* UNT Points Visualization */}
                                      {university.untPoints && university.untPoints.length > 0 && (
                                        <div className="mt-2">
                                          <UNTPointsChart
                                            untPoints={university.untPoints}
                                            universityName={university.name}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t('specializationsComingSoon')}
                </p>
              )}

              {education.specializations && education.specializations.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    💡 {t('untTipsTitle')}
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <li>• {t('untTip1')}</li>
                    <li>• {t('untTip2')}</li>
                    <li>• {t('untTip3')}</li>
                    <li>• {t('untTip4')}</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('coursesTitle')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('coursesDesc')}
              </p>
            </CardHeader>
            <CardContent>
              {education.courses && education.courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {education.courses.map((course, index) => (
                    <Card key={index} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{course.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline">{course.platform}</Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                {course.cost}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium mb-2">{t('skillsYouWillLearn')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {course.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{t('certificateCompletion')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <span>{t('selfPacedLearning')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t('coursesComingSoon')}
                </p>
              )}

              {education.courses && education.courses.length > 0 && (
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                    🚀 {t('gettingStartedTitle')}
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <li>• {t('gettingStartedTip1')}</li>
                    <li>• {t('gettingStartedTip2')}</li>
                    <li>• {t('gettingStartedTip3')}</li>
                    <li>• {t('gettingStartedTip4')}</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Career Transition Advice */}
      <Card>
        <CardHeader>
          <CardTitle>{t('careerTransitionTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('forCareerChangers')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('changeTip1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('changeTip2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('changeTip3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('changeTip4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('changeTip5')}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {t('forStudents')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('studentTip1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('studentTip2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('studentTip3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('studentTip4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('studentTip5')}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
            {t('tipsTitle')}
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{t('tip1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{t('tip2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{t('tip3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{t('tip4')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
