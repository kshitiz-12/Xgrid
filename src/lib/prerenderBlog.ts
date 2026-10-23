import { recordToPost, type BlogPost, type BlogPostRecord } from '../types/blog';

export type PrerenderBlogBag = {
  posts: BlogPostRecord[];
  post?: BlogPostRecord | null;
};

function readBag(): PrerenderBlogBag | null {
  if (typeof window !== 'undefined') {
    return (window as Window & { __PRERENDER_BLOG__?: PrerenderBlogBag }).__PRERENDER_BLOG__ ?? null;
  }
  return (globalThis as { __PRERENDER_BLOG__?: PrerenderBlogBag }).__PRERENDER_BLOG__ ?? null;
}

/** Post summaries baked into the HTML at build time. Null in normal dev browsing. */
export function prerenderPosts(): BlogPost[] | null {
  const posts = readBag()?.posts;
  if (!posts?.length) return null;
  return posts.map(recordToPost);
}

/** The full article for this URL, when this page was prerendered. */
export function prerenderPost(slug: string | undefined): BlogPost | null {
  if (!slug) return null;
  const post = readBag()?.post;
  if (!post || post.slug !== slug) return null;
  return recordToPost(post);
}
