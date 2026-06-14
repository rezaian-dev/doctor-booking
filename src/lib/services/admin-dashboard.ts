// 📊 Dashboard stats query — extracted from (dashboard)/admin/page.tsx
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";
import { Doctor } from "@/lib/db/models/doctor";
import { Article } from "@/lib/db/models/article";
import { HealthTestResult } from "@/lib/db/models/health-test-result";

export type HealthTestEntry = {
  _id: string;
  userName: string;
  userPhone: string;
  repliedAt: Date | null;
  createdAtLabel: string; // 🕒 Pre-formatted on the server (hydration-safe)
};

export type ReviewEntry = {
  doctorId: string;
  doctorName: string;
  userName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: Date;
};

// 🕒 Persian relative time from a SINGLE server snapshot — deterministic, so the
//    string is identical server↔client and never triggers a hydration mismatch. 🔒
function relativeTimeFa(date: Date, nowMs: number): string {
  const mins = Math.floor((nowMs - new Date(date).getTime()) / 60000);
  if (mins < 1)   return "همین الان";
  if (mins < 60)  return `${mins} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${Math.floor(hours / 24)} روز پیش`;
}

export async function getDashboardStats() {
  await connectDB();

  const [totalUsers, totalDoctors, totalArticles] = await Promise.all([
    User.countDocuments(),
    Doctor.countDocuments(),
    Article.countDocuments(),
  ]);

  const allDoctors = await Doctor.find({})
    .select("name reviews")
    .lean<{
      _id: unknown;
      name: string;
      reviews: {
        _id: unknown;
        userName: string;
        rating: number;
        comment: string;
        status: string;
        createdAt: Date;
      }[];
    }[]>();

  let pendingReviews = 0;
  let approvedReviews = 0;
  const recentReviews: ReviewEntry[] = [];

  for (const doc of allDoctors) {
    for (const review of doc.reviews ?? []) {
      if (review.status === "pending") pendingReviews++;
      if (review.status === "approved") approvedReviews++;
      recentReviews.push({
        doctorId:   String(doc._id),
        doctorName: doc.name,
        userName:   review.userName,
        rating:     review.rating,
        comment:    review.comment,
        status:     review.status,
        createdAt:  review.createdAt,
      });
    }
  }

  recentReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const rawTests = await HealthTestResult.find({})
    .select("userName userPhone repliedAt createdAt")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean<{ _id: unknown; userName: string; userPhone: string; repliedAt: Date | null; createdAt: Date }[]>();

  // 🕒 One snapshot for every label → all rows share the same "now"
  const nowMs = Date.now();
  const recentHealthTests: HealthTestEntry[] = rawTests.map((t) => ({
    _id:            String(t._id),
    userName:       t.userName,
    userPhone:      t.userPhone,
    repliedAt:      t.repliedAt,
    createdAtLabel: relativeTimeFa(t.createdAt, nowMs),
  }));

  const pendingHealthTests = await HealthTestResult.countDocuments({ repliedAt: null });

  return {
    totalUsers,
    totalDoctors,
    totalArticles,
    pendingReviews,
    approvedReviews,
    pendingHealthTests,
    recentReviews:    recentReviews.slice(0, 5),
    recentHealthTests,
  };
}
