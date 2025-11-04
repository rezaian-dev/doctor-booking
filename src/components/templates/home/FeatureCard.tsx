import Image from 'next/image';

interface FeatureCardProps {
  icon: string;
  alt: string;
  title: string;
  description: string;
}

// 🃏 Reusable feature card with icon, title, and description
const FeatureCard = ({ icon, title, description, alt }: FeatureCardProps) => {
  return (
    // 🎨 Card container with responsive padding & subtle shadow
    <div className="rounded-[10px] gap-x-3 flex items-start py-5 px-3 xl:p-10 border border-neutral-100 drop-shadow-[0px_-8px_32px_0px_rgba(0,0,0,0.05)]">
      {/* 🖼️ Decorative icon (accessible via alt text) */}
      <div>
        <Image
          src={icon}
          alt={alt}
          width={32}
          height={32}
          className="w-6 h-6 sm:w-8 sm:h-8"
        />
      </div>
      {/* 📝 Content: title + description */}
      <div className="flex flex-col gap-y-1">
        <h4 className="font-medium text-sm sm:text-base xl:text-lg">{title}</h4>
        <span className="text-[13px] font-normal text-neutral-800">{description}</span>
      </div>
    </div>
  );
};

export default FeatureCard;
