// 🫀 Admin heart-health results query (paginated) — extracted from admin/health-tests/page.tsx
//    Reuses the shared TestResultItem shape (single source of truth). 🔁
import { connectDB } from "@/lib/db/connection";
import { HealthTestResult } from "@/lib/db/models/health-test-result";
import type { TestResultItem } from "@/lib/actions/health-test";

const PAGE_SIZE = 10;

export async function getAdminHealthTests(page: number) {
  await connectDB();

  const [raw, total] = await Promise.all([
    HealthTestResult.find()
      .sort({ repliedAt: 1, createdAt: -1 }) // ⏳ Unanswered first
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    HealthTestResult.countDocuments(),
  ]);

  return {
    results: raw.map((r) => ({
      _id:        String(r._id),
      userId:     String(r.userId),
      userName:   r.userName as string,
      userPhone:  (r.userPhone as string) ?? "",
      userEmail:  (r.userEmail as string) ?? "",
      userAvatar: (r.userAvatar as string) ?? "", // 🖼️ Profile image
      answers:    r.answers as Record<number, string>,
      createdAt:  String(r.createdAt),
      repliedAt:  r.repliedAt ? String(r.repliedAt) : null,
    })) as TestResultItem[],
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
