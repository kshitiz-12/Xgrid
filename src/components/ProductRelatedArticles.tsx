import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { blogPath, SITE_URL } from '../lib/seo';
import { productSite } from '../lib/site';
import type { Brand } from '../types/blog';

type ProductTheme = 'orange' | 'blue' | 'navy';

const SECTION_COPY: Record<
  Brand,
  {
    theme: ProductTheme;
    headingLine1: string;
    headingLine2: string;
    description: string;
  }
> = {
  jewelbiz: {
    theme: 'orange',
    headingLine1: 'Insights for jewellers',
    headingLine2: 'from the JewelBiz team.',
    description:
      'Guides on billing, GST, inventory, karigar management, and compliance — written for Indian jewellery businesses.',
  },
  curabiz: {
    theme: 'blue',
    headingLine1: 'Hospital software insights',
    headingLine2: 'from the CuraBiz team.',
    description:
      'Articles on OPD, IPD, pharmacy, billing, and HIMS workflows — for clinics, nursing homes, and hospitals across India.',
  },
  retailbiz: {
    theme: 'navy',
    headingLine1: 'Retail operations insights',
    headingLine2: 'from the RetailBiz team.',
    description:
      'Tips on POS, inventory, GST billing, and multi-store retail — built for specialist retailers and chains.',
  },
};

const THEME_STYLES: Record<ProductTheme, { accent: string; link: string }> = {
  orange: { accent: 'text-[#FF641F]', link: 'text-blue-600 group-hover:text-blue-700' },
  blue: { accent: 'text-[#0C69B6]', link: 'text-[#0C69B6] group-hover:text-[#095a9d]' },
  navy: { accent: 'text-[#0d3b75]', link: 'text-[#0d3b75] group-hover:text-[#1e5eff]' },
};

type Props = {
  brand: Brand;
  limit?: number;
};

export default function ProductRelatedArticles({ brand, limit = 3 }: Props) {
  const { posts, loading } = useBlogPosts();
  const articles = posts.filter((p) => p.brand === brand).slice(0, limit);
  const copy = SECTION_COPY[brand];
  const styles = THEME_STYLES[copy.theme];

  if (loading) {
    return (
      <section className="w-full bg-white py-16">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">Loading articles…</p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block mb-6 px-3 py-1.5 bg-gray-100 text-gray-700 text-[11px] font-medium tracking-wide rounded-full">
          Related Articles
        </span>
        <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-slate-900">
          <span className="block text-[32px] md:text-[44px] lg:text-[52px]">{copy.headingLine1}</span>
          <span className={`block text-[32px] md:text-[44px] lg:text-[52px] italic ${styles.accent}`}>
            {copy.headingLine2}
          </span>
        </h2>
        <p className="mt-6 text-[16px] md:text-[17px] leading-[1.7] text-slate-600 max-w-3xl mx-auto">
          {copy.description}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const href = `${SITE_URL}${blogPath(article.slug)}`;
            const cardClass =
              'group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md text-left';
            const card = (
              <>
                <div className="overflow-hidden rounded-2xl m-3 border border-gray-100">
                  <img
                    src={article.heroImage}
                    alt={article.imageAlt || article.title}
                    width={640}
                    height={360}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 p-5 pt-0">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    {article.date} | {article.readTime}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed flex-1">{article.description}</p>
                  <div className="mt-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${styles.link}`}
                    >
                      Read {article.title} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </>
            );
            return productSite ? (
              <a key={article.id} href={href} className={cardClass}>
                {card}
              </a>
            ) : (
              <Link key={article.id} to={blogPath(article.slug)} className={cardClass}>
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
