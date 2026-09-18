import crypto from 'crypto';
import { prisma } from './prisma.js';

/** Known short SEO slugs → real published slugs (permanent fallback). */
export const BLOG_SLUG_ALIASES = {
  'gold-making-charges':
    'jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  'gold-making-charges-explained':
    'jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  'jewellery-billing-software-counter-fast-accurate':
    'jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  'jewellery-management-system-day-inside':
    'a-day-inside-a-jewellery-management-system-and-what-happens-when-one-piece-is-mi',
  'jewellery-erp-software-enterprise-level':
    'jewellery-erp-software-what-enterprise-level-actually-means-beyond-billing',
  'jewellery-accounting-software-ledger-gap':
    'jewellery-accounting-software-why-the-ledger-never-quite-adds-up-without-one',
  'erp-for-jewellery-what-a-complete-system-needs':
    'erp-for-jewellery-what-a-complete-system-actually-needs-to-cover',
  'gst-rate-gold-jewellery-2026':
    'gst-rate-on-gold-jewellery-the-complete-breakdown-for-2026',
};

export function cleanBlogSlug(slug) {
  return String(slug || '')
    .trim()
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/^blog\//, '')
    .replace(/\/+$/, '')
    .split(/[?#]/)[0];
}

function tokenScore(query, candidate) {
  if (!query || !candidate) return 0;
  if (candidate === query) return 1000;
  if (candidate.startsWith(`${query}-`)) return 800;
  if (candidate.includes(query)) return 600;

  const qTokens = query.split('-').filter((t) => t.length > 2);
  if (!qTokens.length) return 0;
  const hits = qTokens.filter((t) => candidate.includes(t)).length;
  const ratio = hits / qTokens.length;
  if (ratio < 0.7) return 0;
  return Math.round(ratio * 200) + hits * 10;
}

/**
 * Resolve a requested slug to a published post slug.
 * Order: exact → alias map → redirect table → previous_slugs → fuzzy match.
 */
export async function resolvePublishedSlug(rawSlug) {
  const slug = cleanBlogSlug(rawSlug);
  if (!slug) return null;

  const exact = await prisma.blogPost.findFirst({
    where: { slug, published: true },
    select: { slug: true },
  });
  if (exact) return { slug: exact.slug, via: 'exact' };

  const alias = BLOG_SLUG_ALIASES[slug];
  if (alias) {
    const aliased = await prisma.blogPost.findFirst({
      where: { slug: alias, published: true },
      select: { slug: true },
    });
    if (aliased) return { slug: aliased.slug, via: 'alias' };
  }

  const redirect = await prisma.blogRedirect.findUnique({ where: { fromSlug: slug } });
  if (redirect?.toSlug) {
    const target = await prisma.blogPost.findFirst({
      where: { slug: redirect.toSlug, published: true },
      select: { slug: true },
    });
    if (target) return { slug: target.slug, via: 'redirect' };
  }

  const viaPrevious = await prisma.blogPost.findFirst({
    where: {
      published: true,
      previousSlugs: { has: slug },
    },
    select: { slug: true },
  });
  if (viaPrevious) return { slug: viaPrevious.slug, via: 'previous' };

  const published = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  const scored = published
    .map((p) => ({ slug: p.slug, score: tokenScore(slug, p.slug) }))
    .filter((x) => x.score >= 150)
    .sort((a, b) => b.score - a.score);

  if (scored[0] && (!scored[1] || scored[0].score > scored[1].score)) {
    return { slug: scored[0].slug, via: 'fuzzy' };
  }

  return null;
}

export async function upsertRedirect(fromSlug, toSlug) {
  const from = cleanBlogSlug(fromSlug);
  const to = cleanBlogSlug(toSlug);
  if (!from || !to || from === to) return;

  await prisma.blogRedirect.upsert({
    where: { fromSlug: from },
    create: { id: crypto.randomUUID(), fromSlug: from, toSlug: to },
    update: { toSlug: to },
  });

  const pointing = await prisma.blogRedirect.findMany({
    where: { toSlug: from },
  });
  await Promise.all(
    pointing.map((r) =>
      prisma.blogRedirect.update({
        where: { id: r.id },
        data: { toSlug: to },
      })
    )
  );
}

/** Ensure built-in aliases exist as DB redirects (safe to call often). */
export async function ensureDefaultBlogRedirects() {
  for (const [from, to] of Object.entries(BLOG_SLUG_ALIASES)) {
    const exists = await prisma.blogPost.findFirst({
      where: { slug: to, published: true },
      select: { id: true },
    });
    if (exists) await upsertRedirect(from, to);
  }
}

function rewriteHtmlBlogLinks(html, slugByRequest) {
  return html.replace(
    /href=(["'])(\/blog\/[^"'#?\s]+)\1/gi,
    (full, quote, path) => {
      const requested = cleanBlogSlug(path);
      if (!requested) return full;
      const resolved = slugByRequest.get(requested) || requested;
      return `href=${quote}/blog/${resolved}${quote}`;
    }
  );
}

/**
 * Rewrite /blog/... links in post content to real published slugs,
 * and auto-create redirects for any short forms found.
 */
export async function normalizeBlogContentLinks(content) {
  const published = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  const publishedSlugs = published.map((p) => p.slug);

  const resolveLocal = (requested) => {
    if (publishedSlugs.includes(requested)) return requested;
    if (BLOG_SLUG_ALIASES[requested] && publishedSlugs.includes(BLOG_SLUG_ALIASES[requested])) {
      return BLOG_SLUG_ALIASES[requested];
    }
    const scored = publishedSlugs
      .map((s) => ({ slug: s, score: tokenScore(requested, s) }))
      .filter((x) => x.score >= 150)
      .sort((a, b) => b.score - a.score);
    if (scored[0] && (!scored[1] || scored[0].score > scored[1].score)) {
      return scored[0].slug;
    }
    return requested;
  };

  const slugByRequest = new Map();
  const collectFromHtml = (html) => {
    const matches = html.matchAll(/\/blog\/([a-z0-9-]+)\/?/gi);
    for (const m of matches) {
      const requested = cleanBlogSlug(m[1]);
      if (!requested || slugByRequest.has(requested)) continue;
      const resolved = resolveLocal(requested);
      slugByRequest.set(requested, resolved);
    }
  };

  if (typeof content === 'string') collectFromHtml(content);
  else if (Array.isArray(content)) {
    for (const block of content) {
      if (block && typeof block.html === 'string') collectFromHtml(block.html);
      else collectFromHtml(JSON.stringify(block));
    }
  } else if (content && typeof content === 'object') {
    collectFromHtml(JSON.stringify(content));
  }

  for (const [from, to] of slugByRequest.entries()) {
    if (from !== to) await upsertRedirect(from, to);
  }

  const rewrite = (html) => rewriteHtmlBlogLinks(html, slugByRequest);

  if (typeof content === 'string') return rewrite(content);
  if (Array.isArray(content)) {
    return content.map((block) => {
      if (block && typeof block === 'object' && typeof block.html === 'string') {
        return { ...block, html: rewrite(block.html) };
      }
      return block;
    });
  }
  if (content && typeof content === 'object') {
    return JSON.parse(rewrite(JSON.stringify(content)));
  }
  return content;
}
