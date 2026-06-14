// 🗓️ Appointment display utilities — extracted from (dashboard)/appointments/page.tsx

// Jalali month names for slot formatting
export const JALALI_MONTHS = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند",
] as const;

export function formatSlot(date: string, time: string): string {
  const [, m, d] = date.split("-").map(Number);
  const dateFa = `${d} ${JALALI_MONTHS[(m ?? 1) - 1]}`;
  const timeFa = time
    .split(":")
    .map((p) => parseInt(p, 10).toLocaleString("fa-IR", { useGrouping: false }))
    .join(":");
  return `${dateFa} · ساعت ${timeFa}`;
}

export const APPOINTMENTS_PAGE_SIZE = 5;
