// Multilingual text type
export interface MultilingualText {
  en: string;
  ru: string;
  kk: string;
}

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

export interface Category {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  createdAt: string;
}

export interface Profession {
  id: string;
  name: MultilingualText;  // Backend uses 'name' not 'title'
  description: MultilingualText;
  code: string;
  categoryId: string;
  category?: Category;  // Backend returns category object
  featured?: boolean;  // Backend uses 'featured' not 'popular'
  general?: any;  // JSON field from backend
  descriptionData?: any;  // JSON field from backend
  archetypes?: any;  // JSON field from backend
  education?: any;  // JSON field from backend
  marketResearch?: any;  // JSON field from backend
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfessionDetails extends Profession {
  overview: MultilingualText;
  keyResponsibilities: MultilingualText[];
  requiredSkills: MultilingualText[];
  workEnvironment: MultilingualText;
  typicalTasks: MultilingualText[];
  toolsAndTechnologies?: MultilingualText[];
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
  // Category can be either a Category object or a plain string (backward compatibility)
  category?: Category | string;
}

export interface ProfessionLaborMarket {
  professionId: string;
  demandLevel: DemandLevel;
  jobGrowth: string; // e.g., "+15%"
  annualOpenings: number;
  industrySectors: MultilingualText[];
  geographicHotspots: MultilingualText[];
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

export interface College {
  name: string;
  type: string;
  duration: string;
  specializations: string[];
}

export interface University {
  name: string;
  type: string;
  entPoints: string;
  scholarships: boolean;
  specializations: string[];
  subjects: string[];
}

export interface UNTPointsData {
  year: 2023 | 2024 | 2025;
  grantType: 'general' | 'aul'; // aul = rural/regional grants
  minPoints: number;
  maxPoints?: number;
  grantCount?: number;
}

export interface UniversityWithUNT {
  name: string;
  type: string;
  scholarships: boolean;
  untPoints: UNTPointsData[];
}

export interface Specialization {
  name: MultilingualText;
  code: string;
  description: MultilingualText;
  subjects: MultilingualText;
  groupName: MultilingualText;
  universities: UniversityWithUNT[];
}

export interface Course {
  name: string;
  platform: string;
  duration: string;
  cost: string;
  skills: string[];
}

export interface ProfessionEducation {
  professionId: string;
  minimumEducation: EducationLevel;
  preferredFields: MultilingualText[];
  recommendedCourses: {
    core: MultilingualText[];
    elective: MultilingualText[];
  };
  certifications: MultilingualText[];
  learningPaths: LearningPath[];
  colleges?: College[];
  universities?: University[];
  specializations?: Specialization[]; // New: for accordion view
  courses?: Course[];
}

export interface LearningPath {
  id: string;
  title: MultilingualText; // e.g., "Entry Level Path"
  description: MultilingualText;
  duration: string; // e.g., "2-4 years"
  steps: MultilingualText[];
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
