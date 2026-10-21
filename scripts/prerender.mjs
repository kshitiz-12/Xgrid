/**
 * Writes real HTML for each public page so crawlers get content without running JS.
 * Output: dist/_pages/<site>/<name>.html, mapped to URLs by host-aware rewrites in vercel.json.
 * Routes not listed here (blog posts, admin) fall back to dist/app-shell.html.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverEntry = pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href;

const SITES = {
  slatebiz: [
    '/',
    '/products',
    '/services',
    '/about-us/',
    '/contact/',
    '/retailbiz/',
    '/blogs/',
    '/terms-of-use',
    '/privacy-policy/',
    '/careers',
    '/faq',
  ],
  jewelbiz: ['/'],
  curabiz: ['/'],
};

const fileNameFor = (route) => (route === '/' ? 'index' : route.replace(/^\/|\/$/g, ''));

// Helmet emits its own versions of these; drop the shell defaults so tags are not duplicated.
const DEFAULT_HEAD_TAGS =
  /\s*<title>[\s\S]*?<\/title>|\s*<meta\s+(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g;

const shell = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!shell.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root');
await writeFile(path.join(dist, 'app-shell.html'), shell);
const bareShell = shell.replace(DEFAULT_HEAD_TAGS, '');

let count = 0;
for (const [site, routes] of Object.entries(SITES)) {
  globalThis.__PRERENDER_SITE__ = site === 'slatebiz' ? undefined : site;
  // A distinct URL gives each site a fresh module instance, so `productSite` is re-evaluated.
  const { render } = await import(`${serverEntry}?site=${site}`);
  const outDir = path.join(dist, '_pages', site);
  await mkdir(outDir, { recursive: true });

  for (const route of routes) {
    const { html, head } = await render(route);
    if (!html.trim()) throw new Error(`Empty render for ${site} ${route}`);
    const page = bareShell
      .replace('</head>', `    ${head}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    await writeFile(path.join(outDir, `${fileNameFor(route)}.html`), page);
    count += 1;
  }
}

// Without a root index.html, "/" reaches the host-aware rewrites instead of one static file.
await rm(path.join(dist, 'index.html'));
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerendered ${count} pages`);
