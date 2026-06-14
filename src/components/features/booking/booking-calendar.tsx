'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { Button }   from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils/cn';
import {
  dateToJalaliStr,
  jalaliDisplayDate,
  jalaliStrToDate,
  toFarsiTime,
} from '@/hooks/use-jalaali';

interface Schedule { date: string; times: string[] }
interface Props     { schedule?: Schedule[]; doctorId?: string; isLoggedIn?: boolean }

// 👤 Shared /api/auth/me cache (same key as the header) → deduped, no extra request
const meFetcher = (url: string): Promise<{ user: unknown | null }> => fetch(url).then(r => r.json());

const toJalaliStr   = dateToJalaliStr;
const jalaliDisplay = jalaliDisplayDate;
const jalaliToGreg  = jalaliStrToDate;

const BookingCalendar = ({ schedule = [], doctorId = "", isLoggedIn: isLoggedInProp }: Props) => {
  const router = useRouter();

  // 🔐 Auth read only at click-time (the UI never depends on it), so resolving it client-side
  //    from the shared /api/auth/me cache adds zero flicker and lets the doctor page skip the
  //    server cookie read → static/cached. An explicit prop still wins. 🧠✨
  const { data: me } = useSWR('/api/auth/me', meFetcher, { revalidateOnFocus: false });
  const isLoggedIn = isLoggedInProp ?? !!me?.user;
  // 🌍 Client time zone via an external store → no effect, no sync setState, no hydration
  //    mismatch: server snapshot is undefined, client reads the real tz on mount. 🧠
  const timeZone = useSyncExternalStore(
    () => () => {},                                          // 🔌 value never changes → no-op subscribe
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,  // 💻 client snapshot
    () => undefined,                                         // 🖥️ server snapshot
  );

  const now         = useMemo(() => new Date(), []);
  const todayStr    = useMemo(() => toJalaliStr(now), [now]);
  const currentTime = useMemo(() => `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`, [now]);

  const scheduleMap = useMemo(() => new Map(schedule.map(s => [s.date, s.times])), [schedule]);

  // 🗓️ Day timestamps with a real open slot (today-or-future + a free time). Used only to
  //    ring available days — days aren't disabled; an empty day shows a "not scheduled" note. 🔓
  const bookableTs = useMemo(() => {
    const set = new Set<number>();
    for (const { date, times } of schedule) {
      if (date < todayStr) continue;                                            // ⏮️ past day
      const hasFree = date === todayStr ? times.some(t => t > currentTime) : times.length > 0;
      if (hasFree) set.add(jalaliToGreg(date).setHours(0, 0, 0, 0));
    }
    return set;
  }, [schedule, todayStr, currentTime]);

  const hasSlotMatcher = useMemo(() => (d: Date) => bookableTs.has(new Date(d).setHours(0, 0, 0, 0)), [bookableTs]); // 💍 ring

  const firstAvailable = useMemo(() => {
    for (const { date, times } of [...schedule].sort((a,b) => a.date.localeCompare(b.date))) {
      if (date < todayStr) continue;
      if (date === todayStr ? times.some(t => t > currentTime) : times.length > 0) return date;
    }
    return null;
  }, [schedule, todayStr, currentTime]);

  // 🔒 Use undefined instead of new Date() as fallback — new Date() in useState initializer
  // can produce different timestamps on SSR vs hydration, causing hydration mismatch
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => firstAvailable ? jalaliToGreg(firstAvailable) : undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedJalali = selectedDate ? toJalaliStr(selectedDate) : null;
  const sortedTimes    = [...(selectedJalali ? (scheduleMap.get(selectedJalali) ?? []) : [])].sort();

  const isActive = (time: string) => {
    if (!selectedJalali) return false;
    if (selectedJalali > todayStr) return true;
    return selectedJalali === todayStr && time > currentTime;
  };

  // 🔐 Check auth before proceeding
  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    if (!isLoggedIn) {
      toast.error('ابتدا وارد حساب خود شوید', {
        description: 'برای رزرو نوبت باید وارد حساب کاربری خود شوید.',
        action: {
          label: 'ورود',
          onClick: () => router.push('/auth/login'),
        },
        duration: 5000,
      });
      return;
    }

    const jalali = toJalaliStr(selectedDate);
    router.push(`/booking/confirm?${new URLSearchParams({
      doctorId,
      date:        jalali,
      time:        selectedTime,
      displayDate: jalaliDisplay(selectedDate),
      displayTime: toFarsiTime(selectedTime),
    })}`);
  };

  return (
    <div className="mt-6 lg:mt-0 rounded-xl p-3 md:p-4 border border-neutral-100">
      {/* 📅 Calendar */}
      <div className="border border-neutral-100 px-1 py-3 md:p-3 rounded-xl mb-3">
        <div className="flex items-center justify-between mb-3 mx-3">
          <h4 className="text-base md:text-lg font-bold text-neutral-950">تقویم</h4>
          {/* 📌 Today's date, always shown top-left as a reference */}
          <span className="text-sm text-neutral-500">امروز: {jalaliDisplay(now)}</span>
        </div>
        <Calendar
          mode="single"
          onSelect={d => { setSelectedDate(d); setSelectedTime(null); }}
          modifiers={{ hasSlot: hasSlotMatcher }}
          modifiersClassNames={{ hasSlot: 'ring-1 ring-primary-400' }}
          className="rounded-lg"
          // 🔒 Omit optional props when undefined → satisfies exactOptionalPropertyTypes
          {...(selectedDate && { selected: selectedDate, defaultMonth: selectedDate })}
          {...(timeZone && { timeZone })}
        />
      </div>

      {/* ⏱️ Time slots */}
      <div className="mb-3 min-h-16">
        {sortedTimes.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-5">نوبتی برای این روز ثبت نشده</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {sortedTimes.map(time => (
              <Button
                key={time}
                disabled={!isActive(time)}
                variant="outline"
                onClick={() => setSelectedTime(p => p === time ? null : time)}
                className={cn('h-9 text-sm font-medium transition-colors',
                  selectedTime === time
                    ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-500 hover:text-white'
                    : isActive(time)
                      ? 'text-primary-500 border-primary-500 hover:bg-primary-50'
                      : 'text-neutral-400 border-neutral-200 bg-neutral-100 cursor-not-allowed opacity-60'
                )}
              >
                {toFarsiTime(time)}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Button
        className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-700 text-white disabled:bg-primary-200"
        onClick={handleContinue}
        disabled={!selectedDate || !selectedTime}
      >
        ادامه و تایید نوبت
      </Button>
    </div>
  );
};

export default BookingCalendar;
