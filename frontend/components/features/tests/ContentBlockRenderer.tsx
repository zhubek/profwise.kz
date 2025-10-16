import type { ContentBlockUnion } from '@/types/quiz-content';
import OverviewBlock from './OverviewBlock';
import RiasecGridBlock from './RiasecGridBlock';
import NumberedStepsBlock from './NumberedStepsBlock';
import BulletListBlock from './BulletListBlock';
import RichTextBlock from './RichTextBlock';

interface ContentBlockRendererProps {
  blocks: ContentBlockUnion[];
  locale: string;
}

export default function ContentBlockRenderer({ blocks, locale }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'overview':
            return <OverviewBlock key={block.id} block={block} locale={locale} />;

          case 'riasec_grid':
            return <RiasecGridBlock key={block.id} block={block} locale={locale} />;

          case 'numbered_steps':
            return <NumberedStepsBlock key={block.id} block={block} locale={locale} />;

          case 'bullet_list':
            return <BulletListBlock key={block.id} block={block} locale={locale} />;

          case 'rich_text':
            return <RichTextBlock key={block.id} block={block} locale={locale} />;

          default:
            console.warn('Unknown content block type:', (block as any).type);
            return null;
        }
      })}
    </div>
  );
}
