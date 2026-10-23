/** Prefix relative upload paths with VITE_API_URL or runtime api-config in production. */
export function resolveMediaUrl(pathOrUrl: string): string {
  if (!pathOrUrl?.trim()) return pathOrUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
  const fromRuntime =
    typeof window !== 'undefined'
      ? (window as Window & { __SLATEBIZ_API_URL__?: string }).__SLATEBIZ_API_URL__ || ''
      : (globalThis as { __SLATEBIZ_API_URL__?: string }).__SLATEBIZ_API_URL__ || '';
  const base = fromEnv || fromRuntime;
  if (!base) return pathOrUrl;
  return `${base}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}
