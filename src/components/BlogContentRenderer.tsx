import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BlogContent, BlogSection, ContentBlock } from '../types/blog';
import { isLegacyContent, splitParagraphs } from '../types/blog';
import { resolveMediaUrl } from '../lib/media';
import BlogSectionHeader from './blog/BlogSectionHeader';
import BlogFAQItem from './blog/BlogFAQItem';
import { blogPath } from '../lib/seo';

const paragraphClass = 'text-slate-600 leading-[1.85] text-[15.5px] md:text-[16.5px] text-justify';
const paragraphSmClass = 'text-slate-600 leading-[1.85] text-[15.5px] text-justify';

/** Fix /blog/slug/ → /blog/slug so Read Next links match the app route. */
function normalizeBlogHtml(html: string): string {
  return html.replace(
    /(href=["'])(\/blog\/[a-z0-9-]+)\/(["'#?\s>])/gi,
    '$1$2$3'
  );
}

function BlogHtmlBody({ html }: { html: string }) {
  const navigate = useNavigate();
  const normalized = normalizeBlogHtml(html);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      return;
    }
    if (anchor.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    if (href.startsWith('/blog/')) {
      const slug = href.replace(/^\/blog\//, '').replace(/\/+$/, '').split(/[?#]/)[0];
      navigate(blogPath(slug));
      return;
    }
    navigate(href);
  };

  return (
    <div
      className="blog-html-content prose prose-slate max-w-none"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: normalized }}
    />
  );
}

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openFaq, setOpenFaq] = useState(0);
  const filtered = items.filter((f) => f.q || f.a);
  if (!filtered.length) return null;

  return (
    <div className="mt-10 space-y-3">
      {filtered.map((item, idx) => (
        <BlogFAQItem
          key={item.q || idx}
          q={item.q}
          a={item.a}
          open={openFaq === idx}
          onToggle={() => setOpenFaq(openFaq === idx ? -1 : idx)}
        />
      ))}
    </div>
  );
}

function renderSection(section: BlogSection) {
  const safe = {
    ...section,
    subsections: section.subsections ?? [],
    faqs: section.faqs ?? [],
  };
  const paragraphs = splitParagraphs(safe.body);

  return (
    <section
      key={safe.id}
      className={`py-8 md:py-12${safe.whiteBg ? ' bg-white' : ''}`}
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {safe.title ? <BlogSectionHeader title={safe.title} desc={safe.desc} /> : null}

        {safe.image ? (
          <div className="rounded-2xl overflow-hidden mb-8 border border-slate-100 shadow-sm max-w-[1100px] mx-auto">
            <img
              src={resolveMediaUrl(safe.image)}
              alt={safe.imageAlt || safe.title || 'Section image'}
              className="w-full h-auto"
            />
          </div>
        ) : null}

        {(safe.afterImageTitle || paragraphs.length > 0) && (
          <div className="text-left">
            {safe.afterImageTitle ? (
              <h3 className="font-serif text-[22px] sm:text-[26px] font-normal text-slate-900 tracking-[-0.01em] leading-snug text-left">
                {safe.afterImageTitle}
              </h3>
            ) : null}
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`${i === 0 && safe.afterImageTitle ? 'mt-4 ' : i > 0 ? 'mt-5 ' : ''}${paragraphClass}`}
              >
                {p}
              </p>
            ))}
          </div>
        )}

        {safe.subsections.filter((s) => s.title || s.body).length > 0 && (
          <div className="mt-10 space-y-10 text-left">
            {safe.subsections
              .filter((s) => s.title || s.body)
              .map((sub) => (
                <div key={sub.id}>
                  {sub.title ? (
                    <h3 className="font-serif text-[22px] sm:text-[24px] font-normal text-slate-900 tracking-[-0.01em] leading-snug text-left">
                      {sub.title}
                    </h3>
                  ) : null}
                  {splitParagraphs(sub.body).map((p, i) => (
                    <p key={i} className={`mt-4 ${paragraphSmClass}`}>
                      {p}
                    </p>
                  ))}
                </div>
              ))}
          </div>
        )}

        {safe.faqs.length > 0 && <FAQAccordion items={safe.faqs} />}
      </div>
    </section>
  );
}

function LegacyFAQBlock({ blockId, items }: { blockId: string; items: { q: string; a: string }[] }) {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <div className="my-6 space-y-3">
      {items.map((item, idx) => (
        <BlogFAQItem
          key={`${blockId}-${item.q || idx}`}
          q={item.q}
          a={item.a}
          open={openFaq === idx}
          onToggle={() => setOpenFaq(openFaq === idx ? -1 : idx)}
        />
      ))}
    </div>
  );
}

function LegacyRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case 'section':
            return (
              <section
                key={block.id}
                className={`py-8 md:py-12${block.variant === 'white' ? ' bg-white' : ''}`}
              >
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                  <BlogSectionHeader kicker={block.kicker} title={block.title} desc={block.desc} />
                  <LegacyRenderer blocks={block.blocks} />
                </div>
              </section>
            );
          case 'paragraph':
            return (
              <p key={block.id} className={`${paragraphClass} py-2 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8`}>
                {block.content}
              </p>
            );
          case 'heading':
            return block.level === 3 ? (
              <h3
                key={block.id}
                className="font-serif text-[22px] sm:text-[24px] font-normal text-slate-900 tracking-[-0.01em] leading-snug py-3 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8"
              >
                {block.content}
              </h3>
            ) : (
              <h2
                key={block.id}
                className="font-serif text-[26px] sm:text-[30px] font-normal text-slate-900 tracking-[-0.02em] leading-snug py-4 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8"
              >
                {block.content}
              </h2>
            );
          case 'image':
            return block.src ? (
              <div key={block.id} className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 my-8">
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={resolveMediaUrl(block.src)} alt={block.alt || ''} className="w-full h-auto" />
                </div>
              </div>
            ) : null;
          case 'list':
            return (
              <ul
                key={block.id}
                className="my-5 space-y-2.5 text-slate-600 text-[15px] leading-relaxed list-disc pl-5 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8"
              >
                {block.items.filter(Boolean).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case 'faq':
            return (
              <div key={block.id} className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                <LegacyFAQBlock blockId={block.id} items={block.items} />
              </div>
            );
          case 'html':
            return block.html?.trim() ? (
              <section key={block.id} className="py-8 md:py-12">
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                  <BlogHtmlBody html={block.html} />
                </div>
              </section>
            ) : null;
          default:
            return null;
        }
      })}
    </>
  );
}

export default function BlogContentRenderer({ content }: { content: BlogContent }) {
  if (!content.length) return null;

  if (isLegacyContent(content)) {
    return <LegacyRenderer blocks={content} />;
  }

  return <>{content.map(renderSection)}</>;
}
