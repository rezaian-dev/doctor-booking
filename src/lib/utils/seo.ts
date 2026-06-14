import type { Metadata } from "next";

// 🌐 Shared OpenGraph locale for every (main) page
const OG_LOCALE = "fa_IR";

// 🖼️ Default branded share card (1200×630) used whenever a page provides no image.
//    Lives in /public so the absolute URL is resolved via `metadataBase`. ✨
export const OG_IMAGE = {
  url: "/og-cover.png",
  width: 1200,
  height: 630,
  alt: "دکتر رزرو | نوبت‌دهی آنلاین پزشک متخصص در سراسر ایران",
} as const;

type OgImage = { url: string; alt?: string };

export interface PageSeo {
  title: string; // 🏷️ Full <title> — kept verbatim, no auto-suffix
  description?: string; // 📝 Meta + OG description
  canonical?: string; // 🔗 alternates.canonical
  keywords?: Metadata["keywords"]; // 🔑 Optional keywords
  robots?: Metadata["robots"]; // 🤖 "index, follow" | { index: false }
  ogType?: "website" | "article" | "profile"; // 📦 OpenGraph type
  images?: OgImage[]; // 🖼️ OG images (falls back to the branded default)
}

// 🧩 Build a consistent Metadata object — kills the repeated openGraph boilerplate
export function pageMetadata({
  title,
  description,
  canonical,
  keywords,
  robots,
  ogType = "website",
  images,
}: PageSeo): Metadata {
  // 🖼️ Per-page images win; otherwise fall back to the branded default card
  const ogImages = images ?? [OG_IMAGE];
  return {
    title: { absolute: title },
    ...(description ? { description } : {}),
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: { absolute: title },
      ...(description ? { description } : {}),
      locale: OG_LOCALE,
      type: ogType,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: title },
      ...(description ? { description } : {}),
      images: ogImages,
    },
  };
}
