const USE_MOCK = true;

import * as mockAPI from './mock/activities';
import api from './client';
import type { RecentActivity, Activity } from '@/types/activity';
import type { APIResponse } from '@/types/api';

export async function getRecentActivities(userId: string, limit: number = 10): Promise<RecentActivity[]> {
  if (USE_MOCK) {
    return mockAPI.getRecentActivities(userId, limit);
  }
  const response = await api.get<APIResponse<RecentActivity[]>>(`/users/${userId}/activities/recent`, { limit });
  return response.data;
}

export async function getUserActivities(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ activities: Activity[]; total: number }> {
  if (USE_MOCK) {
    return mockAPI.getUserActivities(userId, page, limit);
  }
  const response = await api.get<APIResponse<{ activities: Activity[]; total: number }>>(
    `/users/${userId}/activities`,
    { page, limit }
  );
  return response.data;
}
