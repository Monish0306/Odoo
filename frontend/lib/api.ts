const AUTH_TOKEN_KEY = 'authToken';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok && !payload?.data && !payload?.error) {
    return { data: null, error: 'Request failed' };
  }

  return {
    data: payload?.data ?? payload ?? null,
    error: payload?.error ?? null,
  };
}
