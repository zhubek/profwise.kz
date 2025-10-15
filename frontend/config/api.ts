export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
