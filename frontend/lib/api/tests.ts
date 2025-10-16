const USE_MOCK = true;

import * as mockAPI from './mock/tests';
import api from './client';
import type { Test, UserTest, TestResults, TestType } from '@/types/test';
import type { APIResponse } from '@/types/api';

// Backend quiz response interface
interface BackendQuiz {
  id: string;
  quizName: {
    en: string;
    ru: string;
    kz: string;
  };
  quizType: string;
  isFree: boolean;
  description: {
    en: string;
    ru: string;
    kz: string;
  } | null;
  parameters: {
    duration?: number;
    problemsCount?: number;
    [key: string]: any;
  } | null;
  instructionsContent?: any; // Dynamic content blocks for instructions
  isActive: boolean;
  startDate: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
    results: number;
  };
  source?: 'public' | 'license';
  licenseInfo?: {
    licenseCode: string;
    expireDate: string;
    organizationName: string;
    activationDate: string;
  };
}

// Map backend quiz type to frontend test type
function mapQuizTypeToTestType(quizType: string): TestType {
  const typeMap: Record<string, TestType> = {
    'HOLAND': 'riasec',
    'PERSONALITY': 'personality',
    'CAREER': 'career',
    'APTITUDE': 'skills',
    'KNOWLEDGE': 'values',
  };
  return typeMap[quizType] || 'career';
}

// Transform backend quiz to frontend test
function transformQuizToTest(quiz: BackendQuiz, locale: string = 'en'): Test {
  const localeKey = locale as 'en' | 'ru' | 'kz';

  // Get duration and question count from parameters, fallback to calculated values
  const duration = quiz.parameters?.duration || Math.ceil(quiz._count.questions / 4);
  const totalQuestions = quiz.parameters?.problemsCount || quiz._count.questions;

  // Check if quiz is available (active and either public or from license)
  const isAvailableNow = quiz.isActive && (quiz.source === 'license' || quiz.isPublic);

  return {
    id: quiz.id,
    title: quiz.quizName[localeKey] || quiz.quizName.en,
    description: quiz.description?.[localeKey] || quiz.description?.en || '',
    type: mapQuizTypeToTestType(quiz.quizType),
    duration,
    totalQuestions,
    totalSections: Math.ceil(totalQuestions / 10), // Estimate 10 questions per section
    available: isAvailableNow,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    source: quiz.source,
    isActive: quiz.isActive,
    startDate: quiz.startDate,
    licenseInfo: quiz.licenseInfo,
    instructionsContent: quiz.instructionsContent,
  };
}

export async function getTests(): Promise<Test[]> {
  if (USE_MOCK) {
    return mockAPI.getTests();
  }
  const response = await api.get<APIResponse<Test[]>>('/tests');
  return response.data;
}

// New function to get user-specific quizzes from real API
export async function getUserQuizzes(userId: string, locale: string = 'en'): Promise<Test[]> {
  const response = await api.get<BackendQuiz[]>(`/quizzes/user/${userId}`);
  return response.map(quiz => transformQuizToTest(quiz, locale));
}

export async function getTest(id: string): Promise<Test> {
  if (USE_MOCK) {
    return mockAPI.getTest(id);
  }
  const response = await api.get<APIResponse<Test>>(`/tests/${id}`);
  return response.data;
}

export async function getUserTests(userId: string): Promise<UserTest[]> {
  if (USE_MOCK) {
    return mockAPI.getUserTests(userId);
  }
  const response = await api.get<APIResponse<UserTest[]>>(`/users/${userId}/tests`);
  return response.data;
}

export async function getUserTest(id: string): Promise<UserTest> {
  if (USE_MOCK) {
    return mockAPI.getUserTest(id);
  }
  const response = await api.get<APIResponse<UserTest>>(`/user-tests/${id}`);
  return response.data;
}

