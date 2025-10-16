import { api, setAuthToken, setRefreshToken, clearAuthToken } from './client';
import type {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  User,
  LicenseCodeDTO
} from '@/types/user';

/**
 * Register a new user
 * POST /auth/register
 */
export async function register(data: RegisterDTO): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);

  // Store tokens (backend returns accessToken)
  const token = response.accessToken || response.token;
  if (token) {
    setAuthToken(token);
  }
  if (response.refreshToken) {
    setRefreshToken(response.refreshToken);
  }

  return response;
}

/**
 * Login user
 * POST /auth/login
 */
export async function login(data: LoginDTO): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data);

  // Store tokens (backend returns accessToken)
  const token = response.accessToken || response.token;
  if (token) {
    setAuthToken(token);
  }
  if (response.refreshToken) {
    setRefreshToken(response.refreshToken);
  }

  return response;
}

/**
 * Get current user profile
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<User> {
  return api.get<User>('/auth/me');
}

/**
 * Logout user (client-side only)
 * Clears tokens from localStorage
 */
export function logout(): void {
  clearAuthToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Verify email with token
 * GET /auth/verify-email?token={token}
 */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  return api.get<{ message: string }>('/auth/verify-email', { token });
}

/**
 * Add license code to user
 * POST /auth/license
 */
export async function addLicenseCode(data: LicenseCodeDTO): Promise<{ message: string; success: boolean }> {
  return api.post<{ message: string; success: boolean }>('/auth/license', data);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  return !!token;
}
