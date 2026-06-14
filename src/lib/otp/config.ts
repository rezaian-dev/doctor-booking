// ⚙️ OTP configuration constants — single source of truth for the whole flow
export const OTP_CFG = {
  CODE_LENGTH: 5, // 🔢 5-digit numeric code
  TTL: 300, // ⏲️ code valid for 5 minutes
  THROTTLE: 60_000, // 🚦 min 60s gap between two sends (matches the resend timer)
  WINDOW: 600_000, // 🪟 rolling 10-min burst window
  MAX_SENDS: 3, // 📨 at most 3 codes per window
  MAX_ATTEMPTS: 3, // ❌ 3 wrong tries → code is invalidated, user must request a new one
} as const;
