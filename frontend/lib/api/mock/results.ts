import { RIASECResultDisplay } from '@/types/test';
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
};

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
