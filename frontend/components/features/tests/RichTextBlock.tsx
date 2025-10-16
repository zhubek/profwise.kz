import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RichTextBlock as RichTextBlockType } from '@/types/quiz-content';

interface RichTextBlockProps {
  block: RichTextBlockType;
  locale: string;
}

export default function RichTextBlock({ block, locale }: RichTextBlockProps) {
  const title = block.title
    ? typeof block.title === 'string' ? block.title : block.title[locale as 'en' | 'ru' | 'kz'] || block.title.en
    : null;
  const content = typeof block.content === 'string' ? block.content : block.content[locale as 'en' | 'ru' | 'kz'] || block.content.en;

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
