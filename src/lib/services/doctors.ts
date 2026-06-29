import { unstable_cache } from "next/cache";
import { isValidObjectId, type PipelineStage } from "mongoose";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import { User } from "@/lib/db/models/user";
import { todayJalali, jalaliStrToLabel } from "@/hooks/use-jalaali";

// ─── Types ────────────────────────────────────────────────────────────────────
type Schedule = { date: string; times: string[] };
type Contact = { phone?: string; website?: string; instagram?: string };
type RawDoc = Record<string, unknown>;
export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  _id: string; userId: string; userName: string; userAvatar: string;
  rating: number; comment: string; status: ReviewStatus; createdAt: string;
};

// ─── Jalali Helpers ───────────────────────────────────────────────────────────
// 🗓️ Persian readable label (weekday + day + month) — hydration-safe formatter from use-jalaali. 🔁

// 🟢 Any upcoming slot still open relative to now?
function hasOpenSlot(schedule: Schedule[], today: string, now: string): boolean {
  return schedule.some(({ date, times }) =>
    date > today ? times.length > 0 : date === today && times.some(t => t > now)
  );
}

// 🗓️ Persian label of the earliest day with a free slot (null when fully booked)
function getNextAvailableSlot(schedule: Schedule[], today: string, nowTime: string): string | null {
  for (const { date, times } of [...schedule].sort((a, b) => a.date.localeCompare(b.date))) {
    if (date < today) continue;
    const available = date === today ? times.filter(t => t > nowTime) : times;
    if (available.length > 0) return jalaliStrToLabel(date);
  }
  return null;
}

// ─── Serializers ──────────────────────────────────────────────────────────────
const toReviewStatus = (val: unknown): ReviewStatus =>
  val === "approved" || val === "rejected" ? val : "pending";

const serializeSchedule = (raw: unknown[] = []): Schedule[] =>
  (raw as Array<{ date?: unknown; times?: unknown[] }>).map(s => ({
    date:  String(s.date ?? ""),
    times: (s.times ?? []).map(String),
  }));

// exactOptionalPropertyTypes: spread only defined keys so optionals stay absent
const serializeContact = (raw: Record<string, unknown> | null | undefined): Contact | undefined => {
  if (!raw) return undefined;
  return {
    ...(raw.phone     ? { phone:     String(raw.phone) }     : {}),
    ...(raw.website   ? { website:   String(raw.website) }   : {}),
    ...(raw.instagram ? { instagram: String(raw.instagram) } : {}),
  };
};

// ─── Avatar / Review builders ─────────────────────────────────────────────────

/**
 * 🖼️ Live avatars for a set of reviews, keyed by userId.
 * Priority on read: live User avatar → avatar stored on the review → "".
 */
async function fetchAvatarMap(rawReviews: RawDoc[]): Promise<Map<string, string>> {
  const userIds = [...new Set(rawReviews.map(r => String(r.userId ?? "")).filter(Boolean))];
  if (!userIds.length) return new Map();

  const users = await User.find({ _id: { $in: userIds } })
    .select("_id avatar")
    .lean<{ _id: unknown; avatar?: string }[]>();

  return new Map(users.map(u => [String(u._id), u.avatar || ""]));
}

const buildReviews = (raw: RawDoc[] = [], avatarMap: Map<string, string>): Review[] =>
  raw.map(r => {
    const userId       = String(r.userId ?? "");
    const liveAvatar   = avatarMap.get(userId);
    const storedAvatar = String(r.userAvatar ?? "");
    return {
      _id:        String(r._id ?? ""),
      userId,
      userName:   String(r.userName ?? "کاربر ناشناس"),
      userAvatar: liveAvatar !== undefined ? (liveAvatar || storedAvatar) : storedAvatar,
      rating:     Number(r.rating ?? 0),
      comment:    String(r.comment ?? ""),
      status:     toReviewStatus(r.status),
      createdAt:  r.createdAt ? new Date(r.createdAt as string | number | Date).toISOString() : "",
    };
  });

// ✅ Single approved filter drives count, avg & recommend %
function calcReviewStats(reviews: Review[]): { reviewCount: number; avgRating: number; recommendPct: number } {
  const approved = reviews.filter(r => r.status === "approved");
  const count    = approved.length;
  return {
    reviewCount:  count,
    avgRating:    count ? Math.round(approved.reduce((s, r) => s + r.rating, 0) / count * 10) / 10 : 0,
    recommendPct: count ? Math.round(approved.filter(r => r.rating >= 4).length / count * 100) : 0,
  };
}

