import { notFound } from 'next/navigation';
import { getProfessionArchetypes } from '@/lib/api/mock/professions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Brain,
  Palette,
  Users,
  TrendingUp,
  FileText,
  Lightbulb,
  Target,
  Heart
} from 'lucide-react';

interface ArchetypesPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const riasecInfo = {
  realistic: {
    name: 'Realistic',
    icon: User,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    description: 'Practical, hands-on work with tools, machines, and outdoor activities',
  },
  investigative: {
    name: 'Investigative',
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    description: 'Analytical work, research, and problem-solving with data',
  },
  artistic: {
    name: 'Artistic',
    icon: Palette,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    description: 'Creative work, self-expression, and aesthetic activities',
  },
  social: {
    name: 'Social',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    description: 'Helping others, teaching, and collaborative work',
  },
  enterprising: {
    name: 'Enterprising',
    icon: TrendingUp,
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    description: 'Leadership, persuasion, and business-oriented activities',
  },
  conventional: {
    name: 'Conventional',
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500',
    description: 'Organized work with data, records, and established procedures',
  },
};

const getArchetypeColor = (level: number) => {
  if (level >= 80) return 'bg-green-500';
  if (level >= 60) return 'bg-blue-500';
  if (level >= 40) return 'bg-yellow-500';
  return 'bg-gray-400';
};

export default async function ArchetypesPage({ params }: ArchetypesPageProps) {
  const { id } = await params;

  try {
    const archetypes = await getProfessionArchetypes(id);

    // Convert interest scores to sorted array
    const interestScores = Object.entries(archetypes.archetypeScores.interests)
      .map(([key, value]) => ({
        key: key as keyof typeof riasecInfo,
        value,
        info: riasecInfo[key as keyof typeof riasecInfo],
      }))
      .sort((a, b) => b.value - a.value);

    const topTwoInterests = interestScores.slice(0, 2);

    return (
      <div className="space-y-6">
        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Career Interest Profile</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Based on the O*NET Interest Profiler - RIASEC Model
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              This profession aligns with specific interest areas based on the Holland Codes (RIASEC) model.
              Understanding these interests can help you determine if this career matches your preferences
              and working style.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm font-medium">RIASEC Codes:</span>
              {archetypes.riasecCodes.map((code, index) => (
                <Badge key={index} variant="secondary">
                  {code}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* RIASEC Interest Areas */}
        <Card>
          <CardHeader>
            <CardTitle>RIASEC Interest Areas</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Six interest areas describing work activities and environments
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {interestScores.map((item) => {
              const Icon = item.info.icon;
              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getArchetypeColor(item.value)} text-white flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{item.info.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.info.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold">{item.value}%</div>
                      <div className="text-sm text-muted-foreground">Match</div>
                    </div>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* RIASEC Model Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>About RIASEC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(riasecInfo).map(([key, info]) => {
                const Icon = info.icon;
                return (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${info.color}`} />
                      <span className="font-medium">{info.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Career Fit Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Career Fit Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {topTwoInterests.map((item) => (
                <Badge key={item.key} variant="secondary" className="px-3 py-1">
                  {item.info.name} ({item.value}%)
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Why this fits your profile:</h4>
              <ul className="space-y-2 text-muted-foreground">
                {interestScores
                  .filter(item => item.value >= 70)
                  .map((item) => (
                    <li key={item.key} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>
                        High {item.info.name.toLowerCase()} interests match well with {item.info.description.toLowerCase()}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Skills Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Skills Profile
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Key skill areas required for this profession
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(archetypes.archetypeScores.skills).map(([skill, score]) => (
              <div key={skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{skill}</span>
                  <span className="text-sm text-muted-foreground">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Personality Traits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personality Traits
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Big Five personality dimensions that align with this career
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(archetypes.archetypeScores.personality).map(([trait, score]) => (
              <div key={trait} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{trait}</span>
                  <span className="text-sm text-muted-foreground">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Values */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Work Values
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Values that are typically important in this profession
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(archetypes.archetypeScores.values).map(([value, score]) => (
              <div key={value} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{value.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm text-muted-foreground">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Primary Archetypes Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Primary Archetypes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {archetypes.primaryArchetypes.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {archetypes.primaryArchetypes.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Personality</h4>
              <div className="flex flex-wrap gap-2">
                {archetypes.primaryArchetypes.personality.map((trait, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Values</h4>
              <div className="flex flex-wrap gap-2">
                {archetypes.primaryArchetypes.values.map((value, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching profession archetypes:', error);
    notFound();
  }
}
