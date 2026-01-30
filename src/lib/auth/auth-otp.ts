import crypto from "crypto";

interface OTPData {
  hash: string;
  expiresAt: number;
  attempts: number;
  used: boolean; // 🔒 Prevent reuse
}

interface RateLimit {
  count: number;
  resetAt: number;
  lastSent: number;
}

// 💾 Storage
const otps = new Map<string, OTPData>();
const limits = new Map<string, RateLimit>();

// ⚙️ Config
const CFG = {
  EXPIRY: 5 * 60 * 1000,
  WINDOW: 2 * 60 * 1000,
  MAX_TRIES: 5,
  MAX_SENDS: 3,
  THROTTLE: 30 * 1000,
} as const;

// 🔐 Timing-safe hash comparison
const safeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

// 🔒 Hash OTP
const hash = (code: string) =>
  crypto.createHash("sha256").update(code).digest("hex");

// 🎲 Generate cryptographically secure 5-digit OTP
export const generateOTP = () => {
  const num = crypto.randomInt(10000, 100000);
  return String(num);
};

// 🚦 Check rate limit (atomic operation)
export const canRequestOTP = (phone: string) => {
  const now = Date.now();
  const lim = limits.get(phone);

  // ✅ First request or window expired
  if (!lim || now > lim.resetAt) {
    limits.set(phone, { count: 1, resetAt: now + CFG.WINDOW, lastSent: now });
    return { allowed: true };
  }

  // ⏱️ Throttle check
  const elapsed = now - lim.lastSent;
  if (elapsed < CFG.THROTTLE) {
    return {
      allowed: false,
      waitTime: Math.ceil((CFG.THROTTLE - elapsed) / 1000),
    };
  }

  // 🚫 Max sends check
  if (lim.count >= CFG.MAX_SENDS) {
    return {
      allowed: false,
      waitTime: Math.ceil((lim.resetAt - now) / 1000),
    };
  }

  // ✅ Update atomically
  lim.count++;
  lim.lastSent = now;
  return { allowed: true };
};

// 💾 Store OTP
export const storeOTP = (phone: string, code: string) => {
  otps.set(phone, {
    hash: hash(code),
    expiresAt: Date.now() + CFG.EXPIRY,
    attempts: 0,
    used: false,
  });
};

// ✅ Verify OTP
export const verifyOTP = (phone: string, code: string) => {
  const data = otps.get(phone);
  if (!data) return false;

  const now = Date.now();

  // ⏰ Expired?
  if (now > data.expiresAt) {
    otps.delete(phone);
    return false;
  }

  // 🔒 Already used?
  if (data.used) {
    return false;
  }

  // 🚫 Too many attempts?
  if (data.attempts >= CFG.MAX_TRIES) {
    otps.delete(phone);
    return false;
  }

  data.attempts++;

  // 🔍 Timing-safe comparison
  const valid = safeCompare(data.hash, hash(code));

  if (valid) {
    data.used = true; // 🔒 Mark as used
    otps.delete(phone);
    limits.delete(phone);
  }

  return valid;
};

// 🧹 Manual cleanup (call from cron or startup)
export const cleanupExpired = () => {
  const now = Date.now();

  for (const [phone, data] of otps.entries()) {
    if (now > data.expiresAt) otps.delete(phone);
  }

  for (const [phone, lim] of limits.entries()) {
    if (now > lim.resetAt) limits.delete(phone);
  }
};
