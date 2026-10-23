/**
 * Writes robots.txt and sitemap.xml sources for the three public sites.
 * Vercel rewrites /robots.txt and /sitemap.xml to these files by hostname.
 * Every <loc> is the www URL that returns 200 — apex hosts 308 to www.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seoDir = path.join(root, 'public', 'seo');

const ORIGIN = {
  slatebiz: 'https://www.slatebiz.com',
  jewelbiz: 'https://www.jewelbiz.in',
  curabiz: 'https://www.curabiz.in',
};

/** Indexable SlateBiz pages. Placeholder routes (products, services, retailbiz) stay out. */
const SLATEBIZ_PATHS = [
  '/',
  '/about-us/',
  '/contact/',
  '/blogs/',
  '/terms-of-use',
  '/privacy-policy/',
  '/careers',
  '/faq',
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlset(entries) {
  const body = entries
    .map((entry) => {
      const loc = typeof entry === 'string' ? entry : entry.loc;
      const lastmod = typeof entry === 'string' ? '' : entry.lastmod || '';
      const lastmodLine = /^\d{4}-\d{2}-\d{2}$/.test(lastmod) ? `\n    <lastmod>${lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodLine}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function robots(sitemapUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
}

function blogLoc(post) {
  const slug = String(post.slug || '').trim();
  if (!slug) return null;
  const canonical = String(post.canonical_url || '').trim();
  if (/^https?:\/\//i.test(canonical)) {
    try {
      const url = new URL(canonical);
      if (url.hostname.replace(/^www\./, '') !== 'slatebiz.com') return null;
      const pathname = url.pathname.replace(/\/+$/, '') || '/';
      return `${ORIGIN.slatebiz}${pathname}`;
    } catch {
      return null;
    }
  }
  return `${ORIGIN.slatebiz}/blog/${slug}`;
}

async function blogEntriesFromApi() {
  const api = (process.env.VITE_API_URL || 'https://xgrid.onrender.com').replace(/\/$/, '');
  const res = await fetch(`${api}/api/posts?published=true`, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`posts API returned ${res.status}`);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error('posts API did not return a list');
  return rows
    .filter((post) => post && post.published !== false && !post.no_index)
    .map((post) => ({
      loc: blogLoc(post),
      lastmod: String(post.updated_at || post.published_at || '').slice(0, 10),
    }))
    .filter((entry) => entry.loc);
}

async function blogEntriesFromExistingSitemap() {
  const existing = await readFile(path.join(seoDir, 'sitemap-slatebiz.xml'), 'utf8').catch(() => '');
  return [...existing.matchAll(/<loc>(https:\/\/(?:www\.)?slatebiz\.com\/blog\/[^<]+)<\/loc>/g)].map((match) => ({
    loc: match[1].replace('https://slatebiz.com/', 'https://www.slatebiz.com/'),
    lastmod: '',
  }));
}

let blogEntries;
try {
  blogEntries = await blogEntriesFromApi();
  console.log(`sitemap: ${blogEntries.length} published posts from the API`);
} catch (err) {
  console.warn(`sitemap: API unavailable (${err.message}); keeping blog URLs already listed`);
  blogEntries = await blogEntriesFromExistingSitemap();
}

const seen = new Set();
const blogs = [];
for (const entry of blogEntries) {
  if (seen.has(entry.loc)) continue;
  seen.add(entry.loc);
  blogs.push(entry.lastmod ? entry : entry.loc);
}

const slatebizUrls = SLATEBIZ_PATHS.map((pathname) => `${ORIGIN.slatebiz}${pathname === '/' ? '/' : pathname}`);

await writeFile(path.join(seoDir, 'sitemap-slatebiz.xml'), urlset([...slatebizUrls, ...blogs]));
await writeFile(path.join(seoDir, 'sitemap-jewelbiz.xml'), urlset([`${ORIGIN.jewelbiz}/`]));
await writeFile(path.join(seoDir, 'sitemap-curabiz.xml'), urlset([`${ORIGIN.curabiz}/`]));

function llmsTxt({ title, summary, pages }) {
  return [`# ${title}`, '', `> ${summary}`, '', '## Pages', ...pages.map((page) => `- [${page.title}](${page.url}): ${page.note}`), ''].join('\n');
}

await writeFile(path.join(seoDir, 'robots-slatebiz.txt'), robots(`${ORIGIN.slatebiz}/sitemap.xml`));
await writeFile(path.join(seoDir, 'robots-jewelbiz.txt'), robots(`${ORIGIN.jewelbiz}/sitemap.xml`));
await writeFile(path.join(seoDir, 'robots-curabiz.txt'), robots(`${ORIGIN.curabiz}/sitemap.xml`));

await writeFile(
  path.join(seoDir, 'llms-slatebiz.txt'),
  llmsTxt({
    title: 'SlateBiz Softwares',
    summary:
      'SlateBiz Softwares is a Jaipur company. It builds JewelBiz jewellery ERP, CuraBiz hospital software, and RetailBiz. Jewellery and hospital articles are published on this site.',
    pages: [
      { title: 'Home', url: `${ORIGIN.slatebiz}/`, note: 'ERP software company in Jaipur' },
      { title: 'JewelBiz', url: `${ORIGIN.jewelbiz}/`, note: 'Jewellery ERP, GST billing, HUID, karigar and stock' },
      { title: 'CuraBiz', url: `${ORIGIN.curabiz}/`, note: 'Hospital management software for clinics and hospitals' },
      { title: 'Blog', url: `${ORIGIN.slatebiz}/blogs/`, note: 'Jewellery, hospital and retail guides' },
      { title: 'Contact', url: `${ORIGIN.slatebiz}/contact/`, note: 'Book a demo or 14-day trial' },
    ],
  })
);
await writeFile(
  path.join(seoDir, 'llms-jewelbiz.txt'),
  llmsTxt({
    title: 'JewelBiz',
    summary:
      'JewelBiz is jewellery ERP and billing software for retail, wholesale and manufacturing jewellers in India. It is a product of SlateBiz Softwares, Jaipur. Guides are published on slatebiz.com.',
    pages: [
      { title: 'JewelBiz', url: `${ORIGIN.jewelbiz}/`, note: 'Jewellery software, GST billing, HUID, karigar job work and multi-branch stock' },
      { title: 'Jewellery guides', url: `${ORIGIN.slatebiz}/blogs/`, note: 'Billing, inventory, GST, karigar and showroom articles' },
      { title: 'Book a demo', url: `${ORIGIN.slatebiz}/contact/`, note: '14-day trial and on-site setup from Jaipur' },
    ],
  })
);
await writeFile(
  path.join(seoDir, 'llms-curabiz.txt'),
  llmsTxt({
    title: 'CuraBiz',
    summary:
      'CuraBiz is hospital management software for clinics, nursing homes and hospitals in India. It is a product of SlateBiz Softwares, Jaipur.',
    pages: [
      { title: 'CuraBiz', url: `${ORIGIN.curabiz}/`, note: 'OPD, IPD, e-prescription, pharmacy, lab and billing' },
      { title: 'Hospital guides', url: `${ORIGIN.slatebiz}/blogs/`, note: 'HIMS, pharmacy and clinic articles' },
      { title: 'Book a demo', url: `${ORIGIN.slatebiz}/contact/`, note: 'Talk to SlateBiz about CuraBiz' },
    ],
  })
);

console.log(`seo files written: slatebiz ${slatebizUrls.length + blogs.length} urls, jewelbiz 1, curabiz 1`);
