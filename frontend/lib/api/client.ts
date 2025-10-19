import { API_CONFIG, AUTH_CONFIG } from '@/config/api';
import type { APIError } from '@/types/api';

// Custom API Error class
export class APIErrorClass extends Error implements APIError {
  code: string;
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Token management
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_CONFIG.tokenKey);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_CONFIG.tokenKey, token);
};

export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem(AUTH_CONFIG.refreshTokenKey);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_CONFIG.refreshTokenKey);
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_CONFIG.refreshTokenKey, token);
};

// Request interceptor
const getHeaders = (customHeaders?: HeadersInit): HeadersInit => {
  const headers: HeadersInit = {
    ...API_CONFIG.headers,
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] =
      `${AUTH_CONFIG.tokenPrefix} ${token}`;
  }

  return headers;
};

// Main fetch wrapper
async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: getHeaders(options?.headers),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 - Unauthorized
    if (response.status === 401) {
      clearAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new APIErrorClass(
        'Unauthorized. Please log in again.',
        'UNAUTHORIZED',
        401
      );
    }

    // Parse response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new APIErrorClass(
        data.message || 'An error occurred',
        data.code || 'UNKNOWN_ERROR',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      throw new APIErrorClass(
        'Network error. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }

    // Handle timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new APIErrorClass(
        'Request timeout. Please try again.',
        'TIMEOUT_ERROR',
        408
      );
    }

    // Re-throw API errors
    if (error instanceof APIErrorClass) {
      throw error;
    }

    // Handle unknown errors
    throw new APIErrorClass(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      500
    );
  }
}

// HTTP methods
export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return fetcher<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  },

  post: <T>(endpoint: string, data?: any): Promise<T> => {
    return fetcher<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: <T>(endpoint: string, data?: any): Promise<T> => {
    return fetcher<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: <T>(endpoint: string, data?: any): Promise<T> => {
    return fetcher<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: <T>(endpoint: string): Promise<T> => {
    return fetcher<T>(endpoint, {
      method: 'DELETE',
    });
  },
};

// Export for convenience
export default api;
