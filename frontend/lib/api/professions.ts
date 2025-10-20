const USE_MOCK = false;

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
  return await api.get<Profession[]>('/professions');
}

export async function getProfession(id: string): Promise<Profession> {
  if (USE_MOCK) {
    return mockAPI.getProfession(id);
  }
  return await api.get<Profession>(`/professions/${id}`);
}

export async function getProfessionDetails(id: string): Promise<ProfessionDetails> {
  if (USE_MOCK) {
    return mockAPI.getProfessionDetails(id);
  }
  // Backend returns all details from the main endpoint
  const profession = await api.get<Profession>(`/professions/${id}`);

  // Transform backend structure to frontend ProfessionDetails format
  const descData = profession.descriptionData as any || {};

  return {
    ...profession,
    overview: descData.overview || profession.description,
    keyResponsibilities: descData.keyResponsibilities || [],
    requiredSkills: descData.requiredSkills || [],
    workEnvironment: descData.workEnvironment,
    typicalTasks: descData.typicalTasks || [],
    toolsAndTechnologies: descData.toolsAndTechnologies || [],
  } as ProfessionDetails;
}

export async function getMatchedProfessions(userId: string): Promise<ProfessionMatch[]> {
  if (USE_MOCK) {
    return mockAPI.getMatchedProfessions(userId);
  }
  return await api.get<ProfessionMatch[]>(`/users/${userId}/professions`);
}

export async function getProfessionLaborMarket(professionId: string): Promise<ProfessionLaborMarket> {
  if (USE_MOCK) {
    return mockAPI.getProfessionLaborMarket(professionId);
  }
  const profession = await api.get<Profession>(`/professions/${professionId}`);
  const marketData = profession.marketResearch as any || {};

  return {
    professionId,
    demandLevel: marketData.demandLevel || 'medium',
    jobGrowth: marketData.jobGrowth || 'N/A',
    annualOpenings: marketData.annualOpenings || 0,
    industrySectors: marketData.industrySectors || [],
    geographicHotspots: marketData.geographicHotspots || [],
    updatedAt: profession.createdAt || new Date().toISOString(),
  };
}

export async function getProfessionSalary(professionId: string): Promise<ProfessionSalary> {
  if (USE_MOCK) {
    return mockAPI.getProfessionSalary(professionId);
  }
  const profession = await api.get<Profession>(`/professions/${professionId}`);
  const marketData = profession.marketResearch as any || {};
  const salaryRanges = marketData.salaryRanges || {};

  return {
    professionId,
    currency: salaryRanges.entry?.currency || 'KZT',
    entryLevel: {
      min: salaryRanges.entry?.min || 0,
      max: salaryRanges.entry?.max || 0,
    },
    midCareer: {
      min: salaryRanges.mid?.min || 0,
      max: salaryRanges.mid?.max || 0,
    },
    seniorLevel: {
      min: salaryRanges.senior?.min || 0,
      max: salaryRanges.senior?.max || 0,
    },
    updatedAt: profession.createdAt || new Date().toISOString(),
  };
}

export async function getProfessionEducation(professionId: string): Promise<ProfessionEducation> {
  if (USE_MOCK) {
    return mockAPI.getProfessionEducation(professionId);
  }
  const profession = await api.get<Profession>(`/professions/${professionId}`);
  const eduData = profession.education as any || {};

  // Get specializations from education JSON field
  const specializations = (eduData.specializations || []).map((spec: any) => {
    // Transform old UNT format to new format
    const universities = (spec.universities || []).map((uni: any) => {
      const untPoints: any[] = [];

      // Transform old untPoints format to new format
      if (uni.untPoints) {
        uni.untPoints.forEach((yearData: any) => {
          // Add general grant if exists
          if (yearData.generalGrant) {
            untPoints.push({
              year: yearData.year,
              grantType: 'general' as const,
              minPoints: yearData.generalGrant.min,
              maxPoints: yearData.generalGrant.max,
              grantCount: yearData.generalGrant.count,
            });
          }
          // Add aul grant if exists
          if (yearData.aulGrant) {
            untPoints.push({
              year: yearData.year,
              grantType: 'aul' as const,
              minPoints: yearData.aulGrant.min,
              maxPoints: yearData.aulGrant.max,
              grantCount: yearData.aulGrant.count,
            });
          }
        });
      }

      return {
        name: uni.name,
        type: uni.type || 'Public',
        scholarships: uni.scholarships || untPoints.length > 0,
        untPoints,
      };
    });

    return {
      name: spec.name,
      code: spec.code,
      description: spec.description,
      subjects: spec.subjects,
      groupName: spec.groupName,
      universities,
    };
  });

  return {
    professionId,
    minimumEducation: eduData.minimumEducation || 'bachelor',
    preferredFields: eduData.preferredFields || [],
    recommendedCourses: {
      core: [],
      elective: [],
    },
    certifications: eduData.certifications || [],
    learningPaths: eduData.learningPaths || [],
    specializations,
    colleges: eduData.colleges || [],
    universities: eduData.universities || [],
    courses: eduData.courses || [],
  };
}

export async function getProfessionArchetypes(professionId: string): Promise<ProfessionArchetypes> {
  if (USE_MOCK) {
    return mockAPI.getProfessionArchetypes(professionId);
  }
  const profession = await api.get<Profession>(`/professions/${professionId}`);
  const archData = profession.archetypes as any || {};

  return {
    professionId,
    riasecCodes: archData.riasecCodes || [],
    primaryArchetypes: archData.primaryArchetypes || {
      interests: [],
      skills: [],
      personality: [],
      values: [],
    },
    archetypeScores: archData.archetypeScores || {
      interests: {},
      skills: {},
      personality: {},
      values: {},
    },
  };
}

export async function likeProfession(userId: string, professionId: string, isLiked: boolean): Promise<void> {
  if (USE_MOCK) {
    return mockAPI.likeProfession(professionId, isLiked);
  }
  await api.patch(`/users/${userId}/professions/like`, { professionId, isLiked });
}
