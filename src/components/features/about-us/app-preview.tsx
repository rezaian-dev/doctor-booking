import Image from 'next/image';
import AosWrapper from '@/components/shared/aos-wrapper';

/**
 * ✨ AppPreview Component - Production-ready responsive showcase
 */
const AppPreview = () => {
  return (
    /* 🚫➡️ overflow-x-clip contains AOS fade-left/right (translateX ±100px) so the
       animated blocks can't overflow a 320px viewport → no horizontal scroll.
       clip keeps the vertical axis visible (no content gets cut) 📐 */
    <section className="container px-4 md:px-8 mt-10 md:mt-33.75 overflow-x-clip">
      <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-y-0 justify-between">
        {/* 🖼️ Image */}
        <AosWrapper animation="fade-right" className="w-full max-w-125 aspect-498/541">
          <Image
            src="/images/doctors.png"
            alt="گروهی از پزشکان در حال استفاده از نرم‌افزارهای هوشمند سلامت"
            width={498}
            height={541}
            className="h-auto w-full object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
            priority={false}
          />
        </AosWrapper>

        {/* 📝 Content */}
        <AosWrapper animation="fade-left" delay={150} className="max-w-3xl">
          <h2 className="text-black text-2xl md:text-3xl font-bold mb-4">
            تکنولوژی در خدمت سلامت
          </h2>
          <p className="text-black text-base md:text-lg leading-relaxed text-justify xs:text-right">
            ما با استفاده از فناوری‌های روز، فرایند نوبت‌دهی پزشکی را به سطحی
            جدید ارتقا داده‌ایم. دکتر رزرو با بهره‌گیری از الگوریتم‌های هوشمند،
            سیستم یادآوری خودکار و داده‌های ایمن‌شده، بستری مطمئن و سریع برای
            دریافت خدمات پزشکی فراهم کرده است. طراحی کاربرپسند و دسترسی آسان به
            اطلاعات، باعث شده تا بیماران بدون پیچیدگی‌های اضافی و در کمترین
            زمان، نوبت موردنظر خود را رزرو کنند. همچنین، پزشکان می‌توانند با
            مدیریت دقیق‌تر زمان‌های خود، بهره‌وری بیشتری داشته باشند. با دکتر
            رزرو، نوبت‌دهی دیگر یک چالش نیست، بلکه تجربه‌ای راحت، سریع و بدون
            دغدغه است.
          </p>
        </AosWrapper>
      </div>
    </section>
  );
};

export default AppPreview;
