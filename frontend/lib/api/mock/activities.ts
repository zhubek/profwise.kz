import type { Activity, RecentActivity } from '@/types/activity';

export const mockActivities: RecentActivity[] = [
  {
    id: 'act-1',
    userId: '1',
    type: 'test_completed',
    title: 'Completed RIASEC Interest Test',
    description: 'Scored 85% on Investigative archetype',
    metadata: {
      testId: 'test-1',
      testName: 'RIASEC Interest Inventory',
      score: 85,
    },
    icon: '✅',
    color: 'text-green-600',
    createdAt: '2024-10-12T10:18:00Z',
  },
  {
    id: 'act-2',
    userId: '1',
    type: 'profession_matched',
    title: 'New profession match',
    description: 'Software Developer - 92% match',
    metadata: {
      professionId: 'prof-1',
      professionName: 'Software Developer',
      matchScore: 92,
    },
    icon: '🎯',
    color: 'text-blue-600',
    createdAt: '2024-10-12T10:20:00Z',
  },
  {
    id: 'act-3',
    userId: '1',
    type: 'test_completed',
    title: 'Completed Work Values Assessment',
    description: 'Achievement and Independence are your top values',
    metadata: {
      testId: 'test-2',
      testName: 'Work Values Assessment',
    },
    icon: '✅',
    color: 'text-green-600',
    createdAt: '2024-10-05T14:12:00Z',
  },
  {
    id: 'act-4',
    userId: '1',
    type: 'profile_updated',
    title: 'Updated profile',
    description: 'Changed avatar and personal information',
    icon: '👤',
    color: 'text-purple-600',
    createdAt: '2024-10-03T09:30:00Z',
  },
  {
    id: 'act-5',
    userId: '1',
    type: 'test_started',
    title: 'Started Skills Inventory',
    description: 'Currently 60% complete',
    metadata: {
      testId: 'test-3',
      testName: 'Skills Inventory',
    },
    icon: '📝',
    color: 'text-yellow-600',
    createdAt: '2024-10-12T09:00:00Z',
  },
  {
    id: 'act-6',
    userId: '1',
    type: 'license_activated',
    title: 'License code activated',
    description: 'Successfully joined organization',
    icon: '🔑',
    color: 'text-indigo-600',
    createdAt: '2024-09-25T15:00:00Z',
  },
];

export async function getRecentActivities(userId: string, limit: number = 10): Promise<RecentActivity[]> {
  return mockActivities.slice(0, limit);
}

export async function getUserActivities(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ activities: Activity[]; total: number }> {
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    activities: mockActivities.slice(start, end),
    total: mockActivities.length,
  };
}
