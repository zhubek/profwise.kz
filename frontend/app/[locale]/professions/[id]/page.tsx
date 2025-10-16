import { notFound } from 'next/navigation';
import { getProfessionDetails } from '@/lib/api/mock/professions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Wrench, User, Star, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProfessionPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ProfessionPage({ params }: ProfessionPageProps) {
  const { id } = await params;

  try {
    const profession = await getProfessionDetails(id);

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Link href="/professions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Professions
            </Button>
          </Link>
        </div>

        {/* Key Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Key Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Category:
                  </span>
                  <div className="mt-1">
                    <Badge variant="secondary">{profession.category}</Badge>
                  </div>
                </div>
                {profession.popular && (
                  <div>
                    <Badge variant="default">Popular Career</Badge>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Created:
                  </span>
                  <p className="mt-1 text-sm">
                    {new Date(profession.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated:
                  </span>
                  <p className="mt-1 text-sm">
                    {new Date(profession.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {profession.overview || profession.description}
            </p>
          </CardContent>
        </Card>

        {/* Key Responsibilities */}
        {profession.keyResponsibilities && profession.keyResponsibilities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profession.keyResponsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{responsibility}</span>
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
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profession.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
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
              <p className="text-muted-foreground">{profession.workEnvironment}</p>
            </CardContent>
          </Card>
        )}

        {/* Typical Tasks */}
        {profession.typicalTasks && profession.typicalTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Typical Daily Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profession.typicalTasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span className="text-sm text-muted-foreground">{task}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Save Profession
          </Button>
          <Button>
            View Similar Careers
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching profession details:', error);
    notFound();
  }
}
