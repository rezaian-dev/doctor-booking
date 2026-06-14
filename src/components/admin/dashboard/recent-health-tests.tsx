// 🏥 Server Component — latest health-test submissions. 🔒 Hydration-safe: relative time
//    is pre-formatted in the data layer, so this renders only static strings. ✅
import { ArrowLeft, ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// 🔗 Reuse the data-layer type (single source of truth) — type-only, zero runtime coupling. 🧠
import type { HealthTestEntry } from "@/lib/services/admin-dashboard";

interface Props {
  tests:        HealthTestEntry[];
  pendingCount: number;
}

export default function RecentHealthTests({ tests, pendingCount }: Props) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      {/* 🏷️ Header */}
      <CardHeader className="flex flex-row items-center justify-between px-5 py-4 [.border-b]:pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-bold text-neutral-900">آخرین تست‌های سلامت</CardTitle>
          {pendingCount > 0 && (
            <Badge variant="danger" className="gap-1">
              <Clock className="size-3" />
              {pendingCount} منتظر پاسخ
            </Badge>
          )}
        </div>
        <ButtonLink href="/admin/health-tests" variant="link" size="sm" className="h-auto gap-1 p-0 text-sm">
          مشاهده همه
          <ArrowLeft size={14} />
        </ButtonLink>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {tests.length === 0 ? (
          // 📭 Empty state
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-neutral-400">
            <ClipboardList className="size-8 opacity-40" />
            <p className="text-sm">تستی ثبت نشده</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {tests.map((test) => (
              <div key={test._id} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50">
                <div className="flex min-w-0 items-center gap-3">
                  {/* 🔴/🟢 Status dot — size-2 canonical */}
                  <span className={`size-2 shrink-0 rounded-full ${test.repliedAt ? "bg-secondary-400" : "bg-red-500"}`} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-800">{test.userName}</p>
                    <p className="font-mono text-xs text-neutral-400">{test.userPhone}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {test.repliedAt ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="size-3" />
                      پاسخ داده شد
                    </Badge>
                  ) : (
                    <Badge variant="warning">در انتظار پاسخ</Badge>
                  )}
                  <span className="whitespace-nowrap text-xs text-neutral-400">{test.createdAtLabel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
