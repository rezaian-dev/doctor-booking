import FaqAccordionImpl from "@/components/shared/faq-accordion-impl";
import { pageMetadata } from "@/lib/utils/seo";

// 🧱 SSG — fully static (no data, no cookies); prerendered for best SEO
export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "سوالات متداول",
  description: "پاسخ سوالات رایج درباره نحوه رزرو نوبت، لغو نوبت و خدمات دکتر رزرو.",
  robots: "index, follow",
});

export default function FaqPage() {
  return (
    <>
      <div className="container px-4 md:px-8">
        <h2 className="text-neutral-975 font-medium text-xl my-7 sm:text-2xl sm:my-10 md:my-8">
          سوالات متداول
        </h2>
      </div>

      {/* 🔒 Render the radix accordion DIRECTLY (statically prerendered, SSR'd) instead
          of the lazy native→radix wrapper. On /faq the accordion is the above-the-fold
          main content, so the wrapper's IntersectionObserver upgrade fired instantly on
          every refresh and SWAPPED the native list for radix → that hand-off was the
          flash/jump (plus the late faq.png entrance). Importing the impl directly bakes
          the final radix markup into the static HTML, so the client hydrates the SAME
          tree in place — zero swap, zero pop-in, zero reload on refresh. ✨ */}
      <FaqAccordionImpl mode="full" />
    </>
  );
}
