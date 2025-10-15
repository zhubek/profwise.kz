export type ProfessionCategory =
  | 'technology'
  | 'business'
  | 'healthcare'
  | 'science'
  | 'design'
  | 'communication'
  | 'education'
  | 'arts'
  | 'other';

export type EducationLevel =
  | 'high_school'
  | 'associate'
  | 'bachelor'
  | 'master'
  | 'doctorate'
  | 'certification';

export type DemandLevel = 'low' | 'medium' | 'high' | 'very_high';

export interface Profession {
  id: string;
  title: string;
  description: string;
  category: ProfessionCategory;
  icon?: string;
  popular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionDetails extends Profession {
  overview: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  workEnvironment: string;
  typicalTasks: string[];
  toolsAndTechnologies?: string[];
}

export interface ProfessionMatch extends Profession {
  matchScore: number; // 0-100
  matchBreakdown: {
    interests: number;
    skills: number;
    personality: number;
    values: number;
  };
  isLiked?: boolean;
}

export interface ProfessionLaborMarket {
  professionId: string;
  demandLevel: DemandLevel;
  jobGrowth: string; // e.g., "+15%"
  annualOpenings: number;
  industrySectors: string[];
  geographicHotspots: string[];
  updatedAt: string;
}

export interface ProfessionSalary {
  professionId: string;
  currency: string; // e.g., "USD", "KZT"
  entryLevel: {
    min: number;
    max: number;
  };
  midCareer: {
    min: number;
    max: number;
  };
  seniorLevel: {
    min: number;
    max: number;
  };
  updatedAt: string;
}

export interface ProfessionEducation {
  professionId: string;
  minimumEducation: EducationLevel;
  preferredFields: string[];
  recommendedCourses: {
    core: string[];
    elective: string[];
  };
  certifications: string[];
  learningPaths: LearningPath[];
}

export interface LearningPath {
  id: string;
  title: string; // e.g., "Entry Level Path"
  description: string;
  duration: string; // e.g., "2-4 years"
  steps: string[];
}

export interface ProfessionArchetypes {
  professionId: string;
  riasecCodes: string[]; // e.g., ["I", "A", "R"]
  primaryArchetypes: {
    interests: string[];
    skills: string[];
    personality: string[];
    values: string[];
  };
  archetypeScores: {
    interests: Record<string, number>;
    skills: Record<string, number>;
    personality: Record<string, number>;
    values: Record<string, number>;
  };
}

// DTOs
export interface ProfessionFilters {
  category?: ProfessionCategory;
  minMatchScore?: number;
  popular?: boolean;
  search?: string;
}

export interface LikeProfessionDTO {
  professionId: string;
  isLiked: boolean;
}

export interface ProfessionQueryParams extends ProfessionFilters {
  sortBy?: 'matchScore' | 'title' | 'popularity';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
