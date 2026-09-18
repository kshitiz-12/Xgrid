/** Site origin for absolute SEO URLs (no trailing slash). */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://slatebiz.com').replace(/\/$/, '');

export const SITE_NAME = 'SlateBiz Softwares';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/BGDB.webp`;

const SLUG_MAX_LENGTH = 96;

export function slugify(text: string): string {
  let slug = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length > SLUG_MAX_LENGTH) {
    slug = slug.slice(0, SLUG_MAX_LENGTH);
    const lastHyphen = slug.lastIndexOf('-');
    // Cut on a word boundary when truncation lands mid-slug
    if (lastHyphen > SLUG_MAX_LENGTH * 0.5) {
      slug = slug.slice(0, lastHyphen);
    }
  }

  return slug.replace(/^-+|-+$/g, '');
}

export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function blogPath(slug: string): string {
  const clean = String(slug || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/^blog\//i, '');
  return `/blog/${clean}`;
}

export function blogCanonical(slug: string, override?: string): string {
  if (override?.trim()) return absoluteUrl(override.trim());
  return absoluteUrl(blogPath(slug));
}

export function truncateMeta(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export type SeoSource = {
  title: string;
  description: string;
  slug: string;
  heroImage?: string;
  imageAlt?: string;
  author?: string;
  categoryLabel?: string;
  tags?: string[];
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  contentText?: string;
  internalLinkCount?: number;
  publishedAt?: string;
  updatedAt?: string;
  noIndex?: boolean;
  noFollow?: boolean;
};

export type ResolvedSeo = {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  seoKeywords: string;
  slug: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  imageAlt: string;
  robots: string;
};

export function resolveSeo(source: SeoSource): ResolvedSeo {
  const title = source.title.trim();
  const excerpt = source.description.trim();
  const slug = source.slug.trim() || slugify(title);
  const baseTitle = (source.metaTitle || '').trim() || truncateMeta(title, 55);
  const metaTitle = /slatebiz/i.test(baseTitle)
    ? baseTitle
    : truncateMeta(`${baseTitle} | ${SITE_NAME}`, 65);
  const metaDescription =
    (source.metaDescription || '').trim() ||
    truncateMeta(excerpt || source.contentText || title, 155);
  const image = absoluteUrl(source.ogImage || source.heroImage || DEFAULT_OG_IMAGE);
  const twitterImage = absoluteUrl(source.twitterImage || source.ogImage || source.heroImage || DEFAULT_OG_IMAGE);
  const robotsParts = [
    source.noIndex ? 'noindex' : 'index',
    source.noFollow ? 'nofollow' : 'follow',
  ];

  return {
    metaTitle,
    metaDescription,
    focusKeyword: (source.focusKeyword || '').trim(),
    seoKeywords: (source.seoKeywords || '').trim() || (source.tags || []).join(', '),
    slug,
    canonicalUrl: blogCanonical(slug, source.canonicalUrl),
    ogTitle: (source.ogTitle || '').trim() || baseTitle,
    ogDescription: (source.ogDescription || '').trim() || metaDescription,
    ogImage: image,
    twitterTitle: (source.twitterTitle || '').trim() || (source.ogTitle || '').trim() || baseTitle,
    twitterDescription:
      (source.twitterDescription || '').trim() ||
      (source.ogDescription || '').trim() ||
      metaDescription,
    twitterImage,
    imageAlt: (source.imageAlt || '').trim() || title,
    robots: robotsParts.join(', '),
  };
}

export function buildBlogPostingJsonLd(source: SeoSource, seo: ResolvedSeo) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seo.metaTitle,
    description: seo.metaDescription,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': seo.canonicalUrl,
    },
    url: seo.canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.webp'),
      },
    },
  };

  if (source.heroImage || seo.ogImage) {
    data.image = [seo.ogImage];
  }
  if (source.author?.trim()) {
    data.author = {
      '@type': 'Person',
      name: source.author.trim(),
    };
  }
  if (source.publishedAt) data.datePublished = source.publishedAt;
  if (source.updatedAt) data.dateModified = source.updatedAt;
  if (source.categoryLabel) data.articleSection = source.categoryLabel;
  if (source.tags?.length) data.keywords = source.tags.join(', ');

  return data;
}

export type SeoCheck = {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
};

export function evaluateSeo(source: SeoSource): { score: number; checks: SeoCheck[] } {
  const seo = resolveSeo(source);
  const content = `${source.title} ${source.description} ${source.contentText || ''}`.toLowerCase();
  const wordCount = (source.contentText || '').trim().split(/\s+/).filter(Boolean).length;
  const focus = seo.focusKeyword.toLowerCase();
  const checks: SeoCheck[] = [];

  const titleLen = seo.metaTitle.length;
  checks.push({
    id: 'meta-title',
    label: 'SEO title',
    status: !seo.metaTitle ? 'fail' : titleLen < 30 || titleLen > 60 ? 'warn' : 'pass',
    detail: !seo.metaTitle
      ? 'Missing SEO title'
      : titleLen < 30
        ? `Short (${titleLen} chars) — aim for 30–60`
        : titleLen > 60
          ? `Long (${titleLen} chars) — aim for 30–60`
          : `${titleLen} characters`,
  });

  const descLen = seo.metaDescription.length;
  checks.push({
    id: 'meta-desc',
    label: 'Meta description',
    status: !seo.metaDescription ? 'fail' : descLen < 70 || descLen > 160 ? 'warn' : 'pass',
    detail: !seo.metaDescription
      ? 'Missing meta description'
      : descLen < 70
        ? `Short (${descLen} chars) — aim for 70–160`
        : descLen > 160
          ? `Long (${descLen} chars) — aim for 70–160`
          : `${descLen} characters`,
  });

  checks.push({
    id: 'slug',
    label: 'URL slug',
    status: !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seo.slug) ? 'fail' : seo.slug.length > 60 ? 'warn' : 'pass',
    detail: seo.slug || 'Missing slug',
  });

  checks.push({
    id: 'canonical',
    label: 'Canonical URL',
    status: seo.canonicalUrl ? 'pass' : 'fail',
    detail: seo.canonicalUrl || 'Missing',
  });

  checks.push({
    id: 'image',
    label: 'Featured image',
    status: source.heroImage ? 'pass' : 'warn',
    detail: source.heroImage ? 'Set' : 'No featured image',
  });

  checks.push({
    id: 'alt',
    label: 'Image alt text',
    status: source.imageAlt?.trim() ? 'pass' : source.heroImage ? 'warn' : 'warn',
    detail: source.imageAlt?.trim() ? 'Set' : 'Add descriptive alt text',
  });

  checks.push({
    id: 'content',
    label: 'Content length',
    status: wordCount < 300 ? 'warn' : wordCount < 600 ? 'pass' : 'pass',
    detail: `${wordCount} words${wordCount < 300 ? ' — aim for 300+' : ''}`,
  });

  if (focus) {
    const inTitle = source.title.toLowerCase().includes(focus) || seo.metaTitle.toLowerCase().includes(focus);
    const inBody = content.includes(focus);
    checks.push({
      id: 'focus',
      label: 'Focus keyword usage',
      status: inTitle && inBody ? 'pass' : inTitle || inBody ? 'warn' : 'warn',
      detail:
        inTitle && inBody
          ? 'Appears in title and content'
          : inTitle
            ? 'In title only'
            : inBody
              ? 'In content only'
              : 'Not found in title/content',
    });
  } else {
    checks.push({
      id: 'focus',
      label: 'Focus keyword',
      status: 'warn',
      detail: 'Optional — helps on-page checks',
    });
  }

  const links = source.internalLinkCount ?? 0;
  checks.push({
    id: 'internal-links',
    label: 'Internal links',
    status: links > 0 ? 'pass' : 'warn',
    detail: links > 0 ? `${links} found in content` : 'Add links to related posts or product pages',
  });

  checks.push({
    id: 'structured',
    label: 'Structured data',
    status: 'pass',
    detail: 'BlogPosting JSON-LD will be generated on publish',
  });

  const weights = { pass: 1, warn: 0.45, fail: 0 };
  const score = Math.round(
    (checks.reduce((sum, c) => sum + weights[c.status], 0) / checks.length) * 100
  );

  return { score, checks };
}

export type RelatedCandidate = {
  id: string;
  brand: string;
  slug: string;
  title: string;
  description: string;
  categoryLabel: string;
  tags?: string[];
  focusKeyword?: string;
  heroImage: string;
  date: string;
  readTime: string;
};

export function pickRelatedArticles(
  current: RelatedCandidate,
  pool: RelatedCandidate[],
  limit = 3
): RelatedCandidate[] {
  const tags = new Set((current.tags || []).map((t) => t.toLowerCase()));
  const focus = (current.focusKeyword || '').toLowerCase();
  const category = current.categoryLabel.toLowerCase();

  return pool
    .filter((p) => !(p.slug === current.slug && p.brand === current.brand))
    .map((p) => {
      let score = 0;
      if (p.brand === current.brand) score += 3;
      if (p.categoryLabel.toLowerCase() === category) score += 4;
      for (const tag of p.tags || []) {
        if (tags.has(tag.toLowerCase())) score += 2;
      }
      if (focus && `${p.title} ${p.description} ${p.focusKeyword || ''}`.toLowerCase().includes(focus)) {
        score += 2;
      }
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .filter((x, _, arr) => (arr.some((y) => y.score > 0) ? x.score > 0 : true))
    .slice(0, limit)
    .map((x) => x.post);
}

export function countInternalLinks(htmlOrText: string): number {
  const matches = htmlOrText.match(/href=["'](\/|https?:\/\/(?:www\.)?slatebiz\.com)/gi);
  return matches?.length ?? 0;
}

export const INTERNAL_LINK_PRESETS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'All blogs', href: '/blogs/' },
  { label: 'JewelBiz', href: '/jewelbiz/' },
  { label: 'CuraBiz', href: '/curabiz/' },
  { label: 'RetailBiz', href: '/retailbiz/' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact/' },
  { label: 'About us', href: '/about-us/' },
  { label: 'FAQ', href: '/faq' },
];
