import Intro from "@/components/features/about-us/intro";
import InfoCards from "@/components/features/home/info-cards";
import ContactSection from "@/components/features/about-us/contact-section";
import AppPreview from "@/components/features/about-us/app-preview";
import FeatureCards from "@/components/features/about-us/feature-cards";
import { pageMetadata } from "@/lib/utils/seo";

// 🧱 SSG — fully static (no data, no cookies); prerendered for best SEO
export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "درباره ما",
  description:
    "با تیم دکتر رزرو آشنا شوید. ما با هدف تسهیل دسترسی به خدمات درمانی فعالیت می‌کنیم.",
  robots: "index, follow",
});

export default function AboutPage() {
  return (
    <>
      <Intro />
      <InfoCards mode="about" />
      <ContactSection />
      <AppPreview />
      <FeatureCards />
    </>
  );
}
