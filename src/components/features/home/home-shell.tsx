// 🏠 Thin layout shell for the homepage. The root page.tsx sits outside all route-group
//    layouts, so it supplies its own Header/Footer here → page.tsx stays lightweight.
import type { ReactNode } from "react";
import HomeHeader from "@/components/layout/home-header";
import Footer from "@/components/layout/footer";
import FooterMobile from "@/components/layout/footer-mobile";

export default function HomeShell({ children }: { children: ReactNode }) {
  return (
    // 🧱 Sticky-footer shell (see StandardLayout) — footer stays at the viewport
    //    bottom while homepage sections hydrate, never flashing up early. 🩹
    <div className="flex min-h-screen flex-col">
      {/* 🧷 Header reads NO cookies on the server → `/` stays prerenderable/ISR.
          Auth is hydrated client-side; a stable skeleton shows until it resolves. */}
      <HomeHeader />
      {/* 🚀 Semantic <main> + flex-1: gives the homepage a proper landmark and
          absorbs vertical slack so the footer can't rise into view early. */}
      <main className="flex-1">{children}</main>
      <Footer />
      <FooterMobile />
    </div>
  );
}
