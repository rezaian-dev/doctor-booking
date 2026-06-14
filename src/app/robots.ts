import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";

const BASE_URL = SITE_URL; // 🌐 single source of truth (see lib/constants/site)

/**
 * 🤖 robots.txt (App Router metadata route)
 * ✅ Allows public pages, blocks private/non-indexable areas, points crawlers
 *    to the sitemap. Improves crawl budget & Lighthouse SEO. 🔍
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 🚫 Keep auth, admin, API and the multi-step booking flow out of the index
      disallow: ["/admin", "/api", "/auth", "/booking", "/profile", "/inbox"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
