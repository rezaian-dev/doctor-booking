"use client";
// 📭 Empty state UI + onboarding steps — extracted from (dashboard)/appointments/page.tsx
import Link from "next/link";
import { CalendarX2, Clock, Search, CalendarCheck, CheckCircle2, Stethoscope } from "lucide-react";

const STEPS = [
  { Icon: Search,        iconColor: "text-primary-500",   bg: "bg-primary-50",   text: "پزشک یا تخصص موردنظرت رو پیدا کن" },
  { Icon: CalendarCheck, iconColor: "text-secondary-600", bg: "bg-secondary-50", text: "زمان مناسب رو از بین نوبت‌های خالی انتخاب کن" },
  { Icon: CheckCircle2,  iconColor: "text-alert",         bg: "bg-amber-50",     text: "نوبتت رو تأیید کن و کد پیگیری بگیر" },
] as const;

export default function AppointmentsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-10">
        <div className="absolute -inset-4 rounded-full bg-primary-100 animate-pulse opacity-60" />
        <div className="absolute -inset-2 rounded-full bg-primary-50" />
        <div className="relative w-32 h-32 rounded-full bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-xl shadow-primary-100">
          <CalendarX2 className="w-14 h-14 text-primary-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-neutral-100">
          <Clock className="w-5 h-5 text-neutral-400" />
        </div>
      </div>

      <h2 className="text-neutral-900 text-xl font-bold mb-3">هنوز نوبتی ندارید</h2>
      <p className="text-neutral-500 text-sm text-center max-w-65 leading-7 mb-10">
        همین الان نوبت بگیرید و بدون معطلی پیش پزشک برید
      </p>

      <div className="w-full max-w-sm space-y-3 mb-10">
        {STEPS.map(({ Icon, iconColor, bg, text }, i) => (
          <div key={i} className="flex items-center gap-4 bg-white border border-neutral-100 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3 shrink-0">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-500 text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
            </div>
            <p className="text-neutral-700 text-sm leading-6">{text}</p>
          </div>
        ))}
      </div>

      <Link
        href="/doctors"
        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-sm font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-primary-200 transition-all duration-200"
      >
        <Stethoscope className="w-5 h-5" />
        رزرو نوبت آنلاین
      </Link>
    </div>
  );
}
