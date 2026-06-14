// 🪶 Lazy FAQ: SSR a native <details> accordion (full Q&A → SEO + a11y, zero JS),
//    then upgrade to the radix Accordion near the viewport so its chunk ships late. 🚀
'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { faqs, type FaqAccordionProps } from './faq-accordion-impl';

// 🧱 Native <details> FAQ — SSR'd, JS-free, crawlable. Doubles as the chunk-load
//    placeholder so the section never blanks during the radix upgrade. 🧠
function NativeFaqList({ faqs }: { faqs: readonly { question: string; answer: string }[] }) {
  return (
    <div className="w-full mt-4.5 p-6 border-[1.5px] rounded-2xl border-neutral-100">
      {faqs.map((faq, index) => (
        <details key={`faq-${index}`} className="group border-b border-neutral-100 last:border-b-0">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-medium text-sm sm:text-base text-black sm:px-5 list-none [&::-webkit-details-marker]:hidden">
            {faq.question}
            <ChevronDown
              size={18}
              className="shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="flex flex-col gap-4 pb-5 sm:px-5">
            <p className="text-sm leading-7 text-neutral-975">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

// 🔌 Radix impl as a client-only chunk — preloaded on intersection, swapped only once
//    resolved so the native list stays until ready (no blank gap). 🚀
const FaqAccordionImpl = dynamic(() => import('./faq-accordion-impl'), { ssr: false });

const FaqAccordion = ({ mode, className }: FaqAccordionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [upgraded, setUpgraded] = useState(false);
  const displayedFaqs = mode === 'preview' ? faqs.slice(0, 7) : faqs;

  // 👀 Near viewport → preload the radix chunk, swap once resolved (native list stays
  //    until then → no blank gap or late animation). 🧠
  useEffect(() => {
    if (upgraded) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          import('./faq-accordion-impl')
            .then(() => setUpgraded(true))
            .catch(() => {}); // 🛟 stay on the native list if the chunk fails
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [upgraded]);

  // 🎛️ Near viewport (chunk preloaded) → hand off to the radix Accordion, which
  //    renders its OWN section + header. No AOS entrance now → seamless swap. 🧠
  if (upgraded) {
    return <FaqAccordionImpl mode={mode} {...(className !== undefined ? { className } : {})} />;
  }

  // 🧱 First-paint fallback — native <details>, identical content & styling.
  //    No radix, no hydration, no CLS; fully crawlable & keyboard-accessible.
  return (
    <section
      ref={sectionRef}
      className={cn(
        'container relative z-0 px-4 md:px-8',
        { 'mt-7.5 md:mt-23.5': mode === 'preview', 'mb-12 md:mb-20': mode === 'full' },
        className
      )}
    >
      {mode === 'preview' && (
        <SectionHeader title="سوالات متداول" viewAllHref="/faq" className="" />
      )}

      <NativeFaqList faqs={displayedFaqs} />
    </section>
  );
};

export default FaqAccordion;
