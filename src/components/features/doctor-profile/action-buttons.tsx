"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileMode } from "@/types/doctor";
import { ChevronLeft } from "lucide-react";
import BookingCalendar from "@/components/features/booking/booking-calendar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { todayJalali } from "@/hooks/use-jalaali";

interface ActionButtonsProps {
  mode:        ProfileMode;
  doctorId?:   string;
  schedule?:   { date: string; times: string[] }[];
  isLoggedIn?: boolean;
}

export default function ActionButtons({ mode, doctorId, schedule = [], isLoggedIn = false }: ActionButtonsProps) {
  const [open, setOpen] = useState(false);
  const { guard } = useAuthGuard(isLoggedIn);

  if (mode !== "search") return null;

  // 🗓️ Bookable only if a non-past day still has an open time (future day → any time;
  //    today → a time later than now). Past/gone times don't count → no empty modal. 🚫
  const { date: todayStr, time: nowTime } = todayJalali();
  const hasSlots = schedule.some(d =>
    d.date > todayStr
      ? d.times.length > 0
      : d.date === todayStr && d.times.some(t => t > nowTime)
  );

  // 🔐 Auth guard: show Sonner toast if not authenticated
  const handleBookClick = () => {
    guard(() => setOpen(true));
  };

  return (
    <>
      <div className="flex flex-row-reverse items-center gap-2.5 sm:gap-3 px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
        <Button
          onClick={handleBookClick}
          disabled={!hasSlots}
          title={!hasSlots ? "نوبت خالی موجود نیست" : undefined}
          className="flex-1 min-w-0 h-10 rounded-xl text-xs sm:text-sm font-medium
            bg-primary-500 hover:bg-primary-600 text-white
            disabled:bg-primary-300 disabled:cursor-not-allowed"
        >
          رزرو نوبت <ChevronLeft size={18} className="shrink-0" />
        </Button>

        <ButtonLink href={doctorId ? `/doctors/${doctorId}` : "#"} variant="outline" className="flex-1 min-w-0 h-10 rounded-xl border-neutral-200 text-neutral-500 text-xs sm:text-sm font-medium hover:bg-neutral-50 flex items-center justify-center truncate px-2">
          مشاهده پروفایل
        </ButtonLink>
      </div>

      {/* 🔓 Auth is enforced by `guard` before `open` is ever set true, so the
          dialog only needs slots to exist — no `isLoggedIn` gate (which could race
          the async client-side auth resolution and swallow the modal). */}
      {hasSlots && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent dir="rtl" className="w-full max-w-sm sm:max-w-md p-4 rounded-2xl [&>button]:left-4 [&>button]:right-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-neutral-950 text-right">انتخاب نوبت</DialogTitle>
              <DialogDescription className="sr-only">لطفاً تاریخ و ساعت مورد نظر خود را انتخاب کنید</DialogDescription>
            </DialogHeader>
            <BookingCalendar schedule={schedule} doctorId={doctorId!} isLoggedIn={isLoggedIn} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
