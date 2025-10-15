const USE_MOCK = true;

import * as mockAPI from './mock/professions';
import api from './client';
import type {
  Profession,
  ProfessionMatch,
  ProfessionDetails,
  ProfessionLaborMarket,
  ProfessionSalary,
  ProfessionEducation,
  ProfessionArchetypes,
} from '@/types/profession';
import type { APIResponse } from '@/types/api';

export async function getProfessions(): Promise<Profession[]> {
  if (USE_MOCK) {
    return mockAPI.getProfessions();
  }
  const response = await api.get<APIResponse<Profession[]>>('/professions');
  return response.data;
}

export async function getProfession(id: string): Promise<Profession> {
  if (USE_MOCK) {
    return mockAPI.getProfession(id);
  }
  const response = await api.get<APIResponse<Profession>>(`/professions/${id}`);
  return response.data;
}

export async function getProfessionDetails(id: string): Promise<ProfessionDetails> {
  if (USE_MOCK) {
    return mockAPI.getProfessionDetails(id);
  }
  const response = await api.get<APIResponse<ProfessionDetails>>(`/professions/${id}/details`);
  return response.data;
}

export async function getMatchedProfessions(userId: string): Promise<ProfessionMatch[]> {
  if (USE_MOCK) {
    return mockAPI.getMatchedProfessions(userId);
  }
  const response = await api.get<APIResponse<ProfessionMatch[]>>(`/users/${userId}/matched-professions`);
  return response.data;
}

export async function getProfessionLaborMarket(professionId: string): Promise<ProfessionLaborMarket> {
  if (USE_MOCK) {
    return mockAPI.getProfessionLaborMarket(professionId);
  }
  const response = await api.get<APIResponse<ProfessionLaborMarket>>(`/professions/${professionId}/labor-market`);
  return response.data;
}

export async function getProfessionSalary(professionId: string): Promise<ProfessionSalary> {
  if (USE_MOCK) {
    return mockAPI.getProfessionSalary(professionId);
  }
  const response = await api.get<APIResponse<ProfessionSalary>>(`/professions/${professionId}/salary`);
  return response.data;
}

export async function getProfessionEducation(professionId: string): Promise<ProfessionEducation> {
  if (USE_MOCK) {
    return mockAPI.getProfessionEducation(professionId);
  }
  const response = await api.get<APIResponse<ProfessionEducation>>(`/professions/${professionId}/education`);
  return response.data;
}

export async function getProfessionArchetypes(professionId: string): Promise<ProfessionArchetypes> {
  if (USE_MOCK) {
    return mockAPI.getProfessionArchetypes(professionId);
  }
  const response = await api.get<APIResponse<ProfessionArchetypes>>(`/professions/${professionId}/archetypes`);
  return response.data;
}

export async function likeProfession(professionId: string, isLiked: boolean): Promise<void> {
  if (USE_MOCK) {
    return mockAPI.likeProfession(professionId, isLiked);
  }
  await api.post(`/professions/${professionId}/like`, { isLiked });
}
