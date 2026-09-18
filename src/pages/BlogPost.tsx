import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useBlogPost, useBlogPostBySlug, useBlogPosts } from '../hooks/useBlogPosts';
import BlogContentRenderer from '../components/BlogContentRenderer';
import SeoHead from '../components/SeoHead';
import { blogPath, pickRelatedArticles } from '../lib/seo';
import { brandDisplayTitle, type Brand } from '../types/blog';

export default function BlogPost() {
  const params = useParams();
  const brand = params.brand;
  const slug = params.slug?.replace(/\/+$/, '');
  const bySlug = useBlogPostBySlug(brand ? undefined : slug);
  const byBrand = useBlogPost(brand, slug);
  const { post, loading, error } = brand ? byBrand : bySlug;
  const redirectTo = brand && post ? blogPath(post.slug) : bySlug.redirectTo;
  const { posts: allPosts } = useBlogPosts();

  const related = useMemo(() => {
    if (!post) return [];
    return pickRelatedArticles(
      {
        id: post.id,
        brand: post.brand,
        slug: post.slug,
        title: post.title,
        description: post.description,
        categoryLabel: post.categoryLabel,
        tags: post.tags,
        focusKeyword: post.focusKeyword,
        heroImage: post.heroImage,
        date: post.date,
        readTime: post.readTime,
      },
      allPosts.map((p) => ({
        id: p.id,
        brand: p.brand,
        slug: p.slug,
        title: p.title,
        description: p.description,
        categoryLabel: p.categoryLabel,
        tags: p.tags,
        focusKeyword: p.focusKeyword,
        heroImage: p.heroImage,
        date: p.date,
        readTime: p.readTime,
      })),
      3
    );
  }, [post, allPosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#0C69B6]/30 border-t-[#0C69B6] animate-spin" />
          <p className="text-sm text-slate-500">Loading article…</p>
        </div>
      </div>
    );
  }

  if (redirectTo && redirectTo !== `/blog/${slug}`) {
    return <Navigate to={redirectTo} replace />;
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">{error}</p>
          <Link
            to="/blogs/"
            className="mt-6 inline-flex items-center gap-2 text-[#0C69B6] font-semibold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Blog not found.</p>
          <Link
            to="/blogs/"
            className="mt-6 inline-flex items-center gap-2 text-[#0C69B6] font-semibold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        source={{
          title: post.title,
          description: post.description,
          slug: post.slug,
          heroImage: post.heroImage,
          imageAlt: post.imageAlt || post.title,
          author: post.author || 'SlateBiz Editorial',
          categoryLabel: post.categoryLabel,
          tags: post.tags,
          seoKeywords: (post.tags || []).join(', '),
          publishedAt: post.publishedAt || post.createdAt,
          updatedAt: post.updatedAt,
          noIndex: !post.published,
          noFollow: false,
        }}
        includeJsonLd={Boolean(post.published)}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16"
        style={{
          background: 'linear-gradient(105deg, #E8F2FB 0%, #F3EFF7 42%, #FBEDE6 100%)',
        }}
      >
        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blogs/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0C69B6] hover:text-[#095a9d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All blogs
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white/90 border border-[#0C69B6]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0C69B6]">
              {brandDisplayTitle(post.brand)}
            </span>
            {post.categoryLabel && post.categoryLabel !== brandDisplayTitle(post.brand) ? (
              <span className="inline-flex items-center rounded-full bg-white/70 border border-slate-200/80 px-3 py-1 text-[11px] font-medium text-slate-600">
                {post.categoryLabel}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 font-serif font-normal text-[28px] sm:text-[36px] md:text-[44px] leading-[1.15] tracking-[-0.02em] text-slate-900">
            {post.title}
          </h1>

          {post.description ? (
            <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-slate-600 max-w-[640px]">
              {post.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500">
            <span className="font-medium text-slate-700">{post.author || 'SlateBiz Editorial'}</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span>{post.date}</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4">
        <div className="overflow-hidden rounded-2xl sm:rounded-[1.5rem] border border-white shadow-[0_24px_60px_rgba(15,25,35,0.12)] bg-slate-100">
          <img
            src={post.heroImage}
            alt={post.imageAlt || post.title}
            className="w-full aspect-[16/9] object-cover object-center block"
          />
        </div>
      </div>

      {/* Article body */}
      {post.content && post.content.length > 0 ? (
        <article className="pt-10 md:pt-14">
          <BlogContentRenderer content={post.content} />
        </article>
      ) : (
        <section className="py-16">
          <div className="max-w-[1000px] mx-auto px-4 text-center">
            <p className="text-slate-500">No article content yet.</p>
          </div>
        </section>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 ? (
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[12px] font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* CTA */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="rounded-2xl border border-slate-200/80 px-6 py-8 text-center sm:px-10 sm:py-10 shadow-[0_12px_40px_rgba(15,25,35,0.06)]"
          style={{
            background: 'linear-gradient(115deg, #E8F2FB 0%, #F7F8FC 48%, #FBEDE6 100%)',
          }}
        >
          <h2 className="font-serif font-normal text-[24px] sm:text-[30px] leading-[1.2] tracking-[-0.02em] text-slate-900">
            Ready to see this in your{' '}
            <em className="italic text-[#FF641F]">business?</em>
          </h2>
          <p className="mt-3 text-slate-600 text-[14px] sm:text-[15px] max-w-lg mx-auto leading-relaxed">
            Book a free demo — we configure it around your workflows, not a sample dataset.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact/"
              className="w-full sm:w-auto min-w-[160px] h-[46px] inline-flex items-center justify-center rounded-[10px] bg-[#FF641F] text-white text-[14px] font-semibold hover:bg-[#E55A18] transition-colors"
            >
              Book a free demo
            </Link>
            <Link
              to="/blogs/"
              className="w-full sm:w-auto min-w-[160px] h-[46px] inline-flex items-center justify-center rounded-[10px] border border-slate-800 bg-white text-[#0C69B6] text-[14px] font-semibold hover:bg-slate-50 transition-colors"
            >
              More articles
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-[#F8FAFC] py-14 sm:py-20 border-t border-slate-100">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C69B6] mb-2">
                Keep reading
              </p>
              <h2 className="font-serif font-normal text-[28px] sm:text-[34px] leading-[1.15] text-slate-900">
                Related articles
              </h2>
            </div>
            <Link
              to="/blogs/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C69B6] hover:text-[#095a9d]"
            >
              View all blogs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {related.length === 0 ? (
            <p className="text-sm text-slate-500">No closely related articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id ?? `${p.brand}/${p.slug}`}
                  to={blogPath(p.slug)}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(12,105,182,0.1)]"
                >
                  <div className="overflow-hidden aspect-[16/10] bg-slate-100">
                    <img
                      src={p.heroImage}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                      {p.date} · {p.readTime} · {brandDisplayTitle(p.brand as Brand)}
                    </p>
                    <h3 className="font-serif text-[18px] sm:text-[20px] leading-snug text-slate-900 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                      {p.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C69B6] transition-colors group-hover:text-[#095a9d]">
                      Read more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
