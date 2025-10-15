// Toggle between mock and real API
const USE_MOCK = true;

import * as mockAPI from './mock/users';
import api from './client';
import type {
  User,
  UserProfile,
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  UpdateUserDTO,
  ChangePasswordDTO,
} from '@/types/user';
import type { APIResponse } from '@/types/api';

// Auth endpoints
export async function login(credentials: LoginDTO): Promise<AuthResponse> {
  if (USE_MOCK) {
    return mockAPI.login(credentials);
  }
  const response = await api.post<APIResponse<AuthResponse>>('/auth/login', credentials);
  return response.data;
}

export async function register(data: RegisterDTO): Promise<AuthResponse> {
  if (USE_MOCK) {
    return mockAPI.register(data);
  }
  const response = await api.post<APIResponse<AuthResponse>>('/auth/register', data);
  return response.data;
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    return Promise.resolve();
  }
  await api.post('/auth/logout');
}

// User endpoints
export async function getCurrentUser(): Promise<User> {
  if (USE_MOCK) {
    return mockAPI.getCurrentUser();
  }
  const response = await api.get<APIResponse<User>>('/users/me');
  return response.data;
}

export async function getUserProfile(id: string): Promise<UserProfile> {
  if (USE_MOCK) {
    return mockAPI.getUserProfile(id);
  }
  const response = await api.get<APIResponse<UserProfile>>(`/users/${id}/profile`);
  return response.data;
}

export async function updateUser(id: string, data: UpdateUserDTO): Promise<User> {
  if (USE_MOCK) {
    return mockAPI.updateUser(id, data);
  }
  const response = await api.patch<APIResponse<User>>(`/users/${id}`, data);
  return response.data;
}

export async function changePassword(data: ChangePasswordDTO): Promise<void> {
  if (USE_MOCK) {
    return Promise.resolve();
  }
  await api.post('/users/change-password', data);
}

export async function deleteUser(id: string): Promise<void> {
  if (USE_MOCK) {
    return mockAPI.deleteUser(id);
  }
  await api.delete(`/users/${id}`);
}
