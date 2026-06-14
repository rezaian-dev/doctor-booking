// No next/* imports — not-found renders outside normal router context.
import type { FC } from 'react';

const NotFoundPage: FC = () => {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-white"
      role="alert"
      aria-labelledby="not-found-title"
    >
      <div className="container px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:justify-start justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">
          <section className="shrink-0 w-full sm:w-auto" aria-label="404 error illustration">
            <div className="relative w-full max-w-70 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* loading="lazy" suppresses the <link rel="preload"> Next.js emits for
                  not-found boundary images — they're never used on normal page loads. */}
              <img
                src="/images/404.png"
                alt="صفحه مورد نظر یافت نشد - خطای 404"
                width={788}
                height={738}
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
          </section>

          <section className="flex flex-col items-center md:items-start text-center md:text-right w-full max-w-md lg:max-w-lg space-y-4 sm:space-y-5 lg:space-y-6">
            <h1
              id="not-found-title"
              className="text-xl sm:text-2xl font-medium text-gray-900 leading-tight"
            >
              صفحه مورد نظر در دسترس نیست!
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-medium leading-relaxed">
              ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه حذف شده باشد.
            </p>

            <div className="pt-2 sm:pt-3 lg:pt-4">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="inline-flex items-center justify-center h-10 px-6 bg-white border-2 border-primary-500 text-primary-500 rounded-lg font-semibold text-sm hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
                aria-label="بازگشت به صفحه اصلی"
              >
                بازگشت به صفحه اصلی
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
