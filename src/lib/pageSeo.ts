import { SITE_URL } from './seo';
import { JEWELBIZ_FAQ } from '../data/jewelbizFaq';
import { PRODUCT_DOMAINS, productSite, type ProductSite } from './site';

export type PageSeoConfig = {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

const COMPANY = {
  name: 'SlateBiz Softwares',
  email: 'info@slatebiz.com',
  phone: '+91-9257373668',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'DH-079, 1st Floor, Ansal Sushant City-1, Kalwar Road',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '303706',
    addressCountry: 'IN',
  },
};

const PRODUCT_INFO: Record<
  ProductSite,
  { name: string; category: string; description: string; logo: string; image: string }
> = {
  jewelbiz: {
    name: 'JewelBiz',
    category: 'Jewellery ERP and billing software',
    description:
      'Jewellery ERP and billing software for retail, wholesale and manufacturing jewellers in India — GST billing, HUID, karigar job work, stock and multi-branch control.',
    logo: '/jewelbiz-logo.png',
    image: '/jewelbiz-hero-bg-v2.webp',
  },
  curabiz: {
    name: 'CuraBiz',
    category: 'Hospital management software (HIMS)',
    description:
      'Hospital management software connecting OPD, IPD, e-prescription, pharmacy, lab and billing on a single patient record for Indian clinics, nursing homes and hospitals.',
    logo: '/curabiz-logo.png',
    image: '/curabiz-hero-wide.webp',
  },
};

const PRODUCT_PAGE_SEO: Record<ProductSite, PageSeoConfig> = {
  jewelbiz: {
    title: 'Jewellery Software in Jaipur | Jewellery ERP & Billing – JewelBiz',
    description:
      'JewelBiz jewellery software for retail, wholesale & manufacturing jewellers — GST billing, HUID, karigar job work, stock & multi-branch. By SlateBiz, Jaipur.',
    image: PRODUCT_INFO.jewelbiz.image,
  },
  curabiz: {
    title: 'Hospital Management Software | HIMS for Clinics & Hospitals – CuraBiz',
    description:
      'CuraBiz HIMS connects OPD, IPD, e-prescription, pharmacy, lab and billing on one patient record for clinics, nursing homes and hospitals. By SlateBiz, Jaipur.',
    image: PRODUCT_INFO.curabiz.image,
  },
};

const PAGE_SEO: Record<string, PageSeoConfig> = {
  '/': {
    title: 'SlateBiz Softwares | ERP Software Company in Jaipur',
    description:
      'SlateBiz builds industry-specific ERP software in Jaipur — JewelBiz jewellery software, CuraBiz hospital management and RetailBiz retail ERP. Book a free demo.',
  },
  '/products': {
    title: 'ERP Products – Jewellery, Hospital & Retail Software | SlateBiz',
    description:
      'Explore SlateBiz ERP products: JewelBiz for jewellers, CuraBiz for hospitals and clinics, RetailBiz for specialised retail, plus custom ERP for your workflows.',
    // "Coming soon" placeholder; index once it has real content.
    noIndex: true,
  },
  '/services': {
    title: 'ERP Implementation, Data Migration & Support Services | SlateBiz',
    description:
      'SlateBiz handles ERP setup, data migration, on-site training, compliance updates and dedicated support so your team goes live without disruption.',
    noIndex: true,
  },
  '/about-us/': {
    title: 'About SlateBiz Softwares – ERP Software Company, Jaipur',
    description:
      'SlateBiz Softwares is a Jaipur-based company building purpose-built ERP software for jewellers, hospitals and retailers across India. Our mission and vision.',
  },
  '/contact/': {
    title: 'Contact SlateBiz – Book a Free ERP Demo | Jaipur',
    description:
      'Talk to SlateBiz about JewelBiz, CuraBiz or RetailBiz. Book a free demo or 14-day trial. Call +91 92573 73668 or email info@slatebiz.com.',
  },
  '/retailbiz/': {
    title: 'Retail ERP & Billing Software for Specialised Retail – RetailBiz',
    description:
      'RetailBiz retail ERP for specialised retailers — billing, barcode stock, purchase, GST and multi-store reporting in one system. By SlateBiz, Jaipur.',
    noIndex: true,
  },
  '/blogs/': {
    title: 'Blog – Jewellery, Hospital & Retail ERP Guides | SlateBiz',
    description:
      'Practical guides on jewellery billing, GST, HUID, hospital management and retail operations from the SlateBiz team.',
  },
  '/terms-of-use': {
    title: 'Terms of Use | SlateBiz Softwares',
    description: 'Terms of use for SlateBiz Softwares software, licences and services.',
  },
  '/privacy-policy/': {
    title: 'Privacy Policy | SlateBiz Softwares',
    description: 'How SlateBiz Softwares collects, uses, protects and retains your information.',
  },
  '/careers': {
    title: 'Careers at SlateBiz – Jobs in Jaipur & Remote',
    description:
      'Join SlateBiz to build ERP software India’s businesses run on. Open roles in engineering, marketing, creative and business development — freshers welcome.',
  },
  '/faq': {
    title: 'FAQ – SlateBiz ERP Software',
    description: 'Answers to common questions about SlateBiz ERP software, pricing, deployment, training and support.',
  },
};

