import { useState } from 'react';
import { asset } from '../../lib/asset';
import HospitalAppDemo from './HospitalAppDemo';
import { useLiveLink } from './LiveLinkModal';

const HOSPITAL_LIVE = 'https://hospital-erp-ten.vercel.app/';
const BRAND_LIVE = 'https://www.blhissaria.com/';

/** Interactive hospital website demo — deeper actions open the live-link gate. */
export function HospitalDesktopScreen() {
  const { askLiveLink } = useLiveLink();
  const [page, setPage] = useState<'home' | 'departments' | 'doctors'>('home');

  const deeper = (reason: string) =>
    askLiveLink({
      url: HOSPITAL_LIVE,
      product: 'Curabiz Hospital',
      reason,
    });

  const nav = (
    <div className="flex items-center justify-between">
      <button type="button" onClick={() => setPage('home')} className="shrink-0">
        <img
          src={asset('/services/curabiz-logo-white.png')}
          alt="curabiz"
          className="h-7 w-auto object-contain"
        />
      </button>
      <div className="hidden items-center gap-3 text-[10px] font-medium text-white/85 sm:flex">
        {(
          [
            ['departments', 'Departments'],
            ['doctors', 'Doctors'],
            ['services', 'Services'],
            ['about', 'About'],
            ['contact', 'Contact'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (key === 'departments' || key === 'doctors') setPage(key);
              else
                deeper(
                  `${label} continues on the live Curabiz hospital site — this preview stays light for performance.`,
                );
            }}
            className={
              (key === 'departments' || key === 'doctors') && page === key
                ? 'text-[#FF8A4C]'
                : 'hover:text-white'
            }
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            deeper('Booking and calendar sync run on the live hospital site.')
          }
          className="rounded-full bg-[#FF641F] px-3 py-1.5 text-[10px] font-bold text-white"
        >
          Book appointment
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0B1C2C] text-white">
      {page === 'home' ? (
        <>
          <img
            src={asset('/services/hospital-hero.webp')}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2C]/88 via-[#0B1C2C]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2C]/55 via-transparent to-[#0B1C2C]/25" />
          <div className="relative flex h-full flex-col px-7 py-5">
            {nav}
            <div className="mt-auto max-w-[58%] pb-8 pt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF8A4C]">
                Private multi-specialty · Jaipur
              </p>
              <h3 className="mt-2 font-serif text-[28px] font-semibold leading-[1.08] tracking-tight sm:text-[34px]">
                One patient journey. Registration to discharge.
              </h3>
              <p className="mt-3 max-w-md text-[12px] leading-relaxed text-white/88">
                Advanced OPD to discharge care — specialists, diagnostics and pharmacy under one
                organised roof.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    deeper('WhatsApp consultation continues on the live Curabiz site.')
                  }
                  className="inline-flex items-center rounded-full bg-[#25D366] px-3.5 py-2 text-[10px] font-bold"
                >
                  WhatsApp consultation
                </button>
                <button
                  type="button"
                  onClick={() => setPage('doctors')}
                  className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-3.5 py-2 text-[10px] font-bold backdrop-blur-md"
                >
                  Find a specialist
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative flex h-full flex-col bg-[#F7F9FC] text-[#0F172A]">
          <div className="bg-[#0A2F5C] px-7 py-4 text-white">{nav}</div>
          <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
            {page === 'departments' ? (
              <>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0C69B6]">
                  Departments
                </p>
                <h3 className="mt-1 font-serif text-[26px] font-semibold text-[#0A2F5C]">
                  Specialist care under one roof
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    ['General Medicine', '/services/app/opd.jpg'],
                    ['Diagnostics & Lab', '/services/app/lab.jpg'],
                    ['Pharmacy', '/services/app/pharmacy.jpg'],
                    ['Orthopaedics', '/services/app/care.jpg'],
                    ['Paediatrics', '/services/app/lobby.jpg'],
                    ['IPD wards', '/services/app/ipd.jpg'],
                  ].map(([name, img]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        deeper(`Full ${name} details and booking live on the hospital site.`)
                      }
                      className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white text-left"
                    >
                      <img src={asset(img)} alt="" className="h-16 w-full object-cover" />
                      <p className="px-2.5 py-2 text-[11px] font-extrabold">{name}</p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0C69B6]">
                  Doctors
                </p>
                <h3 className="mt-1 font-serif text-[26px] font-semibold text-[#0A2F5C]">
                  Consultants on the OPD list
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ['Dr. Vikram Malhotra', 'General Medicine', '/services/app/vikram.jpg'],
                    ['Dr. Ishita Banerjee', 'Paediatrics', '/services/app/ishita.jpg'],
                    ['Dr. Manav Sharma', 'Orthopaedics', '/services/app/manav.jpg'],
                    ['Dr. Rahul Mehta', 'Cardiology', '/services/app/rahul.jpg'],
                  ].map(([name, role, img]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        deeper('Doctor schedules and live booking open on the hospital website.')
                      }
                      className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 text-left"
                    >
                      <img
                        src={asset(img)}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover object-[center_30%]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-extrabold">{name}</p>
                        <p className="text-[10px] font-semibold text-[#64748B]">{role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() =>
                deeper('Open the live Curabiz hospital site for the complete patient journey.')
              }
              className="mt-5 text-[12px] font-extrabold text-[#0C69B6]"
            >
              See more on live site →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Full interactive Flutter-style patient app running inside the Services page. */
export function HospitalAppScreen() {
  return <HospitalAppDemo />;
}

export function BrandDesktopScreen() {
  const { askLiveLink } = useLiveLink();
  const deeper = (reason: string) =>
    askLiveLink({ url: BRAND_LIVE, product: 'B.L. Hissaria', reason });

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0B1C14] text-[#F4F0E6]">
      <img
        src={asset('/services/brand-hero.webp')}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[70%_20%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C14]/92 via-[#0B1C14]/55 to-[#0B1C14]/15" />

      <div className="relative flex h-full flex-col px-7 py-5">
        <div className="flex items-center justify-between">
          <p className="font-serif text-[13px] tracking-wide text-[#E8D5A8]">
            B.L. Hissaria Jewellers
          </p>
          <div className="hidden gap-4 text-[10px] uppercase tracking-[0.14em] text-[#F4F0E6]/80 sm:flex">
            <span className="text-[#C6A15B]">Home</span>
            {['Collections', 'About Us', 'Contact'].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  deeper(`${label} and full brand storytelling continue on blhissaria.com.`)
                }
                className="hover:text-[#C6A15B]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto max-w-[52%] pb-10 pt-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#F4F0E6]/75">
            Timeless by Generations
          </p>
          <h3 className="mt-3 font-serif text-[32px] leading-[1.05] text-[#F4F0E6] sm:text-[38px]">
            Jewellery that
            <span className="block">tells your story.</span>
          </h3>
          <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-[#F4F0E6]/65">
            Exquisite designs. Unwavering quality. A legacy of trust for generations.
          </p>
          <button
            type="button"
            onClick={() => deeper('Collections, lookbooks and showroom booking live on blhissaria.com.')}
            className="mt-5 inline-flex bg-[#C6A15B] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#0B1C14]"
          >
            Explore Our Collections →
          </button>

          <div className="mt-8 flex gap-8 border-t border-[#C6A15B]/35 pt-4">
            {[
              ['50+', 'Years of Trust'],
              ['1L+', 'Happy Customers'],
              ['100%', 'Hallmarked'],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-serif text-[22px] text-[#C6A15B]">{v}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#F4F0E6]/55">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EcommerceDesktopScreen() {
  const { askLiveLink } = useLiveLink();
  const deeper = (reason: string) =>
    askLiveLink({ url: BRAND_LIVE, product: 'B.L. Hissaria boutique', reason });

  const products = [
    { name: 'Bridal Necklace', img: '/services/product-bridal-necklace.webp', price: '₹2,48,000' },
    { name: 'Diamond Studs', img: '/services/product-diamond-studs.webp', price: '₹86,500' },
    { name: 'Gold Kada', img: '/services/product-gold-kada.webp', price: '₹64,200' },
    { name: 'Mangalsutra', img: '/services/product-mangalsutra.webp', price: '₹52,800' },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#F7F4EF] text-[#0B1C14]">
      <div className="relative min-h-[58%] overflow-hidden bg-[#0B1C14]">
        <img
          src={asset('/services/ecom-hero.webp')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[70%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C14]/90 via-[#0B1C14]/55 to-[#0B1C14]/20" />
        <div className="relative flex h-full flex-col justify-between px-6 py-4 text-[#F4F0E6]">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[12px] text-[#E8D5A8]">B.L. Hissaria · Boutique</p>
            <div className="flex gap-3 text-[9px] uppercase tracking-[0.14em] text-[#F4F0E6]/75">
              <span>Shop</span>
              <button type="button" onClick={() => deeper('Bridal paths continue on the live boutique.')}>
                Bridal
              </button>
              <button type="button" onClick={() => deeper('Cart and checkout open on the live boutique.')}>
                Cart (2)
              </button>
            </div>
          </div>
          <div className="pb-3 pt-8">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#C6A15B]">Online Boutique</p>
            <h3 className="mt-2 max-w-md font-serif text-[28px] leading-[1.05]">
              Jewellery that tells your story.
            </h3>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => deeper('Full catalogue browsing continues on the live boutique.')}
                className="bg-[#C6A15B] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-[#0B1C14]"
              >
                Shop All →
              </button>
              <button
                type="button"
                onClick={() => deeper('Bridal collection opens on the live boutique.')}
                className="border border-[#F4F0E6]/35 px-3 py-2 text-[9px] uppercase tracking-[0.14em]"
              >
                Bridal Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#C6A15B]">Featured</p>
            <p className="font-serif text-[16px]">Chosen for this season</p>
          </div>
          <button
            type="button"
            onClick={() => deeper('See the complete featured edit on the live boutique.')}
            className="text-[9px] uppercase tracking-[0.14em] text-[#0B1C14]/50"
          >
            View all →
          </button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {products.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => deeper(`${p.name} product detail and purchase live on the boutique.`)}
              className="overflow-hidden bg-white text-left"
            >
              <img src={asset(p.img)} alt="" className="aspect-square w-full object-cover" />
              <div className="px-1.5 py-1.5">
                <p className="truncate text-[9px] font-medium">{p.name}</p>
                <p className="text-[9px] text-[#C6A15B]">{p.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const AURA_REPLIES: Record<string, { user: string; bot: string; note: string }> = {
  'Bridal under 2L': {
    user: 'Do you have bridal sets under 2L?',
    bot: 'Yes — I can shortlist hallmarked bridal options in that band. Engagement or wedding?',
    note: 'CRM · scored Hot · Qualified',
  },
  'Book a visit': {
    user: 'Can I visit the showroom tomorrow?',
    bot: 'Of course. Prefer morning or evening? I’ll hold a slot and confirm on this chat.',
    note: 'CRM · appointment hold · Negotiation',
  },
  'Follow up later': {
    user: 'Not now — maybe next month.',
    bot: 'No rush. I’ll send a gentle reminder in 7 days with fresh options. Reply STOP anytime.',
    note: 'CRM · 7-day follow-up sequence',
  },
};

const CRM_LEADS = [
  {
    name: 'Priya Sharma',
    initials: 'PS',
    phone: '+91 98765 21408',
    email: 'priya.s@email.com',
    stage: 'Qualified',
    tag: 'Hot' as const,
    score: 86,
    source: 'WhatsApp',
    interest: 'Bridal set · budget under ₹2L',
    owner: 'Aura AI',
    ownerInitials: 'AI',
    lastSeen: '2 min ago',
    value: '₹1.8L',
    city: 'Jaipur',
    tags: ['Wedding', 'Bridal', 'Deposit-ready'],
    timeline: [
      { t: '2m', label: 'Inbound WhatsApp', detail: '“Do you have bridal sets under 2L?”' },
      { t: '2m', label: 'AI reply sent', detail: 'Asked occasion · wedding confirmed' },
      { t: '1m', label: 'Score updated', detail: '86 · Hot · intent + budget signals' },
      { t: '1m', label: 'Stage changed', detail: 'Contacted → Qualified' },
    ],
  },
  {
    name: 'Rahul Mehta',
    initials: 'RM',
    phone: '+91 97661 22014',
    email: 'rahul.m@email.com',
    stage: 'Interested',
    tag: 'Warm' as const,
    score: 71,
    source: 'WhatsApp',
    interest: '22K rate + showroom visit',
    owner: 'Ananya Rao',
    ownerInitials: 'AR',
    lastSeen: '18 min ago',
    value: '₹45K',
    city: 'Jaipur',
    tags: ['Daily wear', 'Visit'],
    timeline: [
      { t: '18m', label: 'Asked gold rate', detail: '22K indicative shared via template' },
      { t: '12m', label: 'Visit suggested', detail: 'Tomorrow 5–7 PM slot offered' },
      { t: '8m', label: 'Follow-up queued', detail: 'Auto nudge in 24h if no reply' },
    ],
  },
  {
    name: 'Neha Gupta',
    initials: 'NG',
    phone: '+91 98290 44112',
    email: 'neha.g@clinic.in',
    stage: 'Contacted',
    tag: 'Warm' as const,
    score: 58,
    source: 'Broadcast reply',
    interest: 'OPD reminder broadcasts',
    owner: 'Unassigned',
    ownerInitials: '—',
    lastSeen: '1 hr ago',
    value: '—',
    city: 'Jaipur',
    tags: ['Clinic', 'Broadcast'],
    timeline: [
      { t: '1h', label: 'Replied to campaign', detail: 'Interested in OPD reminders' },
      { t: '55m', label: 'Lead created', detail: 'Merged by phone · opted-in' },
      { t: '40m', label: 'Assigned queue', detail: 'Waiting for agent claim' },
    ],
  },
  {
    name: 'Vikram Shah',
    initials: 'VS',
    phone: '+91 94140 77821',
    email: 'vikram@retail.co',
    stage: 'Negotiation',
    tag: 'Hot' as const,
    score: 79,
    source: 'WhatsApp',
    interest: 'Diamond studs · quote',
    owner: 'Ananya Rao',
    ownerInitials: 'AR',
    lastSeen: 'Yesterday',
    value: '₹92K',
    city: 'Udaipur',
    tags: ['Diamond', 'Quote'],
    timeline: [
      { t: '1d', label: 'Quote shared', detail: 'Making + GST breakdown sent' },
      { t: '1d', label: 'Stage → Negotiation', detail: 'Waiting on budget confirmation' },
    ],
  },
] as const;

const PIPELINE_COUNTS = [
  { label: 'New', n: 18 },
  { label: 'Contacted', n: 34 },
  { label: 'Qualified', n: 22 },
  { label: 'Negotiation', n: 11 },
  { label: 'Converted', n: 43 },
] as const;

/** Aura Connect — realistic CRM workspace for the laptop frame. */
export function AuraCrmScreen() {
  const [active, setActive] = useState(0);
  const lead = CRM_LEADS[active];

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#EEF1F4] text-[11px] text-slate-800">
      {/* App rail */}
      <aside className="flex w-10 shrink-0 flex-col items-center gap-3 bg-[#0B1C2C] py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#25D366] text-[10px] font-bold text-[#0B1C2C]">
          A
        </div>
        {['▣', '◎', '☰', '✎', '⚙'].map((icon, i) => (
          <span
            key={icon}
            className={`flex h-6 w-6 items-center justify-center rounded-[6px] text-[10px] ${
              i === 1 ? 'bg-white/15 text-white' : 'text-white/40'
            }`}
          >
            {icon}
          </span>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-2 border-b border-slate-200/80 bg-white px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold tracking-tight text-slate-900">
              Aura Connect · CRM
            </p>
            <p className="text-[9px] text-slate-500">SlateBiz Softwares · Production</p>
          </div>
          <div className="ml-auto hidden items-center gap-1.5 sm:flex">
            <div className="rounded-[6px] border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] text-slate-400">
              Search leads, phone, tags…
            </div>
            <button
              type="button"
              className="rounded-[6px] bg-[#25D366] px-2.5 py-1 text-[9px] font-semibold text-white"
              onClick={(e) => e.stopPropagation()}
            >
              + Lead
            </button>
          </div>
        </header>

        {/* Pipeline strip */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200/80 bg-white px-3 py-2">
          {PIPELINE_COUNTS.map((col, i) => (
            <div
              key={col.label}
              className={`min-w-[72px] flex-1 rounded-[7px] px-2 py-1.5 ${
                i === 2 ? 'bg-[#E8F8EF] ring-1 ring-[#25D366]/30' : 'bg-slate-50'
              }`}
            >
              <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {col.label}
              </p>
              <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-slate-900">{col.n}</p>
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Lead table */}
          <div className="min-w-0 flex-[1.15] overflow-hidden border-r border-slate-200/80 bg-white">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.55fr_0.7fr] gap-1 border-b border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              <span>Lead</span>
              <span>Stage</span>
              <span>Score</span>
              <span>Owner</span>
            </div>
            <div className="overflow-y-auto">
              {CRM_LEADS.map((row, i) => (
                <button
                  key={row.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`grid w-full grid-cols-[1.4fr_0.7fr_0.55fr_0.7fr] items-center gap-1 border-b border-slate-50 px-2.5 py-2 text-left ${
                    i === active ? 'bg-[#F0FAF4]' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B1C2C] text-[8px] font-bold text-white">
                      {row.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-semibold text-slate-900">
                        {row.name}
                      </span>
                      <span className="block truncate text-[8px] text-slate-500">
                        {row.source} · {row.lastSeen}
                      </span>
                    </span>
                  </span>
                  <span>
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-semibold ${
                        row.tag === 'Hot'
                          ? 'bg-orange-50 text-orange-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}
                    >
                      {row.stage}
                    </span>
                  </span>
                  <span className="pr-1">
                    <span className="mb-0.5 block text-[9px] font-semibold tabular-nums">
                      {row.score}
                    </span>
                    <span className="block h-1 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-[#25D366]"
                        style={{ width: `${row.score}%` }}
                      />
                    </span>
                  </span>
                  <span className="truncate text-[9px] text-slate-600">{row.owner}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex w-[46%] min-w-[170px] flex-col bg-[#F7F9FB]">
            <div className="border-b border-slate-200/80 bg-white px-3 py-2.5">
              <div className="flex items-start gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#075E54] text-[11px] font-bold text-white">
                  {lead.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-slate-900">{lead.name}</p>
                  <p className="truncate text-[9px] text-slate-500">{lead.phone}</p>
                  <p className="truncate text-[9px] text-slate-500">{lead.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-semibold tabular-nums text-[#075E54]">{lead.score}</p>
                  <p className="text-[8px] uppercase tracking-[0.1em] text-slate-400">Score</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px border-b border-slate-200 bg-slate-200/80">
              {[
                ['Deal value', lead.value],
                ['City', lead.city],
                ['Source', lead.source],
                ['Owner', lead.owner],
              ].map(([k, v]) => (
                <div key={k} className="bg-white px-2.5 py-1.5">
                  <p className="text-[8px] uppercase tracking-[0.08em] text-slate-400">{k}</p>
                  <p className="mt-0.5 truncate text-[10px] font-medium text-slate-800">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
              <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Timeline
              </p>
              <div className="space-y-2">
                {lead.timeline.map((ev) => (
                  <div key={`${ev.t}-${ev.label}`} className="flex gap-2">
                    <div className="flex w-7 shrink-0 flex-col items-center">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                      <span className="mt-1 text-[7px] tabular-nums text-slate-400">{ev.t}</span>
                    </div>
                    <div className="min-w-0 pb-1">
                      <p className="text-[10px] font-semibold text-slate-800">{ev.label}</p>
                      <p className="text-[9px] leading-snug text-slate-500">{ev.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-3 py-2">
              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#128C7E]">
                Next best action
              </p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-700">
                {lead.tag === 'Hot'
                  ? 'Hold consult slot · deposit follow-up if silent 4h'
                  : 'Keep nurture sequence · pause on next reply'}
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="rounded-[5px] bg-[#25D366] px-2 py-1 text-[8px] font-semibold text-white">
                  Open WhatsApp
                </span>
                <span className="rounded-[5px] border border-slate-200 px-2 py-1 text-[8px] font-semibold text-slate-600">
                  Assign
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Aura Connect — WhatsApp Business chat preview. */
export function AuraConnectScreen() {
  const [messages, setMessages] = useState<
    { from: 'customer' | 'ai' | 'system'; text: string }[]
  >([
    {
      from: 'ai',
      text: 'Namaste! Welcome to our WhatsApp desk. I can help with catalogue, visits and orders — every chat syncs to your CRM.',
    },
  ]);

  const send = (key: string) => {
    const pack = AURA_REPLIES[key];
    if (!pack) return;
    setMessages((prev) => [
      ...prev,
      { from: 'customer', text: pack.user },
      { from: 'ai', text: pack.bot },
      { from: 'system', text: pack.note },
    ]);
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden text-[#111B21]"
      style={{
        backgroundColor: '#E5DDD5',
        backgroundImage:
          'radial-gradient(rgba(0,0,0,0.04) 0.6px, transparent 0.6px)',
        backgroundSize: '10px 10px',
      }}
    >
      <div className="bg-[#075E54] px-3 pb-3 pt-8 text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-[13px] font-bold text-[#075E54]">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight">Aura Connect</p>
            <p className="text-[10px] text-white/70">Business · AI + CRM synced</p>
          </div>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em]">
            WABA
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {messages.map((m, i) =>
          m.from === 'system' ? (
            <div key={`s-${i}`} className="flex justify-center">
              <span className="rounded-full bg-[#FFF3C4] px-2.5 py-1 text-[9px] font-medium text-[#5C4B12] shadow-sm">
                {m.text}
              </span>
            </div>
          ) : (
            <div
              key={`${m.from}-${i}`}
              className={`max-w-[86%] px-2.5 py-2 text-[11px] leading-relaxed shadow-sm ${
                m.from === 'customer'
                  ? 'ml-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-[#D9FDD3]'
                  : 'rounded-tl-xl rounded-tr-xl rounded-br-xl bg-white'
              }`}
            >
              {m.from === 'ai' ? (
                <p className="mb-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#075E54]">
                  Aura AI
                </p>
              ) : null}
              {m.text}
            </div>
          ),
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {Object.keys(AURA_REPLIES).map((q) => (
            <button
              key={q}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                send(q);
              }}
              className="rounded-full border border-[#075E54]/20 bg-white/95 px-2.5 py-1 text-[9px] font-medium tracking-wide text-[#075E54] shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#F0F2F5] px-2 py-2">
        <div className="flex-1 rounded-full bg-white px-3 py-2 text-[11px] text-[#667781] shadow-sm">
          Message…
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-[12px] font-bold text-white shadow">
          ➤
        </div>
      </div>
    </div>
  );
}

const CHAT_REPLIES: Record<string, string> = {
  'Just browsing':
    'Of course — take your time. I can point you to bridal, everyday gold, or diamond favourites whenever you’re ready.',
  'I want to buy / visit':
    'Wonderful. Share a preferred date and city showroom, and our team will confirm on WhatsApp.',
  'Store timings':
    'We’re open Mon–Sat 11:00 AM – 8:00 PM, Sunday 11:00 AM – 6:00 PM. Walk-ins welcome.',
  Address:
    'Visit us at our Jaipur showroom — full map and directions open on the live site.',
  'Gold rate':
    'Today’s indicative 22K rate is shown on the live site and updated by the team each morning.',
};

export function ChatbotScreen() {
  const { askLiveLink } = useLiveLink();
  const [messages, setMessages] = useState<
    { from: 'bot' | 'user'; text: string }[]
  >([
    {
      from: 'bot',
      text: "Namaste! I'm Sunehri from B.L. Hissaria. I can answer quick questions — and if you're seriously looking for jewellery, I'll take a few details so our team can help.",
    },
  ]);

  const send = (q: string) => {
    const reply =
      CHAT_REPLIES[q] ??
      'I can help with browsing, buying, timings, address and gold rate in this preview.';
    setMessages((prev) => [...prev, { from: 'user', text: q }, { from: 'bot', text: reply }]);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F7F4EF] text-[#0B1C14]">
      <div className="flex items-center justify-between bg-[#0B1C14] px-3 pb-3 pt-8 text-[#F4F0E6]">
        <div className="flex items-center gap-2">
          <img
            src={asset('/services/chatbot-avatar.webp')}
            alt=""
            className="h-8 w-8 rounded-full object-cover ring-1 ring-[#C6A15B]/50"
          />
          <div>
            <p className="font-serif text-[13px] leading-tight">Sunehri</p>
            <p className="text-[9px] tracking-wide text-[#F4F0E6]/55">B.L. Hissaria · online</p>
          </div>
        </div>
        <span className="text-[#F4F0E6]/70">✕</span>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
        {messages.map((m, i) => (
          <div
            key={`${m.from}-${i}`}
            className={`max-w-[92%] px-3 py-2 text-[11px] leading-relaxed ${
              m.from === 'bot'
                ? 'border border-[#0B1C14]/10 bg-[#EFE9DF]/80'
                : 'ml-auto bg-[#0B1C14] text-[#F4F0E6]'
            }`}
          >
            {m.text}
          </div>
        ))}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(CHAT_REPLIES).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-[#C6A15B]/40 px-2.5 py-1 text-[9px] tracking-wide text-[#0B1C14]/80"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              askLiveLink({
                url: BRAND_LIVE,
                product: 'Sunehri chatbot',
                reason: 'WhatsApp handoff continues on the live B.L. Hissaria site.',
              })
            }
            className="border border-[#0B1C14]/15 py-1.5 text-center text-[9px] uppercase tracking-[0.12em]"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() =>
              askLiveLink({
                url: BRAND_LIVE,
                product: 'Sunehri chatbot',
                reason: 'Visit booking and lead capture continue on the live site.',
              })
            }
            className="bg-[#0B1C14] py-1.5 text-center text-[9px] uppercase tracking-[0.12em] text-[#F4F0E6]"
          >
            Book visit
          </button>
        </div>
      </div>

      <div className="flex border-t border-[#0B1C14]/10">
        <span className="flex-1 px-3 py-3 text-[12px] text-[#0B1C14]/40">Type your message…</span>
        <span className="px-3 py-3 text-[#C6A15B]">➤</span>
      </div>
    </div>
  );
}

