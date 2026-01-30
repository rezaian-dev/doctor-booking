import Image from 'next/image';

interface SpecialtyCardProps {
  image: string;
  title: string;
  subtitle: string;
}

/**
 * 🎯 Reusable medical specialty card.
 * 🖼️ Icons use lazy loading → no impact on initial page load!
 * ♿ Accessible with dynamic alt text.
 * 📱 Fully responsive text & layout.
 */
const SpecialtyCard = ({ image, title, subtitle }: SpecialtyCardProps) => {
  return (
    <div className="p-4 rounded-[10px] bg-white border border-neutral-100 flex flex-col gap-y-4 items-center justify-center">
      {/* 🖼️ Lazy-loaded icon – only loads when near viewport */}
      <Image
        src={image}
        width={64}
        height={64}
        alt={`${title} icon`}
        loading="lazy" // ⚡ Optimizes performance & data usage
        className="object-contain"
      />

      <div className="flex flex-col items-center justify-center gap-y-1">
        <h4 className="font-medium text-center text-sm md:text-base text-neutral-900">
          {title}
        </h4>
        <span className="text-xs md:text-sm text-center text-neutral-600">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default SpecialtyCard;
