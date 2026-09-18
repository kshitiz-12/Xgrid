import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { connectDatabase } from './prisma.js';
import {
  listPosts,
  getPostById,
  getPublishedPostBySlug,
  getPublishedPostByBrandSlug,
  ensureDefaultBlogRedirects,
  getRedirect,
  createPost,
  updatePost,
  deletePost,
  getPublishedPostsForSitemap,
} from './blogRepository.js';
import { createSession, deleteSession, getSession } from './sessionRepository.js';
import { isSupabaseStorageConfigured } from './supabase.js';
import { ensureStorageBucket, uploadBlogImage } from './storage.js';
import { createCaptchaChallenge, verifyCaptchaChallenge } from './captcha.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const API_PUBLIC_URL = (process.env.API_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '');

const PORT = process.env.PORT || 3001;
const VALID_BRANDS = ['jewelbiz', 'curabiz', 'retailbiz', 'custom'];

const ADMIN_USER = {
  id: 'admin-1',
  email: process.env.ADMIN_EMAIL || 'admin@slatebiz.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: 'SlateBiz Admin',
};

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://slatebiz.com').replace(/\/$/, '');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');

const STATIC_SITEMAP_PATHS = [
  '/',
  '/products',
  '/services',
  '/about-us/',
  '/contact/',
  '/jewelbiz/',
  '/curabiz/',
  '/retailbiz/',
  '/blogs/',
  '/terms-of-use',
  '/privacy-policy/',
  '/careers',
  '/faq',
];

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function buildSitemapXml() {
  const posts = await getPublishedPostsForSitemap();
  const urls = [...STATIC_SITEMAP_PATHS];
  for (const post of posts) {
    if (post.slug) urls.push(`/blog/${post.slug}`);
  }

  const body = urls
    .map((loc) => {
      const abs = `${SITE_URL}${loc.startsWith('/') ? '' : '/'}${loc}`;
      return `  <url>\n    <loc>${xmlEscape(abs)}</loc>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function writeSitemapFile() {
  try {
    fs.writeFileSync(SITEMAP_PATH, await buildSitemapXml());
  } catch (err) {
    console.warn('Sitemap regenerate failed:', err.message);
  }
}

function validatePostBody(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.brand !== undefined) {
    if (!VALID_BRANDS.includes(body.brand)) errors.push('Invalid brand.');
  }
  if (!partial || body.slug !== undefined) {
    const slug = String(body.slug || '').trim();
    if (!slug) errors.push('Slug is required.');
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push('Invalid slug format.');
  }
  if (!partial || body.title !== undefined) {
    if (!String(body.title || '').trim()) errors.push('Title is required.');
  }
  if (!partial || body.description !== undefined) {
    if (!String(body.description || '').trim()) errors.push('Description is required.');
  }
  if (body.content !== undefined && !Array.isArray(body.content)) {
    errors.push('Content must be an array.');
  }
  return errors;
}

function sanitizePostInput(body) {
  const tagsRaw = body.tags;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map((t) => String(t).trim()).filter(Boolean)
    : String(tagsRaw || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  return {
    brand: body.brand,
    slug: String(body.slug || '').trim(),
    category_label: String(body.category_label || '').trim(),
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    hero_image: String(body.hero_image || '/logo.jpg').trim(),
    image_alt: String(body.image_alt || '').trim(),
    author: String(body.author || '').trim(),
    tags,
    date: String(body.date || '').trim(),
    read_time: String(body.read_time || '5 MIN READ').trim(),
    content: Array.isArray(body.content) ? body.content : [],
    published: Boolean(body.published),
    meta_title: String(body.meta_title || '').trim(),
    meta_description: String(body.meta_description || '').trim(),
    focus_keyword: String(body.focus_keyword || '').trim(),
    seo_keywords: String(body.seo_keywords || '').trim(),
    canonical_url: String(body.canonical_url || '').trim(),
    og_title: String(body.og_title || '').trim(),
    og_description: String(body.og_description || '').trim(),
    og_image: String(body.og_image || '').trim(),
    twitter_title: String(body.twitter_title || '').trim(),
    twitter_description: String(body.twitter_description || '').trim(),
    twitter_image: String(body.twitter_image || '').trim(),
    no_index: Boolean(body.no_index),
    no_follow: Boolean(body.no_follow),
  };
}

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const session = await getSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in again.' });
    }
    req.user = session.user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message || 'Auth error.' });
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
    const extOk = allowedExt.includes(ext);
    const mimeOk = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/pjpeg'].includes(file.mimetype);
    if (extOk && mimeOk) cb(null, true);
    else cb(new Error('Only JPG, PNG, and WebP images are allowed.'));
  },
});

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  })
);
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await connectDatabase();
    // Keep short SEO URLs working after deploys / DB restores
    ensureDefaultBlogRedirects().catch(() => {});
    res.json({
      ok: true,
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'local',
      database: 'supabase-postgres',
      storage: isSupabaseStorageConfigured ? 'supabase-storage' : 'not-configured',
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      error: err.message || 'Database unavailable. Set DATABASE_URL and DIRECT_URL.',
    });
  }
});

app.get('/api/auth/captcha', (_req, res) => {
  try {
    res.json(createCaptchaChallenge());
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not create captcha.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body || {};

    const captcha = verifyCaptchaChallenge(captchaId, captchaAnswer);
    if (!captcha.ok) {
      return res.status(400).json({ error: captcha.error });
    }

    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      const token = crypto.randomUUID();
      const user = { id: ADMIN_USER.id, email: ADMIN_USER.email, name: ADMIN_USER.name };
      await createSession(token, user);
      return res.json({ token, user });
    }
    return res.status(401).json({ error: 'Invalid email or password.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

app.post('/api/auth/logout', authMiddleware, async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) await deleteSession(token);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Logout failed.' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/posts', async (req, res) => {
  try {
    if (req.query.published === 'true') {
      return res.json(await listPosts({ publishedOnly: true }));
    }
    return authMiddleware(req, res, async () => {
      res.json(await listPosts());
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.get('/api/posts/slug/:slug', async (req, res) => {
  try {
    const post = await getPublishedPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    if (post._redirect_from) {
      res.set('X-Redirect-To', `/blog/${post.slug}`);
    }
    res.json(post);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.get('/api/posts/by-slug/:brand/:slug', async (req, res) => {
  try {
    const post = await getPublishedPostByBrandSlug(req.params.brand, req.params.slug);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json(post);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.get('/api/redirects/:slug', async (req, res) => {
  try {
    const redirect = await getRedirect(req.params.slug);
    if (!redirect) return res.status(404).json({ error: 'No redirect.' });
    res.json(redirect);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.get(['/api/sitemap.xml', '/sitemap.xml'], async (_req, res) => {
  try {
    const xml = await buildSitemapXml();
    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.get('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json(post);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const errors = validatePostBody(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const input = sanitizePostInput(req.body);
    const post = await createPost(input);
    await writeSitemapFile();
    res.status(201).json(post);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const errors = validatePostBody(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const existing = await getPostById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Post not found.' });

    const input = sanitizePostInput(req.body);
    const post = await updatePost(req.params.id, input, existing);
    await writeSitemapFile();
    res.json(post);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await deletePost(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Post not found.' });
    await writeSitemapFile();
    res.json({ ok: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error.' });
  }
});

app.post('/api/upload', authMiddleware, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed.' });
    if (!req.file) return res.status(400).json({ error: 'No file received. Choose a JPG, PNG, or WebP image.' });

    try {
      const url = await uploadBlogImage({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
      });
      res.json({ url });
    } catch (uploadErr) {
      res.status(400).json({ error: uploadErr.message || 'Upload failed.' });
    }
  });
});

// Legacy local uploads (old posts that still use /uploads/blogs/... paths)
app.use('/uploads', express.static(path.join(ROOT, 'public', 'uploads')));

async function start() {
  if (!process.env.DATABASE_URL) {
    console.error('\nDATABASE_URL is required. Add your Supabase Postgres connection string to .env\n');
    process.exit(1);
  }

  if (!isSupabaseStorageConfigured) {
    console.error('\nSUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for image uploads.\n');
    process.exit(1);
  }

  await connectDatabase();
  await ensureStorageBucket();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT} (${process.env.NODE_ENV === 'production' ? 'production' : 'local'})`);
    console.log('Database: Supabase Postgres via Prisma');
    console.log('Storage: Supabase Storage (blog-images bucket)');
    if (API_PUBLIC_URL) console.log(`Public URL: ${API_PUBLIC_URL}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Admin login: ${ADMIN_USER.email} / ${ADMIN_USER.password}`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use.`);
      console.error('Fix: run "npm run kill-server" then "npm run dev" again.\n');
      process.exit(1);
    }
    throw err;
  });

  await writeSitemapFile();
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
