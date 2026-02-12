// 🔧 OTP Configuration (immutable)
export const OTP_CFG = {
  CODE_LENGTH: 5,        // 🔢 5-digit numeric code
  TTL: 300,              // 🕐 Expiry in seconds (5 minutes)
  THROTTLE: 30_000,      // ⏱️ Min ms between OTP requests (30s)
  WINDOW: 300_000,       // 🪟 Rate-limit window in ms (5 minutes)
  MAX_SENDS: 3,          // 📨 Max OTP sends per window
  MAX_ATTEMPTS: 5,       // 🔁 Max verification attempts per OTP
} as const;

// 📦 Data structures

// 🗝️ Stored OTP record (hashed, time-bound, attempt-tracked)
export interface OTPData {
  hash: string;          // 🔒 SHA-256 hash of the OTP
  attempts: number;      // 📊 Number of failed verifications
  createdAt: number;     // 🕒 Timestamp (ms) when OTP was issued
  expiresAt: number;     // ⌛ Timestamp (ms) when OTP expires
}

// 🚦 Rate-limit state per phone number
export interface RateLimit {
  count: number;         // 📈 OTP requests in current window
  windowStart: number;   // 📅 Start timestamp (ms) of current window
  lastSent: number;      // ⏳ Timestamp (ms) of last OTP sent
}

// 🎯 Response types

// ✅ Result of rate-limit check before sending OTP
export interface RateLimitCheck {
  allowed: boolean;               // 🟢/🔴 Can send OTP?
  reason?: "throttle" | "max_sends"; // ❌ Why denied?
  waitTime?: number;              // ⏳ Seconds to wait (if throttled)
  remaining?: number;             // 📉 Remaining sends in window
}

// ✅ Result of OTP verification attempt
export interface VerifyResult {
  success: boolean;               // ✅/❌ Verification passed?
  error?: string;                 // 📝 Human-readable error (e.g., "Invalid code")
  attemptsLeft?: number;          // 🔢 Remaining attempts before lockout
}
