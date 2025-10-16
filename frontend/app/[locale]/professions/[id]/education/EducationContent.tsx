'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
} from 'lucide-react';
import type { ProfessionEducation } from '@/types/profession';

interface EducationContentProps {
  education: ProfessionEducation;
  locale: string;
}

export default function EducationContent({ education, locale }: EducationContentProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="universities" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="colleges" disabled>
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Колледжи</span>
            <span className="sm:hidden">Колледж</span>
            {education.colleges && education.colleges.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {education.colleges.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="universities">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Университеты</span>
            <span className="sm:hidden">Вузы</span>
            {education.universities && education.universities.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {education.universities.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="courses" disabled>
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Курсы</span>
            <span className="sm:hidden">Курсы</span>
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
              <CardTitle>Колледжи и технические училища</CardTitle>
              <p className="text-sm text-muted-foreground">
                Технические колледжи предлагают практическое, прикладное образование,
                ориентированное на конкретные навыки и технологии.
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
                          <h4 className="font-medium mb-2">Доступные специализации:</h4>
                          <div className="flex flex-wrap gap-2">
                            {college.specializations.map((spec, specIndex) => (
                              <Badge key={specIndex} variant="secondary">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <strong>Focus:</strong> Практическая подготовка, партнерство с индустрией,
                          прямое трудоустройство
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Информация о колледжах скоро будет добавлена
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Universities Tab */}
        <TabsContent value="universities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Университеты и высшее образование</CardTitle>
              <p className="text-sm text-muted-foreground">
                Университеты предоставляют комплексное образование с возможностями
                исследований и теоретическими основами.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Система стипендий ЕНТ Казахстана
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Единое Национальное Тестирование (ЕНТ) определяет поступление в университеты.
                  Более высокие баллы ЕНТ дают право на государственные стипендии и престижные программы.
                </p>
              </div>

              {education.universities && education.universities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {education.universities.map((university, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{university.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline">{university.type}</Badge>
                              {university.scholarships && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                  <Star className="w-3 h-3 mr-1" />
                                  Стипендии
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {university.entPoints}
                            </div>
                            <div className="text-sm text-muted-foreground">Баллы ЕНТ</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium mb-2">Доступные специализации:</h4>
                          <div className="flex flex-wrap gap-2">
                            {university.specializations.map((spec, specIndex) => (
                              <Badge key={specIndex} variant="secondary">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <strong>Необходимые предметы:</strong> {university.subjects.join(', ')}
                          </div>
                          <div>
                            <strong>Степень:</strong> Бакалавр (4 года) • <strong>Язык:</strong> Казахский/Русский/Английский
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Информация об университетах скоро будет добавлена
                </p>
              )}

              {education.universities && education.universities.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    💡 Советы по подготовке к ЕНТ
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <li>• Сосредоточьтесь на математике, физике и английском для технических специальностей</li>
                    <li>• Практикуйтесь с прошлыми экзаменами ЕНТ и пробными тестами</li>
                    <li>• Рассмотрите подготовительные курсы для лучших результатов</li>
                    <li>• Более высокие баллы открывают лучшие возможности стипендий</li>
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
              <CardTitle>Онлайн-курсы и сертификаты</CardTitle>
              <p className="text-sm text-muted-foreground">
                Онлайн-курсы предоставляют гибкие возможности обучения для развития
                навыков и карьерного перехода.
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
                          <h4 className="font-medium mb-2">Навыки, которые вы освоите:</h4>
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
                            <span>Сертификат по завершении</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <span>Обучение в своем темпе</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Информация о курсах скоро будет добавлена
                </p>
              )}

              {education.courses && education.courses.length > 0 && (
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                    🚀 Начало работы
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <li>• Начните с основных курсов, если вы новичок в этой области</li>
                    <li>• Выполняйте проекты для создания портфолио</li>
                    <li>• Комбинируйте несколько курсов для комплексного обучения</li>
                    <li>• Ищите специализации и профессиональные сертификаты</li>
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
          <CardTitle>Поддержка карьерного перехода</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                Для смены карьеры
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Начните с онлайн-курсов для построения базовых знаний</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Рассмотрите буткемпы для интенсивной практической подготовки</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Общайтесь с профессионалами, уже работающими в этой области</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Создайте портфолио, демонстрирующее ваши проекты и навыки</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ищите начальные позиции или стажировки для получения опыта</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Для студентов
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Выбирайте соответствующие специализации и концентрации</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Участвуйте в стажировках и кооперативных программах</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Вступайте в студенческие организации и профессиональные клубы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Работайте над личными проектами для развития практических навыков</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Посещайте ярмарки вакансий и сетевые мероприятия</span>
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
            Советы для начала
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Исследуйте различные образовательные пути, чтобы найти наиболее подходящий</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Рассмотрите онлайн-курсы для гибкого обучения во время работы</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Свяжитесь с профессионалами в LinkedIn для наставничества и советов</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Следите за отраслевыми трендами и новыми технологиями</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
