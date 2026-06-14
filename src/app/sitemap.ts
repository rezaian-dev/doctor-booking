import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import { Article } from "@/lib/db/models/article";
import { SITE_URL } from "@/lib/constants/site";

const BASE_URL = SITE_URL; // 🌐 single source of truth (see lib/constants/site)

export const revalidate = 3600; // 🕐 rebuild hourly (ISR)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date(); // 🕒 one timestamp for all "now" entries

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                    lastModified: now, changeFrequency: "daily",   priority: 1 },
    { url: `${BASE_URL}/doctors`,       lastModified: now, changeFrequency: "hourly",  priority: 0.95 },
    { url: `${BASE_URL}/articles`,      lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/about-us`,      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact-us`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`,           lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // 🗂️ Dynamic URLs — doctors + published articles, fetched in parallel.
  //    Guarded: a DB hiccup degrades to static pages instead of failing the sitemap. 🛟
  try {
    await connectDB();
    const [doctors, articles] = await Promise.all([
      Doctor.find({}).select("_id updatedAt").lean<{ _id: unknown; updatedAt?: Date }[]>(),
      Article.find({ status: "published" }).select("slug updatedAt").lean<{ slug: string; updatedAt?: Date }[]>(),
    ]);

    const doctorUrls: MetadataRoute.Sitemap = doctors.map((d) => ({
      url: `${BASE_URL}/doctors/${String(d._id)}`,
      lastModified: d.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 🔤 encodeURIComponent — Persian slugs must be percent-encoded for valid sitemap URLs
    const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${BASE_URL}/articles/${encodeURIComponent(a.slug)}`,
      lastModified: a.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...doctorUrls, ...articleUrls];
  } catch {
    return staticPages; // 🛟 DB error → still serve the static URLs
  }
}
