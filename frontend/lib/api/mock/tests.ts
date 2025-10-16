import type { Test, UserTest, TestResults, TestStatus } from '@/types/test';

export const mockTests: Test[] = [
  {
    id: 'test-1',
    title: 'Holland Test (RIASEC)',
    description: 'Discover your vocational interests based on the Holland Codes framework',
    type: 'riasec',
    duration: 15,
    totalQuestions: 60,
    totalSections: 6,
    available: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'test-2',
    title: 'Work Values Assessment',
    description: 'Identify what matters most to you in your career',
    type: 'values',
    duration: 10,
    totalQuestions: 40,
    totalSections: 4,
    available: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'test-3',
    title: 'Skills Inventory',
    description: 'Evaluate your current skills and identify areas for growth',
    type: 'skills',
    duration: 12,
    totalQuestions: 50,
    totalSections: 5,
    available: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'test-4',
    title: 'Personality Profile',
    description: 'Understand your personality traits and work style preferences',
    type: 'personality',
    duration: 20,
    totalQuestions: 80,
    totalSections: 5,
    available: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockUserTests: UserTest[] = [
  {
    id: 'ut-1',
    userId: '1',
    testId: 'test-1',
    status: 'completed',
    progress: 100,
    startedAt: '2024-10-01T10:00:00Z',
    completedAt: '2024-10-01T10:18:00Z',
    results: {
      id: 'result-1',
      userTestId: 'ut-1',
      testId: 'test-1',
      userId: '1',
      archetypeScores: {
        interests: {
          realistic: 65,
          investigative: 85,
          artistic: 72,
          social: 58,
          enterprising: 45,
          conventional: 40,
        },
      },
      riasecScores: {
        realistic: 65,
        investigative: 85,
        artistic: 72,
        social: 58,
        enterprising: 45,
        conventional: 40,
      },
      matchedProfessions: ['prof-1', 'prof-2', 'prof-3'],
      generatedAt: '2024-10-01T10:18:00Z',
    },
  },
  {
    id: 'ut-2',
    userId: '1',
    testId: 'test-2',
    status: 'completed',
    progress: 100,
    startedAt: '2024-10-05T14:00:00Z',
    completedAt: '2024-10-05T14:12:00Z',
    results: {
      id: 'result-2',
      userTestId: 'ut-2',
      testId: 'test-2',
      userId: '1',
      archetypeScores: {
        values: {
          achievement: 80,
          independence: 75,
          recognition: 60,
          relationships: 70,
          support: 55,
          workingConditions: 65,
        },
      },
      generatedAt: '2024-10-05T14:12:00Z',
    },
  },
  {
    id: 'ut-3',
    userId: '1',
    testId: 'test-3',
    status: 'in_progress',
    progress: 60,
    currentSection: 3,
    startedAt: '2024-10-12T09:00:00Z',
  },
  {
    id: 'ut-4',
    userId: '1',
    testId: 'test-4',
    status: 'not_started',
    progress: 0,
  },
];

export async function getTests(): Promise<Test[]> {
  return mockTests;
}

export async function getTest(id: string): Promise<Test> {
  const test = mockTests.find(t => t.id === id);
  if (!test) throw new Error('Test not found');
  return test;
}

export async function getUserTests(userId: string): Promise<UserTest[]> {
  return mockUserTests.filter(ut => ut.userId === userId);
}

export async function getUserTest(id: string): Promise<UserTest> {
  const userTest = mockUserTests.find(ut => ut.id === id);
  if (!userTest) throw new Error('User test not found');
  return userTest;
}

export async function startTest(testId: string, userId: string): Promise<UserTest> {
  const test = mockTests.find(t => t.id === testId);
  if (!test) throw new Error('Test not found');

  const newUserTest: UserTest = {
    id: `ut-${Date.now()}`,
    userId,
    testId,
    status: 'in_progress',
    progress: 0,
    currentSection: 1,
    startedAt: new Date().toISOString(),
  };

  mockUserTests.push(newUserTest);
  return newUserTest;
}

export async function getTestResults(userTestId: string): Promise<TestResults | null> {
  const userTest = mockUserTests.find(ut => ut.id === userTestId);
  return userTest?.results || null;
}
