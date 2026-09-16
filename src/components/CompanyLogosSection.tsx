import { asset } from '../lib/asset';

const DEFAULT_LOGOS = [
  '/hissaria gems private limited.webp',
  '/Mahalaxmi.webp',
  '/BTR.webp',
  '/b l hissaria jewellers.webp',
  '/Cris-v2.png',
  '/Bhagwati Ayurveda & Panchakarma Research Centre.webp',
  '/Parmeshwari Newborn & Children Hospital - Abohar.webp',
  '/Skyy High Placement.webp',
  '/Shiv General Store.webp',
];

type CompanyLogosSectionProps = {
  logos?: string[];
  className?: string;
};

export default function CompanyLogosSection({
  logos = DEFAULT_LOGOS,
  className = 'bg-white',
}: CompanyLogosSectionProps) {
  return (
    <div className={`relative z-20 w-full overflow-hidden py-7 sm:py-8 md:py-9 ${className}`}>
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-500 sm:mb-6 sm:text-[13px]">
        Trusted by 17,000+ founders & business owners
      </p>
      <div className="overflow-hidden">
        <div className="company-logos-marquee items-center gap-6 sm:gap-8 md:gap-10">
          {logos.map((src, idx) => (
            <div
              key={`logo-a-${idx}`}
              className="flex h-24 w-44 shrink-0 items-center justify-center p-1.5 sm:h-28 sm:w-52 md:h-32 md:w-56"
            >
              <img
                src={asset(src)}
                alt="Client logo"
                loading="lazy"
                decoding="async"
                width={256}
                height={128}
                className={`max-h-full max-w-full object-contain${
                  src.includes('Cris') ? '' : ' mix-blend-multiply'
                }`}
              />
            </div>
          ))}
          {logos.map((src, idx) => (
            <div
              key={`logo-b-${idx}`}
              className="flex h-24 w-44 shrink-0 items-center justify-center p-1.5 sm:h-28 sm:w-52 md:h-32 md:w-56"
            >
              <img
                src={asset(src)}
                alt="Client logo"
                loading="lazy"
                decoding="async"
                width={256}
                height={128}
                className={`max-h-full max-w-full object-contain${
                  src.includes('Cris') ? '' : ' mix-blend-multiply'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes company-logos-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .company-logos-marquee {
          display: inline-flex;
          animation: company-logos-marquee 22s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
