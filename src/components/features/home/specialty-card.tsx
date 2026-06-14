import Image from 'next/image';
import Link from 'next/link';
import CountUp from './count-up';

interface SpecialtyCardProps {
  image: string;
  title: string;
  count: number; // 🩺 real number of doctors in this specialty
  href: string;  // 🔗 destination — /doctors filtered by this specialty
  index?: number;
}

/**
 * 🎯 Reusable medical specialty card.
 * 🖱️ Whole card is a link to the filtered doctors list, with a tactile hover/focus state.
 * 🖼️ Icons use lazy loading → no impact on initial page load!
 * 🔢 Doctor count is real (from DB) and counts up on scroll-in.
 * ♿ Accessible with dynamic alt text + visible focus ring.
 */
const SpecialtyCard = ({ image, title, count, href }: SpecialtyCardProps) => {
  return (
    <Link
      href={href}
      className="group p-4 rounded-[10px] bg-white border border-neutral-100 flex flex-col gap-y-4 items-center justify-center
                 transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-md
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
    >
      {/* 🖼️ Lazy-loaded icon – only loads when near viewport
          sizes: 64px at every breakpoint → stops the browser fetching a larger image than needed */}
      <Image
        src={image}
        width={64}
        height={64}
        alt={`${title} icon`}
        loading="lazy"
        sizes="64px"
        className="object-contain transition-transform duration-200 group-hover:scale-110"
      />

      <div className="flex flex-col items-center justify-center gap-y-1">
        <h3 className="font-medium text-center text-sm md:text-base text-neutral-900 transition-colors group-hover:text-primary-600">
          {title}
        </h3>
        {/* 🔢 Animated real count — exact number, nowrap so it always shows in full */}
        <span className="text-xs md:text-sm text-center text-neutral-600 whitespace-nowrap">
          <CountUp value={count} /> پزشک
        </span>
      </div>
    </Link>
  );
};

export default SpecialtyCard;
