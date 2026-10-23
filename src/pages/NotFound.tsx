import { Link } from 'react-router-dom';
import { PRODUCT_DOMAINS, productSite } from '../lib/site';
import { SITE_URL } from '../lib/seo';

const links = [
  { label: 'SlateBiz', href: productSite ? `${SITE_URL}/` : '/' },
  { label: 'JewelBiz', href: `${PRODUCT_DOMAINS.jewelbiz}/` },
  { label: 'CuraBiz', href: `${PRODUCT_DOMAINS.curabiz}/` },
  { label: 'Blog', href: productSite ? `${SITE_URL}/blogs/` : '/blogs/' },
  { label: 'Contact', href: productSite ? `${SITE_URL}/contact/` : '/contact/' },
];

function SiteLink({ href, children }: Readonly<{ href: string; children: string }>) {
  const className = 'text-[14px] font-medium text-slate-600 transition-colors hover:text-[#0C69B6]';
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-[#F7F8FC] px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#0C69B6]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#FF641F]/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="font-inter text-[13px] font-semibold uppercase tracking-[0.22em] text-[#0C69B6]">404</p>
        <h1 className="mt-4 text-[40px] text-slate-900 sm:text-[52px]">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-slate-600">
          This address is not a page on SlateBiz, JewelBiz, or CuraBiz.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-[50px] items-center justify-center rounded-[10px] bg-[#0C69B6] px-8 text-[12px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#0A5A9C]"
        >
          Back to home
        </Link>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Helpful pages">
          {links.map((link) => (
            <SiteLink key={link.label} href={link.href}>
              {link.label}
            </SiteLink>
          ))}
        </nav>
      </div>
    </section>
  );
}
