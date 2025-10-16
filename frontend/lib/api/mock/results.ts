import { RIASECResultDisplay, TestResultListItem } from '@/types/test';
import { mockProfessionMatches } from './professions';

// Mock RIASEC test results
export const mockRIASECResults: Record<string, RIASECResultDisplay> = {
  'result-1': {
    id: 'result-1',
    userTestId: 'test-1',
    scores: {
      R: 7,
      I: 9,
      A: 5,
      S: 7,
      E: 5,
      C: 6,
    },
    primaryInterest: 'Investigative',
    secondaryInterest: 'Realistic',
    hollandCode: 'IRS',
    description:
      'Your results show a strong preference for investigative work involving research, analysis, and problem-solving. You also show interest in realistic, hands-on activities and social interactions. This suggests you would thrive in careers that combine intellectual curiosity with practical application and helping others.',
    // Use top 20 profession matches from mock data
    topProfessions: mockProfessionMatches.slice(0, 20),
    generatedAt: '2024-10-01T10:30:00Z',
  },
  'result-2': {
    id: 'result-2',
    userTestId: 'test-2',
    scores: {
      R: 6,
      I: 8,
      A: 6,
      S: 8,
      E: 4,
      C: 5,
    },
    primaryInterest: 'Social',
    secondaryInterest: 'Investigative',
    hollandCode: 'SIA',
    description:
      'You have strong social and investigative interests. You enjoy helping others and working collaboratively, while also valuing research and analytical thinking. Careers in education, counseling, or healthcare research would be ideal matches.',
    topProfessions: mockProfessionMatches.slice(5, 25),
    generatedAt: '2024-09-15T14:20:00Z',
  },
  'result-3': {
    id: 'result-3',
    userTestId: 'test-3',
    scores: {
      R: 8,
      I: 7,
      A: 4,
      S: 6,
      E: 6,
      C: 5,
    },
    primaryInterest: 'Realistic',
    secondaryInterest: 'Investigative',
    hollandCode: 'RIE',
    description:
      'Your profile shows strong realistic and investigative traits. You excel at hands-on problem-solving and technical work. Engineering, technology, and applied sciences are excellent career paths for you.',
    topProfessions: mockProfessionMatches.slice(2, 22),
    generatedAt: '2024-08-20T09:45:00Z',
  },
};

// Mock test result list for a user
export const mockUserTestResults: TestResultListItem[] = [
  {
    id: 'result-1',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-10-01T10:30:00Z',
    hollandCode: 'IRS',
    primaryInterest: 'Investigative',
  },
  {
    id: 'result-2',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-09-15T14:20:00Z',
    hollandCode: 'SIA',
    primaryInterest: 'Social',
  },
  {
    id: 'result-3',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-08-20T09:45:00Z',
    hollandCode: 'RIE',
    primaryInterest: 'Realistic',
  },
  {
    id: 'result-4',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-07-10T11:15:00Z',
    hollandCode: 'IAR',
    primaryInterest: 'Investigative',
  },
  {
    id: 'result-5',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-06-05T16:45:00Z',
    hollandCode: 'ASE',
    primaryInterest: 'Artistic',
  },
  {
    id: 'result-6',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-05-18T13:30:00Z',
    hollandCode: 'SEC',
    primaryInterest: 'Social',
  },
  {
    id: 'result-7',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-04-22T10:00:00Z',
    hollandCode: 'ECS',
    primaryInterest: 'Enterprising',
  },
  {
    id: 'result-8',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-03-30T15:20:00Z',
    hollandCode: 'CRI',
    primaryInterest: 'Conventional',
  },
  {
    id: 'result-9',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-02-14T09:10:00Z',
    hollandCode: 'RIS',
    primaryInterest: 'Realistic',
  },
  {
    id: 'result-10',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2024-01-28T14:55:00Z',
    hollandCode: 'SAI',
    primaryInterest: 'Social',
  },
  {
    id: 'result-11',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-12-15T11:40:00Z',
    hollandCode: 'AIE',
    primaryInterest: 'Artistic',
  },
  {
    id: 'result-12',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-11-20T16:25:00Z',
    hollandCode: 'IRA',
    primaryInterest: 'Investigative',
  },
  {
    id: 'result-13',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-10-05T13:15:00Z',
    hollandCode: 'ESC',
    primaryInterest: 'Enterprising',
  },
  {
    id: 'result-14',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-09-18T10:50:00Z',
    hollandCode: 'CSE',
    primaryInterest: 'Conventional',
  },
  {
    id: 'result-15',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-08-25T15:35:00Z',
    hollandCode: 'RCI',
    primaryInterest: 'Realistic',
  },
  {
    id: 'result-16',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-07-12T12:20:00Z',
    hollandCode: 'SIR',
    primaryInterest: 'Social',
  },
  {
    id: 'result-17',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-06-08T09:40:00Z',
    hollandCode: 'ARS',
    primaryInterest: 'Artistic',
  },
  {
    id: 'result-18',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-05-20T14:10:00Z',
    hollandCode: 'IES',
    primaryInterest: 'Investigative',
  },
  {
    id: 'result-19',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-04-15T11:30:00Z',
    hollandCode: 'EAS',
    primaryInterest: 'Enterprising',
  },
  {
    id: 'result-20',
    testId: 'test-1',
    testName: 'Holland Test (RIASEC)',
    testType: 'riasec',
    completedAt: '2023-03-10T16:00:00Z',
    hollandCode: 'CAR',
    primaryInterest: 'Conventional',
  },
];

// API functions for test results
export async function getTestResult(
  resultId: string
): Promise<RIASECResultDisplay> {
  const result = mockRIASECResults[resultId];
  if (!result) {
    throw new Error('Result not found');
  }

  return result;
}

export async function getTestResultByUserTestId(
  userTestId: string
): Promise<RIASECResultDisplay | null> {
  const result = Object.values(mockRIASECResults).find(
    (r) => r.userTestId === userTestId
  );

  return result || null;
}

// Get user's test results list
export async function getUserTestResults(
  userId: string
): Promise<TestResultListItem[]> {
  // In a real app, this would filter by userId
  // For now, return all mock results sorted by completion date (newest first)
  return mockUserTestResults.sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
}
