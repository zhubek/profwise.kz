export interface Organization {
  id: string;
  name: string;
  type: 'school' | 'university' | 'company' | 'other';
  logo?: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Classroom {
  id: string;
  name: string;
  organizationId: string;
  teacherId?: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseCode {
  id: string;
  code: string;
  organizationId: string;
  classroomId?: string;
  isUsed: boolean;
  usedBy?: string; // userId
  usedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface OrganizationStudent {
  id: string;
  name: string;
  email: string;
  classroomId?: string;
  classroomName?: string;
  testsCompleted: number;
  lastActive: string;
  joinedAt: string;
}

export interface StudentArchetypeResult {
  studentId: string;
  studentName: string;
  interests: Record<string, number>;
  skills: Record<string, number>;
  personality: Record<string, number>;
  values: Record<string, number>;
  topProfessions: string[];
  completedAt: string;
}

export interface AggregatedResults {
  organizationId: string;
  totalStudents: number;
  activeStudents: number;
  averageTestsCompleted: number;
  archetypeDistribution: {
    category: string;
    archetype: string;
    count: number;
    percentage: number;
  }[];
  topProfessions: {
    professionName: string;
    matchCount: number;
  }[];
  classroomComparison: {
    classroomId: string;
    classroomName: string;
    studentCount: number;
    averageProgress: number;
  }[];
}

// DTOs
export interface CreateOrganizationDTO {
  name: string;
  type: 'school' | 'university' | 'company' | 'other';
  logo?: string;
}

export interface UpdateOrganizationDTO {
  name?: string;
  logo?: string;
}

export interface CreateClassroomDTO {
  name: string;
  organizationId: string;
}

export interface GenerateLicenseCodesDTO {
  organizationId: string;
  count: number;
  classroomId?: string;
  expiresAt?: string;
}

export interface JoinClassroomDTO {
  classroomId: string;
}

export interface UserLicenseInfo {
  licenseCode: string;
  expiresAt: string;
  organizationName: string;
}
