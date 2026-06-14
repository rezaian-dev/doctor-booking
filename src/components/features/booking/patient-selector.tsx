"use client";

import { useState, useTransition } from "react";
import { useRouter }               from "next/navigation";
import { Button }                  from "@/components/ui/button";
import { Input }                   from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { buildPaymentUrl }         from "@/lib/booking/url";
import { REGEX }                   from "@/lib/validations/regex";
import { cn }                      from "@/lib/utils/cn";

interface CurrentUser { name: string; phone: string }
interface Props {
  currentUser: CurrentUser;
  doctorId:    string;
  date:        string;
  time:        string;
  displayDate: string;
  displayTime: string;
}
interface OtherPatient { name: string; phone: string }

// ⚠️ Inline error row — always present, opacity prevents layout shift
function FieldError({ message }: { message?: string | undefined }) {
  return (
    <p
      role="alert"
      aria-live="polite"
      className="h-4 mt-1 text-xs text-danger-500 text-right transition-opacity duration-200"
      style={{ opacity: message ? 1 : 0 }}
    >
      {message ?? "\u200c"}
    </p>
  );
}

export default function PatientSelector({
  currentUser, doctorId, date, time, displayDate, displayTime,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [forSelf,   setForSelf]      = useState(true);
  const [other,     setOther]        = useState<OtherPatient>({ name: "", phone: "" });
  const [errors,    setErrors]       = useState<Partial<OtherPatient>>({});

  const validate = (): boolean => {
    const e: Partial<OtherPatient> = {};
    if (!other.name.trim())             e.name  = "نام بیمار الزامی است";
    if (!REGEX.PHONE.test(other.phone)) e.phone = "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!forSelf && !validate()) return;
    const patientName  = forSelf ? currentUser.name  : other.name.trim();
    const patientPhone = forSelf ? currentUser.phone : other.phone.trim();
    startTransition(() => {
      router.replace(buildPaymentUrl({
        doctorId, date, time, displayDate, displayTime,
        patientName, patientPhone, forSelf: forSelf ? "1" : "0",
      }));
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-neutral-100 p-4 sm:p-5">
      <div>
        <h3 className="mb-1 text-base font-medium text-neutral-850 sm:text-lg">مراجعه‌کننده</h3>
        <p className="text-sm text-neutral-500">برای چه کسی نوبت می‌گیرید؟</p>
      </div>

      {/* 🙋 Self */}
      <label className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors sm:p-4",
        forSelf ? "border-primary-400 bg-primary-50" : "border-neutral-200"
      )}>
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-medium text-neutral-850">{currentUser.name} (خودم)</p>
          <p className="mt-0.5 truncate text-xs text-neutral-400" dir="ltr" style={{ textAlign: "right" }}>{currentUser.phone}</p>
        </div>
        <input type="radio" checked={forSelf} onChange={() => setForSelf(true)} className="size-4 shrink-0 accent-primary-500" />
      </label>

      {/* 👥 Other */}
      <label className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors sm:p-4",
        !forSelf ? "border-primary-400 bg-primary-50" : "border-neutral-200"
      )}>
        <span className="text-sm text-neutral-700">برای شخص دیگر</span>
        <input type="radio" checked={!forSelf} onChange={() => setForSelf(false)} className="size-4 shrink-0 accent-primary-500" />
      </label>

      {/* ✏️ Other person fields */}
      {!forSelf && (
        <div className="space-y-2">
          <div>
            {/* 🧑 Patient name — shadcn Input; red state driven by aria-invalid */}
            <Input
              type="text"
              value={other.name}
              onChange={e => setOther(p => ({ ...p, name: e.target.value }))}
              placeholder="نام و نام خانوادگی بیمار"
              dir="rtl"
              aria-invalid={!!errors.name}
              className="h-auto rounded-xl px-4 py-3"
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            {/* 📱 Patient phone — LTR value, RTL placeholder; aria-invalid → red */}
            <Input
              type="tel"
              value={other.phone}
              onChange={e => setOther(p => ({ ...p, phone: e.target.value }))}
              placeholder="شماره موبایل (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"
              dir="ltr"
              aria-invalid={!!errors.phone}
              className="h-auto rounded-xl px-4 py-3 text-left placeholder:text-right"
            />
            <FieldError message={errors.phone} />
          </div>
        </div>
      )}

      {/* 🚀 Continue */}
      <Button
        onClick={handleContinue}
        disabled={isPending || (!forSelf && !other.name.trim())}
        className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white text-base font-medium flex items-center justify-center gap-x-2"
      >
        {isPending
          ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          : <> ادامه و رفتن به پرداخت <ChevronLeft size={20} /> </>
        }
      </Button>
    </div>
  );
}
