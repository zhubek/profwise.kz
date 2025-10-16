export type UserRole = 'student' | 'organization_admin' | 'super_admin';
export type UserLanguage = 'EN' | 'RU' | 'KZ';

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  schoolId?: string;
  grade?: string;
  age?: number;
  language?: UserLanguage;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
  avatar?: string;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  testsTaken: number;
  testsCompleted: number;
  professionsExplored: number;
  joinedDate: string;
}

// DTOs
export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  surname: string;
  language?: UserLanguage;
  schoolId?: string;
  grade?: string;
  age?: number;
}

export interface UpdateUserDTO {
  name?: string;
  surname?: string;
  schoolId?: string;
  grade?: string;
  age?: number;
  avatar?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth types
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO extends CreateUserDTO {}

export interface AuthResponse {
  user: User;
  accessToken: string;
  token?: string;
  refreshToken?: string;
  message?: string;
}

export interface LicenseCodeDTO {
  code: string;
}
