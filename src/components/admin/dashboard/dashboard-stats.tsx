// 📊 Server Component — stat cards using <Card> + shadcn primitives; no raw divs.
import { Users, Stethoscope, FileText, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatFaNumber } from "@/lib/utils/persian-format";
import type { LucideIcon } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalArticles: number;
  pendingReviews: number;
  approvedReviews: number;
  pendingHealthTests?: number;
}

// 🎨 Card color tokens — one source of truth
const CARDS: {
  key: keyof Stats;
  label: string;
  icon: LucideIcon;
  iconCls: string;
  borderCls: string;
}[] = [
  { key: "totalUsers",      label: "کل کاربران",        icon: Users,        iconCls: "bg-primary-50 text-primary-600",   borderCls: "border-primary-100" },
  { key: "totalDoctors",    label: "دکترها",             icon: Stethoscope,  iconCls: "bg-secondary-50 text-secondary-600", borderCls: "border-secondary-100" },
  { key: "totalArticles",   label: "مقالات",             icon: FileText,     iconCls: "bg-neutral-100 text-neutral-600",  borderCls: "border-neutral-200" },
  { key: "pendingReviews",  label: "نظرات در انتظار",    icon: Clock,        iconCls: "bg-amber-50 text-amber-600",       borderCls: "border-amber-100" },
  { key: "approvedReviews", label: "نظرات تأیید شده",   icon: CheckCircle,  iconCls: "bg-secondary-50 text-secondary-700", borderCls: "border-secondary-100" },
];

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {CARDS.map(({ key, label, icon: Icon, iconCls, borderCls }) => (
        <Card key={key} className={`gap-3 p-5 ${borderCls}`}>
          <CardContent className="p-0">
            {/* 🎨 Icon badge — size-10 canonical shorthand */}
            <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${iconCls}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {formatFaNumber(stats[key] ?? 0)}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
