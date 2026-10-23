import { isApiConfiguredBase, resetApiBaseCache, resolveApiBase } from './runtimeConfig';

const TOKEN_KEY = 'slatebiz_admin_token';

export type AdminUser = {
  id: string;
  email: string;
  name?: string;
};

export type ApiFetchOptions = RequestInit & {
  skipAuthClear?: boolean;
  timeoutMs?: number;
};

type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

function notifyUnauthorized() {
  unauthorizedListeners.forEach((fn) => fn());
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function buildApiUrl(path: string): Promise<string> {
  const base = await resolveApiBase();
  if (base) return `${base}/api${path}`;
  if (import.meta.env.DEV) return `/api${path}`;
  return `/api${path}`;
}

export async function getApiBase(): Promise<string> {
  return resolveApiBase();
}

export async function checkApiConfigured(): Promise<boolean> {
  const base = await resolveApiBase();
  return isApiConfiguredBase(base);
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const defaultTimeout = import.meta.env.PROD ? 90000 : 8000;
  const { skipAuthClear, timeoutMs = path === '/upload' ? 120000 : defaultTimeout, ...fetchOptions } = options;
  const token = getToken();
  const headers = new Headers(fetchOptions.headers);

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const isFormData = fetchOptions.body instanceof FormData;
  if (!isFormData && fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(await buildApiUrl(path), { ...fetchOptions, headers, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        path === '/upload'
          ? 'Upload timed out. Try a smaller image or check your connection.'
          : import.meta.env.PROD
            ? 'API server not responding. Render may be waking up — wait 30s and try again.'
            : 'API server not responding. Run npm run kill-server then npm run dev.'
      );
    }
    throw new Error(
      import.meta.env.PROD
        ? 'Cannot reach API server. Set VITE_API_URL on Vercel or public/api-config.json.'
        : 'Cannot reach API server. Run npm run dev (both client and server must start).'
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    const message = body.error || 'Request failed';

    if (res.status === 401 && !skipAuthClear) {
      clearToken();
      notifyUnauthorized();
      throw new ApiError('Session expired. Please sign in again.', 401);
    }

    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function wakeApiServer(): Promise<boolean> {
  resetApiBaseCache();
  return checkApiHealth();
}

export async function checkApiHealth(options?: { attempts?: number; timeoutMs?: number }): Promise<boolean> {
  const configured = await checkApiConfigured();
  if (!configured) return false;

  const attempts = options?.attempts ?? (import.meta.env.PROD ? 5 : 1);
  const timeoutMs = options?.timeoutMs ?? (import.meta.env.PROD ? 90000 : 5000);

  for (let i = 0; i < attempts; i += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(await buildApiUrl('/health'), { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
        if (data?.ok) return true;
      }
    } catch {
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
  return false;
}
