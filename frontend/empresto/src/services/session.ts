// Sessão do usuário: token e dados ficam em sessionStorage
// (expiram ao fechar a aba). "empresto_saved_user" é a preferência de
// "lembrar usuário" do formulário de login e continua em localStorage.

const TOKEN_KEY = 'empresto_token';
const USER_KEY = 'empresto_usuario';

export interface SessionUser {
  id?: number;
  nome?: string;
  nomeUsuario?: string;
  email?: string;
  perfil?: string;
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return Boolean(token && token.trim());
}

export function getSessionUser(): SessionUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user?: SessionUser) {
  sessionStorage.setItem(TOKEN_KEY, token);
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem('login_success');
  sessionStorage.removeItem('register_success');

  // Restos de versões anteriores que usavam localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('user_token');
}
