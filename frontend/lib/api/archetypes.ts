const USE_MOCK = true;

import * as mockAPI from './mock/archetypes';
import api from './client';
import type { Archetype, UserArchetypeProfile, UserArchetypeScore } from '@/types/archetype';
import type { APIResponse } from '@/types/api';

export async function getArchetypes(): Promise<Archetype[]> {
  if (USE_MOCK) {
    return mockAPI.getArchetypes();
  }
  const response = await api.get<APIResponse<Archetype[]>>('/archetypes');
  return response.data;
}

export async function getArchetype(id: string): Promise<Archetype> {
  if (USE_MOCK) {
    return mockAPI.getArchetype(id);
  }
  const response = await api.get<APIResponse<Archetype>>(`/archetypes/${id}`);
  return response.data;
}

export async function getUserArchetypeProfile(userId: string): Promise<UserArchetypeProfile> {
  if (USE_MOCK) {
    return mockAPI.getUserArchetypeProfile(userId);
  }
  const response = await api.get<APIResponse<UserArchetypeProfile>>(`/users/${userId}/archetype-profile`);
  return response.data;
}

export async function getArchetypesByCategory(category: string): Promise<UserArchetypeScore[]> {
  if (USE_MOCK) {
    return mockAPI.getArchetypesByCategory(category);
  }
  const response = await api.get<APIResponse<UserArchetypeScore[]>>(`/archetypes/category/${category}`);
  return response.data;
}
