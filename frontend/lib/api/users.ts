import api from './client';
import type {
  User,
  UpdateUserDTO,
} from '@/types/user';

// User endpoints
export async function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

export async function updateUser(id: string, data: UpdateUserDTO): Promise<User> {
  return api.patch<User>(`/users/${id}`, data);
}

export async function changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
  await api.post('/users/change-password', data);
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
