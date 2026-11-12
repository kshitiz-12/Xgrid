import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserFrame, PhoneFrame } from './DeviceFrames';
import DeviceExpandOverlay from './DeviceExpandOverlay';
import { LiveLinkProvider } from './LiveLinkModal';

gsap.registerPlugin(ScrollTrigger);

type ExpandMode = 'laptop' | 'phone' | null;

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  points: string[];
  href?: string;
  hrefLabel?: string;
  tone?: 'light' | 'mist' | 'ink';
  layout: 'pair' | 'browser' | 'phone';
  urlLabel?: string;
  browserScreen?: ReactNode;
  phoneScreen?: ReactNode;
  /** Lay phone UI out at this width, then scale into the frame (Flutter-faithful previews). */
  phoneDesignWidth?: number;
};

const tones: Record<NonNullable<Props['tone']>, string> = {
  light: 'bg-white text-slate-900',
  mist: 'bg-[#F7F7F5] text-slate-900',
  ink: 'bg-[#0B1C2C] text-white',
};

export default function ScrollDeviceStage({
  id,
  eyebrow,
  title,
  description,
  points,
  href,
  hrefLabel = 'Open live site',
  tone = 'light',
  layout,
  urlLabel = 'preview',
  browserScreen,
  phoneScreen,
  phoneDesignWidth,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState<ExpandMode>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    if (!section || !visual) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        visual,
        { y: 28, opacity: 0.6 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            end: 'top 35%',
            scrub: 0.7,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const dark = tone === 'ink';

  return (
    <LiveLinkProvider>
      <section id={id} ref={sectionRef} className={`relative ${tones[tone]}`}>
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-8 lg:py-24">
          <div>
            <p
              className={`mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                dark ? 'text-[#FF8A4C]' : 'text-[#FF641F]'
              }`}
            >
              {eyebrow}
            </p>
            <h2 className="max-w-xl font-serif text-[clamp(1.9rem,3.4vw,2.85rem)] leading-[1.1] tracking-[-0.02em]">
              {title}
            </h2>
            <p
              className={`mt-5 max-w-md text-[15px] leading-relaxed ${
                dark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {description}
            </p>
            <ul className="mt-7 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[13px] leading-snug">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      dark ? 'bg-[#FF8A4C]' : 'bg-[#0C69B6]'
                    }`}
                  />
                  <span className={dark ? 'text-slate-200' : 'text-slate-700'}>{point}</span>
                </li>
              ))}
            </ul>
            {href ? (
              <a
                href={href}
                {...(href.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
                className={`mt-8 inline-flex min-h-[48px] items-center justify-center rounded-[10px] px-5 text-[13px] font-semibold transition-colors ${
                  dark
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-[#FF641F] text-white hover:bg-[#E55A18]'
                }`}
              >
                {hrefLabel}
              </a>
            ) : null}
          </div>

          <div
            ref={visualRef}
            className={`relative flex min-h-[340px] items-center justify-center ${
              layout === 'pair' ? 'pb-16 sm:pb-20' : ''
            }`}
          >
            {layout === 'pair' && browserScreen && phoneScreen ? (
              <div className="relative w-full max-w-[680px]">
                <BrowserFrame
                  title="Website preview"
                  urlLabel={urlLabel}
                  className="w-full"
                  onExpand={() => setExpand('laptop')}
                >
                  {browserScreen}
                </BrowserFrame>
                <PhoneFrame
                  title="App preview"
                  className="absolute -bottom-10 right-0 z-10 w-[240px] sm:-bottom-12 sm:right-[-8px] sm:w-[268px]"
                  designWidth={phoneDesignWidth}
                  onExpand={() => setExpand('phone')}
                >
                  {phoneScreen}
                </PhoneFrame>
              </div>
            ) : null}

            {layout === 'browser' && browserScreen ? (
              <BrowserFrame
                title="Website preview"
                urlLabel={urlLabel}
                onExpand={() => setExpand('laptop')}
              >
                {browserScreen}
              </BrowserFrame>
            ) : null}

            {layout === 'phone' && phoneScreen ? (
              <PhoneFrame
                title="App preview"
                className="w-[280px]"
                designWidth={phoneDesignWidth ?? 390}
                onExpand={() => setExpand('phone')}
              >
                {phoneScreen}
              </PhoneFrame>
            ) : null}
          </div>
        </div>
      </section>

      <DeviceExpandOverlay
        open={expand === 'laptop'}
        mode="laptop"
        title={
          id === 'whatsapp' ? `${eyebrow} · CRM` : `${eyebrow} · website`
        }
        urlLabel={urlLabel}
        onClose={() => setExpand(null)}
      >
        {browserScreen}
      </DeviceExpandOverlay>

      <DeviceExpandOverlay
        open={expand === 'phone'}
        mode="phone"
        title={
          id === 'whatsapp' ? `${eyebrow} · WhatsApp` : `${eyebrow} · app`
        }
        onClose={() => setExpand(null)}
        phoneDesignWidth={phoneDesignWidth ?? 390}
      >
        {phoneScreen}
      </DeviceExpandOverlay>
    </LiveLinkProvider>
  );
}
