// 🏗️ Shared Header + main + Footer shell for the (main), (marketing) & auth groups. Each
//    group keeps its own layout.tsx for config; this holds the JSX they used to duplicate.

import type { ReactNode } from "react";
import HomeHeader from "@/components/layout/home-header";
import Footer from "@/components/layout/footer";
import FooterMobile from "@/components/layout/footer-mobile";

interface StandardLayoutProps {
  children: ReactNode;
}

export default function StandardLayout({ children }: StandardLayoutProps) {
  return (
    // 🧱 Sticky-footer shell: min-h-screen + flex-col pins the footer to the viewport bottom
    //    even while main is empty, so it never flashes up under the header. 🩹
    <div className="flex min-h-screen flex-col">
      {/* 🧷 Header reads NO cookies on the server → every page stays prerenderable
          (ISR/SSG, fast TTFB). Auth (avatar/login) is hydrated client-side and the
          header shows a stable skeleton until it resolves → no login flash, no shift. */}
      <HomeHeader />
      {/* 🚀 flex-1 absorbs all vertical slack → footer can't rise into view early.
          🚫 No page-level fade here: animating the whole <main> from opacity:0 on every
          load made the entire content (filters/sort/cards) blink on refresh. Loading state
          now belongs ONLY to the data that needs it (e.g. the doctor cards skeleton). ✨ */}
      <main className="flex-1">{children}</main>
      <Footer />
      <FooterMobile />
    </div>
  );
}
