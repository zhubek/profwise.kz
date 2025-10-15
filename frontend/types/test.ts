export type TestType = 'riasec' | 'values' | 'skills' | 'personality' | 'career';
export type TestStatus = 'not_started' | 'in_progress' | 'completed';
export type QuestionType = 'likert' | 'multiple_choice' | 'single_choice' | 'text';

export interface Test {
  id: string;
  title: string;
  description: string;
  type: TestType;
  duration: number; // in minutes
  totalQuestions: number;
  totalSections: number;
  available?: boolean; // Whether the test is available to take
  createdAt: string;
  updatedAt: string;
}

export interface TestSection {
  id: string;
  testId: string;
  title: string;
  description: string;
  order: number;
  questions: Question[];
}

export interface Question {
  id: string;
  sectionId: string;
  text: string;
  type: QuestionType;
  order: number;
  required: boolean;
  options?: QuestionOption[];
  archetypeCategory?: string; // interests, skills, personality, values
  archetypeCode?: string; // For RIASEC: R, I, A, S, E, C
}

export interface QuestionOption {
  id: string;
  text: string;
  value: number | string;
  order: number;
}

export interface UserTest {
  id: string;
  userId: string;
  testId: string;
  status: TestStatus;
  progress: number; // 0-100
  currentSection?: number;
  startedAt?: string;
  completedAt?: string;
  results?: TestResults;
}

export interface TestResults {
  id: string;
  userTestId: string;
  testId: string;
  userId: string;
  archetypeScores: ArchetypeScores;
  riasecScores?: RIASECScores;
  matchedProfessions?: string[]; // profession IDs
  generatedAt: string;
}

export interface ArchetypeScores {
  interests?: Record<string, number>;
  skills?: Record<string, number>;
  personality?: Record<string, number>;
  values?: Record<string, number>;
  abilities?: Record<string, number>;
}

export interface RIASECScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface TestAnswer {
  questionId: string;
  answer: string | number | string[];
}

export interface SectionAnswers {
  sectionId: string;
  answers: TestAnswer[];
}

// DTOs
export interface StartTestDTO {
  testId: string;
}

export interface SubmitSectionDTO {
  userTestId: string;
  sectionId: string;
  answers: TestAnswer[];
}

export interface CompleteTestDTO {
  userTestId: string;
  finalAnswers?: SectionAnswers[];
}

export interface SaveProgressDTO {
  userTestId: string;
  currentSection: number;
  answers: SectionAnswers[];
}

// LocalStorage types for test state management
export interface HollandTestState {
  testId: string;
  userId: string;
  currentSectionIndex: number;
  answers: Record<string, number | string | string[]>;
  startedAt: string;
  lastUpdated: string;
}

export interface TestStorageKey {
  holland: 'profwise_holland_test';
}

export type RIASECCategory = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
