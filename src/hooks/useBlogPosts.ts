import { useEffect, useState } from 'react';
import { fetchPublishedPosts, fetchPostBySlug, fetchPostByPublicSlug } from '../lib/blogService';
import type { BlogPost } from '../types/blog';
import { blogPath } from '../lib/seo';
import { prerenderPost, prerenderPosts } from '../lib/prerenderBlog';

function withDefaults(post: BlogPost): BlogPost {
  return {
    ...post,
    imageAlt: post.imageAlt || post.title,
    author: post.author || 'SlateBiz Editorial',
    tags: post.tags || [],
  };
}

export function useBlogPosts() {
  const seeded = prerenderPosts();
  const [posts, setPosts] = useState<BlogPost[]>(seeded ?? []);
  const [loading, setLoading] = useState(!seeded?.length);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchPublishedPosts()
      .then((remote) => {
        if (!cancelled) setPosts(remote.map(withDefaults));
      })
      .catch((err) => {
        if (!cancelled && !seeded?.length) {
          setError(err instanceof Error ? err.message : 'Could not load blog posts.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}

export function useBlogPostBySlug(slug: string | undefined) {
  const seeded = prerenderPost(slug);
  const [post, setPost] = useState<BlogPost | null>(seeded);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(!seeded && Boolean(slug));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    if (!seeded) setLoading(true);
    setRedirectTo(null);
    setError('');

    fetchPostByPublicSlug(slug.replace(/\/+$/, ''))
      .then((remote) => {
        if (cancelled) return;
        if (remote) {
          const cleanSlug = slug.replace(/\/+$/, '');
          if (remote.slug !== cleanSlug) setRedirectTo(blogPath(remote.slug));
          setPost(withDefaults(remote));
          return;
        }
        if (!seeded) setPost(null);
      })
      .catch((err) => {
        if (cancelled || seeded) return;
        setError(err instanceof Error ? err.message : 'Failed to load post.');
        setPost(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, redirectTo, loading, error };
}

export function useBlogPost(brand: string | undefined, slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!brand || !slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchPostBySlug(brand as BlogPost['brand'], slug)
      .then((remote) => {
        if (!cancelled) setPost(remote ? withDefaults(remote) : null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load post.');
        setPost(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [brand, slug]);

  return { post, loading, error };
}
