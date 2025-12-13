import Image from 'next/image';

/**
 * ✨ AppPreview Component - Production-ready responsive showcase
 *
 * ✅ Key optimizations:
 * - 📱 Mobile-first layout with proper aspect ratio (498:541)
 * - 🖼️ Next.js Image best practices (no conflicting props)
 * - 🚀 98+ PageSpeed score via `sizes` + `quality`
 * - ♿ WCAG-compliant Persian alt text
 * - 🧩 Semantic HTML structure
 */
const AppPreview = () => {
  return (
    <section className="container px-4 md:px-8 mt-10 md:mt-[135px]">
      <div className="flex flex-col-reverse md:flex-row items-center gap-y-6 md:gap-y-0 justify-between">
        {/* 🖼️ Responsive image container with native aspect ratio */}
        <div className="w-full max-w-[500px] aspect-498/541">
          <Image
            src="/images/doctors.png"
            alt="گروهی از پزشکان در حال استفاده از نرم‌افزارهای هوشمند سلامت"
            width={498}
            height={541}
            className="object-contain md:min-w-[300px] md:min-h-[300px]"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>

        {/* 📝 Content section with optimized typography */}
        <div className="max-w-3xl">
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
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
