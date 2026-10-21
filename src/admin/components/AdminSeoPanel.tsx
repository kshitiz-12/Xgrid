import type { ReactNode } from 'react';
import { evaluateSeo, INTERNAL_LINK_PRESETS, type SeoCheck } from '../../lib/seo';

type Props = {
  title: string;
  description: string;
  slug: string;
  heroImage: string;
  imageAlt: string;
  author: string;
  tags: string[];
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  noIndex: boolean;
  noFollow: boolean;
  contentText: string;
  internalLinkCount: number;
  onChange: (patch: Partial<Props>) => void;
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

function inputClass() {
  return 'w-full px-4 py-2.5 rounded-[10px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0C69B6]/20 focus:border-[#0C69B6]';
}

function CheckRow({ check }: { check: SeoCheck }) {
  const color =
    check.status === 'pass'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
      : check.status === 'warn'
        ? 'text-amber-800 bg-amber-50 border-amber-100'
        : 'text-red-700 bg-red-50 border-red-100';
  const badge =
    check.status === 'pass' ? 'Pass' : check.status === 'warn' ? 'Warn' : 'Fail';
  return (
    <div className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${color}`}>
      <div>
        <p className="font-medium">{check.label}</p>
        <p className="text-xs opacity-80 mt-0.5">{check.detail}</p>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wide shrink-0">{badge}</span>
    </div>
  );
}

export default function AdminSeoPanel(props: Props) {
  const { score, checks } = evaluateSeo({
    title: props.title,
    description: props.description,
    slug: props.slug,
    heroImage: props.heroImage,
    imageAlt: props.imageAlt,
    author: props.author,
    tags: props.tags,
    focusKeyword: props.focusKeyword,
    metaTitle: props.metaTitle,
    metaDescription: props.metaDescription,
    seoKeywords: props.seoKeywords,
    canonicalUrl: props.canonicalUrl,
    ogTitle: props.ogTitle,
    ogDescription: props.ogDescription,
    ogImage: props.ogImage,
    twitterTitle: props.twitterTitle,
    twitterDescription: props.twitterDescription,
    twitterImage: props.twitterImage,
    contentText: props.contentText,
    internalLinkCount: props.internalLinkCount,
    noIndex: props.noIndex,
    noFollow: props.noFollow,
  });

  const set = (patch: Partial<Props>) => props.onChange(patch);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">SEO settings</h2>
          <p className="text-sm text-slate-500 mt-1">
            Leave fields blank to auto-generate from title, excerpt, and featured image.
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-slate-50 px-4 py-3 text-center min-w-[110px]">
          <p className="text-2xl font-bold text-slate-900">{score}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">SEO score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="SEO / Meta title" hint="Recommended 30–60 characters">
          <input
            value={props.metaTitle}
            onChange={(e) => set({ metaTitle: e.target.value })}
            className={inputClass()}
            placeholder={props.title || 'Defaults to blog title'}
          />
        </Field>
        <Field label="Focus keyword">
          <input
            value={props.focusKeyword}
            onChange={(e) => set({ focusKeyword: e.target.value })}
            className={inputClass()}
            placeholder="e.g. jewellery erp software"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Meta description" hint="Recommended 70–160 characters">
            <textarea
              rows={3}
              value={props.metaDescription}
              onChange={(e) => set({ metaDescription: e.target.value })}
              className={inputClass()}
              placeholder={props.description || 'Defaults to excerpt'}
            />
          </Field>
        </div>
        <Field label="SEO keywords" hint="Comma-separated">
          <input
            value={props.seoKeywords}
            onChange={(e) => set({ seoKeywords: e.target.value })}
            className={inputClass()}
            placeholder="Defaults to tags"
          />
        </Field>
        <Field label="Canonical URL" hint="Leave blank for /blog/{slug}">
          <input
            value={props.canonicalUrl}
            onChange={(e) => set({ canonicalUrl: e.target.value })}
            className={inputClass()}
            placeholder="https://www.slatebiz.com/blog/your-slug"
          />
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Open Graph</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="OG title">
            <input
              value={props.ogTitle}
              onChange={(e) => set({ ogTitle: e.target.value })}
              className={inputClass()}
              placeholder="Defaults to SEO title"
            />
          </Field>
          <Field label="OG image URL">
            <input
              value={props.ogImage}
              onChange={(e) => set({ ogImage: e.target.value })}
              className={inputClass()}
              placeholder="Defaults to featured image"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="OG description">
              <textarea
                rows={2}
                value={props.ogDescription}
                onChange={(e) => set({ ogDescription: e.target.value })}
                className={inputClass()}
                placeholder="Defaults to meta description"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Twitter / X card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Twitter title">
            <input
              value={props.twitterTitle}
              onChange={(e) => set({ twitterTitle: e.target.value })}
              className={inputClass()}
              placeholder="Defaults to OG / SEO title"
            />
          </Field>
          <Field label="Twitter image URL">
            <input
              value={props.twitterImage}
              onChange={(e) => set({ twitterImage: e.target.value })}
              className={inputClass()}
              placeholder="Defaults to OG / featured image"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Twitter description">
              <textarea
                rows={2}
                value={props.twitterDescription}
                onChange={(e) => set({ twitterDescription: e.target.value })}
                className={inputClass()}
                placeholder="Defaults to OG / meta description"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Indexing</h3>
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={props.noIndex}
              onChange={(e) => set({ noIndex: e.target.checked })}
              className="rounded border-gray-300 text-[#0C69B6] focus:ring-[#0C69B6]"
            />
            <span className="text-sm text-slate-700">Noindex (hide from search engines)</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={props.noFollow}
              onChange={(e) => set({ noFollow: e.target.checked })}
              className="rounded border-gray-300 text-[#0C69B6] focus:ring-[#0C69B6]"
            />
            <span className="text-sm text-slate-700">Nofollow</span>
          </label>
        </div>
        <p className="text-xs text-slate-400">
          Drafts are never sitemap-listed. Published + noindex stays out of the sitemap and sends robots noindex.
        </p>
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
          Internal link presets
        </h3>
        <p className="text-xs text-slate-500">
          Copy a path into your section content as a markdown-style or HTML link (e.g. href=&quot;/jewelbiz/&quot;).
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERNAL_LINK_PRESETS.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => navigator.clipboard.writeText(item.href)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              title={`Copy ${item.href}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">SEO checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {checks.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
        </div>
        <p className="text-xs text-slate-400">Warnings do not block publishing — only title, excerpt, and slug are required.</p>
      </div>
    </section>
  );
}
