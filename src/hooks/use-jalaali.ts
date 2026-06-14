/**
 * 📅 Jalaali utilities — Centralized Jalali (Shamsi) date helpers
 * Pure functions — usable in both Server and Client components
 * DRY: eliminates repeated jalaali-js imports across the project
 */

import { toJalaali, toGregorian } from 'jalaali-js';
import { toFaDigits } from '@/lib/utils/persian-format';

// ─── Constants ────────────────────────────────────────────────────────────────

export const JALALI_MONTHS = [
  'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
  'مهر','آبان','آذر','دی','بهمن','اسفند',
] as const;

export const JALALI_DAYS = [
  'یک‌شنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه','شنبه',
] as const;

// ─── Pure helpers (no React, usable in server code too) ───────────────────────

const pad = (n: number) => String(n).padStart(2, '0');

/** Convert any Date to Jalali "YYYY-MM-DD" */
export function dateToJalaliStr(d: Date): string {
  const { jy, jm, jd } = toJalaali(d);
  return `${jy}-${pad(jm)}-${pad(jd)}`;
}

/** Today as Jalali "YYYY-MM-DD" + current "HH:mm" — always Asia/Tehran, regardless of server TZ */
export function todayJalali(): { date: string; time: string } {
  // 🕰️ Read Tehran wall-clock so appointment availability never drifts with the host timezone
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tehran',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date());

  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)?.value ?? '00';
  const gy = Number(get('year'));
  const gm = Number(get('month'));
  const gd = Number(get('day'));
  const hh = get('hour') === '24' ? '00' : get('hour'); // ⏱️ some ICU builds emit "24" at midnight
  const mm = get('minute');

  const { jy, jm, jd } = toJalaali(gy, gm, gd); // 🗓️ Gregorian (Tehran) → Jalali
  return {
    date: `${jy}-${pad(jm)}-${pad(jd)}`,
    time: `${hh}:${mm}`,
  };
}

/** Convert Gregorian Date → Persian display, e.g. "15 Farvardin 1404" */
export function jalaliDisplayDate(d: Date): string {
  const { jy, jm, jd } = toJalaali(d);
  return `${toFaDigits(jd)} ${JALALI_MONTHS[jm - 1]} ${toFaDigits(jy)}`;
}

/** Jalali string "YYYY-MM-DD" → Persian readable label with weekday */
export function jalaliStrToLabel(jalaliStr: string): string {
  const [jy = 1400, jm = 1, jd = 1] = jalaliStr.split('-').map(Number);
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  const weekDay = JALALI_DAYS[new Date(gy, gm - 1, gd).getDay()];
  const dayFa   = toFaDigits(jd);
  return `${weekDay} ${dayFa} ${JALALI_MONTHS[jm - 1]}`;
}

/** Convert Jalali "YYYY-MM-DD" → JavaScript Date */
export function jalaliStrToDate(s: string): Date {
  const [jy, jm, jd] = s.split('-').map(Number);
  const { gy, gm, gd } = toGregorian(jy ?? 1400, jm ?? 1, jd ?? 1);
  return new Date(gy, gm - 1, gd);
}

/** Format toJalaali for month caption in calendar */
export function jalaliMonthCaption(d: Date): string {
  const { jy, jm } = toJalaali(d);
  return `${JALALI_MONTHS[jm - 1]} ماه ${toFaDigits(jy)}`;
}

/** Get Jalali day number as Persian digit for calendar cells */
export function jalaliDayNumber(d: Date): string {
  const { jd } = toJalaali(d);
  return toFaDigits(jd);
}

/** Check if a Jalali date string is before today */
export function isPastJalaliDate(jalaliDate: string): boolean {
  if (!jalaliDate) return false;
  return jalaliDate < todayJalali().date;
}

/** Format a "HH:mm" time string into Persian (Farsi) digits */
export function toFarsiTime(t: string): string {
  // 🕒 Split "12:0" → hour "12", minute "0"; minutes are always zero-padded to 2 digits
  const [h = '0', m = '0'] = t.split(':');
  const mm = String(parseInt(m, 10)).padStart(2, '0'); // 🔢 "0" → "00", "5" → "05"
  return `${toFaDigits(parseInt(h, 10))}:${toFaDigits(mm)}`;
}

// 🇮🇷 Tehran is fixed UTC+03:30 (DST permanently abolished in 2022)
const TEHRAN_OFFSET_MIN = 3 * 60 + 30;

/**
 * Format an instant as a Jalali Persian date(+time) in Tehran wall-clock.
 * Deterministic: epoch → fixed offset → UTC getters → jalaali-js → toFaDigits.
 * No Intl / toLocaleDateString, so SSR and client outputs are byte-identical. 🔒
 * e.g. jalaliDateTimeFa(iso)               → "25 Dey 1404, 08:30" (Persian digits)
 *      jalaliDateTimeFa(iso,{year:false})  → "25 Dey, 08:30"
 */
export function jalaliDateTimeFa(
  input: Date | string,
  opts: { year?: boolean; time?: boolean } = {},
): string {
  const { year = true, time = true } = opts;
  const base = typeof input === 'string' ? new Date(input) : input;
  const t = new Date(base.getTime() + TEHRAN_OFFSET_MIN * 60_000); // shift to Tehran wall-clock
  const { jy, jm, jd } = toJalaali(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
  let out = `${toFaDigits(jd)} ${JALALI_MONTHS[jm - 1]}`;
  if (year) out += ` ${toFaDigits(jy)}`;
  if (time) {
    const hh = toFaDigits(String(t.getUTCHours()).padStart(2, '0'));
    const mm = toFaDigits(String(t.getUTCMinutes()).padStart(2, '0'));
    out += `، ${hh}:${mm}`;
  }
  return out;
}
