// 🧠 Generic RTL-aware, responsive Swiper carousel.
// ✨ overflow-hidden prevents slide bleed; a mounted guard avoids SSR mismatch on nav buttons.
// 🔧 RTL: NEXT = left (←), PREV = right (→).
'use client';

import { cn } from '@/lib/utils/cn';
import { useRef, useState, useSyncExternalStore, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';

import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface BreakpointConfig { slidesPerView: number; spaceBetween: number }

export interface SwiperSectionProps<T> {
  title:                 string;
  viewAllHref?:          string;
  viewAllLabel?:         string;
  items:                 readonly T[];
  renderItem:            (item: T, index?: number) => ReactNode;
  getItemKey:            (item: T) => string | number;
  breakpoints?:          { [key: number]: BreakpointConfig };
  defaultSlidesPerView?: number;
  defaultSpaceBetween?:  number;
  className?:            string;
  containerClassName?:   string;
  autoplay?:             boolean | number; // ▶️ true = 4.5s, or pass a custom delay in ms
}

function SwiperSection<T>({
  title,
  viewAllHref          = '#',
  viewAllLabel         = 'مشاهده همه',
  items,
  renderItem,
  getItemKey,
  breakpoints = {
    640:  { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
    1280: { slidesPerView: 4, spaceBetween: 24 },
  },
  defaultSlidesPerView = 1,
  defaultSpaceBetween  = 16,
  className            = '',
  containerClassName   = 'container px-4 md:px-8 mt-[30px] md:mt-[94px]',
  autoplay             = false,
}: SwiperSectionProps<T>) {

  // ⏳ mounted: false on server + first client render → nav buttons render only after hydration
  //    (no SSR mismatch). useSyncExternalStore avoids a setState-in-effect mount guard. 🧠
  const mounted = useSyncExternalStore(
    () => () => {}, // 🔌 never changes → no-op subscribe
    () => true,     // 💻 client snapshot
    () => false,    // 🖥️ server snapshot
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd,       setIsEnd]       = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  // 🔄 Nav state is fed by Swiper's own onSwiper (init) + onSlideChange callbacks — no effect needed
  const syncNavState = (s: { isBeginning: boolean; isEnd: boolean }) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <section className={containerClassName}>
      <SectionHeader title={title} viewAllHref={viewAllHref} viewAllLabel={viewAllLabel} />

      {/* 🎠 Carousel container
          px-5: space for nav buttons so they don't overlap cards
          overflow-hidden: clips slides cleanly inside container */}
      <div className={cn('relative', className)}>
        <div className="overflow-hidden mx-5">
          <Swiper
            ref={swiperRef}
            dir="rtl"
            modules={autoplay ? [Navigation, Autoplay] : [Navigation]}
            slidesPerView={defaultSlidesPerView}
            spaceBetween={defaultSpaceBetween}
            watchOverflow
            onSwiper={syncNavState}
            onSlideChange={syncNavState}
            breakpoints={breakpoints}
            className="pb-2"
            {...(autoplay
              ? {
                  // ▶️ Auto-advance; keep going after manual nav, pause on hover
                  autoplay: {
                    delay: typeof autoplay === 'number' ? autoplay : 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  },
                }
              : {})}
          >
            {items.map((item, idx) => (
              <SwiperSlide key={getItemKey(item)} className="h-auto">
                {renderItem(item, idx)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ══════════════════════════════════════════
            RTL NAVIGATION — correct visual layout:
            • NEXT button: LEFT side, arrow points LEFT (←), calls slideNext()
            • PREV button: RIGHT side, arrow points RIGHT (→), calls slidePrev()
            In RTL carousels, "forward" visually moves toward the left.
            ══════════════════════════════════════════ */}

        {/* ← Left-side NEXT button: advances to newer slides */}
        {mounted && !isEnd && (
          <button
            onClick={() => swiperRef.current?.swiper?.slideNext()}
            aria-label="اسلایدهای بیشتر"
            className="absolute top-1/2 -translate-y-1/2 left-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:shadow-lg transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* → Right-side PREV button: goes back to earlier slides */}
        {mounted && !isBeginning && (
          <button
            onClick={() => swiperRef.current?.swiper?.slidePrev()}
            aria-label="اسلایدهای قبلی"
            className="absolute top-1/2 -translate-y-1/2 right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:shadow-lg transition-all"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
}

export default SwiperSection;