// ─── Card mapper (single source of truth for list views) ──────────────────────
// 🧮 Receives a doc whose review stats were computed in the DB ($set), so the heavy reviews
//    array never crosses the wire and no per-reviewer avatar query is needed for cards. 🪶
function toDoctorCard(d: RawDoc, today: string, now: string) {
  const schedule = serializeSchedule(d.schedule as unknown[]);
  return {
    _id:               String(d._id),
    name:              String(d.name ?? ""),
    specialty:         String(d.specialty ?? ""),
    city:              String(d.city ?? ""),
    photo:             String(d.photo ?? ""),
    address:           String(d.address ?? ""),
    medicalCode:       String(d.medicalCode ?? ""),
    hasOnlineVisit:    Boolean(d.hasOnlineVisit),
    hasInPersonVisit:  Boolean(d.hasInPersonVisit),
    isAvailable:       hasOpenSlot(schedule, today, now),
    schedule,
    nextAvailableSlot: getNextAvailableSlot(schedule, today, now) ?? undefined,
    reviewCount:       Number(d.reviewCount ?? 0),
    avgRating:         Number(d.avgRating ?? 0),
    recommendPct:      Number(d.recommendPct ?? 0),
  };
}
export type DoctorCard = ReturnType<typeof toDoctorCard>;

// 🔁 Fetch + map doctor cards via ONE aggregation — every list view derives from this (DRY).
//    Stats, sort, and limit all run in Mongo; only the ≤N projected cards reach Node. ⚡
//    This is the big win on a 4000-doc collection: no full-collection scan into memory and no
//    reviews/avatars transfer — just the handful of fields a card actually renders. 🚀
async function loadDoctorCards(
  opts: { sort?: Record<string, 1 | -1>; limit?: number } = {},
): Promise<DoctorCard[]> {
  await connectDB();
  const { date: today, time: now } = todayJalali();

  const pipeline: PipelineStage[] = [
    // ⭐ Approved-review stats in-DB — the reviews array is consumed here and dropped by $project.
    { $set: { _ok: { $filter: { input: { $ifNull: ["$reviews", []] }, as: "r", cond: { $eq: ["$$r.status", "approved"] } } } } },
    { $set: {
        reviewCount: { $size: "$_ok" },
        avgRating: { $cond: [{ $gt: [{ $size: "$_ok" }, 0] }, { $round: [{ $avg: "$_ok.rating" }, 1] }, 0] },
        recommendPct: { $cond: [
          { $gt: [{ $size: "$_ok" }, 0] },
          { $round: [{ $multiply: [{ $divide: [
            { $size: { $filter: { input: "$_ok", as: "r", cond: { $gte: ["$$r.rating", 4] } } } },
            { $size: "$_ok" },
          ] }, 100] }, 0] },
          0,
        ] },
    } },
  ];
  if (opts.sort)  pipeline.push({ $sort: opts.sort });
  if (opts.limit) pipeline.push({ $limit: opts.limit });
  // 🎯 Ship only what a card renders (drops reviews, contact, about, insurances, experience…)
  pipeline.push({ $project: {
    name: 1, specialty: 1, city: 1, photo: 1, address: 1, medicalCode: 1,
    hasOnlineVisit: 1, hasInPersonVisit: 1, schedule: 1,
    avgRating: 1, reviewCount: 1, recommendPct: 1,
  } });

  const docs = await Doctor.aggregate<RawDoc>(pipeline);
  return docs.map(d => toDoctorCard(d, today, now));
}

// ─── Public list queries ──────────────────────────────────────────────────────

// ⭐ Top doctors by avgRating (approved only), ties broken by reviewCount — sorted & limited in Mongo
export const fetchPopularDoctors = unstable_cache(
  (limit = 8): Promise<DoctorCard[]> =>
    loadDoctorCards({ sort: { avgRating: -1, reviewCount: -1 }, limit }),
  ["doctors-popular"],
  // ⏱️ 15-min safety net: `isAvailable`/`nextAvailableSlot` are clock-relative, so a long
  //    cache would show stale "available today" badges. Bookings still bust INSTANTLY via tag. 🧠
  { revalidate: 900, tags: ["doctors"] },
);

