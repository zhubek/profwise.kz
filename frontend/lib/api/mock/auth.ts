import type {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  User,
  LicenseCodeDTO
} from '@/types/user';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@test.com',
    name: 'Айдын',
    surname: 'Нұрланов',
    schoolId: 'school-1',
    grade: '10',
    age: 16,
    language: 'RU',
    role: 'student',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    email: 'admin@test.com',
    name: 'Алия',
    surname: 'Сарсенова',
    schoolId: 'school-1',
    language: 'RU',
    role: 'organization_admin',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
];

// Mock passwords (email:password)
const mockPasswords: Record<string, string> = {
  'student@test.com': 'password123',
  'admin@test.com': 'admin123',
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock JWT token generation
const generateMockToken = (userId: string): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

/**
 * Mock register function
 */
export async function register(data: RegisterDTO): Promise<AuthResponse> {
  await delay(800);

  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const newUser: User = {
    id: `user-${mockUsers.length + 1}`,
    email: data.email,
    name: data.name,
    surname: data.surname,
    schoolId: data.schoolId,
    grade: data.grade,
    age: data.age,
    language: data.language || 'RU',
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to mock database
  mockUsers.push(newUser);
  mockPasswords[data.email] = data.password;

  // Generate tokens
  const token = generateMockToken(newUser.id);
  const refreshToken = `mock-refresh-token-${newUser.id}-${Date.now()}`;

  return {
    user: newUser,
    token,
    refreshToken,
  };
}

/**
 * Mock login function
 */
export async function login(data: LoginDTO): Promise<AuthResponse> {
  await delay(600);

  // Find user
  const user = mockUsers.find(u => u.email === data.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const expectedPassword = mockPasswords[data.email];
  if (data.password !== expectedPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const token = generateMockToken(user.id);
  const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

  return {
    user,
    token,
    refreshToken,
  };
}

/**
 * Mock getCurrentUser function
 */
export async function getCurrentUser(token: string): Promise<User> {
  await delay(300);

  // Extract user ID from mock token
  const match = token.match(/mock-jwt-token-(\d+)-/);
  if (!match) {
    throw new Error('Invalid token');
  }

  const userId = match[1];
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Mock verifyEmail function
 */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  await delay(500);

  // Mock email verification
  return {
    message: 'Email verified successfully',
  };
}

/**
 * Mock addLicenseCode function
 */
export async function addLicenseCode(data: LicenseCodeDTO): Promise<{ message: string; success: boolean }> {
  await delay(600);

  // Mock valid license codes
  const validCodes = ['LIC-2024-SCHOOL1', 'LIC-2024-SCHOOL2', 'LIC-2024-DEMO'];

  if (validCodes.includes(data.code)) {
    return {
      message: 'License code added successfully',
      success: true,
    };
  }

  throw new Error('Invalid license code');
}

// Export mock users for testing
export { mockUsers, mockPasswords };
