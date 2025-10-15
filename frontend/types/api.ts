// Generic API response types
export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface APIError {
  message: string;
  code: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export type QueryParams = PaginationParams & SortParams & FilterParams;
