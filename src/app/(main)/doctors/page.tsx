import type { Metadata } from "next";
import DoctorSearchGrid from "@/components/features/doctors/doctor-search-grid";
import { pageMetadata } from "@/lib/utils/seo";
import { getCityFilterGroup } from "@/lib/services/cities";

// 🔎 Dynamic SEO derived from searchParams (specialty / city / search)
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const specialty = pick(sp.specialty);
  const city = pick(sp.city);
  const search = pick(sp.search);

  let title = "پزشکان متخصص";
  let description =
    "لیست کامل پزشکان متخصص در سراسر ایران. فیلتر بر اساس تخصص، شهر، بیمه و زمان نوبت. رزرو آنلاین سریع و آسان.";
  let canonical = "/doctors";

  if (specialty) {
    title = `دکتر ${specialty} | نوبت‌دهی آنلاین`;
    description = `رزرو نوبت آنلاین پزشک متخصص ${specialty} در سراسر ایران. مشاهده لیست دکترها و دریافت نوبت.`;
    canonical += `?specialty=${specialty}`;
  } else if (city) {
    title = `پزشک در ${city} | نوبت‌دهی آنلاین`;
    description = `رزرو نوبت پزشک متخصص در ${city}. لیست پزشکان و دریافت نوبت آنلاین.`;
    canonical += `?city=${city}`;
  } else if (search) {
    title = `نتایج جستجو: ${search}`;
    description = `نتایج جستجوی پزشک برای "${search}". رزرو نوبت آنلاین پزشک متخصص.`;
  }

  return pageMetadata({
    title,
    description,
    canonical,
    keywords: ["پزشک متخصص", "نوبت پزشک", "رزرو آنلاین", specialty ?? "دکتر", city ?? "ایران"],
    robots: "index, follow",
  });
}

// ✅ Server Component — SEO via generateMetadata. The shell (filters + sort) is gated only
//    by the cached city list (ISR), reads no cookies → rock-stable on refresh. Auth resolves
//    client-side in <DoctorList> via the shared /api/auth/me cache (like the header). 🧠✨
export default async function DoctorsPage() {
  // ⚡ Single fast read: cityGroup = unstable_cache (ISR). 🛡️ Graceful empty fallback.
  const cityGroup = await getCityFilterGroup().catch(() => ({
    id: "city" as const,
    title: "شهر",
    label: "شهر مورد نظر را انتخاب کنید",
    options: [],
  }));

  return <DoctorSearchGrid cityGroup={cityGroup} />;
}
