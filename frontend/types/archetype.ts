export type ArchetypeCategory = 'interests' | 'skills' | 'personality' | 'values' | 'abilities';

export type RIASECCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Archetype {
  id: string;
  code: string; // e.g., "R" for Realistic
  name: string;
  category: ArchetypeCategory;
  description: string;
  icon?: string;
  keyTraits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserArchetypeScore {
  archetypeId: string;
  archetype: Archetype;
  score: number; // 0-100
  percentile?: number; // 0-100, compared to other users
}

export interface UserArchetypeProfile {
  userId: string;
  interests: UserArchetypeScore[];
  skills: UserArchetypeScore[];
  personality: UserArchetypeScore[];
  values: UserArchetypeScore[];
  abilities: UserArchetypeScore[];
  riasecProfile?: RIASECProfile;
  lastUpdated: string;
  testsCompleted: {
    interests: boolean;
    skills: boolean;
    personality: boolean;
    values: boolean;
  };
}

export interface RIASECProfile {
  realistic: UserArchetypeScore;
  investigative: UserArchetypeScore;
  artistic: UserArchetypeScore;
  social: UserArchetypeScore;
  enterprising: UserArchetypeScore;
  conventional: UserArchetypeScore;
  hollandCode: string; // e.g., "IAE" (top 3 codes)
}

export interface ArchetypeMatchedProfessions {
  archetypeId: string;
  professions: {
    id: string;
    title: string;
    matchScore: number;
  }[];
}

// For displaying archetype details with user's score
export interface ArchetypeWithScore extends Archetype {
  userScore: number;
  userPercentile?: number;
  matchedProfessionsCount: number;
}
