export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://172.26.195.243:4000',
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
