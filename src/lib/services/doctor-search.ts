// 🩺 Filtered + paginated doctor search — single source of truth for the /doctors list.
//    Extracted from /api/doctors so it can be called directly for SSR fallbackData, with the
//    API route as a thin wrapper. 🧠
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import { todayJalali, jalaliStrToLabel } from "@/hooks/use-jalaali";
import { DOCTOR_FILTERS } from "@/lib/constants/filters";
import { getCityLabelMap } from "@/lib/services/cities";

const PAGE_SIZE = 5;

// 🏷️ Static id→label map for constant groups (specialty/insurance/...). City comes from DB.
const STATIC_ID_TO_LABEL = Object.fromEntries(
  DOCTOR_FILTERS.flatMap((f) => f.options.map((o) => [o.id, o.label])),
);

// ⏰ Returns "1403-12-01 09:30" of the nearest open slot — lexicographically sortable
function nextSlotKey(schedule: { date: string; times: string[] }[], today: string, now: string): string {
  for (const { date, times } of [...schedule].sort((a, b) => a.date.localeCompare(b.date))) {
    if (date < today) continue;
    const open = date === today ? times.filter((t) => t > now) : [...times].sort();
    if (open.length) return `${date} ${open[0]}`;
  }
  return "9999"; // no slot → sorts last
}

function nextSlotLabel(schedule: { date: string; times: string[] }[], today: string, now: string) {
  const key = nextSlotKey(schedule, today, now);
  return key === "9999" ? null : jalaliStrToLabel(key.split(" ")[0] ?? "");
}

// 🩺 Typed doctor row returned to the UI
export interface DoctorSearchItem {
  _id: string;
  name: unknown;
  specialty: unknown;
  city: unknown;
  photo: unknown;
  address: unknown;
  medicalCode: unknown;
  hasOnlineVisit: unknown;
  hasInPersonVisit: unknown;
  schedule: { date: string; times: string[] }[];
  isAvailable: boolean;
  nextAvailableSlot: string | null;
  reviewCount: unknown;
  avgRating: unknown;
}

export interface DoctorSearchResult {
  doctors: DoctorSearchItem[];
  totalPages: number;
}

