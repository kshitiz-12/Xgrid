/**
 * Fix broken Read Next / in-article blog links:
 * 1. Insert redirects from short SEO slugs → real published slugs
 * 2. Rewrite GST post HTML hrefs to the real slugs
 *
 * Run: node --env-file=.env scripts/fix-blog-link-redirects.mjs
 */
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

/** Short slug used in article HTML → real published slug */
const REDIRECTS = {
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
  'gst-rate-gold-jewellery-2026': 'gst-rate-on-gold-jewellery-the-complete-breakdown-for-2026',
  // Common variants from older drafts / titles
  'gold-making-charges': 'jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  'gold-making-charges-explained':
    'jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
};

const HREF_REPLACEMENTS = {
  '/blog/jewellery-billing-software-counter-fast-accurate/':
    '/blog/jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  '/blog/jewellery-billing-software-counter-fast-accurate':
    '/blog/jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  '/blog/jewellery-management-system-day-inside/':
    '/blog/a-day-inside-a-jewellery-management-system-and-what-happens-when-one-piece-is-mi',
  '/blog/jewellery-management-system-day-inside':
    '/blog/a-day-inside-a-jewellery-management-system-and-what-happens-when-one-piece-is-mi',
  '/blog/jewellery-erp-software-enterprise-level/':
    '/blog/jewellery-erp-software-what-enterprise-level-actually-means-beyond-billing',
  '/blog/jewellery-erp-software-enterprise-level':
    '/blog/jewellery-erp-software-what-enterprise-level-actually-means-beyond-billing',
  '/blog/jewellery-accounting-software-ledger-gap/':
    '/blog/jewellery-accounting-software-why-the-ledger-never-quite-adds-up-without-one',
  '/blog/jewellery-accounting-software-ledger-gap':
    '/blog/jewellery-accounting-software-why-the-ledger-never-quite-adds-up-without-one',
  '/blog/erp-for-jewellery-what-a-complete-system-needs/':
    '/blog/erp-for-jewellery-what-a-complete-system-actually-needs-to-cover',
  '/blog/erp-for-jewellery-what-a-complete-system-needs':
    '/blog/erp-for-jewellery-what-a-complete-system-actually-needs-to-cover',
  '/blog/gst-rate-gold-jewellery-2026/':
    '/blog/gst-rate-on-gold-jewellery-the-complete-breakdown-for-2026',
  '/blog/gst-rate-gold-jewellery-2026':
    '/blog/gst-rate-on-gold-jewellery-the-complete-breakdown-for-2026',
  '/blog/gold-making-charges-explained/':
    '/blog/jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  '/blog/gold-making-charges-explained':
    '/blog/jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  '/blog/gold-making-charges/':
    '/blog/jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
  '/blog/gold-making-charges':
    '/blog/jewellery-billing-software-what-the-counter-actually-needs-to-run-fast-and-stay',
};

function rewriteHtml(html) {
  let out = html;
  for (const [from, to] of Object.entries(HREF_REPLACEMENTS)) {
    out = out.split(from).join(to);
  }
  // also strip trailing slash on remaining /blog/ links for consistency
  out = out.replace(/(href=["'])(\/blog\/[a-z0-9-]+)\/(["'#?\s>])/gi, '$1$2$3');
  return out;
}

function rewriteContent(content) {
  if (typeof content === 'string') return rewriteHtml(content);
  if (Array.isArray(content)) {
    return content.map((block) => {
      if (block && typeof block === 'object' && typeof block.html === 'string') {
        return { ...block, html: rewriteHtml(block.html) };
      }
      return block;
    });
  }
  if (content && typeof content === 'object') {
    return JSON.parse(rewriteHtml(JSON.stringify(content)));
  }
  return content;
}

const published = await prisma.blogPost.findMany({
  where: { published: true },
  select: { slug: true },
});
const publishedSet = new Set(published.map((p) => p.slug));

console.log('Creating redirects…');
for (const [from, to] of Object.entries(REDIRECTS)) {
  if (!publishedSet.has(to)) {
    console.warn('SKIP redirect — target not published:', from, '→', to);
    continue;
  }
  await prisma.blogRedirect.upsert({
    where: { fromSlug: from },
    create: { id: crypto.randomUUID(), fromSlug: from, toSlug: to },
    update: { toSlug: to },
  });
  console.log('OK redirect', from, '→', to);
}

const gst = await prisma.blogPost.findFirst({
  where: { slug: 'gst-rate-on-gold-jewellery-the-complete-breakdown-for-2026' },
});

if (gst) {
  const nextContent = rewriteContent(gst.content);
  await prisma.blogPost.update({
    where: { id: gst.id },
    data: { content: nextContent },
  });
  console.log('Updated GST post HTML links');
} else {
  console.warn('GST post not found — skipped content rewrite');
}

// Also rewrite any other published posts that still use short hrefs
const others = await prisma.blogPost.findMany({ where: { published: true } });
let touched = 0;
for (const post of others) {
  if (post.slug === gst?.slug) continue;
  const before = JSON.stringify(post.content);
  const afterContent = rewriteContent(post.content);
  const after = JSON.stringify(afterContent);
  if (before !== after) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { content: afterContent },
    });
    touched += 1;
    console.log('Updated links in', post.slug);
  }
}
console.log('Other posts updated:', touched);

await prisma.$disconnect();
console.log('Done.');
