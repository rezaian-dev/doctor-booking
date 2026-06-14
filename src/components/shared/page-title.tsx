import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils/cn';
import AosWrapper from '@/components/shared/aos-wrapper';

interface PageTitleProps {
  title:       string;
  hasPadding:  boolean;
  backHref?:   string;
  // 🪄 AOS entrance on by default. Pass animate={false} for above-the-fold titles that
  //    must stay stable on refresh (no fade) — the /faq zero-flash contract. ✨
  animate?:    boolean;
}

export default function PageTitle({ title, hasPadding, backHref = "/doctors", animate = true }: PageTitleProps) {
  const className = cn(
    "container mt-6 md:mt-8 flex items-center gap-x-2",
    hasPadding && "px-4 md:px-7.5"
  );

  const inner = (
    <>
      <Link href={backHref}>
        <ArrowRightCircle size={24} color="#3D3D3D" />
      </Link>
      <h1 className="text-xl font-bold text-neutral-850">{title}</h1>
    </>
  );

  // 🔒 Static (no AOS) → baked into the first HTML paint, never re-animates on refresh
  if (!animate) return <section className={className}>{inner}</section>;

  // 🎬 Animated entrance (default) for pages where the fade-down is desired
  return <AosWrapper animation="fade-down" as="section" className={className}>{inner}</AosWrapper>;
}
