import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  apiFetch,
  clearToken,
  getToken,
  setToken,
  checkApiConfigured,
  getApiBase,
  onUnauthorized,
  wakeApiServer,
  type AdminUser,
} from '../lib/api';

type AuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  apiReady: boolean;
  apiChecking: boolean;
  apiBase: string;
  apiConfigured: boolean;
  refreshApiHealth: () => Promise<boolean>;
  signIn: (email: string, password: string, captcha?: { captchaId: string; captchaAnswer: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiReady, setApiReady] = useState(false);
  const [apiChecking, setApiChecking] = useState(true);
  const [apiBase, setApiBase] = useState('');
  const [apiConfigured, setApiConfigured] = useState(false);

  const refreshApiHealth = useCallback(async () => {
    setApiChecking(true);
    const ok = await wakeApiServer();
    const base = await getApiBase();
    const configured = await checkApiConfigured();
    setApiBase(base);
    setApiConfigured(configured);
    setApiReady(ok && configured);
    setApiChecking(false);
    return ok && configured;
  }, []);

  useEffect(() => {
    const onAdmin = window.location.pathname.startsWith('/admin');
    if (!onAdmin) {
      setLoading(false);
      setApiChecking(false);
      return;
    }
    void refreshApiHealth().then(async (ready) => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      if (!ready) {
        setLoading(false);
        return;
      }
      apiFetch<{ user: AdminUser }>('/auth/me')
        .then(({ user: me }) => setUser(me))
        .catch(() => {
          clearToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    });
  }, [refreshApiHealth]);

  useEffect(() => {
    return onUnauthorized(() => setUser(null));
  }, []);

  const signIn = async (
    email: string,
    password: string,
    captcha?: { captchaId: string; captchaAnswer: string }
  ) => {
    try {
      const { token, user: loggedIn } = await apiFetch<{ token: string; user: AdminUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          captchaId: captcha?.captchaId || '',
          captchaAnswer: captcha?.captchaAnswer || '',
        }),
        skipAuthClear: true,
      });
      setToken(token);
      setUser(loggedIn);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign in failed.' };
    }
  };

  const signOut = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        apiReady,
        apiChecking,
        apiBase,
        apiConfigured,
        refreshApiHealth,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
