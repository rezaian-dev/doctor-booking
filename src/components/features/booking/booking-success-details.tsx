'use client';

import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

// 📋 The only searchParam-driven slice of the success page — isolated behind its own
//    <Suspense> so the rest of the card stays static and flash-free. 🧠✨
export default function BookingSuccessDetails() {
  const params = useSearchParams();

  const patientName  = params.get('patientName')  ?? '—';
  const displayDate  = params.get('displayDate')  ?? '—';
  const displayTime  = params.get('displayTime')  ?? '—';
  const trackingCode = params.get('trackingCode') ?? '—';

  // 🧑‍⚕️ Top rows render uniformly; tracking code is emphasized separately below
  const rows: [string, string][] = [
    ['بیمار:', patientName],
    ['تاریخ:', displayDate],
    ['ساعت:',  displayTime],
  ];

  return (
    <div className="border border-neutral-100 rounded-xl p-4 text-right space-y-3 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between">
          <span className="text-neutral-500">{label}</span>
          <span className="font-medium text-neutral-800">{value}</span>
        </div>
      ))}

      <Separator className="bg-neutral-100" />

      <div className="flex justify-between">
        <span className="text-neutral-500">کد پیگیری:</span>
        <span className="font-bold text-primary-600 tracking-widest">{trackingCode}</span>
      </div>
    </div>
  );
}
