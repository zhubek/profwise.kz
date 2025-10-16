import type { User, UserProfile, CreateUserDTO, UpdateUserDTO, AuthResponse, LoginDTO } from '@/types/user';
import type { UserLicenseInfo } from '@/types/organization';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@profwise.kz',
    name: 'Aidar',
    surname: 'Nurlan',
    schoolId: 'school-157',
    grade: '10A',
    age: 16,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aidar',
    role: 'student',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'admin@school.kz',
    name: 'Assel',
    surname: 'Temirbek',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Assel',
    role: 'organization_admin',
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
];

export async function login(credentials: LoginDTO): Promise<AuthResponse> {
  const user = mockUsers.find(u => u.email === credentials.email);

  if (!user || credentials.password !== 'password123') {
    throw new Error('Invalid credentials');
  }

  return {
    user,
    token: 'mock-jwt-token-' + user.id,
    refreshToken: 'mock-refresh-token-' + user.id,
  };
}

export async function register(data: CreateUserDTO): Promise<AuthResponse> {
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    surname: data.surname,
    schoolId: data.schoolId,
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  return {
    user: newUser,
    token: 'mock-jwt-token-' + newUser.id,
    refreshToken: 'mock-refresh-token-' + newUser.id,
  };
}

export async function getCurrentUser(): Promise<User> {
  return mockUsers[0];
}

export async function getUserProfile(id: string): Promise<UserProfile> {
  const user = mockUsers.find(u => u.id === id);
  if (!user) throw new Error('User not found');

  return {
    ...user,
    testsTaken: 4,
    testsCompleted: 2,
    professionsExplored: 12,
    joinedDate: user.createdAt,
  };
}

export async function updateUser(id: string, data: UpdateUserDTO): Promise<User> {
  const user = mockUsers.find(u => u.id === id);
  if (!user) throw new Error('User not found');

  const updatedUser = {
    ...user,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const index = mockUsers.findIndex(u => u.id === id);
  mockUsers[index] = updatedUser;

  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');

  mockUsers.splice(index, 1);
}

export async function getUserLicenseInfo(userId: string): Promise<UserLicenseInfo> {
  // Mock license data
  return {
    licenseCode: 'SCH-ALM-2024-A1B2',
    expiresAt: '2025-06-30T23:59:59Z',
    organizationName: 'Almaty Gymnasium #157',
  };
}
