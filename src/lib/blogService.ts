import { apiFetch, ApiError } from './api';
import type { BlogPostRecord, BlogContent, Brand } from '../types/blog';
import { recordToPost } from '../types/blog';
import type { BlogPost } from '../types/blog';

export type BlogPostInput = {
  brand: Brand;
  slug: string;
  category_label: string;
  title: string;
  description: string;
  hero_image: string;
  image_alt: string;
  author: string;
  tags: string[];
  date: string;
  read_time: string;
  content: BlogContent;
  published: boolean;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  seo_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  no_index: boolean;
  no_follow: boolean;
};

const PUBLIC_TIMEOUT_MS = 12000;

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const data = await apiFetch<BlogPostRecord[]>('/posts?published=true&fields=summary', {
    timeoutMs: PUBLIC_TIMEOUT_MS,
  });
  return data.map(recordToPost);
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const data = await apiFetch<BlogPostRecord[]>('/posts');
  return data.map(recordToPost);
}

export async function fetchPostByPublicSlug(slug: string): Promise<BlogPost | null> {
  try {
    const data = await apiFetch<BlogPostRecord>(`/posts/slug/${encodeURIComponent(slug)}`, {
      timeoutMs: PUBLIC_TIMEOUT_MS,
    });
    return recordToPost(data);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function fetchPostBySlug(brand: Brand, slug: string): Promise<BlogPost | null> {
  try {
    const data = await apiFetch<BlogPostRecord>(`/posts/by-slug/${brand}/${slug}`, {
      timeoutMs: PUBLIC_TIMEOUT_MS,
    });
    return recordToPost(data);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function fetchPostById(id: string): Promise<BlogPost> {
  const data = await apiFetch<BlogPostRecord>(`/posts/${id}`);
  return recordToPost(data);
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const data = await apiFetch<BlogPostRecord>('/posts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return recordToPost(data);
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogPost> {
  const data = await apiFetch<BlogPostRecord>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return recordToPost(data);
}

export async function deletePost(id: string): Promise<void> {
  await apiFetch(`/posts/${id}`, { method: 'DELETE' });
}

export async function uploadBlogImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const { url } = await apiFetch<{ url: string }>('/upload', { method: 'POST', body: form });
  return url;
}
