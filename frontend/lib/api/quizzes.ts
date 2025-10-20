import type { Question, TestSection } from '@/types/test';
import { createDynamicSections } from './mock/holland';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://172.26.195.243:4000';

interface DatabaseQuestion {
  id: string;
  quizId: string;
  questionText: Record<string, string>;
  questionType: string;
  answers: {
    options?: Array<Record<string, string>>;
    // New format: object with numeric keys
    [key: string]: any;
  };
  parameters?: Record<string, any>;
}

interface QuizResponse {
  id: string;
  quizName: Record<string, string>;
  quizType: string;
  questions: DatabaseQuestion[];
}

// Transform database question type to frontend question type
function transformQuestion(dbQuestion: DatabaseQuestion, index: number): Question {
  const questionType = dbQuestion.questionType.toLowerCase() as 'likert' | 'multiple_choice' | 'single_choice';

  let options: any[] = [];
  let backendAnswers: Record<string, number> = {};

  // Check if using old array format (Holland questions)
  if (dbQuestion.answers?.options && Array.isArray(dbQuestion.answers.options)) {
    // Old format: options is an array
    options = dbQuestion.answers.options.map((opt, optIndex) => {
      const value = optIndex + 1; // 1-based indexing for option values
      return {
        id: `${dbQuestion.id}-${value}`,
        text: opt,
        value: value,
        order: optIndex + 1,
      };
    });
  } else {
    // New format: answers is an object with numeric keys like {"1": {...}, "2": {...}}
    const numericKeys = Object.keys(dbQuestion.answers).filter(key => !isNaN(Number(key))).sort((a, b) => Number(a) - Number(b));

    options = numericKeys.map((key, index) => {
      const value = Number(key);
      return {
        id: `${dbQuestion.id}-${value}`,
        text: dbQuestion.answers[key],
        value: value,
        order: index + 1,
      };
    });

    // For new format, backendAnswers maps value to value (no transformation needed)
    numericKeys.forEach(key => {
      backendAnswers[key] = Number(key);
    });
  }

  const transformed = {
    id: dbQuestion.id,
    sectionId: '', // Will be set by createDynamicSections
    text: dbQuestion.questionText,
    type: questionType,
    order: index + 1,
    required: true,
    options,
    parameters: dbQuestion.parameters,
    backendAnswers: Object.keys(backendAnswers).length > 0 ? backendAnswers : undefined,
  };

  // Debug logging
  console.log(`Transform Q${index + 1}: ${dbQuestion.id}`);
  console.log(`  Type: ${dbQuestion.questionType} -> ${questionType}`);
  console.log(`  Options: ${options.length}`);
  console.log(`  Backend answers:`, backendAnswers);

  return transformed;
}

/**
 * Fetch quiz questions from backend and create dynamic sections
 * @param quizId - Quiz ID to fetch
 * @param questionsPerSection - Number of questions per section (default: 6)
 */
export async function getQuizSections(
  quizId: string,
  questionsPerSection: number = 6
): Promise<TestSection[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch quiz: ${response.statusText}`);
    }

    const quiz: QuizResponse = await response.json();

    // Transform database questions to frontend format
    const questions = quiz.questions.map((dbQ, index) => transformQuestion(dbQ, index));

    // Create dynamic sections using the helper function
    const sections = createDynamicSections(questions, questionsPerSection);

    return sections;
  } catch (error) {
    console.error('Error fetching quiz sections:', error);
    throw error;
  }
}
