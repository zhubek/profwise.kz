import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RiasecGridBlock as RiasecGridBlockType } from '@/types/quiz-content';

interface RiasecGridBlockProps {
  block: RiasecGridBlockType;
  locale: string;
}

// Color mappings for RIASEC types
const colorClasses: Record<string, { bg: string; darkBg: string }> = {
  blue: { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-950' },
  purple: { bg: 'bg-purple-50', darkBg: 'dark:bg-purple-950' },
  pink: { bg: 'bg-pink-50', darkBg: 'dark:bg-pink-950' },
  green: { bg: 'bg-green-50', darkBg: 'dark:bg-green-950' },
  orange: { bg: 'bg-orange-50', darkBg: 'dark:bg-orange-950' },
  gray: { bg: 'bg-gray-50', darkBg: 'dark:bg-gray-900' },
  yellow: { bg: 'bg-yellow-50', darkBg: 'dark:bg-yellow-950' },
  red: { bg: 'bg-red-50', darkBg: 'dark:bg-red-950' },
};

export default function RiasecGridBlock({ block, locale }: RiasecGridBlockProps) {
  const title = typeof block.title === 'string' ? block.title : block.title[locale as 'en' | 'ru' | 'kz'] || block.title.en;
  const description = typeof block.description === 'string' ? block.description : block.description[locale as 'en' | 'ru' | 'kz'] || block.description.en;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {block.items.map((item) => {
            const itemTitle = typeof item.title === 'string' ? item.title : item.title[locale as 'en' | 'ru' | 'kz'] || item.title.en;
            const itemDescription = typeof item.description === 'string' ? item.description : item.description[locale as 'en' | 'ru' | 'kz'] || item.description.en;
            const colors = colorClasses[item.color] || colorClasses.gray;

            return (
              <div key={item.code} className={`p-4 rounded-lg ${colors.bg} ${colors.darkBg}`}>
                <h4 className="font-medium mb-1">{item.code} - {itemTitle}</h4>
                <p className="text-sm text-muted-foreground">{itemDescription}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
