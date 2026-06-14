// 🔢 Canonical deterministic Persian number formatting — zero Intl/toLocaleString. Pure string
//    math → identical output on server (Node ICU) and client, so SSR values hydrate byte-for-byte. 🧠

// Persian digit table (index === ASCII digit value)
const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

// Persian thousands separator (U+066C) — matches the previous Intl("fa-IR") visual output
const FA_GROUP_SEP = "٬";

/** 🔁 Map every ASCII digit 0-9 → Persian digit. Deterministic, no Intl. */
export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]!);
}

/** 🔢 Inverse: Persian (۰-۹) & Arabic-Indic (٠-٩) digits → ASCII 0-9.
 *  Critical for OTP/phone input: users on a Persian keyboard type ۱۲۳۴۵,
 *  which must hash identically to the SMS-sent ASCII code. 🧠 */
export function toEnDigits(input: string): string {
  return input
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0)) // 🇮🇷 Persian
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660)); // 🌐 Arabic-Indic
}

/** 💰 Format an integer with Persian digits + optional thousands grouping (default on). */
export function formatFaNumber(value: number, options?: { grouping?: boolean }): string {
  const grouping = options?.grouping ?? true;
  const n = Math.trunc(value);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n).toString();
  // Insert the thousands separator every 3 digits from the right (pure regex, no locale data)
  const grouped = grouping ? abs.replace(/\B(?=(\d{3})+(?!\d))/g, FA_GROUP_SEP) : abs;
  return sign + toFaDigits(grouped);
}
