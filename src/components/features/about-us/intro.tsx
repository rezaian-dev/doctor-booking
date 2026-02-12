import Image from 'next/image';
import { FC } from 'react';

/**
 * 📱 Intro section for "About Us" page
 * ✨ Fully responsive, RTL-ready, and performance-optimized
 */
const Intro: FC = () => {
  return (
    <div className="container px-4 md:px-8">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-6 md:pt-16 lg:pt-33.75 gap-10 md:gap-0 lg:gap-10.75">
        {/* 📝 Text content */}
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
          <h1 className="text-black text-2xl md:text-3xl font-bold">
            درباره دکتر رزرو
          </h1>
          <span className="text-black text-lg md:text-xl font-bold">
            نوبت‌دهی سریع و هوشمند برای پزشکان و بیماران
          </span>
          <p className="text-black text-base md:text-lg text-justify leading-relaxed">
            دکتر رزرو یک پلتفرم مدرن و کاربرپسند برای مدیریت نوبت‌دهی پزشکان و
            بیماران است. ما با ارائه یک سیستم هوشمند، به پزشکان کمک می‌کنیم تا
            زمان‌های خود را بهتر مدیریت کنند و به بیماران این امکان را می‌دهیم
            که بدون اتلاف وقت، نوبت خود را به‌صورت آنلاین رزرو کنند.
          </p>
        </div>

        {/* 🖼️ Image — full original size on desktop, responsive on mobile */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <Image
            src="/images/about-us.png"
            alt="تصویر معرفی دکتر رزرو"
            width={845}
            height={426}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto w-211.25 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Intro;
