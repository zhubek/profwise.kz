const USE_MOCK = true;

import * as mockAPI from './mock/tests';
import api from './client';
import type { Test, UserTest, TestResults } from '@/types/test';
import type { APIResponse } from '@/types/api';

export async function getTests(): Promise<Test[]> {
  if (USE_MOCK) {
    return mockAPI.getTests();
  }
  const response = await api.get<APIResponse<Test[]>>('/tests');
  return response.data;
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
