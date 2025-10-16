import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { OverviewBlock as OverviewBlockType } from '@/types/quiz-content';

interface OverviewBlockProps {
  block: OverviewBlockType;
  locale: string;
}

export default function OverviewBlock({ block, locale }: OverviewBlockProps) {
  const title = typeof block.title === 'string' ? block.title : block.title[locale as 'en' | 'ru' | 'kz'] || block.title.en;
  const description = typeof block.description === 'string' ? block.description : block.description[locale as 'en' | 'ru' | 'kz'] || block.description.en;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