export async function startTest(testId: string, userId: string): Promise<UserTest> {
  if (USE_MOCK) {
    return mockAPI.startTest(testId, userId);
  }
  const response = await api.post<APIResponse<UserTest>>('/user-tests/start', { testId });
  return response.data;
}

export async function getTestResults(userTestId: string): Promise<TestResults | null> {
  if (USE_MOCK) {
    return mockAPI.getTestResults(userTestId);
  }
  const response = await api.get<APIResponse<TestResults>>(`/user-tests/${userTestId}/results`);
  return response.data;
}

// Fetch quiz instructions
interface QuizInstructionsResponse {
  quizId: string;
  instructionsContent: any;
}

export async function getQuizInstructions(quizId: string): Promise<QuizInstructionsResponse> {
  const response = await api.get<QuizInstructionsResponse>(`/quizzes/${quizId}/instructions`);
  return response;
}

// Backend question response interface
interface BackendQuestion {
  id: string;
  quizId: string;
  questionText: {
    en: string;
    ru: string;
    kk: string;
  };
  answers: {
    options: Array<{
      en: string;
      ru: string;
      kk: string;
    }>;
  };
  parameters: {
    archetype?: string;
    weight?: number;
    [key: string]: any;
  } | null;
  questionType: string; // MULTIPLE_CHOICE, SINGLE_CHOICE, TRUE_FALSE, SCALE, LIKERT, TEXT
  createdAt: string;
}

// Map backend question type to frontend question type
function mapQuestionType(backendType: string): QuestionType {
  const typeMap: Record<string, QuestionType> = {
    'LIKERT': 'likert',
    'MULTIPLE_CHOICE': 'multiple_choice',
    'SINGLE_CHOICE': 'single_choice',
    'TEXT': 'text',
    'SCALE': 'likert', // Treat SCALE as likert
  };
  return typeMap[backendType] || 'single_choice';
}

// Transform backend question to frontend question
function transformBackendQuestion(question: BackendQuestion, locale: string = 'en'): Question {
  const localeKey = locale as 'en' | 'ru' | 'kk';

  // Transform options
  const options: QuestionOption[] = question.answers.options.map((option, index) => ({
    id: `${question.id}-option-${index}`,
    text: {
      en: option.en,
      ru: option.ru,
      kz: option.kk,
    },
    value: index + 1, // Use 1-5 for likert scales, 1-n for other types
    order: index,
  }));

  return {
    id: question.id,
    sectionId: question.quizId, // Use quizId as sectionId for now
    text: {
      en: question.questionText.en,
      ru: question.questionText.ru,
      kz: question.questionText.kk,
    },
    type: mapQuestionType(question.questionType),
    order: 0, // Will be set by order in array
    required: true,
    options,
    archetypeCode: question.parameters?.archetype,
  };
}

// Fetch quiz with all questions
interface QuizWithQuestions extends BackendQuiz {
  questions: BackendQuestion[];
}

export async function getQuizWithQuestions(quizId: string, locale: string = 'en'): Promise<{ quiz: Test; questions: Question[] }> {
  // Fetch quiz details
  const quizResponse = await api.get<QuizWithQuestions>(`/quizzes/${quizId}`);

  // Fetch all questions for this quiz
  const questionsResponse = await api.get<BackendQuestion[]>(`/questions?quizId=${quizId}`);

  // Transform quiz to test
  const quiz = transformQuizToTest(quizResponse, locale);

  // Transform questions
  const questions = questionsResponse.map((q, index) => ({
    ...transformBackendQuestion(q, locale),
    order: index,
  }));

  return { quiz, questions };
}

// Submit quiz result to backend
interface SubmitResultRequest {
  userId: string;
  quizId: string;
  answers: Record<string, number | string | string[]>;
  results: Record<string, number>;
}

interface SubmitResultResponse {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, any>;
  results: Record<string, number>;
  createdAt: string;
}

export async function submitQuizResult(data: SubmitResultRequest): Promise<SubmitResultResponse> {
  const response = await api.post<SubmitResultResponse>('/results', data);
  return response;
}
