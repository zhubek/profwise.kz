import api from './client';
import type { Category, CategoryWithProfessions } from '@/types/category';
import type { APIResponse } from '@/types/api';

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories');
  return response;
}

export async function getCategory(id: string): Promise<CategoryWithProfessions> {
  const response = await api.get<CategoryWithProfessions>(`/categories/${id}`);
  return response;
}
