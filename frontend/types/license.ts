export interface License {
  id: string;
  name: string;
  licenseCode: string;
  startDate: string;
  expireDate: string;
  isExpired?: boolean;
  isActive?: boolean;
  licenseClassId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  licenseClass?: LicenseClass;
  organization?: Organization;
  _count?: {
    userLicenses: number;
  };
}

export interface LicenseClass {
  id: string;
  name: string;
  description?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  region?: {
    name: Record<string, string>;
  };
}

export type OrganizationType = 'SCHOOL' | 'UNIVERSITY' | 'COMPANY' | 'OTHER';

export interface UserLicense {
  id: string;
  userId: string;
  licenseId: string;
  createdAt: string;
  license: License;
  availableQuizzes?: Quiz[];
}

export interface Quiz {
  id: string;
  quizName: Record<string, string>;
  quizType: string;
  isFree: boolean;
  description?: Record<string, string>;
  _count?: {
    questions: number;
    results: number;
  };
}

export interface ActivateLicenseDTO {
  userId: string;
  licenseCode: string;
}

export interface ActivateLicenseResponse {
  message: string;
  userLicense: UserLicense;
  availableQuizzes: Quiz[];
}

export interface ValidateLicenseResponse {
  valid: boolean;
  license?: License;
}

export interface LicenseQuizzesResponse {
  licenseId: string;
  licenseName: string;
  licenseClass: string;
  quizzes: Quiz[];
}
