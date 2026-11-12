import { Link } from 'react-router-dom';
import { asset } from '../lib/asset';
import ScrollDeviceStage from '../components/services/ScrollDeviceStage';
import {
  AuraConnectScreen,
  AuraCrmScreen,
  BrandDesktopScreen,
  ChatbotScreen,
  EcommerceDesktopScreen,
  HospitalAppScreen,
  HospitalDesktopScreen,
} from '../components/services/ShowcaseScreens';

const WA_PIPELINE = ['New', 'Contacted', 'Qualified', 'Negotiation', 'Converted'] as const;

const OFFERINGS = [
  {
    id: 'hospital',
    label: 'Care websites + apps',
    blurb: 'Booking-ready care sites with a matching patient app UI.',
  },
  {
    id: 'branding',
    label: 'Branding websites',
    blurb: 'Premium brand storytelling sites — like blhissaria.com.',
  },
  {
    id: 'ecommerce',
    label: 'Ecommerce',
    blurb: 'Jewellery boutique storefronts with collections and cart.',
  },
  {
    id: 'chatbot',
    label: 'Chatbots',
    blurb: 'On-site assistants for FAQs, gold rate, visits and lead capture.',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp + CRM',
    blurb: 'Aura Connect — Cloud API chat, lead CRM, AI follow-ups and broadcasts.',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Hero />
      <OfferStrip />

      <ScrollDeviceStage
        id="hospital"
        tone="ink"
        eyebrow="Care website + app"
        title={
          <>
            Desktop site for patients.
            <em className="mt-1 block italic text-[#FF8A4C]">Same UI language on the app.</em>
          </>
        }
        description="Click the website or app frame to open a 3D laptop / phone. Scroll and use the demo inside — go deeper and we’ll offer the live link."
        points={[
          'Click website frame → 3D laptop you can scroll',
          'Click app frame → 3D phone with full patient app',
          'Deeper site actions open a live-link prompt',
        ]}
        href="https://hospital-erp-ten.vercel.app/"
        hrefLabel="Open live Curabiz site"
        layout="pair"
        urlLabel="hospital-erp-ten.vercel.app"
        browserScreen={<HospitalDesktopScreen />}
        phoneScreen={<HospitalAppScreen />}
        phoneDesignWidth={390}
      />

      <ScrollDeviceStage
        id="branding"
        tone="mist"
        eyebrow="Branding website"
        title={
          <>
            Brand sites that feel
            <em className="mt-1 block italic text-[#FF641F]">as premium as the product.</em>
          </>
        }
        description="Click the frame to open a 3D laptop, scroll the brand site inside, and deeper links offer blhissaria.com."
        points={[
          'Click frame → 3D laptop preview',
          'Scroll and explore the brand hero in-device',
          'Deeper nav offers the live site prompt',
        ]}
        href="https://www.blhissaria.com/"
        hrefLabel="Open blhissaria.com"
        layout="browser"
        urlLabel="www.blhissaria.com"
        browserScreen={<BrandDesktopScreen />}
      />

      <ScrollDeviceStage
        id="ecommerce"
        tone="light"
        eyebrow="Ecommerce boutique"
        title={
          <>
            Shop experiences that convert
            <em className="mt-1 block italic text-[#FF641F]">without looking generic.</em>
          </>
        }
        description="Click the boutique frame to open a 3D laptop — scroll products inside; cart and detail open the live-link prompt."
        points={[
          'Click frame → 3D laptop boutique',
          'Scroll featured products in-device',
          'Cart / bridal open the live-link prompt',
        ]}
        href="https://www.blhissaria.com/"
        hrefLabel="Talk ecommerce with us"
        layout="browser"
        urlLabel="jewelecom · boutique"
        browserScreen={<EcommerceDesktopScreen />}
      />

      <ScrollDeviceStage
        id="chatbot"
        tone="ink"
        eyebrow="Conversational chatbot"
        title={
          <>
            Sunehri-style assistants
            <em className="mt-1 block italic text-[#FF8A4C]">that sell, not just answer.</em>
          </>
        }
        description="Click the phone frame to open a 3D handset — chat with Sunehri inside; WhatsApp hands you the live site."
        points={[
          'Click frame → 3D phone chatbot',
          'Quick replies work inside the device',
          'WhatsApp / book visit open the live-link prompt',
        ]}
        href="https://www.blhissaria.com/"
        hrefLabel="See chatbot on live site"
        layout="phone"
        phoneScreen={<ChatbotScreen />}
        phoneDesignWidth={390}
      />

      <ScrollDeviceStage
        id="whatsapp"
        tone="mist"
        eyebrow="WhatsApp + CRM · Aura Connect"
        title={
          <>
            Chat on WhatsApp.
            <em className="mt-1 block italic text-[#128C7E]">Close it in CRM.</em>
          </>
        }
        description="Click the CRM laptop or WhatsApp phone to expand. Every Cloud API chat creates a scored lead — AI replies, follow-ups and broadcasts stay in sync."
        points={[
          'Laptop → lead CRM with score, stage and activity',
          'Phone → WhatsApp AI desk on Meta Cloud API',
          'Hot / Warm / Cold scoring from real conversation signals',
          'Follow-ups pause on reply · stop on Converted',
        ]}
        href="/contact/#contact-form"
        hrefLabel="Talk WhatsApp + CRM"
        layout="pair"
        urlLabel="aura.connect · crm"
        browserScreen={<AuraCrmScreen />}
        phoneScreen={<AuraConnectScreen />}
        phoneDesignWidth={390}
      />

      <WhatsAppPipeline />
      <Capabilities />
      <ClosingCTA />
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-100"
      style={{
        background: 'linear-gradient(115deg, #E8F2FB 0%, #F7F8FC 45%, #FBEDE6 100%)',
      }}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#0C69B6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-[#FF641F]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1100px] items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="h-0.5 w-7 rounded bg-[#0C69B6]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C69B6]">
              SlateBiz Services
            </span>
          </div>

          <h1 className="font-serif font-normal text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-slate-900">
            Websites, apps and assistants
            <em className="mt-1 block font-serif italic text-[#FF641F]">
              from the team behind our ERPs.
            </em>
          </h1>

          <p className="mt-4 max-w-[460px] text-[14.5px] leading-relaxed text-slate-600 sm:text-[15.5px]">
            Custom digital builds and WhatsApp automation (Aura Connect), scoped the same way we ship
            JewelBiz, CuraBiz and RetailBiz — then try interactive demos further down this page.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#branding"
              className="inline-flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#FF641F] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#E55A18] sm:w-auto"
            >
              See the showcases
            </a>
            <Link
              to="/contact/#contact-form"
              className="inline-flex h-[50px] w-full items-center justify-center rounded-[10px] border border-slate-900 bg-white px-6 text-[14px] font-semibold text-slate-900 transition-colors hover:bg-slate-50 sm:w-auto"
            >
              Talk about a project
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-6 sm:grid-cols-4">
            {[
              ['Web', 'Brand & care sites'],
              ['App', 'Patient experiences'],
              ['Chat', 'On-site assistants'],
              ['WA', 'WhatsApp + CRM'],
            ].map(([value, label]) => (
              <div key={value}>
                <p className="font-serif text-[1.35rem] leading-none tracking-tight text-slate-900 sm:text-[1.5rem]">
                  {value}
                </p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border-[3px] border-white shadow-[0_20px_50px_rgba(15,25,35,0.1)] ring-1 ring-slate-200/80">
            <img
              src={asset('/services/services-hero.webp')}
              alt="SlateBiz Softwares — hospital websites, apps, ecommerce and AI chatbots"
              width={1600}
              height={900}
              decoding="async"
              fetchPriority="high"
              className="aspect-[16/9] w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferStrip() {
  return (
    <section className="border-b border-slate-100 bg-[#F7F7F5]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        {OFFERINGS.map((item, index) => (
          <a key={item.id} href={`#${item.id}`} className="group block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0C69B6]">
              0{index + 1}
            </p>
            <p className="mt-3 font-serif text-[21px] leading-tight text-slate-900 transition-colors group-hover:text-[#FF641F]">
              {item.label}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{item.blurb}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function WhatsAppPipeline() {
  const pillars = [
    {
      title: 'WhatsApp Cloud API',
      body: 'Official Meta channel — multi-number inbox, media, templates and delivery receipts.',
    },
    {
      title: 'Lead CRM',
      body: 'Auto-create / merge leads, score Hot–Cold, assign owners, full activity timeline.',
    },
    {
      title: 'AI + follow-ups',
      body: 'Gemini replies in your tone, then nurtures silent leads until Converted or opt-out.',
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-white py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#E8F8F0] to-transparent" />
      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#128C7E]">
            From first ping to booked
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.55rem,2.8vw,2.15rem)] leading-[1.15] text-slate-900">
            WhatsApp conversations,
            <em className="italic text-[#075E54]"> CRM pipeline underneath.</em>
          </h2>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {WA_PIPELINE.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2 sm:gap-2.5">
                <span
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                    i === WA_PIPELINE.length - 1
                      ? 'bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.28)]'
                      : 'bg-[#F4F7F5] text-slate-800 ring-1 ring-[#25D366]/15'
                  }`}
                >
                  {stage}
                </span>
                {i < WA_PIPELINE.length - 1 ? (
                  <span className="hidden text-[#25D366]/50 sm:inline" aria-hidden>
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-slate-100 pt-10 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title}>
              <h3 className="text-[15px] font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const items = [
    {
      title: 'Care digital presence',
      body: 'Public care websites with booking, departments, doctors and patient FAQs.',
    },
    {
      title: 'Patient-facing apps',
      body: 'Mobile experiences that reuse the website UI so the brand stays familiar.',
    },
    {
      title: 'Branding websites',
      body: 'Story-led brand sites with heritage, collections and showroom conversion.',
    },
    {
      title: 'Ecommerce boutiques',
      body: 'Product grids, bridal paths, hallmarked trust and cart-ready shopping.',
    },
    {
      title: 'Custom chatbots',
      body: 'On-site assistants for FAQs, gold rate, store info and lead routing.',
    },
    {
      title: 'WhatsApp + CRM',
      body: 'Aura Connect — Cloud API inbox, AI desk, lead CRM with scoring, follow-ups and broadcasts.',
    },
    {
      title: 'ERP go-live support',
      body: 'Implementation, migration, training and support for JewelBiz, CuraBiz and RetailBiz.',
    },
  ];

  return (
    <section id="capabilities" className="border-t border-slate-100 bg-white py-20">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF641F]">
          What we provide
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.12] text-slate-900">
          Built from shipped products —
          <em className="italic text-[#0C69B6]"> not templates with a logo swap.</em>
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="text-[16px] font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="bg-[#0B1C2C] py-20">
      <div className="mx-auto max-w-[820px] px-4 text-center sm:px-6">
        <h2 className="font-serif text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.1] text-white">
          Need a care site, storefront, chatbot
          <em className="mt-1 block italic text-[#FF8A4C]">or WhatsApp automation?</em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300">
          Tell us what you&apos;re launching. We&apos;ll scope websites, apps and Aura Connect the same
          way we shipped Curabiz, blhissaria and jewelecom.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/contact/#contact-form"
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-[10px] bg-[#FF641F] px-6 text-[14px] font-semibold text-white hover:bg-[#E55A18] sm:w-auto"
          >
            Book a free consultation
          </Link>
          <Link
            to="/curabiz/"
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-[10px] border border-white/25 px-6 text-[14px] font-semibold text-white hover:bg-white/5 sm:w-auto"
          >
            Explore CuraBiz HIMS
          </Link>
        </div>
      </div>
    </section>
  );
}
