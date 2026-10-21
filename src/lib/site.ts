export type ProductSite = 'jewelbiz' | 'curabiz';

export const PRODUCT_DOMAINS: Record<ProductSite, string> = {
  jewelbiz: 'https://www.jewelbiz.in',
  curabiz: 'https://www.curabiz.in',
};

const PRODUCTION_HOSTS = new Set(['slatebiz.com', 'slatebiz.in', 'jewelbiz.in', 'curabiz.in']);

const currentHost =
  typeof window === 'undefined' ? '' : window.location.hostname.toLowerCase().replace(/^www\./, '');

/** True on the real public domains; false on localhost and *.vercel.app previews. */
export const isProductionHost = PRODUCTION_HOSTS.has(currentHost);

/** Set by scripts/prerender.mjs while rendering each domain's HTML at build time. */
const prerenderSite =
  typeof window === 'undefined'
    ? (globalThis as { __PRERENDER_SITE__?: string }).__PRERENDER_SITE__
    : undefined;

export const productSite: ProductSite | null = (() => {
  const forced = prerenderSite ?? import.meta.env.VITE_SITE;
  if (currentHost === 'jewelbiz.in' || forced === 'jewelbiz') return 'jewelbiz';
  if (currentHost === 'curabiz.in' || forced === 'curabiz') return 'curabiz';
  return null;
})();