// 🆕 Newest doctors — DB-level sort by createdAt (uses the _id index)
export const fetchNewestDoctors = unstable_cache(
  (limit = 8): Promise<DoctorCard[]> => loadDoctorCards({ sort: { createdAt: -1 }, limit }),
  ["doctors-newest"],
  { revalidate: 900, tags: ["doctors"] }, // ⏱️ 15-min drift bound + 🏷️ busted on book/cancel
);

// ─── fetchDoctorById ──────────────────────────────────────────────────────────
export async function fetchDoctorById(id: string) {
  await connectDB();

  const d = await Doctor.findById(id)
    .select("name specialty city photo address medicalCode about hasOnlineVisit hasInPersonVisit schedule reviews contact acceptedInsurances experience gender visitFee")
    .lean<RawDoc | null>();

  if (!d) return null;

  const avatarMap = await fetchAvatarMap((d.reviews as RawDoc[]) ?? []);
  const reviews   = buildReviews((d.reviews as RawDoc[]) ?? [], avatarMap);
  const schedule  = serializeSchedule(d.schedule as unknown[]);
  const { date: today, time: nowTime } = todayJalali();

  return {
    _id:                String(d._id),
    name:               String(d.name ?? ""),
    specialty:          String(d.specialty ?? ""),
    city:               String(d.city ?? ""),
    photo:              String(d.photo ?? ""),
    address:            String(d.address ?? ""),
    medicalCode:        String(d.medicalCode ?? ""),
    about:              String(d.about ?? ""),
    hasOnlineVisit:     Boolean(d.hasOnlineVisit),
    hasInPersonVisit:   Boolean(d.hasInPersonVisit),
    experience:         Number(d.experience ?? 0),
    gender:             String(d.gender ?? ""),
    visitFee:           Number(d.visitFee ?? 0),
    acceptedInsurances: ((d.acceptedInsurances as unknown[]) ?? []).map(String),
    contact:            serializeContact(d.contact as Record<string, unknown> | null | undefined),
    schedule,
    reviews,
    nextAvailableSlot:  getNextAvailableSlot(schedule, today, nowTime),
    isAvailable:        hasOpenSlot(schedule, today, nowTime),
    ...calcReviewStats(reviews),
  };
}

export type DoctorDetail = NonNullable<Awaited<ReturnType<typeof fetchDoctorById>>>;

// ─── fetchSpecialtyCounts ─────────────────────────────────────────────────────
// 🩺 Real doctor count per specialty (exact NFC match), one aggregation; keyed by the original titles.
async function fetchSpecialtyCountsInternal(
  titles: readonly string[],
): Promise<Record<string, number>> {
  await connectDB();

  const rows = await Doctor.aggregate<{ _id: string; count: number }>([
    { $match: { specialty: { $in: titles.map(t => t.normalize("NFC")) } } },
    { $group: { _id: "$specialty", count: { $sum: 1 } } },
  ]);

  const byNorm = new Map(rows.map(r => [String(r._id).normalize("NFC"), r.count]));
  const result: Record<string, number> = {};
  for (const t of titles) result[t] = byNorm.get(t.normalize("NFC")) ?? 0;
  return result;
}

// ⚡ Hourly safety net + 🏷️ tag "doctors" → counts refresh the moment a doctor is added/removed
export const fetchSpecialtyCounts = unstable_cache(
  fetchSpecialtyCountsInternal,
  ["specialty-counts"],
  { revalidate: 3600, tags: ["doctors"] },
);

// ─── Lean fetch for the review form ───────────────────────────────────────────
// 🪶 The review form's header only renders name/specialty/photo. Fetching the whole
//    doctor (every review + an avatar map) just to show three fields wastes DB time
//    and the user's bandwidth — these targeted reads keep the comment page light. ⚡
export async function fetchDoctorHeader(
  id: string,
): Promise<{ name: string; specialty: string; photo: string } | null> {
  if (!isValidObjectId(id)) return null; // 🛡️ bad id → 404, not a CastError
  await connectDB();
  const d = await Doctor.findById(id).select("name specialty photo").lean<RawDoc | null>();
  return d ? { name: String(d.name ?? ""), specialty: String(d.specialty ?? ""), photo: String(d.photo ?? "") } : null;
}

// 🔒 Already reviewed? Existence check only — never transfers the reviews array.
export async function hasUserReviewed(doctorId: string, userId: string): Promise<boolean> {
  if (!isValidObjectId(doctorId)) return false;
  await connectDB();
  return Boolean(await Doctor.exists({ _id: doctorId, "reviews.userId": String(userId) }));
}
