// 📅 Controlled Jalali date + time-slot picker. The parent <DoctorForm> (RHF) owns the
//    value → no hidden input, no DOM reads, single source of truth. 🧠
"use client";

import { useMemo } from "react";
import { CalendarDays, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DatePicker, { type DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { todayJalali, jalaliStrToLabel } from "@/hooks/use-jalaali";
import type { ScheduleItem } from "@/lib/validations/doctor";

interface SchedulePickerProps {
  value: ScheduleItem[];
  onChange: (next: ScheduleItem[]) => void;
  errors?: (string | undefined)[]; // 🚨 per-row date errors surfaced from the form resolver
}

// ⏰ Available time slots — every 30 minutes from 8:00 to 20:00
const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
];

export default function SchedulePicker({ value, onChange, errors }: SchedulePickerProps) {
  // 🕒 Compute once at mount — keeps new Date() out of the render body (stable guard)
  const today = useMemo(() => todayJalali().date, []);

  // 🚫 Dates already chosen in OTHER rows → one calendar day = one row. Used to disable those
  //    days in the picker and to reject a duplicate pick defensively. Row i ignores its own date. 🧠
  const usedDatesExcept = (rowIdx: number) =>
    new Set(value.filter((_, idx) => idx !== rowIdx).map((s) => s.date).filter(Boolean));

  // 🧰 Immutable helpers — each returns a new array passed up via onChange
  const addDay = () => onChange([...value, { date: "", times: [] }]);
  const removeDay = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const setDate = (i: number, date: string) =>
    onChange(value.map((s, idx) => (idx === i ? { ...s, date } : s)));
  const toggleTime = (i: number, time: string) =>
    onChange(
      value.map((s, idx) => {
        if (idx !== i) return s;
        const times = s.times.includes(time)
          ? s.times.filter((t) => t !== time)
          : [...s.times, time].sort();
        return { ...s, times };
      })
    );

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <p className="py-4 text-center text-sm text-neutral-400">هیچ روزی اضافه نشده</p>
      )}

      {/* Rows are fully driven by props, so an index key is stable and correct */}
      {value.map((slot, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          {/* 📅 Date row */}
          <div className="flex items-start gap-3">
            <CalendarDays size={16} className="mt-2.5 shrink-0 text-primary-500" />
            <div className="flex-1 space-y-1.5">
              {/* 🏷️ Weekday + Persian label once a date is picked */}
              {slot.date && (
                <Badge variant="default" className="rounded-lg">
                  {jalaliStrToLabel(slot.date)}
                </Badge>
              )}
              <DatePicker
                value={slot.date || ""}
                onChange={(val: DateObject | null) => {
                  if (!val) return;
                  const y = val.year;
                  const m = String(val.month.number).padStart(2, "0");
                  const d = String(val.day).padStart(2, "0");
                  const dateStr = `${y}-${m}-${d}`;
                  if (dateStr < today) return; // 🚫 block past dates
                  if (usedDatesExcept(i).has(dateStr)) return; // 🚫 block a date already used by another row
                  setDate(i, dateStr);
                }}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                // 🛑 Don't auto-select today on open. RMDP fires onChange(today) on open (picking it
                //    unasked + flickering the popup); now a date is set only on an explicit click. 🧠
                onOpenPickNewDate={false}
                inputClass="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                placeholder="انتخاب تاریخ (روز / ماه / سال)"
                containerClassName="w-full"
                mapDays={({ date }) => {
                  const dateStr = `${date.year}-${String(date.month.number).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
                  if (dateStr < today) {
                    return { disabled: true, style: { color: "#d1d5db", cursor: "not-allowed" } };
                  }
                  // 🚫 Grey out days already taken by another row → duplicates are unpickable. 🧠
                  if (usedDatesExcept(i).has(dateStr)) {
                    return { disabled: true, style: { color: "#d1d5db", cursor: "not-allowed" } };
                  }
                  return undefined; // ✅ explicit return satisfies noImplicitReturns
                }}
              />
              {/* 🚨 Duplicate / invalid date error from the form resolver */}
              {errors?.[i] && (
                <p className="text-xs font-medium text-danger-600">{errors[i]}</p>
              )}
            </div>

            {/* 🗑️ Remove day */}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeDay(i)}
              aria-label="حذف روز"
              className="mt-1 shrink-0 text-neutral-400 hover:bg-danger-50 hover:text-danger-600"
            >
              <Trash2 size={14} />
            </Button>
          </div>

          {/* ⏰ Time slot grid */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Clock size={14} className="text-neutral-400" />
              <span className="text-xs text-neutral-500">ساعت‌های ویزیت (بازه زمانی)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TIME_SLOTS.map((t) => {
                const active = slot.times.includes(t);
                return (
                  <Button
                    key={t}
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => toggleTime(i, t)}
                    className="h-7 px-2.5 text-xs"
                  >
                    {t}
                  </Button>
                );
              })}
            </div>
            {slot.times.length > 0 && (
              <p className="mt-2 text-xs text-primary-600">{slot.times.length} ساعت انتخاب شده</p>
            )}
          </div>
        </div>
      ))}

      {/* ➕ Add day */}
      <Button
        type="button"
        variant="outline"
        onClick={addDay}
        className="w-full gap-2 border-dashed"
      >
        <Plus size={15} />
        افزودن روز جدید
      </Button>
    </div>
  );
}
