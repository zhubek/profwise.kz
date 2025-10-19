import api from './client';
import type { TestResultListItem } from '@/types/test';

// Backend result response interface
interface BackendResult {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, any>;
  results: {
    scores?: Record<string, number>; // RIASEC scores like {R: 15, I: 12, A: 8, S: 10, E: 14, C: 11}
    hollandCode?: string;
    primaryInterest?: string;
    secondaryInterest?: string;
    topProfessions?: Array<any>;
    description?: string;
    // Or legacy format:
    [key: string]: any;
  };
  createdAt: string;
  quiz?: {
    id: string;
    quizName: {
      en: string;
      ru: string;
      kz: string;
    };
    quizType: string;
  };
}

// Map quiz type to test type
function mapQuizTypeToTestType(quizType: string): TestResultListItem['testType'] {
  const typeMap: Record<string, TestResultListItem['testType']> = {
    'HOLAND': 'riasec',
    'PERSONALITY': 'personality',
    'CAREER': 'career',
    'APTITUDE': 'skills',
    'KNOWLEDGE': 'values',
  };
  return typeMap[quizType] || 'career';
}

// Calculate Holland code from RIASEC scores (fallback for legacy data)
function calculateHollandCode(scores: Record<string, number>): string {
  // Sort RIASEC scores by value (descending)
  const sortedScores = Object.entries(scores)
    .filter(([key]) => ['R', 'I', 'A', 'S', 'E', 'C'].includes(key))
    .sort((a, b) => b[1] - a[1]);

  // Take top 3 letters
  return sortedScores.slice(0, 3).map(([key]) => key).join('');
}

// Get primary interest name from code
function getPrimaryInterestName(code: string): string {
  const names: Record<string, string> = {
    'R': 'Realistic',
    'I': 'Investigative',
    'A': 'Artistic',
    'S': 'Social',
    'E': 'Enterprising',
    'C': 'Conventional',
  };
  return names[code] || code;
}

// Transform backend result to frontend TestResultListItem
function transformBackendResult(result: BackendResult, locale: string = 'en'): TestResultListItem {
  const localeKey = locale as 'en' | 'ru' | 'kz';

  // Check if results field already has hollandCode and primaryInterest (new format)
  let hollandCode: string;
  let primaryInterest: string;

  if (result.results.hollandCode && result.results.primaryInterest) {
    // Use stored values from new format
    hollandCode = result.results.hollandCode;
    primaryInterest = result.results.primaryInterest;
  } else {
    // Calculate from scores (legacy format or fallback)
    const scores = result.results.scores || result.results;
    hollandCode = calculateHollandCode(scores);
    const primaryInterestCode = hollandCode.charAt(0);
    primaryInterest = getPrimaryInterestName(primaryInterestCode);
  }

  return {
    id: result.id,
    testId: result.quizId,
    testName: result.quiz?.quizName?.[localeKey] || result.quiz?.quizName?.en || 'Test',
    testType: result.quiz ? mapQuizTypeToTestType(result.quiz.quizType) : 'career',
    completedAt: result.createdAt,
    hollandCode,
    primaryInterest,
  };
}

// Get user's test results
export async function getUserResults(userId: string, locale: string = 'en'): Promise<TestResultListItem[]> {
  const results = await api.get<BackendResult[]>(`/results?userId=${userId}`);

  // Transform and sort by completion date (newest first)
  return results
    .map(result => transformBackendResult(result, locale))
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}

// Get specific result by ID (with full details)
export async function getResultById(resultId: string) {
  const result = await api.get<BackendResult>(`/results/${resultId}`);

  // Transform to the format expected by results page
  return {
    id: result.id,
    userTestId: result.id, // Use result ID as userTestId
    scores: result.results.scores || {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    },
    primaryInterest: result.results.primaryInterest || 'Unknown',
    secondaryInterest: result.results.secondaryInterest || 'Unknown',
    hollandCode: result.results.hollandCode || 'XXX',
    description: result.results.description || '',
    topProfessions: (result.results.topProfessions || []).map((prof: any) => ({
      id: prof.professionId,
      // Backend now returns professionName and professionDescription as proper JSON objects with en, ru, kz keys
      title: prof.professionName || {
        en: 'Unknown Profession',
        ru: 'Неизвестная профессия',
        kz: 'Белгісіз мамандық',
      },
      description: prof.professionDescription || {
        en: 'Career description',
        ru: 'Описание профессии',
        kz: 'Мамандық сипаттамасы',
      },
      icon: prof.icon || undefined,
      code: prof.professionCode,
      matchScore: prof.matchScore,
      category: prof.category || 'General', // Default category
    })),
    generatedAt: result.createdAt,
  };
}
