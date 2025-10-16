// Content block types for dynamic quiz instructions

import { LocalizedText } from './test';

export type ContentBlockType =
  | 'overview'
  | 'riasec_grid'
  | 'numbered_steps'
  | 'bullet_list'
  | 'rich_text';

// Base content block interface
export interface ContentBlock {
  type: ContentBlockType;
  id: string;
}

// Overview section - what the test is about
export interface OverviewBlock extends ContentBlock {
  type: 'overview';
  title: LocalizedText;
  description: LocalizedText;
}

// RIASEC Grid - colored cards for Holland test
export interface RiasecItem {
  code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  title: LocalizedText;
  description: LocalizedText;
  color: string; // Tailwind color class (e.g., 'blue', 'purple', 'yellow')
}

export interface RiasecGridBlock extends ContentBlock {
  type: 'riasec_grid';
  title: LocalizedText;
  description: LocalizedText;
  items: RiasecItem[];
}

// Numbered steps - how it works section
export interface NumberedStep {
  number: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface NumberedStepsBlock extends ContentBlock {
  type: 'numbered_steps';
  title: LocalizedText;
  description?: LocalizedText;
  steps: NumberedStep[];
}

// Bullet list - instructions or what you'll learn
export interface BulletListBlock extends ContentBlock {
  type: 'bullet_list';
  title: LocalizedText;
  description?: LocalizedText;
  items: LocalizedText[];
}

// Rich text - flexible content section
export interface RichTextBlock extends ContentBlock {
  type: 'rich_text';
  title?: LocalizedText;
  content: LocalizedText;
}

// Union type for all blocks
export type ContentBlockUnion =
  | OverviewBlock
  | RiasecGridBlock
  | NumberedStepsBlock
  | BulletListBlock
  | RichTextBlock;

// Main quiz instructions content structure
export interface QuizInstructionsContent {
  blocks: ContentBlockUnion[];
}
