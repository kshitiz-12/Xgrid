import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { DEFAULT_OG_IMAGE, SITE_NAME } from '../lib/seo';
import { absoluteFor, canonicalFor, jsonLdForPath, seoForPath } from '../lib/pageSeo';

/** Page-level SEO for static routes. Blog posts render their own tags via SeoHead. */
export default function RouteSeo() {
  const { pathname } = useLocation();

  if (/^\/blogs?\/[^/]+/.test(pathname) && pathname !== '/blogs/' && pathname !== '/blogs') return null;

  const seo = seoForPath(pathname);
  const canonical = canonicalFor(pathname);
  const jsonLd = jsonLdForPath(pathname);

  if (!seo) {
    return (
      <Helmet>
        <title>Page not found | SlateBiz</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonical} />
      </Helmet>
    );
  }

  const image = seo.image ? absoluteFor(pathname, seo.image) : DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={seo.noIndex ? 'noindex, follow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={image} />

      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
