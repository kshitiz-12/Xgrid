/** Bump when replacing files under /public so browsers fetch the new asset. */
export const ASSET_VERSION = '20260916b';

/**
 * Cache-bust a public asset path. Hashed Vite /assets/* URLs are left alone.
 * External/data URLs are returned unchanged.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith('/assets/')) return path;

  const clean = path.startsWith('/') ? path : `/${path}`;
  const [pathname, existingQuery = ''] = clean.split('?');
  const params = new URLSearchParams(existingQuery);
  params.set('v', ASSET_VERSION);
  return `${pathname}?${params.toString()}`;
}
