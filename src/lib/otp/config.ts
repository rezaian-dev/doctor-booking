// ⚙️ OTP configuration constants
export const OTP_CFG = {
  CODE_LENGTH: 5,
  TTL: 300,
  THROTTLE: 30_000,
  WINDOW: 300_000,
  MAX_SENDS: 3,
  MAX_ATTEMPTS: 5,
} as const;