const PRODUCT_PATHS: Record<string, ProductSite> = {
  '/jewelbiz/': 'jewelbiz',
  '/curabiz/': 'curabiz',
};

function normalizePath(pathname: string): string {
  if (pathname === '/') return '/';
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (PRODUCT_PATHS[withSlash] || PAGE_SEO[withSlash]) return withSlash;
  const without = pathname.replace(/\/+$/, '');
  return PAGE_SEO[without] ? without : pathname;
}

/** Which product (if any) a path represents on the current domain. */
function productForPath(path: string): ProductSite | null {
  if (path === '/' && productSite) return productSite;
  return PRODUCT_PATHS[path] ?? null;
}

/**
 * Canonical URL rules: product pages live at the root of their own domain;
 * every other page belongs to slatebiz.com, whichever domain it is opened on.
 */
export function canonicalFor(pathname: string): string {
  const path = normalizePath(pathname);
  const product = productForPath(path);
  if (product) return `${PRODUCT_DOMAINS[product]}/`;
  return `${SITE_URL}${path}`;
}

export function seoForPath(pathname: string): PageSeoConfig | null {
  const path = normalizePath(pathname);
  const product = productForPath(path);
  if (product) return PRODUCT_PAGE_SEO[product];
  return PAGE_SEO[path] ?? null;
}

export function absoluteFor(pathname: string, asset: string): string {
  if (/^https?:\/\//i.test(asset)) return asset;
  const origin = new URL(canonicalFor(pathname)).origin;
  return `${origin}${asset.startsWith('/') ? '' : '/'}${asset}`;
}

function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: COMPANY.name,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.webp`,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: COMPANY.address,
    brand: (Object.keys(PRODUCT_INFO) as ProductSite[]).map((key) => ({
      '@type': 'Brand',
      name: PRODUCT_INFO[key].name,
      url: `${PRODUCT_DOMAINS[key]}/`,
    })),
    sameAs: [
      ...Object.values(PRODUCT_DOMAINS).map((url) => `${url}/`),
      'https://www.linkedin.com/company/slatebiz/',
    ],
  };
}

export function jsonLdForPath(pathname: string): Record<string, unknown> | null {
  const path = normalizePath(pathname);
  const product = productForPath(path);

  if (product) {
    const info = PRODUCT_INFO[product];
    const url = `${PRODUCT_DOMAINS[product]}/`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        organizationNode(),
        {
          '@type': 'SoftwareApplication',
          '@id': `${url}#software`,
          name: info.name,
          url,
          applicationCategory: 'BusinessApplication',
          applicationSubCategory: info.category,
          operatingSystem: 'Windows, Android, iOS, Web',
          description: info.description,
          image: `${PRODUCT_DOMAINS[product]}${info.image}`,
          brand: { '@type': 'Brand', name: info.name, logo: `${PRODUCT_DOMAINS[product]}${info.logo}` },
          publisher: { '@id': `${SITE_URL}/#organization` },
          offers: {
            '@type': 'Offer',
            description: '14-day free trial',
            price: '0',
            priceCurrency: 'INR',
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${url}#website`,
          name: info.name,
          url,
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        ...(product === 'jewelbiz'
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                mainEntity: JEWELBIZ_FAQ.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: { '@type': 'Answer', text: item.answer },
                })),
              },
            ]
          : []),
      ],
    };
  }

  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        organizationNode(),
        {
          '@type': 'LocalBusiness',
          '@id': `${SITE_URL}/#localbusiness`,
          name: COMPANY.name,
          url: `${SITE_URL}/`,
          image: `${SITE_URL}/logo.webp`,
          telephone: COMPANY.phone,
          email: COMPANY.email,
          address: COMPANY.address,
          parentOrganization: { '@id': `${SITE_URL}/#organization` },
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: COMPANY.name,
          url: `${SITE_URL}/`,
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    };
  }

  return null;
}