// 🔎 Run the filtered/sorted/paginated search for the given (API-shaped) params
export async function searchDoctors(sp: URLSearchParams): Promise<DoctorSearchResult> {
  await connectDB();

  const page = Math.max(1, Number(sp.get("page")) || 1);
  const sort = sp.get("sort") ?? "default";
  const search = sp.get("search")?.trim();
  const gender = sp.get("gender");
  const minExp = sp.get("experience") ? Number(sp.get("experience")!.replace("+", "")) : null;
  const onlineOnly = sp.get("onlineVisit") === "true";
  const availToday = sp.get("availableToday") === "true";
  const { date: today, time: now } = todayJalali();

  // ── Match ─────────────────────────────────────────────────────────────────
  const must: Record<string, unknown>[] = [];
  // 🔗 Static groups + cached DB city map → unified id→label lookup for this request
  const idToLabel = { ...STATIC_ID_TO_LABEL, ...(await getCityLabelMap()) };
  const toLabel = (ids: string[]) => ids.map((id) => idToLabel[id] ?? id);

  if (search) must.push({ $or: [{ name: { $regex: search, $options: "i" } }, { specialty: { $regex: search, $options: "i" } }] });
  if (sp.getAll("specialty").length) must.push({ $or: sp.getAll("specialty").map((id) => ({ specialty: { $regex: idToLabel[id] ?? id, $options: "i" } })) });
  if (sp.getAll("city").length) must.push({ city: { $in: toLabel(sp.getAll("city")) } });
  if (sp.getAll("insurance").length) must.push({ acceptedInsurances: { $in: sp.getAll("insurance") } });
  if (gender) must.push({ gender });
  if (minExp) must.push({ experience: { $gte: minExp } });
  if (onlineOnly) must.push({ hasOnlineVisit: true });
  if (availToday)
    must.push({
      $or: [
        { schedule: { $elemMatch: { date: { $gt: today }, "times.0": { $exists: true } } } },
        { schedule: { $elemMatch: { date: today, times: { $elemMatch: { $gt: now } } } } },
      ],
    });

  const match = must.length ? { $and: must } : {};

  // ── Aggregation ───────────────────────────────────────────────────────────
  const [result] = await Doctor.aggregate([
    { $match: match },

    // 🛡️ Normalize null arrays
    {
      $addFields: {
        _sch: { $ifNull: ["$schedule", []] },
        _rev: { $ifNull: ["$reviews", []] },
      },
    },

    // ⭐ Approved reviews only
    {
      $addFields: {
        _ok: { $filter: { input: "$_rev", as: "r", cond: { $eq: ["$$r.status", "approved"] } } },
      },
    },

    // 📊 Compute sortable fields
    {
      $addFields: {
        reviewCount: { $size: "$_ok" },
        avgRating: {
          $cond: [{ $gt: [{ $size: "$_ok" }, 0] }, { $round: [{ $divide: [{ $sum: "$_ok.rating" }, { $size: "$_ok" }] }, 1] }, 0],
        },
        // 🗓️ "1403-12-01 09:30" — date+time of nearest open slot, lexicographically sortable
        _nextKey: {
          $reduce: {
            input: {
              $sortArray: {
                input: { $filter: { input: "$_sch", as: "s", cond: { $gte: ["$$s.date", today] } } },
                sortBy: { date: 1 },
              },
            },
            initialValue: "9999",
            in: {
              $cond: [
                // Keep existing value if already found a valid slot
                { $lt: ["$$value", "9999"] },
                "$$value",
                {
                  $let: {
                    vars: {
                      // For today: pick first time > now; for future: pick first time
                      t: {
                        $cond: [
                          { $eq: ["$$this.date", today] },
                          { $arrayElemAt: [{ $filter: { input: { $ifNull: ["$$this.times", []] }, as: "t", cond: { $gt: ["$$t", now] } } }, 0] },
                          { $arrayElemAt: [{ $ifNull: ["$$this.times", []] }, 0] },
                        ],
                      },
                    },
                    in: { $cond: [{ $gt: ["$$t", null] }, { $concat: ["$$this.date", " ", "$$t"] }, "9999"] },
                  },
                },
              ],
            },
          },
        },
      },
    },

    {
      $sort: sort === "popular" ? { avgRating: -1, reviewCount: -1 } : sort === "nearest" ? { _nextKey: 1 } : { createdAt: -1 },
    },

    {
      $facet: {
        data: [{ $skip: (page - 1) * PAGE_SIZE }, { $limit: PAGE_SIZE }],
        total: [{ $count: "n" }],
      },
    },
  ]);

  const raw = result?.data ?? [];
  const total = result?.total?.[0]?.n ?? 0;

  // 🔒 Type alias for schedule entries returned by aggregation
  type RawSlot = { date: string; times: string[] };

  const doctors: DoctorSearchItem[] = raw.map((d: Record<string, unknown>) => {
    // ✅ Cast aggregation output to typed slot array (aggregation guarantees this shape via $addFields)
    const sch = (d._sch ?? []) as RawSlot[];
    return {
      _id: String(d._id),
      name: d.name,
      specialty: d.specialty,
      city: d.city,
      photo: d.photo ?? "",
      address: d.address ?? "",
      medicalCode: d.medicalCode ?? "",
      hasOnlineVisit: d.hasOnlineVisit,
      hasInPersonVisit: d.hasInPersonVisit,
      schedule: sch,
      isAvailable: nextSlotKey(sch, today, now) !== "9999",
      nextAvailableSlot: nextSlotLabel(sch, today, now),
      reviewCount: d.reviewCount,
      avgRating: d.avgRating,
    };
  });

  return { doctors, totalPages: Math.ceil(total / PAGE_SIZE) };
}
