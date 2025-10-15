export type UserRole = 'student' | 'organization_admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  organizationId?: string;
  classroomId?: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
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
  licenseCode?: string;
  classroomId?: string;
}

export interface UpdateUserDTO {
  name?: string;
  avatar?: string;
  classroomId?: string;
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
  token: string;
  refreshToken?: string;
}

export interface LicenseCodeDTO {
  code: string;
}
