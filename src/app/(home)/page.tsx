// 🏠 Homepage (Server Component) — fully prerendered + ISR. Reads NO cookies, so
//    `/` is served from cache; auth is hydrated client-side in the header.
import type { Metadata } from "next";
import { fetchPopularDoctors, fetchNewestDoctors } from "@/lib/services/doctors";
import { getPublishedArticles } from "@/lib/services/articles";

import HomeShell from "@/components/features/home/home-shell";
import Hero from "@/components/features/home/hero";
import SearchHero from "@/components/features/home/search-hero";
import InfoCards from "@/components/features/home/info-cards";
import SpecialtyGrid from "@/components/features/home/specialty-grid";
import DoctorSection from "@/components/shared/doctor-section";
import UserTestimonials from "@/components/features/home/user-testimonials";
// 🔧 Static (not next/dynamic): lazy boundaries shift tree position and break Radix useId.
import HealthCTA from "@/components/features/home/health-cta";
import FaqAccordion from "@/components/shared/faq-accordion";
import MedicalArticles from "@/components/features/home/medical-articles";
import { SITE_URL } from "@/lib/constants/site";

// ⚡ Static + ISR — reads no cookies server-side, so / is fully prerendered & cache-served
//    (fast TTFB/FCP/LCP). Auth hydrates client-side behind a stable skeleton. ⏱️ 15-min window
//    keeps the "available today" badge fresh; book/cancel busts it instantly via revalidateTag. 🚀
export const revalidate = 900;

const BASE_URL = SITE_URL; // 🌐 single source of truth (see lib/constants/site)
const DESCRIPTION = "رزرو سریع نوبت پزشک متخصص در سراسر ایران — در کمتر از ۱ دقیقه.";

export const metadata: Metadata = {
  title: "نوبت‌دهی آنلاین پزشک",
  description: DESCRIPTION,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "دکتر رزرو | نوبت‌دهی آنلاین",
    description: DESCRIPTION,
    locale: "fa_IR",
    type: "website",
    url: BASE_URL,
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "دکتر رزرو | نوبت‌دهی آنلاین پزشک" }], // 🖼️ branded share card
  },
};

export default async function Page() {
  // 🛡️ Graceful fallback: if MongoDB is unreachable, the page still renders — data-less sections
  //    show nothing instead of crashing the whole Server Component tree.
  const [popularDoctors, newestDoctors, articles] = await Promise.all([
    fetchPopularDoctors().catch(() => []),
    fetchNewestDoctors().catch(() => []),
    getPublishedArticles().catch(() => []),
  ]);

  return (
    <HomeShell>
      <Hero />
      <InfoCards mode="home" />
      <SearchHero />
      <SpecialtyGrid />
      <DoctorSection title="محبوب‌ترین پزشکان" doctors={popularDoctors} viewAllHref="/doctors?sort=popular" autoplay />
      <UserTestimonials />
      <HealthCTA />
      <DoctorSection title="جدیدترین پزشک‌ها" doctors={newestDoctors} viewAllHref="/doctors" autoplay />
      <FaqAccordion mode="preview" />
      <MedicalArticles articles={articles} />
    </HomeShell>
  );
}
