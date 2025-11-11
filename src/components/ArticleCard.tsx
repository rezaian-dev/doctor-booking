'use client';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
}

/**
 * 📰 ArticleCard – Reusable card with optimized, responsive image
 * ✅ Max height 256px | ✅ Responsive sizing | ✅ Object cover | ✅ SEO-friendly
 */
const ArticleCard = ({
  title,
  excerpt,
  date,
  image,
  href,
}:ArticleCardProps) => {
  return (
    <div className="bg-white rounded-[10px] overflow-hidden border border-b-neutral-100 drop-shadow-[0_8px_40px_rgba(0,0,0,0.05)]">
      {/* 🖼️ Optimized Image */}
      <div className="aspect-289/200 w-full relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <div className="px-4 py-3 flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-1">
          <h4 className="font-medium text-base md:text-lg text-neutral-990 line-clamp-1">
            {title}
          </h4>
          <p className="text-sm/7 text-neutral-750 line-clamp-1">{excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-550 text-[13px]">{date}</span>
          <Link
            href={href}
            className="text-primary-500 text-sm/7"
            aria-label={`ادامه مطلب: ${title}`}
          >
            ادامه مطلب
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
