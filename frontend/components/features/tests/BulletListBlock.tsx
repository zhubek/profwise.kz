import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BulletListBlock as BulletListBlockType } from '@/types/quiz-content';

interface BulletListBlockProps {
  block: BulletListBlockType;
  locale: string;
}

export default function BulletListBlock({ block, locale }: BulletListBlockProps) {
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
        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
          {block.items.map((item, index) => {
            const itemText = typeof item === 'string' ? item : item[locale as 'en' | 'ru' | 'kz'] || item.en;
            return <li key={index}>{itemText}</li>;
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
