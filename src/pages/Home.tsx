import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanyLogosSection from '../components/CompanyLogosSection';
import { asset } from '../lib/asset';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <HeroSection />
      <CompanyLogosSection className="bg-[#F7F7F5]" />
      <WhyWeExistSection />
      <ProductsSection />
      <FoundationSection />
      <TechnicalSection />
      <ClientTestimonialsSection />
      <AccreditationSection />
      <StepsSection />
      <FAQSection />
      <CTASection />
      <QuickEnquiryPopup />
    </div>
  );
}


function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat min-h-[620px] md:min-h-[720px] flex items-center justify-center"
      style={{ backgroundImage: `url('${asset('/herobg.webp')}')` }}
    >
      <div className="relative z-10 w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <span className="inline-block mb-7 px-4 py-2 bg-blue-50 text-slate-800 text-[13px] font-medium tracking-wide rounded-full">
          ERP SOFTWARE - PAN INDIA
        </span>

        <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-slate-900">
          <span className="block text-[38px] md:text-[52px] lg:text-[62px]">
            The technology large enterprises run on.
          </span>
          <span className="block text-[38px] md:text-[52px] lg:text-[62px] italic text-[#FF641F]">
            Built for the businesses that power India.
          </span>
        </h1>

        <p className="mt-6 text-[17px] leading-[1.7] text-slate-600 max-w-3xl mx-auto">
          SlateBiz builds purpose-built ERP software for jewellers, hospitals, and specialist retailers — the
          industries that form the backbone of India's economy. Robust, secure, and engineered on
          enterprise-grade technology.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/contact/#contact-form"
            className="w-full sm:w-[182px] h-[50px] inline-flex items-center justify-center rounded-[10px] bg-[#FF641F] text-white text-[14px] font-semibold hover:bg-[#E55A18] transition-colors"
          >
            Get 14 Days Free Trial
          </Link>
          <Link
            to="/contact/#contact-form"
            className="w-full sm:w-[160px] h-[50px] inline-flex items-center justify-center rounded-[10px] bg-white border border-slate-900 text-slate-900 text-[14px] font-semibold hover:bg-slate-50 transition-colors"
          >
            Book A Free Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyWeExistSection() {
  return (
    <section className="w-full bg-[#F7F7F5] pt-8 pb-16 sm:pt-10">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[465px_1fr] gap-10 items-start">
          <img
            src={asset('/why-we-exist-v2.webp')}
            alt="JewelBiz on-site training in a jewellery showroom"
            width={465}
            height={550}
            decoding="async"
            fetchPriority="low"
            className="w-full h-auto md:w-[465px] md:h-[550px] object-cover rounded-xl"
          />

          <div className="pt-1 w-full max-w-[560px]">
            <span className="block text-[#FF641F] text-[11px] font-semibold tracking-[1px] uppercase font-sans mb-10">
              Why We Exist
            </span>

            <h2 className="font-sans font-medium leading-[1.1] tracking-[-0.01em] text-[#171717]">
              <span className="block text-[31px] whitespace-normal md:whitespace-nowrap">
                The small business is the Indian economy.
              </span>
              <span className="block text-[30px] font-medium italic text-[#FF641F] whitespace-normal md:whitespace-nowrap">
                It deserves the same tools the enterprise has.
              </span>
            </h2>

            <p className="mt-8 text-[14px] leading-[1.6] text-[#4B5563] max-w-[550px]">
              Large retail chains, hospital groups, and jewellery conglomerates run on systems worth crores. The independent jeweller, the clinic, the specialty retailer compete with those players every day. SlateBiz gives them the same backbone.
            </p>

            <div className="mt-12 flex flex-col gap-5">
              <div className="relative overflow-hidden bg-[#F5F6F7] rounded-xl py-5 px-6 pl-[26px]">
                <div className="absolute left-0 top-0 h-full w-[3px] bg-[#FF641F]" />
                <span className="block font-sans text-[11px] font-normal tracking-[0.15em] uppercase text-[#0C69B6] mb-3">
                  Vision
                </span>
                <h3 className="text-[14px] font-semibold leading-[1.3] text-[#171717] mb-2">
                  Put enterprise technology in every Indian business's hands
                </h3>
                <p className="text-[12px] leading-[1.4] text-[#4B5563]">
                  We build software that is purpose-built — not a generic platform with a skin on top. JewelBiz cannot be run as a hospital system. CuraBiz cannot manage a karigar workshop. That is not a limitation. That is the point.
                </p>
              </div>

              <div className="relative overflow-hidden bg-[#F5F6F7] rounded-xl py-5 px-6 pl-[26px]">
                <div className="absolute left-0 top-0 h-full w-[3px] bg-[#FF641F]" />
                <span className="block font-sans text-[11px] font-normal tracking-[0.15em] uppercase text-[#0C69B6] mb-3">
                  Mission
                </span>
                <h3 className="text-[14px] font-semibold leading-[1.3] text-[#171717] mb-2">
                  Put enterprise technology in every Indian business's hands
                </h3>
                <p className="text-[12px] leading-[1.4] text-[#4B5563]">
                  We build software that is purpose-built — not a generic platform with a skin on top. JewelBiz cannot be run as a hospital system. CuraBiz cannot manage a karigar workshop. That is not a limitation. That is the point.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const products = [
    {
      id: 'jewelbiz',
      title: 'JewelBiz ERP',
      badge: 'Primary Product',
      tagline: 'Your karigar, your stock, your GST. One system. Nothing missed.',
      description:
        'One system for the retail counter, the wholesale desk, and the karigar workshop. Sales, stock, manufacturing, accounts, and compliance on a single ledger — from metal purchase to a signed GST invoice.',
      tags: [
        'HUID and BIS compliance',
        'Karigar WIP tracking',
        'MCX live gold rates',
        'GSTR-1 and 3B auto-ready',
        'Old gold exchange',
        'Ohm / pawn register',
        'Multi-branch real-time sync',
        'On-premise and cloud',
      ],
      tagClass: 'bg-[#FFF7ED] text-[#9A3412]',
      image: asset('/jewelbiz-home-section.webp'),
      imageAlt: 'JewelBiz ERP',
      link: '/jewelbiz/',
      linkText: 'Explore JewelBiz',
      imageLeft: false,
    },
    {
      id: 'curabiz',
      title: 'CuraBiz HIMS',
      badge: 'Primary Product',
      tagline: 'Every patient. Every prescription. Every rupee. One system.',
      description:
        'Full hospital information management with integrated pharmacy, OPD, IPD, e-prescriptions, and patient records. Built for clinics and hospitals — including Ayurveda practices with Panchkarma scheduling and WhatsApp patient communication.',
      tags: [
        'OPD and IPD',
        'Integrated pharmacy',
        'e-Prescription',
        'Panchkarma scheduler',
        'ABDM readiness',
        'WhatsApp API',
      ],
      tagClass: 'bg-[#DBEAFE] text-[#1E40AF]',
      image: asset('/curabiz-home-section.webp'),
      imageAlt: 'CuraBiz HIMS',
      link: '/curabiz/',
      linkText: 'Explore CuraBiz',
      imageLeft: true,
    },
    {
      id: 'retailbiz',
      title: 'RetailBiz ERP',
      badge: null,
      tagline: "Built for your retail. Not adapted from someone else's.",
      description:
        'Specialized ERP for retail verticals where generic software cannot be forced to fit. Built around your industry rules, compliance needs, and operational workflows.',
      tags: [
        'Specialized vertical ERP',
        'GST-compliant billing',
        'Multi-branch support',
        'Industry-specific workflows',
      ],
      tagClass: 'bg-[#F1F5F9] text-[#334155]',
      image: asset('/retailbiz-home-section.webp'),
      imageAlt: 'RetailBiz ERP',
      link: '/retailbiz/',
      linkText: 'Explore RetailBiz ERP',
      imageLeft: false,
    },
  ];

  type Product = (typeof products)[number];

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const cardViewportRef = useRef<HTMLDivElement>(null);
  const productsHeaderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const Card = ({
    product,
    className,
  }: {
    product: Product;
    className?: string;
  }) => (
    <div
      className={`bg-white rounded-[10px] p-3 md:p-5 shadow-sm h-full ${
        className || ''
      }`}
    >
      <div className="grid md:grid-cols-2 gap-4 items-center h-full">
        <div className={product.imageLeft ? 'order-1' : 'order-2'}>
          <img
            src={product.image}
            alt={product.imageAlt}
            loading="lazy"
            decoding="async"
            className={`w-full h-[180px] md:h-[380px] rounded-[1.5rem] ${
              product.id === 'jewelbiz' || product.id === 'curabiz' || product.id === 'retailbiz'
                ? 'object-cover brightness-100 opacity-100'
                : 'object-contain brightness-110 opacity-80 rounded-[3rem]'
            }`}
          />
        </div>

        <div className={product.imageLeft ? 'order-2' : 'order-1'}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-sans text-[22px] font-semibold tracking-[-0.01em] text-[#171717]">
              {product.title}
            </h3>

            {product.badge && (
              <span className="bg-[#FF641F] text-white text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded">
                {product.badge}
              </span>
            )}
          </div>

          <p className="text-[#0C69B6] italic text-[14px] mb-3">
            “{product.tagline}”
          </p>

          <p className="text-[#4B5563] text-[13px] leading-[1.5] mb-5">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className={`${product.tagClass} text-[11px] font-medium px-3 py-1.5 rounded-md`}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            to={product.link}
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-md bg-[#FF641F] text-white text-[13px] font-medium hover:bg-[#E55A18] transition-colors"
          >
            {product.linkText}
          </Link>
        </div>
      </div>
    </div>
  );

useLayoutEffect(() => {
  const viewport = scrollViewportRef.current;
  const header = productsHeaderRef.current;
  const cardViewport = cardViewportRef.current;

  if (!viewport || !header || !cardViewport) return;

  const cards = cardRefs.current.filter(
    Boolean
  ) as HTMLDivElement[];

  if (cards.length !== 3) return;

  const getHeaderOffset = () => {
    const siteHeader = document.querySelector('header');
    return siteHeader?.offsetHeight ?? 96;
  };

  let ctx: { revert: () => void } | undefined;
  let cancelled = false;

  void (async () => {
    const gsap = (await import('gsap')).default;
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    if (cancelled) return;

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        gsap.set(cards[0], {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          zIndex: 10,
        });

        gsap.set(cards[1], {
          yPercent: 105,
          opacity: 0.85,
          scale: 0.985,
          zIndex: 20,
        });

        gsap.set(cards[2], {
          yPercent: 105,
          opacity: 0.85,
          scale: 0.985,
          zIndex: 30,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: viewport,
            start: () => `top top+=${getHeaderOffset()}`,
            end: () => `+=${window.innerHeight * 3.5}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          header,
          {
            yPercent: -120,
            opacity: 0,
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0,
            overflow: 'hidden',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        );

        tl.to(
          cardViewport,
          {
            height: () => `calc(100svh - ${getHeaderOffset()}px)`,
            ease: 'power2.inOut',
            duration: 1,
          },
          0.9
        );

        tl.to(
          cards[1],
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            duration: 1.2,
          },
          2.0
        );

        tl.to(
          cards[2],
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            duration: 1.2,
          },
          3.25
        );
      });
    }, viewport);
  })();

  return () => {
    cancelled = true;
    ctx?.revert();
  };
}, []);

  return (
    <section className="w-full bg-[#EBF0F1]">
      <div
        ref={scrollViewportRef}
        className="products-scroll-viewport w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center md:min-h-[calc(100svh-var(--site-header-height))]"
      >
        <div
          ref={productsHeaderRef}
          className="products-static-header shrink-0 pt-10 md:pt-14 text-center mb-6 md:mb-8"
        >
          <span className="inline-block mb-5 px-3 py-1.5 bg-white text-[#4B5563] text-[11px] font-medium tracking-wide rounded-full">
            Why we exist
          </span>

          <h2 className="font-sans font-medium leading-[1.1] tracking-[-0.01em] text-[#171717]">
            <span className="block text-[26px] sm:text-[31px] whitespace-normal md:whitespace-nowrap">
              Three ERPs.
            </span>

            <span className="block text-[24px] sm:text-[29px] font-medium italic text-[#FF641F] whitespace-normal md:whitespace-nowrap">
              One standard of engineering.
            </span>
          </h2>

          <p className="mt-5 text-[12px] leading-[1.6] text-[#4B5563] max-w-2xl mx-auto px-2">
            Each product is built from the ground up for its industry — not a
            generic ERP retrofitted with a template.
          </p>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-4 pb-10">
          {products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>

        {/* Desktop: GSAP pinned stack */}
        <div
          ref={cardViewportRef}
          className="products-card-viewport relative w-full overflow-hidden h-[480px] shrink-0 hidden md:block"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="products-card absolute inset-0 w-full h-full will-change-transform overflow-hidden"
              style={{
                zIndex: index + 1,
              }}
            >
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FoundationSection() {
  const cards = [
    {
      image: asset('/industry-specific-erp-v2.webp'),
      title: 'Industry-specific ERP',
      desc: 'Purpose-built software for jewellery, healthcare, and specialist retail.',
    },
    {
      image: asset('/data-migration.webp'),
      title: 'Data migration',
      desc: 'Opening stock, party ledgers, and historical records migrated before go-live.',
    },
    {
      image: asset('/empowering-v2.webp'),
      title: 'On-site training',
      desc: 'Counter staff, accountant, and manager trained by role — included in every deployment.',
    },
    {
      image: asset('/always-v2.webp'),
      title: 'Dedicated support',
      desc: 'Named account support over phone, email, and WhatsApp when operations cannot wait.',
    },
    {
      image: asset('/stay-v2.webp'),
      title: 'Compliance updates',
      desc: 'GST, e-invoice, and HUID regulatory changes tracked and pushed into your system.',
    },
    {
      image: asset('/built.webp'),
      title: 'Industry-specific ERP',
      desc: 'Purpose-built software for jewellery, healthcare, and specialist retail.',
    },
  ];

  return (
    <section className="w-full bg-white pt-16 pb-20">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="mb-5 inline-block rounded-full bg-[#F1F5F9] px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#4B5563]">
            Technical foundation
          </span>
          <h2 className="font-sans font-medium leading-[1.1] tracking-[-0.01em] text-[#171717]">
            <span className="block text-[31px] whitespace-normal md:whitespace-nowrap">
              Built on the same stack
            </span>
            <span className="block text-[29px] font-medium italic text-[#FF641F] whitespace-normal md:whitespace-nowrap">
              India&apos;s banks use
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[12px] leading-[1.6] text-[#4B5563]">
            Buying a licence is not the same as going live successfully. Every SlateBiz deployment
            includes end-to-end support from setup to steady-state operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <div key={`${card.title}-${i}`}>
              <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-slate-100 bg-[#F7F8FC] shadow-[0_8px_24px_rgba(15,25,35,0.05)]">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover scale-[1.08] origin-center"
                />
              </div>
              <h3 className="mt-5 text-[14px] font-bold text-[#171717]">{card.title}</h3>
              <p className="mt-2 text-[12px] leading-[1.5] text-[#4B5563]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnicalSection() {
  return (
    <section className="w-full bg-[#F7F7F5] pt-16 pb-10">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block mb-5 px-3 py-1.5 bg-[#F1F5F9] text-[#4B5563] text-[11px] font-medium tracking-wide rounded-full">
            Technical foundation
          </span>
          <h2 className="font-sans font-medium leading-[1.1] tracking-[-0.01em] text-[#171717]">
            <span className="block text-[31px] whitespace-normal md:whitespace-nowrap">
              Built on the same stack
            </span>
            <span className="block text-[29px] font-medium italic text-[#FF641F] whitespace-normal md:whitespace-nowrap">
              India&apos;s banks use
            </span>
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-[16px] font-bold text-[#171717] mb-3">
                Bank-grade security architecture
              </h3>
              <p className="text-[12px] leading-[1.5] text-[#4B5563]">
                Java and Oracle with SHA-256 encryption. On-premise keeps your data on your premises.
              </p>
            </div>
            <div>
              <img
                src={asset('/technical.webp')}
                alt="Bank-grade security"
                loading="lazy"
                decoding="async"
                className="w-full h-[260px] md:h-[320px] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#171717] mb-2">
              Full offline capability
            </h3>
            <p className="text-[12px] leading-[1.5] text-[#4B5563]">
              Billing, POS, stock, and ledger operations run without internet on peak days.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#171717] mb-2">
              Government-ready compliance
            </h3>
            <p className="text-[12px] leading-[1.5] text-[#4B5563]">
              GST, HUID, e-invoice and medicines are recorded with digital IRN and QR at the point of sale.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#171717] mb-2">
              Mobile and WhatsApp API
            </h3>
            <p className="text-[12px] leading-[1.5] text-[#4B5563]">
              Member transactions and confirmations with customers or patients from the workflows you already use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientTestimonialsSection() {
  const testimonials = [
    {
      text: "From procurement to sales, everything is streamlined. Highly recommended for any growing jewellery business.",
      name: "Kalpit Hissaria",
      brand: "Hissaria Art Palace Pvt Ltd"
    },
    {
      text: "The reporting features give us deep insights into our business performance. A must-have tool for modern jewellers.",
      name: "Mudit Hissaria",
      brand: "Hissaria Gems Private Limited",
      logo: "/hissaria gems private limited.webp"
    },
    {
      text: "JewelBiz is intuitive and powerful. It has significantly reduced our manual errors and improved operational efficiency.",
      name: "Abhishek Jain",
      brand: "BTR & SONS",
      logo: "/BTR.webp"
    },
    {
      text: "Security and reliability were our top priorities, and JewelBiz delivers on both fronts perfectly.",
      name: "Manoj Bansal",
      brand: "Mahalaxmi Refinery",
      logo: "/Mahalaxmi.webp"
    },
    {
      text: "JewelBiz has revolutionized our inventory tracking. The precision and ease of use are unmatched in the industry.",
      name: "Rajesh Hissaria",
      brand: "B.L.Hissaria Jewellers Pvt. Ltd.",
      logo: "/b l hissaria jewellers.webp"
    },
    {
      text: "Managing multiple branches has never been easier. Real-time data synchronization keeps us ahead of the competition.",
      name: "Sandeep Hissaria",
      brand: "B.L.Hissaria Jewellers Pvt. Ltd.",
      logo: "/b l hissaria jewellers.webp"
    },
    {
      text: "The karigar management module is a game-changer. We now have complete visibility over our gold wastage and job work.",
      name: "Sachin Hissaria",
      brand: "B.L.Hissaria Jewellers Pvt. Ltd.",
      logo: "/b l hissaria jewellers.webp"
    },
    {
      text: "Excellent support and a robust platform. It handles our complex billing requirements effortlessly.",
      name: "Aditya Hissaria",
      brand: "Hissaria Art Palace Pvt Ltd"
    },
    {
      text: "Managing patient records, appointments, and pharmacy has become effortless. The CuraBiz platform truly understands the needs of an Ayurvedic practice.",
      name: "Dr. Amit Sharma",
      brand: "Bhagwati Ayurveda & Panchakarma Research Centre",
      logo: "/Bhagwati Ayurveda & Panchakarma Research Centre.webp"
    },
    {
      text: "From OPD to billing and discharge summaries, everything runs smoothly. It has greatly improved our hospital's day-to-day efficiency.",
      name: "Dr. Saabram",
      brand: "Parmeshwari Newborn & Children Hospital - Abohar",
      logo: "/Parmeshwari Newborn & Children Hospital - Abohar.webp"
    },
    {
      text: "Tracking candidates, clients, and placements is now incredibly simple. The team's support has been outstanding throughout our journey.",
      name: "Ms. Preeti",
      brand: "Skyy High Placement",
      logo: "/Skyy High Placement.webp"
    },
    {
      text: "Inventory, billing, and daily reports are all in one place now. Running our store has become much easier and faster than before.",
      name: "Mr. Kanhaiya Lal",
      brand: "Shiv General Store",
      logo: "/Shiv General Store.webp"
    }
  ];

  return (
    <section className="w-full bg-[#F7F7F5] pt-16 pb-20 overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block mb-5 px-3 py-1.5 bg-white text-[#4B5563] text-[11px] font-medium tracking-wide rounded-full">
            Client Testimonials
          </span>
          <h2 className="font-sans font-medium leading-[1.1] tracking-[-0.01em] text-[#171717]">
            <span className="block text-[31px] whitespace-normal md:whitespace-nowrap">
              Businesses that refuse to
            </span>
            <span className="block text-[29px] font-medium italic text-[#FF641F] whitespace-normal md:whitespace-nowrap">
              settle for off-the-shelf.
            </span>
          </h2>
          <p className="mt-5 text-[12px] leading-[1.6] text-[#4B5563] max-w-2xl mx-auto">
            Jewellery showrooms and healthcare practices across India have moved from scattered notebooks and generic software to a single connected system.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="testimonial-marquee gap-6 items-stretch">
            {testimonials.map((testimonial, index) => (
              <div
                key={`a-${index}`}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm flex-shrink-0 w-[300px] sm:w-[340px] flex flex-col justify-between"
              >
                <p className="text-[13px] leading-[1.6] text-[#4B5563] italic mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center">
                  {testimonial.logo ? (
                    <img src={asset(testimonial.logo)} alt={testimonial.brand} loading="lazy" decoding="async" width={40} height={40} className="w-10 h-10 rounded-full object-contain border border-slate-100 bg-white p-1" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0C69B6] font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div className="ml-3">
                    <h4 className="text-[13px] font-bold text-[#171717]">{testimonial.name}</h4>
                    <p className="text-[11px] text-[#4B5563]">{testimonial.brand}</p>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.map((testimonial, index) => (
              <div
                key={`b-${index}`}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm flex-shrink-0 w-[300px] sm:w-[340px] flex flex-col justify-between"
              >
                <p className="text-[13px] leading-[1.6] text-[#4B5563] italic mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center">
                  {testimonial.logo ? (
                    <img src={asset(testimonial.logo)} alt={testimonial.brand} loading="lazy" decoding="async" width={40} height={40} className="w-10 h-10 rounded-full object-contain border border-slate-100 bg-white p-1" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0C69B6] font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div className="ml-3">
                    <h4 className="text-[13px] font-bold text-[#171717]">{testimonial.name}</h4>
                    <p className="text-[11px] text-[#4B5563]">{testimonial.brand}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes testimonial-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .testimonial-marquee {
            display: inline-flex;
            animation: testimonial-marquee 80s linear infinite;
            will-change: transform;
          }
        `}</style>
      </div>
    </section>
  );
}

function AccreditationSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [reduced, setReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const complianceItems = [
    {
      title: 'GST & e-Invoicing (IRP / IRN)',
      content: 'Mandatory for businesses above the notified turnover threshold. JewelBiz auto generates HSN mapped, GST split invoices with signed IRN and QR at the point of sale.'
    },
    {
      title: 'BIS hallmarking & HUID readiness',
      content: 'Hallmarking and HUID tracking are core to jewellery compliance. JewelBiz links HUID to stock, tags and invoices for full audit traceability.'
    },
    {
      title: 'E-Way Bill aligned dispatch',
      content: 'Interstate and threshold based goods movement needs controlled challans and tax documents. Dispatch flows stay aligned with GST practice throughout.'
    },
    {
      title: 'Enterprise security architecture',
      content: 'Built on Java and Oracle with SHA-512 hashing, role based access and full audit trails. On-premise deployment keeps your data inside your own premises.'
    },
    {
      title: 'PCI-oriented payment controls',
      content: 'Card and digital collection paths follow payment security discipline. Settlement workflows and access controls protect high value jewellery transactions.'
    },
    {
      title: 'ABDM & NABH-ready healthcare pathways',
      content: 'CuraBiz is built for hospital operations with ABDM aligned integration and NABH oriented reporting. Healthcare clients get a purpose built system, not a generic retail ERP.'
    },
    {
      title: 'Financial audit freeze & logs',
      content: 'Period locks, voucher audit trails and day end controls support CA reviews and GST assessments. No reconstructing history from spreadsheets.'
    },
    {
      title: 'TDS / TCS & reverse charge',
      content: 'Jewellery and trade purchases often trigger TDS, TCS and reverse charge rules. Platform masters and billing logic apply these correctly at transaction time.'
    },
    {
      title: 'Data residency & deployment choice',
      content: 'Choose on premise, cloud or hybrid deployment. Accreditation conversations increasingly start with where your data lives, so SlateBiz lets you decide.'
    }
  ];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
    } else {
      mq.addListener(onChange);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', onChange);
      } else {
        mq.removeListener(onChange);
      }
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      const ul = ulRef.current;
      if (ul) setLineHeight(ul.clientHeight);
      return;
    }
    const li = liRefs.current[activeIndex];
    if (!li) return;
    setLineHeight(li.offsetTop + li.clientHeight);
  }, [activeIndex, reduced]);

  const handleClick = (i: number) => {
    setActiveIndex(i === activeIndex ? -1 : i);
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#EAECEF] pt-16 pb-20">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16">
        <span className="inline-block mb-6 px-3 py-1.5 bg-white text-[#4B5563] text-[11px] font-medium tracking-wide rounded-full">
          Accreditation
        </span>
        <h2 className="font-sans font-medium leading-[1.05] tracking-[-0.03em] text-[#171717]">
          <span className="block text-[38px] md:text-[46px] lg:text-[54px] whitespace-normal md:whitespace-nowrap">
            Built on Java and Oracle — ready for
          </span>
          <span className="block text-[38px] md:text-[46px] lg:text-[54px] font-medium italic text-[#FF641F] whitespace-normal md:whitespace-nowrap">
            India&apos;s compliance stack.
          </span>
        </h2>
        <p className="mt-6 text-[14px] leading-[1.7] text-[#4B5563] max-w-[780px]">
          ERP buyers in India do not only ask for features. They ask whether the platform can survive GST audits, hallmarking rules, e-invoice mandates, and healthcare data expectations. SlateBiz is engineered on the same Java and Oracle foundation used across enterprise and banking systems — with product workflows aligned to the accreditations and controls that matter in our verticals.
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-slate-300/40" />
            <div
              className="absolute top-0 left-0 w-[2px] bg-[#0C69B6] transition-[height] duration-1000 ease-out"
              style={{ height: lineHeight }}
            />
            <ul
              ref={ulRef}
              className="space-y-2 pl-6"
            >
              {complianceItems.map((item, i) => {
                const isActive = reduced || i === activeIndex;
                return (
                  <li
                    key={item.title}
                    ref={(el) => { liRefs.current[i] = el; }}
                    className="py-2.5 cursor-pointer"
                    onClick={() => handleClick(i)}
                  >
                    <h3 className="text-[15px] font-semibold text-black">
                      {item.title}
                    </h3>
                    <div
                      className={`mt-2 text-[13px] leading-[1.5] text-black overflow-hidden transition-all duration-1000 ease-out ${
                        isActive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.content}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              className="w-full max-w-[760px] h-auto object-contain rounded-[12px]"
              aria-label="Java and Oracle compliance stack"
            >
              <source src="/java slatebiz.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  const steps = [
    {
      number: '1',
      title: 'Demo on your own stock and rate structure',
      description: 'A 60-minute walkthrough configured with your item masters, purity structure, making rates, and GST setup — on your business, not a sample dataset.'
    },
    {
      number: '2',
      title: 'Choose deployment model',
      description: 'On-premise or cloud — your call. Scope and commercial terms confirmed in writing before any work begins.'
    },
    {
      number: '3',
      title: 'Go live in 24 hours',
      description: 'Opening stock, party ledgers, and karigar balances migrated before your first live transaction. Staff trained in parallel.'
    }
  ];

  return (
    <section className="w-full bg-[#F7F7F5] pt-16 pb-20">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF641F] mb-5">
              Why we exist
            </p>
            <h2 className="font-sans font-medium leading-[1.1] tracking-[-0.03em] text-[#171717] text-[36px] md:text-[42px] mb-4">
              Three steps from today to live
            </h2>
            <p className="text-[14px] leading-[1.6] text-[#4B5563] mb-10">
              You call us today. You&apos;re live tomorrow. Here is exactly how it works.
            </p>

            <div>
              {steps.map((step, index) => (
                <div key={step.number} className={`py-6 ${index > 0 ? 'border-t border-slate-200/60' : ''}`}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0C69B6] text-white flex items-center justify-center text-[14px] font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#171717] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[13px] leading-[1.5] text-[#4B5563]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <img
              src={asset('/three-steps.webp')}
              alt="Implementation steps"
              loading="lazy"
              decoding="async"
              className="w-full h-[400px] md:h-[520px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "How do you ensure the security of our data?",
      answer: "Data security is a top priority. We prioritise the security of your information by implementing industry-leading security measures. Additionally, all team members are bound by strict confidentiality agreements to ensure your privacy is always protected."
    },
    {
      question: "Do you provide post-development support and maintenance?",
      answer: "Absolutely! We understand the importance of ongoing support. We offer flexible maintenance plans to keep your project running smoothly."
    },
    {
      question: "How quickly can you start a new project?",
      answer: "Initiate your project with ease. Schedule a complimentary consultation through our website. We prioritize prompt communication and will respond within 2-3 business hours to discuss your project confidentially."
    },
    {
      question: "Do you offer refunds?",
      answer: "Refund policies depend on the terms and conditions of the subscription plan."
    },
    {
      question: "How can I request a product demo?",
      answer: "You can request a demo by filling out the demo request form on our website. Lets’s talk form"
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#F7F7F5] py-20">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#171717] leading-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[14px] leading-[1.6] text-[#4B5563] mb-8">
              Have any questions about our services?
              <br />
              You&apos;re in the right place.
            </p>
            <Link
              to="/faq"
              className="w-full sm:w-[160px] h-[50px] inline-flex items-center justify-center rounded-[10px] bg-[#0C69B6] text-white text-[12px] font-semibold uppercase tracking-wide hover:bg-[#0C69B6]/90 transition-colors"
            >
              VIEW ALL FAQ
            </Link>
          </div>

          <div>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-slate-200 py-5"
              >
                <button
                  className="flex items-start gap-4 w-full text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-[#4B5563] text-[18px] font-light w-4 flex-shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                  <span className="text-[15px] font-medium text-[#171717]">
                    {faq.question}
                  </span>
                </button>
                {openIndex === index && (
                  <p className="mt-3 pl-8 text-[13px] leading-[1.6] text-[#4B5563]">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat min-h-[620px] md:min-h-[720px] flex items-center justify-center"
      style={{ backgroundImage: `url('${asset('/herobg.webp')}')` }}
    >
      <div className="relative z-10 w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-slate-900">
          <span className="block text-[38px] md:text-[52px] lg:text-[62px]">
            Your business runs on precision.
          </span>
          <span className="block text-[38px] md:text-[52px] lg:text-[62px] italic text-[#FF641F]">
            Your software should too.
          </span>
        </h2>

        <p className="mt-6 text-[17px] leading-[1.7] text-slate-600 max-w-3xl mx-auto">
          Book a demo today. We configure it on your stock, your rates, and your industry — so you see exactly what changes before you commit.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/contact/#contact-form"
            className="w-full sm:w-[182px] h-[50px] inline-flex items-center justify-center rounded-[10px] bg-[#FF641F] text-white text-[14px] font-semibold hover:bg-[#E55A18] transition-colors"
          >
            Get 14 Days Free Trial
          </Link>
          <Link
            to="/contact/#contact-form"
            className="w-full sm:w-[160px] h-[50px] inline-flex items-center justify-center rounded-[10px] bg-white border border-slate-900 text-slate-900 text-[14px] font-semibold hover:bg-slate-50 transition-colors"
          >
            Book A Free Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuickEnquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    product: '',
    email: ''
  });

  const products = ['JewelBiz', 'CuraBiz', 'Specialized Retail', 'Custom ERP'];

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.product) return;
    console.log('Quick enquiry:', formData);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-enquiry-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div
        className="relative w-full sm:max-w-[420px] max-h-[92svh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8"
      >
        <div className="sm:hidden w-10 h-1 rounded-full bg-slate-200 mx-auto mb-4" aria-hidden />

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#FF641F] mb-2 pr-10">
          Quick Enquiry
        </p>
        <h2 id="quick-enquiry-title" className="text-[20px] sm:text-[22px] font-semibold text-slate-900 mb-1 pr-8">
          Talk to SlateBiz
        </h2>
        <p className="text-[13px] text-slate-500 mb-5 sm:mb-6">
          Name, number, and product — we&apos;ll call you back.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Name <span className="text-[#FF641F]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-slate-100 border-0 text-[16px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF641F] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Contact number <span className="text-[#FF641F]">*</span>
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              placeholder="+91 XXXXXXXXXX"
              autoComplete="tel"
              className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-slate-100 border-0 text-[16px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF641F] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Product interested in <span className="text-[#FF641F]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {products.map((product) => (
                <button
                  key={product}
                  type="button"
                  onClick={() => handleChange('product', product)}
                  className={`min-h-[48px] py-2.5 px-2 sm:px-3 rounded-lg border text-[12px] sm:text-[13px] font-medium transition-colors ${
                    formData.product === product
                      ? 'bg-orange-50 border-[#FF641F] text-[#FF641F]'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {product}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Business email <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              inputMode="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-slate-100 border-0 text-[16px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF641F] outline-none"
            />
          </div>

          <div className="pt-2 space-y-3 sticky bottom-0 bg-white pb-1">
            <button
              type="submit"
              className="w-full min-h-[48px] py-3 rounded-lg bg-[#FF641F] text-white text-[14px] font-semibold hover:bg-[#E55A18] transition-colors"
            >
              Request a call
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full min-h-[48px] py-3 rounded-lg bg-white border border-slate-300 text-slate-600 text-[14px] font-medium hover:bg-slate-50 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

