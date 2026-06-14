// 🏠 Admin dashboard — stats + recent activity. Auth handled by the route layout.
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/get-admin";
import { getDashboardStats } from "@/lib/services/admin-dashboard";
import DashboardStats from "@/components/admin/dashboard/dashboard-stats";
import RecentReviews from "@/components/admin/dashboard/recent-reviews";
import RecentHealthTests from "@/components/admin/dashboard/recent-health-tests";

export const metadata: Metadata = {
  title: "داشبورد | پنل ادمین",
  robots: { index: false, follow: false },
};

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 👤 Cached read (layout already guarded) — used only for the greeting
  const admin = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">داشبورد ادمین</h1>
        <p className="mt-1 text-sm text-neutral-500">
          خوش آمدید، {admin.firstName} {admin.lastName}
        </p>
      </div>

      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentReviews reviews={stats.recentReviews} />
        <RecentHealthTests
          tests={stats.recentHealthTests}
          pendingCount={stats.pendingHealthTests}
        />
      </div>
    </div>
  );
}
