import { OTP_CFG, RateLimitCheck, VerifyResult } from "@/types/otp.types";
import { generateOTP, hash, safeCompare } from "./crypto";
import { redisOTP, redisRate } from "./redis";

// 🚦 Check if user can request OTP (smart rate limiting)
export async function canRequestOTP(phone: string): Promise<RateLimitCheck> {
  const now = Date.now();
  const limit = await redisRate.get(phone);

  // ✨ First request - allow immediately
  if (!limit) {
    await redisRate.set(
      phone,
      { count: 1, windowStart: now, lastSent: now },
      Math.ceil(OTP_CFG.WINDOW / 1000)
    );
    return { allowed: true, remaining: OTP_CFG.MAX_SENDS - 1 };
  }

  const timeSinceLastRequest = now - limit.lastSent;
  const timeSinceWindowStart = now - limit.windowStart;

  // ⏱️ Throttle check - minimum 30s between requests
  if (timeSinceLastRequest < OTP_CFG.THROTTLE) {
    const waitTime = Math.ceil((OTP_CFG.THROTTLE - timeSinceLastRequest) / 1000);
    return { allowed: false, reason: "throttle", waitTime };
  }

  // 🔄 Reset window if expired
  if (timeSinceWindowStart >= OTP_CFG.WINDOW) {
    await redisRate.set(
      phone,
      { count: 1, windowStart: now, lastSent: now },
      Math.ceil(OTP_CFG.WINDOW / 1000)
    );
    return { allowed: true, remaining: OTP_CFG.MAX_SENDS - 1 };
  }

  // 🚫 Max requests exceeded in current window
  if (limit.count >= OTP_CFG.MAX_SENDS) {
    const windowRemaining = OTP_CFG.WINDOW - timeSinceWindowStart;
    const waitTime = Math.ceil(windowRemaining / 1000);
    return { allowed: false, reason: "max_sends", waitTime };
  }

  // ✅ Allow and increment counter
  await redisRate.set(
    phone,
    {
      count: limit.count + 1,
      windowStart: limit.windowStart,
      lastSent: now,
    },
    Math.ceil((OTP_CFG.WINDOW - timeSinceWindowStart) / 1000)
  );

  return { allowed: true, remaining: OTP_CFG.MAX_SENDS - limit.count - 1 };
}

// 📨 Generate and store OTP
export async function createOTP(phone: string): Promise<string> {
  const code = generateOTP(OTP_CFG.CODE_LENGTH);
  const hashed = hash(code);
  await redisOTP.set(phone, hashed, OTP_CFG.TTL);
  return code;
}

// ✅ Verify OTP code
export async function verifyOTP(phone: string, code: string): Promise<VerifyResult> {
  const data = await redisOTP.get(phone);

  // ❌ No OTP found or expired
  if (!data) {
    return { success: false, error: "کد تایید یافت نشد یا منقضی شده" };
  }

  // ⏰ Expired check
  if (Date.now() > data.expiresAt) {
    await redisOTP.delete(phone);
    return { success: false, error: "کد تایید منقضی شده است" };
  }

  // 🚫 Max attempts exceeded
  if (data.attempts >= OTP_CFG.MAX_ATTEMPTS) {
    await Promise.all([redisOTP.delete(phone), redisRate.delete(phone)]);
    return { success: false, error: "تعداد تلاش‌های مجاز به پایان رسید" };
  }

  // 🔐 Verify code
  const isValid = safeCompare(data.hash, hash(code));

  if (isValid) {
    // ✨ Success - clean up both OTP and rate limit
    await Promise.all([redisOTP.delete(phone), redisRate.delete(phone)]);
    return { success: true };
  }

  // ❌ Invalid code - increment attempts
  data.attempts++;
  const attemptsLeft = OTP_CFG.MAX_ATTEMPTS - data.attempts;

  // 🚫 Last attempt failed - show final error and cleanup
  if (attemptsLeft === 0) {
    await Promise.all([redisOTP.delete(phone), redisRate.delete(phone)]);
    return {
      success: false,
      error: "تعداد تلاش‌های مجاز به پایان رسید",
      attemptsLeft: 0
    };
  }

  // ⚠️ Still have attempts left - update and show remaining
  await redisOTP.update(phone, data);
  return {
    success: false,
    error: `کد تایید نادرست است (${attemptsLeft} تلاش باقی‌مانده)`,
    attemptsLeft,
  };
}
