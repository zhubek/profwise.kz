import { notFound } from 'next/navigation';
import { getProfessionEducation } from '@/lib/api/mock/professions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
} from 'lucide-react';
import { getLocalizedText } from '@/lib/utils/i18n';

interface EducationPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const educationLevelLabels: Record<string, string> = {
  'high-school': 'High School Diploma',
  'associate': 'Associate Degree',
  'bachelor': "Bachelor's Degree",
  'master': "Master's Degree",
  'doctorate': 'Doctorate/PhD',
  'certificate': 'Professional Certificate',
  'bootcamp': 'Coding Bootcamp',
};

export default async function EducationPage({ params }: EducationPageProps) {
  const { id, locale } = await params;

  try {
    const education = await getProfessionEducation(id);

    return (
      <div className="space-y-6">
        {/* Education Requirements Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education Requirements
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Typical education requirements for entering this profession
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Minimum Education Level</h4>
              <Badge variant="default" className="text-base px-4 py-2">
                {educationLevelLabels[education.minimumEducation] || education.minimumEducation}
              </Badge>
            </div>

            {education.preferredFields && education.preferredFields.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Preferred Fields of Study</h4>
                <div className="flex flex-wrap gap-2">
                  {education.preferredFields.map((field, index) => (
                    <Badge key={index} variant="secondary">
                      {getLocalizedText(field, locale)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Courses */}
        {education.recommendedCourses && (
          <div className="space-y-4">
            {/* Core Courses */}
            {education.recommendedCourses.core && education.recommendedCourses.core.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Core Courses
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Essential foundational courses typically required for this field
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {education.recommendedCourses.core.map((course, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{getLocalizedText(course, locale)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Elective Courses */}
            {education.recommendedCourses.elective && education.recommendedCourses.elective.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Elective Courses
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Specialized courses to enhance your skills and knowledge
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {education.recommendedCourses.elective.map((course, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                        <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{getLocalizedText(course, locale)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Certifications */}
        {education.certifications && education.certifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Professional Certifications
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Industry-recognized certifications that can boost your career prospects
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {education.certifications.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm font-medium">{getLocalizedText(cert, locale)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Paths */}
        {education.learningPaths && education.learningPaths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Paths
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Structured pathways to help you enter and progress in this profession
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {education.learningPaths.map((path) => (
                  <div key={path.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{getLocalizedText(path.title, locale)}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{getLocalizedText(path.description, locale)}</p>
                      </div>
                      <Badge variant="outline" className="ml-4 flex-shrink-0">
                        {path.duration}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Steps:</h4>
                      <div className="space-y-2">
                        {path.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm text-muted-foreground pt-0.5">{getLocalizedText(step, locale)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Transition Advice */}
        <Card>
          <CardHeader>
            <CardTitle>Career Transition Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  For Career Changers
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Start with online courses to build foundational knowledge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Consider bootcamps for intensive, practical training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Network with professionals already in the field</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Build a portfolio showcasing your projects and skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Look for entry-level positions or internships to gain experience</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  For Students
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Choose relevant specializations and concentrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Participate in internships and co-op programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Join student organizations and professional clubs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Work on personal projects to build practical skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Attend career fairs and networking events</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h4 className="font-medium text-blue-900 mb-3">Getting Started Tips</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Research different educational paths to find what fits your situation best</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Consider online courses for flexible learning while working</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Connect with professionals on LinkedIn for mentorship and advice</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Stay updated with industry trends and emerging technologies</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching profession education:', error);
    notFound();
  }
}
