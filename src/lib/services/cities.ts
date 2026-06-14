import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { City } from "@/lib/db/models/city";
import type { FilterConfig } from "@/types/filters";

export interface CityRecord {
  slug: string;
  label: string;
  province: string;
}

/**
 * 🗃️ Single cached DB read — every helper below derives from this.
 * ⚡ unstable_cache + tag 'cities' → revalidate on demand after admin edits.
 * 🔁 revalidate: 3600s ISR window, matching the doctors service pattern.
 */
const loadCities = unstable_cache(
  async (): Promise<CityRecord[]> => {
    await connectDB();
    const docs = await City.find({}, { _id: 0, slug: 1, label: 1, province: 1 })
      .sort({ order: 1, province: 1, label: 1 })
      .lean<CityRecord[]>();
    return docs.map((d) => ({ slug: d.slug, label: d.label, province: d.province }));
  },
  ["cities:all"],
  { revalidate: 3600, tags: ["cities"] }
);

// 🎛️ FilterConfig-shaped group — drop-in replacement for the old static `city` group
export async function getCityFilterGroup(): Promise<FilterConfig> {
  const cities = await loadCities();
  return {
    id: "city",
    title: "شهر",
    label: "شهر مورد نظر را انتخاب کنید",
    options: cities.map((c) => ({ id: c.slug, label: c.label })),
  };
}

// 🏷️ Labels only — for the admin form combobox (value persisted to Doctor.city)
export async function getCityLabels(): Promise<string[]> {
  return (await loadCities()).map((c) => c.label);
}

// 🔁 slug → label map — for /api/doctors query translation (city filter)
export async function getCityLabelMap(): Promise<Record<string, string>> {
  return Object.fromEntries((await loadCities()).map((c) => [c.slug, c.label]));
}
