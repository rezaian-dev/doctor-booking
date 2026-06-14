import Image from 'next/image';
import Link from 'next/link';

/**
 * 🎯 Hero section – primary value proposition with dual CTAs
 * 🖼️ LCP-optimized image (priority-loaded)
 * 💬 Clear messaging: trust + convenience
 * 📱 Mobile-first layout (stacked → side-by-side)
 *
 * ⚡ PERF: above-the-fold content paints synchronously — intentionally NOT wrapped
 *    in AosWrapper. AOS locks [data-aos] at opacity:0 until its (idle-deferred) JS
 *    runs, which delayed the LCP element by up to ~500ms. Entrance animation is
 *    reserved for below-the-fold sections so the largest paint is never blocked. 🚀
 */
const Hero = () => {
  return (
    <section className="container px-4 md:px-8 mt-5.5 md:mt-7.5">
      {/* 📱 Layout: column on mobile, row on desktop */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-y-3.5 md:gap-y-0">
        {/* 📝 Headline + CTAs — paints instantly (no opacity lock) */}
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4 text-center md:text-right">
            <h1 className="font-bold text-3xl sm:text-[32px] md:text-4xl lg:text-5xl text-gray-900">
              سلامت شما، رسالت ما
            </h1>
            <h2 className="text-base lg:text-xl text-neutral-600 leading-relaxed">
              بهترین پزشکان در دسترس شما،
              <br />
              نوبت‌دهی آنلاین مطمئن فقط با چند کلیک.
            </h2>
          </div>

          {/* 🔘 Dual CTA Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-x-4">
            <Link
              href="/doctors?sort=nearest"
              className="group relative flex items-center justify-center rounded-lg bg-primary-600 text-white font-medium text-sm sm:text-base lg:text-lg w-full max-w-36 md:max-w-46 h-12 md:h-14 overflow-hidden transition-all duration-300 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="relative z-10">رزرو نوبت</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg" />
            </Link>

            <Link
              href="/contact-us"
              className="group relative flex items-center justify-center w-full max-w-36 h-12 md:max-w-40 md:h-14 rounded-lg border-[1.5px] border-neutral-400 bg-white font-medium text-neutral-700 text-sm sm:text-base lg:text-lg overflow-hidden transition-all duration-300 hover:border-primary-500 hover:text-primary-600 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="relative z-10">پشتیبانی</span>
              <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg" />
            </Link>
          </div>
        </div>

        {/* 🖼️ Hero image – LCP element; paints immediately, never opacity-locked */}
        <div className="relative w-full max-w-208.5">
          <Image
            src="/images/happy-doctors-group.webp"
            alt="گروهی از پزشکان خوشحال در بیمارستان"
            width={834}
            height={520}
            priority
            // 📐 Let Next ship a right-sized candidate per breakpoint → fewer LCP bytes
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
