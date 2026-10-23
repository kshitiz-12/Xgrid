import { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { ProductModule } from '../data/productMatrix';
import { MODULE_ARTICLES } from '../data/moduleArticles';
import { SITE_URL, blogPath } from '../lib/seo';

type FeatureTheme = 'orange' | 'blue';

const themeStyles: Record<FeatureTheme, { heading: string; activeButton: string; icon: string; chip: string }> = {
  orange: {
    heading: 'text-[#FF641F]',
    activeButton: 'bg-[#FF641F] text-white shadow-md',
    icon: 'text-[#FF641F]',
    chip: 'bg-[#FF641F] text-white',
  },
  blue: {
    heading: 'text-[#0C69B6]',
    activeButton: 'bg-[#0C69B6] text-white shadow-md',
    icon: 'text-[#0C69B6]',
    chip: 'bg-[#0C69B6] text-white',
  },
};

interface ProductFeaturesSectionProps {
  modules: ProductModule[];
  subtitle: string;
  theme?: FeatureTheme;
  kicker?: string;
  /** Serif heading before “listed clearly.” — e.g. “Every CuraBiz module,” */
  headingLead?: string;
  sectionId?: string;
}

export default function ProductFeaturesSection({
  modules,
  subtitle,
  theme = 'orange',
  kicker,
  headingLead,
  sectionId,
}: ProductFeaturesSectionProps) {
  const [active, setActive] = useState(0);
  const styles = themeStyles[theme];

  const module = modules[active];
  const Icon = module.icon;

  return (
    <section id={sectionId} className="w-full scroll-mt-header bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          {kicker ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
              {kicker}
            </p>
          ) : null}
          <h2
            className={`font-serif font-normal text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-slate-900`}
          >
            {headingLead ? (
              <>
                <span className="block">{headingLead}</span>
                <span className={`block italic ${styles.heading}`}>listed clearly.</span>
              </>
            ) : (
              <span className={`italic ${styles.heading}`}>listed clearly.</span>
            )}
          </h2>
          <p className="mt-4 text-slate-500 text-[15px] leading-relaxed">{subtitle}</p>
        </div>

        {/* Mobile: horizontal module chips */}
        <div className="lg:hidden -mx-4 px-4 mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max pb-1">
            {modules.map((m, i) => {
              const isActive = i === active;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 min-h-[40px] px-4 py-2 rounded-full text-sm font-semibold transition ${
                    isActive ? styles.chip : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {m.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <div className="hidden lg:flex flex-col gap-1">
            {modules.map((m, i) => {
              const isActive = i === active;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-left transition min-h-[48px] ${
                    isActive ? styles.activeButton : 'text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {m.number}
                  </span>
                  <span className="text-sm font-semibold leading-snug">{m.title}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>

          <div key={module.id} className="transition-all duration-300">
            <div className="mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md mb-4">
                <Icon className={`w-4 h-4 ${styles.icon}`} />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-800">
                  {module.title}
                </span>
              </div>
              <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-slate-900 leading-snug">
                {module.description}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {module.features.map((feature) => {
                const slug = MODULE_ARTICLES[feature.title];
                return (
                  <div
                    key={feature.title}
                    className="flex flex-col bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition"
                  >
                    <h4 className="text-sm font-semibold text-slate-900">{feature.title}</h4>
                    <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{feature.description}</p>
                    {slug ? (
                      <a
                        href={`${SITE_URL}${blogPath(slug)}`}
                        className={`mt-3 inline-flex items-center gap-1 text-[13px] font-semibold ${styles.icon} hover:underline`}
                      >
                        Read more
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
