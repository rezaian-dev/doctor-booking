// 🪶 Lazy Swiper boundary — keeps the ~100KB bundle off the initial homepage payload.
//    SSR a native scroll-snap row of the real cards (SEO + no CLS), then upgrade to the
//    full Swiper only when the section nears the viewport → zero swiper JS on first load. 🚀
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils/cn';
import { SectionHeader } from '@/components/shared/section-header';
import type { SwiperSectionProps } from './swiper-section-impl';

// 🔌 Heavy impl loaded as a separate client-only chunk (ssr:false ⇒ swiper never
//    runs on the server, never ships in the initial JS).
const SwiperSectionImpl = dynamic(() => import('./swiper-section-impl'), {
  ssr: false,
});

function SwiperSection<T>(props: SwiperSectionProps<T>) {
  const sectionRef = useRef<HTMLElement>(null);
  const [upgraded, setUpgraded] = useState(false);

  // 👀 Mount the real carousel a little before it scrolls into view (200px buffer)
  useEffect(() => {
    if (upgraded) return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setUpgraded(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [upgraded]);

  // 🎠 Near viewport → hand off to the full Swiper experience
  if (upgraded) {
    // ⚙️ next/dynamic narrows the generic away; re-apply it for type safety
    const Impl = SwiperSectionImpl as unknown as (p: SwiperSectionProps<T>) => ReactNode;
    return <Impl {...props} />;
  }

  const {
    title,
    viewAllHref = '#',
    viewAllLabel = 'مشاهده همه',
    items,
    renderItem,
    getItemKey,
    containerClassName = 'container px-4 md:px-8 mt-[30px] md:mt-[94px]',
  } = props;

  // 🧱 First-paint fallback — identical cards in a native, JS-free scroll row.
  //    Widths mirror Swiper's slidesPerView so the upgrade is visually seamless.
  return (
    <section ref={sectionRef} className={containerClassName}>
      {/* 🏷️ Header (matches the carousel header 1:1) */}
      <SectionHeader title={title} viewAllHref={viewAllHref} viewAllLabel={viewAllLabel} />

      {/* 📜 Native scroll-snap row — real content, no swiper, hidden scrollbar */}
      <div
        className={cn(
          'mx-5 flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x',
          'scrollbar-none [&::-webkit-scrollbar]:hidden'
        )}
      >
        {items.map((item, idx) => (
          <div
            key={getItemKey(item)}
            className="snap-start shrink-0 basis-[80%] sm:basis-[45%] lg:basis-[30%] xl:basis-[23%]"
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SwiperSection;
