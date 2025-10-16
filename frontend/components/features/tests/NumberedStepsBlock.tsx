import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NumberedStepsBlock as NumberedStepsBlockType } from '@/types/quiz-content';

interface NumberedStepsBlockProps {
  block: NumberedStepsBlockType;
  locale: string;
}

export default function NumberedStepsBlock({ block, locale }: NumberedStepsBlockProps) {
  const title = typeof block.title === 'string' ? block.title : block.title[locale as 'en' | 'ru' | 'kz'] || block.title.en;
  const description = block.description
    ? typeof block.description === 'string' ? block.description : block.description[locale as 'en' | 'ru' | 'kz'] || block.description.en
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {description && <p className="text-muted-foreground mb-4">{description}</p>}
        <ol className="space-y-3">
          {block.steps.map((step) => {
            const stepTitle = typeof step.title === 'string' ? step.title : step.title[locale as 'en' | 'ru' | 'kz'] || step.title.en;
            const stepDescription = typeof step.description === 'string' ? step.description : step.description[locale as 'en' | 'ru' | 'kz'] || step.description.en;

            return (
              <li key={step.number} className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                  {step.number}
                </span>
                <div className="flex-1 pt-0.5">
                  {stepTitle && <p className="font-medium mb-0.5">{stepTitle}</p>}
                  <p className="text-muted-foreground">{stepDescription}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
