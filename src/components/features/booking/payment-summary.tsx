"use client";

import { useState }       from "react";
import { useRouter }      from "next/navigation";
import { ChevronLeft }    from "lucide-react";
import { Button }         from "@/components/ui/button";
import { Label }          from "@/components/ui/label";
import { Checkbox }       from "@/components/ui/checkbox";
import { Separator }      from "@/components/ui/separator";

import { toast }          from "sonner";
import BankOption         from "./bank-option";
import { formatFaNumber } from "@/lib/utils/persian-format";
import { revalidateDoctorsClient } from "@/lib/utils/revalidate-doctors-client";
const SERVICE_FEE = 0.1;
// 💰 Deterministic fa formatting → identical SSR/CSR output, no hydration mismatch 🧠
const fmt = (n: number) => formatFaNumber(n);

interface Props {
  doctorId:      string;
  date:          string;
  time:          string;
  displayDate:   string;
  displayTime:   string;
  patientName:   string;
  patientPhone:  string;  // 📱 patient's contact (their own when booking for someone else)
  bookedForSelf: boolean; // 🧑‍⚕️ false → server stores the entered patient, not the account holder
  visitFee:      number;
}

const BANKS = [
  { id: "bank-saman",   logo: "/images/logo-bank-saman.png", name: "بانک سامان"   },
  { id: "bank-parsian", logo: "/images/logo-parsian.png",    name: "بانک پارسیان" },
] as const;

const FeeRow = ({ label, value, bold }: { label: string; value: number; bold?: boolean }) => (
  <div className="flex items-center justify-between gap-x-3">
    <span className={`shrink-0 text-sm ${bold ? "font-medium" : ""} text-neutral-700`}>{label}</span>
    <span className={`whitespace-nowrap text-left font-bold ${bold ? "text-base text-primary-600" : "text-sm text-neutral-850"}`}>
      {fmt(value)} تومان
    </span>
  </div>
);

export default function PaymentSummary({
  doctorId, date, time, displayDate, displayTime, patientName, patientPhone, bookedForSelf, visitFee,
}: Props) {
  const router = useRouter();

  const [selectedBank,    setSelectedBank]    = useState("bank-saman");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading,         setLoading]         = useState(false);

  const serviceFee = Math.round(visitFee * SERVICE_FEE);
  const totalFee   = visitFee + serviceFee;

  const handlePayment = async () => {
    if (!isTermsAccepted || loading) return;
    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 2000)); // ⏳ Simulate gateway

      const res  = await fetch(`/api/doctors/${doctorId}/book`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        // 🧑‍⚕️ forSelf drives whether the server trusts these fields or the account holder
        body:    JSON.stringify({ date, time, forSelf: bookedForSelf, patientName, patientPhone }),
      });

      const text = await res.text();
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(text) as Record<string, unknown>; }
      catch { console.error("[book] non-JSON response:", text); }

      if (!res.ok) {
        toast.error((data.error as string) ?? "خطا در ثبت نوبت");
        return;
      }

      // 🔄 Realtime: clear both client caches the booking invalidated server-side. router.refresh()
      //    busts the Next Router Cache (RSC surfaces refetch); revalidateDoctorsClient() busts the
      //    SWR cache behind /doctors that router.refresh() can't reach → instant sync. 🧠✨
      await revalidateDoctorsClient();
      router.refresh();

      // 🎫 Prefer the real DB tracking code so success page matches "My appointments";
      //    fall back to a local code only if the API somehow omitted it.
      const booking      = (data.booking ?? {}) as { trackingCode?: string };
      const trackingCode = booking.trackingCode ?? Date.now().toString(36).toUpperCase();

      // ✅ replace — wipes entire booking flow (calendar → confirm → payment) from history
      //    User pressing back from success goes to doctor page, not back into booking
      router.replace(`/booking/success?${new URLSearchParams({
        doctorId,
        displayDate,
        displayTime,
        patientName,
        trackingCode,
      })}`);

    } finally {
      setLoading(false);
    }
  };

  const summaryRows: [string, string][] = [
    ["بیمار:",  patientName],
    ["تاریخ:",  displayDate],
    ["ساعت:",   displayTime],
  ];

  return (
    <div className="space-y-3">

      {/* 💵 Fee breakdown */}
      <div className="space-y-3 rounded-xl border border-neutral-100 p-4 sm:p-5">
        <h3 className="mb-1 text-base font-medium text-neutral-850 sm:text-lg">جزئیات پرداخت</h3>
        <FeeRow label="مبلغ ویزیت:"   value={visitFee}   />
        <FeeRow label="هزینه کارمزد:" value={serviceFee} />
        <Separator className="bg-neutral-100" />
        <FeeRow label="مبلغ نهایی:"   value={totalFee}   bold />
      </div>

      {/* 📅 Appointment summary */}
      {(displayDate || patientName) && (
        <div className="space-y-2 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm">
          <h4 className="mb-2 font-medium text-neutral-700">خلاصه نوبت</h4>
          {summaryRows.filter(([, v]) => v).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-x-3">
              <span className="shrink-0 text-neutral-500">{label}</span>
              <span className="min-w-0 truncate text-left font-medium text-neutral-800">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* 🏦 Bank selection */}
      <div className="rounded-xl border border-neutral-100 p-4 sm:p-5">
        <h3 className="mb-3 text-base font-medium text-neutral-850 sm:text-lg">درگاه پرداخت آنلاین</h3>
        <div className="space-y-2">
          {BANKS.map(({ id, logo, name }) => (
            <BankOption
              key={id} id={id} name="payment-gateway"
              logoSrc={logo} bankName={name}
              isSelected={selectedBank === id}
              onChange={() => setSelectedBank(id)}
            />
          ))}
        </div>
      </div>

      {/* ✅ Terms */}
      <div className="flex items-start gap-x-2">
        <Checkbox
          id="payment-terms"
          checked={isTermsAccepted}
          onCheckedChange={c => setIsTermsAccepted(Boolean(c))}
          className="mt-0.5 data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
        />
        <Label htmlFor="payment-terms" className="cursor-pointer text-xs leading-relaxed text-neutral-850">
          پرداخت به منزله پذیرش شرایط و قوانین است.
        </Label>
      </div>

      {/* 🚀 Submit */}
      <Button
        disabled={!isTermsAccepted || loading}
        onClick={handlePayment}
        className="flex h-12 w-full items-center justify-center gap-x-2 rounded-xl bg-primary-500 text-base font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-300"
      >
        {loading
          ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> در حال پرداخت...</>
          : <>پرداخت <ChevronLeft size={20} /></>
        }
      </Button>
    </div>
  );
}
