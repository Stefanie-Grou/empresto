function getApiBaseUrl(): string {
  const env = (import.meta as any).env || {};
  let url = (env.VITE_API_URL as string | undefined)?.trim();

  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    if (!url || !url.includes('.')) {
      return 'https://empresto-backend.onrender.com/api/v1';
    }
  }

  if (!url) {
    return 'http://localhost:8080/api/v1';
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (!url.includes('.') && !url.includes('localhost')) {
      url = `${url}.onrender.com`;
    }
    url = `https://${url}`;
  }

  const clean = url.replace(/\/+$/, '');
  return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
}

export const API_BASE_URL = getApiBaseUrl();

export const ENDPOINTS = {
  LOANS: `${API_BASE_URL}/emprestimos`,
  INVENTORY: `${API_BASE_URL}/acervo`,
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  AUTH: `${API_BASE_URL}/auth`,
};

export const DASHBOARD_ENDPOINTS = {
  SUMMARY: `${API_BASE_URL}/dashboard/resumo`,
};
