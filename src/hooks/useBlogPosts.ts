import { useEffect, useState } from 'react';
import { fetchPublishedPosts, fetchPostBySlug, fetchPostByPublicSlug } from '../lib/blogService';
import type { BlogPost } from '../types/blog';
import { checkApiHealth } from '../lib/api';
import { blogPath } from '../lib/seo';

function withDefaults(post: BlogPost): BlogPost {
  return {
    ...post,
    imageAlt: post.imageAlt || post.title,
    author: post.author || 'SlateBiz Editorial',
    tags: post.tags || [],
  };
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkApiHealth()
      .then(async (ok) => {
        if (!ok) return;
        const remote = await fetchPublishedPosts();
        setPosts(remote.map(withDefaults));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Could not load blog posts.');
      })
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading, error };
}

export function useBlogPostBySlug(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setRedirectTo(null);
    setError('');

    checkApiHealth()
      .then(async (apiUp) => {
        if (cancelled) return;

        if (!apiUp) {
          setPost(null);
          return;
        }

        try {
          const cleanSlug = slug.replace(/\/+$/, '');
          const remote = await fetchPostByPublicSlug(cleanSlug);
          if (cancelled) return;

          if (remote) {
            if (remote.slug !== cleanSlug) {
              setRedirectTo(blogPath(remote.slug));
            }
            setPost(withDefaults(remote));
            return;
          }

          setPost(null);
        } catch (err) {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : 'Failed to load post.');
          setPost(null);
        }
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

    checkApiHealth()
      .then(async (apiUp) => {
        if (cancelled) return;

        if (!apiUp) {
          setPost(null);
          return;
        }

        try {
          const remote = await fetchPostBySlug(brand as BlogPost['brand'], slug);
          if (cancelled) return;
          setPost(remote ? withDefaults(remote) : null);
        } catch (err) {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : 'Failed to load post.');
          setPost(null);
        }
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
