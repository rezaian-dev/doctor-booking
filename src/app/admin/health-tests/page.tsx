// 🫀 Heart health test results. Auth handled by the route layout; data via the service.
import type { Metadata } from "next";
import { formatFaNumber } from "@/lib/utils/persian-format";
import { getAdminHealthTests } from "@/lib/services/admin-health-tests";
import HealthTestTable from "@/components/admin/health-tests/health-test-table";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "تست‌های سلامت | پنل ادمین",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HealthTestsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { results, total, totalPages } = await getAdminHealthTests(page);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">تست‌های سلامت قلب</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{formatFaNumber(total)} نتیجه ثبت شده</p>
      </div>

      <HealthTestTable results={results} />

      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </div>
  );
}
