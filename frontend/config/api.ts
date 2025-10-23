// Get the appropriate base URL based on environment
// Server-side (SSR): Use internal Docker network URL
// Client-side: Use public URL
export const getBaseURL = (): string => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Server-side: use internal Docker network or local backend
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  } else {
    // Client-side: use public URL
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
};

export const API_CONFIG = {
  get baseURL() {
    return getBaseURL();
  },
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenPrefix: 'Bearer',
};
