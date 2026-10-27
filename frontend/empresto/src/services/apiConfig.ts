const env = (import.meta as any).env || {};
const rawApiUrl = env.VITE_API_URL as string | undefined;

export const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.startsWith('http')
      ? (rawApiUrl.endsWith('/api/v1')
          ? rawApiUrl
          : `${rawApiUrl.replace(/\/$/, '')}/api/v1`)
      : `https://${rawApiUrl.replace(/\/$/, '')}/api/v1`)
  : 'http://localhost:8080/api/v1';

export const ENDPOINTS = {
  LOANS: `${API_BASE_URL}/emprestimos`,
  INVENTORY: `${API_BASE_URL}/acervo`,
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  AUTH: `${API_BASE_URL}/auth`,
};
