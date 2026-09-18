import crypto from 'crypto';
import { prisma } from './prisma.js';
import {
  cleanBlogSlug,
  resolvePublishedSlug,
  normalizeBlogContentLinks,
  upsertRedirect,
  ensureDefaultBlogRedirects,
} from './blogLinks.js';

export { upsertRedirect, ensureDefaultBlogRedirects, cleanBlogSlug };

/** @param {import('@prisma/client').BlogPost} post */
export function toRecord(post) {
  return {
    id: post.id,
    brand: post.brand,
    slug: post.slug,
    category_label: post.categoryLabel,
    title: post.title,
    description: post.description,
    hero_image: post.heroImage,
    image_alt: post.imageAlt,
    author: post.author,
    tags: post.tags,
    date: post.date,
    read_time: post.readTime,
    content: post.content,
    published: post.published,
    published_at: post.publishedAt ? post.publishedAt.toISOString() : null,
    previous_slugs: post.previousSlugs,
    meta_title: post.metaTitle,
    meta_description: post.metaDescription,
    focus_keyword: post.focusKeyword,
    seo_keywords: post.seoKeywords,
    canonical_url: post.canonicalUrl,
    og_title: post.ogTitle,
    og_description: post.ogDescription,
    og_image: post.ogImage,
    twitter_title: post.twitterTitle,
    twitter_description: post.twitterDescription,
    twitter_image: post.twitterImage,
    no_index: post.noIndex,
    no_follow: post.noFollow,
    created_at: post.createdAt.toISOString(),
    updated_at: post.updatedAt.toISOString(),
  };
}

/** @param {Record<string, unknown>} input */
function toCreateData(input) {
  return {
    brand: input.brand,
    slug: input.slug,
    categoryLabel: input.category_label,
    title: input.title,
    description: input.description,
    heroImage: input.hero_image,
    imageAlt: input.image_alt,
    author: input.author,
    tags: input.tags,
    date: input.date,
    readTime: input.read_time,
    content: input.content,
    published: input.published,
    publishedAt: input.published ? new Date() : null,
    previousSlugs: [],
    metaTitle: input.meta_title,
    metaDescription: input.meta_description,
    focusKeyword: input.focus_keyword,
    seoKeywords: input.seo_keywords,
    canonicalUrl: input.canonical_url,
    ogTitle: input.og_title,
    ogDescription: input.og_description,
    ogImage: input.og_image,
    twitterTitle: input.twitter_title,
    twitterDescription: input.twitter_description,
    twitterImage: input.twitter_image,
    noIndex: input.no_index,
    noFollow: input.no_follow,
  };
}

/** @param {Record<string, unknown>} input */
function toUpdateData(input) {
  return {
    brand: input.brand,
    slug: input.slug,
    categoryLabel: input.category_label,
    title: input.title,
    description: input.description,
    heroImage: input.hero_image,
    imageAlt: input.image_alt,
    author: input.author,
    tags: input.tags,
    date: input.date,
    readTime: input.read_time,
    content: input.content,
    published: input.published,
    metaTitle: input.meta_title,
    metaDescription: input.meta_description,
    focusKeyword: input.focus_keyword,
    seoKeywords: input.seo_keywords,
    canonicalUrl: input.canonical_url,
    ogTitle: input.og_title,
    ogDescription: input.og_description,
    ogImage: input.og_image,
    twitterTitle: input.twitter_title,
    twitterDescription: input.twitter_description,
    twitterImage: input.twitter_image,
    noIndex: input.no_index,
    noFollow: input.no_follow,
  };
}

export async function listPosts({ publishedOnly = false } = {}) {
  const posts = await prisma.blogPost.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { updatedAt: 'desc' },
  });
  return posts.map(toRecord);
}

export async function getPostById(id) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  return post ? toRecord(post) : null;
}

export async function getPublishedPostBySlug(slug) {
  const resolved = await resolvePublishedSlug(slug);
  if (!resolved) return null;

  const post = await prisma.blogPost.findFirst({
    where: { slug: resolved.slug, published: true },
  });
  if (!post) return null;

  const record = toRecord(post);
  if (resolved.via !== 'exact') {
    record._redirect_from = cleanBlogSlug(slug);
  }
  return record;
}

export async function getPublishedPostByBrandSlug(brand, slug) {
  const clean = cleanBlogSlug(slug);
  const post = await prisma.blogPost.findFirst({
    where: { brand, slug: clean, published: true },
  });
  if (post) return toRecord(post);

  // Brand route: still honour aliases/redirects, then verify brand
  const resolved = await resolvePublishedSlug(clean);
  if (!resolved) return null;
  const viaAlias = await prisma.blogPost.findFirst({
    where: { brand, slug: resolved.slug, published: true },
  });
  if (!viaAlias) return null;
  const record = toRecord(viaAlias);
  if (resolved.via !== 'exact') record._redirect_from = clean;
  return record;
}

export async function ensureUniqueSlug(slug, excludeId = null) {
  let candidate = slug;
  let n = 2;
  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!existing) return candidate;
    candidate = `${slug}-${n}`;
    n += 1;
  }
}

export async function getRedirect(fromSlug) {
  const redirect = await prisma.blogRedirect.findUnique({
    where: { fromSlug: cleanBlogSlug(fromSlug) },
  });
  return redirect ? { from: redirect.fromSlug, to: redirect.toSlug } : null;
}

export async function deleteRedirectsForSlug(slug) {
  const clean = cleanBlogSlug(slug);
  await prisma.blogRedirect.deleteMany({
    where: {
      OR: [{ fromSlug: clean }, { toSlug: clean }],
    },
  });
}

export async function createPost(input) {
  const slug = await ensureUniqueSlug(input.slug);
  const content = await normalizeBlogContentLinks(input.content);
  const post = await prisma.blogPost.create({
    data: {
      id: crypto.randomUUID(),
      ...toCreateData({ ...input, slug, content }),
    },
  });
  return toRecord(post);
}

export async function updatePost(id, input, existing) {
  const slug = await ensureUniqueSlug(input.slug, id);
  const previousSlugs = Array.isArray(existing.previous_slugs) ? [...existing.previous_slugs] : [];

  if (existing.slug && existing.slug !== slug) {
    if (!previousSlugs.includes(existing.slug)) previousSlugs.push(existing.slug);
    await upsertRedirect(existing.slug, slug);
    for (const old of previousSlugs) {
      if (old !== slug) await upsertRedirect(old, slug);
    }
  }

  let publishedAt = existing.published_at ? new Date(existing.published_at) : null;
  if (input.published && !publishedAt) publishedAt = new Date();

  const content = await normalizeBlogContentLinks(input.content);

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...toUpdateData({ ...input, slug, content }),
      previousSlugs,
      publishedAt,
    },
  });
  return toRecord(post);
}

export async function deletePost(id) {
  const existing = await getPostById(id);
  if (!existing) return null;
  await deleteRedirectsForSlug(existing.slug);
  await prisma.blogPost.delete({ where: { id } });
  return existing;
}

export async function getPublishedPostsForSitemap() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, noIndex: false },
    select: { slug: true },
  });
  return posts;
}
