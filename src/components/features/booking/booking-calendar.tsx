'use client';
import { useState, useEffect } from 'react';
import { toJalaali } from 'jalaali-js';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { clsx } from 'clsx';

// 🗓️ Jalali months name mapping
const JALALI_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
] as const;


// 🕒 Static time slots configuration
const TIME_SLOTS_DATA = [
  { id: '1', time: '۹:۱۵', isAvailable: false },
  { id: '2', time: '۹:۳۰', isAvailable: false },
  { id: '3', time: '۹:۴۵', isAvailable: false },
  { id: '4', time: '۱۰:۰۰', isAvailable: false },
  { id: '5', time: '۱۰:۱۵', isAvailable: true },
  { id: '6', time: '۱۰:۳۰', isAvailable: true },
  { id: '7', time: '۱۰:۴۵', isAvailable: false },
  { id: '8', time: '۱۱:۰۰', isAvailable: false },
  { id: '9', time: '۱۱:۱۵', isAvailable: true },
] as const;

// 📅 Convert Gregorian date to Jalali format (YYYY/MM/DD)
const formatJalaliDate = (date: Date) => {
  const { jy, jm, jd } = toJalaali(date);
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
};

// 🖋️ Convert date to readable Persian format
const getJalaliDisplay = (date: Date) => {
  const { jy, jm, jd } = toJalaali(date);
  return `${jd.toLocaleString('fa-IR', { useGrouping: false })} ${JALALI_MONTHS[jm - 1]} ${jy.toLocaleString('fa-IR', { useGrouping: false })}`;
};

// 🔁 Sort time slots chronologically
const sortedTimeSlots = () => {
  // 🔄 Convert Persian digits to standard format for comparison
  const toHHMM = (time: string)=> {
    const [h, m] = time.split(':');
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  };

  return [...TIME_SLOTS_DATA].sort((a, b) =>
    toHHMM(a.time).localeCompare(toHHMM(b.time), 'fa-IR')
  );
};

const BookingCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date()); // 📅 Selected date state
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // ⏰ Selected time state
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined); // 🌐 User timezone state

  // 🌍 Detect and set user's timezone on mount
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  // 🔹 Toggle time slot selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(prev => prev === time ? null : time);
  };

  // ✅ Handle booking confirmation
  const handleBook = () => {
    if (!date || !selectedTime) {
      alert('لطفاً تاریخ و زمان را انتخاب کنید.');
      return;
    }
    const formattedDate = formatJalaliDate(date);
    alert(`رزرو با موفقیت ثبت شد! 📅 تاریخ: ${formattedDate}، ⏰ زمان: ${selectedTime}`);
  };

  const displayDate = date ? getJalaliDisplay(date) : 'تاریخی انتخاب نشده';

  return (
    <div className="mt-6 lg:mt-0 rounded-xl p-3 md:p-4 border border-neutral-100">
      {/* 📆 Calendar Section */}
      <div className="border border-neutral-100 px-1 py-3 md:p-3 rounded-xl mb-2">
        <div className="flex items-center justify-between mb-3 mx-3">
          <h4 className="text-base md:text-lg font-bold text-neutral-950">تقویم</h4>
          <span className="text-sm md:text-[15px]/7 text-neutral-500">{displayDate}</span>
        </div>
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          timeZone={timeZone}
          className="rounded-lg"
        />
      </div>

      {/* ⏰ Time Slots Grid */}
      <div className="grid grid-cols-2 auto-cols-fr md:grid-cols-3 gap-2 mb-2">
        {sortedTimeSlots().map(slot => (
          <Button
            key={slot.id}
            variant={slot.isAvailable ? (selectedTime === slot.time ? 'default' : 'outline') : 'secondary'}
            disabled={!slot.isAvailable}
            onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
            className={clsx(
              'h-9 text-sm font-medium border cursor-pointer last:col-span-2 md:last:col-span-1',
              slot.isAvailable
                ? clsx(
                    'text-primary-500 border-primary-500 hover:text-primary-500 hover:bg-primary-100',
                    selectedTime === slot.time && 'bg-primary-500 text-white hover:bg-primary-500 hover:text-white'
                  )
                : 'text-neutral-500 border-none bg-neutral-200 cursor-not-allowed'
            )}
          >
            {slot.time}
          </Button>
        ))}
      </div>

      {/* 🎯 Book Appointment Button */}
      <Button
        className="w-full h-12.25 rounded-xl bg-primary-500 hover:bg-primary-700 cursor-pointer text-white"
        onClick={handleBook}
        disabled={!date || !selectedTime}
      >
        رزرو نوبت
      </Button>
    </div>
  );
};

export default BookingCalendar;
