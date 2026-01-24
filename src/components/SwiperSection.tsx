'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useRef, useState, ReactNode } from 'react';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Button } from '@/components/ui/button';

// 📐 Breakpoint configuration type
interface BreakpointConfig {
  slidesPerView: number;
  spaceBetween: number;
}

interface SwiperSectionProps<T> {
  // 🎨 Section metadata
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;

  // 📦 Data & rendering
  items: readonly T[];
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string | number;

  // 🎛️ Swiper configuration
  breakpoints?: {
    [key: number]: BreakpointConfig;
  };
  defaultSlidesPerView?: number;
  defaultSpaceBetween?: number;

  // 🎨 Styling
  className?: string;
  containerClassName?: string;
}

/**
 * 🎠 SwiperSection – Unified carousel component with shadcn/ui Button
 * ✅ Eliminates code duplication across doctor/testimonial/article sections
 * ✅ RTL-ready | ✅ Fully responsive | ✅ Type-safe | ✅ Accessible
 */
function SwiperSection<T>({
  title,
  viewAllHref = '#',
  viewAllLabel = 'مشاهده همه',
  items,
  renderItem,
  getItemKey,
  breakpoints = {
    640: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
    1280: { slidesPerView: 4, spaceBetween: 24 },
  },
  defaultSlidesPerView = 1,
  defaultSpaceBetween = 16,
  className = '',
  containerClassName = 'container px-4 md:px-8 mt-[30px] md:mt-[94px]',
}: SwiperSectionProps<T>) {
  // 🧠 Track swiper boundaries for nav buttons
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  // 🔄 Update nav state on slide change
  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // 🎯 Manual navigation handlers
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleNext = () => swiperRef.current?.swiper?.slideNext();

  return (
    <section className={containerClassName}>
      {/* 🧭 Header: Title + "View All" link */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-neutral-975 line-clamp-2">
          {title}
        </h2>
        <div className="flex items-center gap-x-1.5">
          <Link
            href={viewAllHref}
            className="font-medium text-xs sm:text-sm text-neutral-400 hover:text-neutral-600 focus:text-neutral-700 focus:outline-none transition-colors whitespace-nowrap"
            aria-label={`${viewAllLabel} - ${title}`}
          >
            {viewAllLabel}
          </Link>
          <MdOutlineKeyboardArrowLeft
            size={20}
            className="text-neutral-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 🎠 Swiper Carousel */}
      <div className={clsx('mt-[18px] relative', className)}>
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          slidesPerView={defaultSlidesPerView}
          spaceBetween={defaultSpaceBetween}
          watchOverflow
          onSwiper={swiper => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          breakpoints={breakpoints}
          className="pb-6"
        >
          {items.map(item => (
            <SwiperSlide key={getItemKey(item)}>
              {renderItem(item)}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ◀️ Previous Button (RTL: right side) */}
        {!isBeginning && (
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="icon"
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 z-10',
              'w-10 h-10 rounded-full',
              'bg-white/80 backdrop-blur-sm text-gray-700',
              'hover:bg-white hover:shadow-md',
              'focus-visible:ring-2 focus-visible:ring-primary-500',
              'transition-all duration-200 ease-in-out',
              'right-0 sm:-right-3 md:-right-4 lg:-right-5'
            )}
            aria-label="اسلاید قبلی"
          >
            <MdOutlineKeyboardArrowRight size={20} />
          </Button>
        )}

        {/* ▶️ Next Button (RTL: left side) */}
        {!isEnd && (
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 z-10',
              'w-10 h-10 rounded-full',
              'bg-white/80 backdrop-blur-sm text-gray-700',
              'hover:bg-white hover:shadow-md',
              'focus-visible:ring-2 focus-visible:ring-primary-500',
              'transition-all duration-200 ease-in-out',
              'left-0 sm:-left-3 md:-left-4 lg:-left-5'
            )}
            aria-label="اسلاید بعدی"
          >
            <MdOutlineKeyboardArrowLeft size={20} />
          </Button>
        )}
      </div>
    </section>
  );
}

export default SwiperSection;
