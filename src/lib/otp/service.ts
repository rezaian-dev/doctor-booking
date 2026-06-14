import { OTP_CFG } from './config';
import { generateOTP, hashOTP, compareOTP } from '../utils/crypto';
import { getOTP, setOTP, deleteOTP, deleteRateLimit } from './redis';
import { checkRateLimit, incrementRateLimit } from './limiter';
import { RateLimitError } from './errors';
import { VerifyResult } from '@/types/otp';

// 🎟️ Generate, store, and return a fresh OTP (caller sends it via SMS)
export async function createOTP(phone: string): Promise<string> {
  const check = await checkRateLimit(phone);

  if (!check.allowed) {
    // 🚦 Typed error so routes answer 429 (rate-limit) instead of 500 (infra)
    throw new RateLimitError(
      check.reason === 'throttle'
        ? `لطفاً ${check.waitTime} ثانیه تا درخواست مجدد صبر کنید.`
        : 'تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.'
    );
  }

  const code = generateOTP();
  const now = Date.now();

  // 🛑 Persist BEFORE returning. If the write fails we must NOT send an SMS —
  //    an un-stored code always reads back as "expired/invalid" on verify.
  const stored = await setOTP(
    phone,
    { hash: hashOTP(code), attempts: 0, createdAt: now, expiresAt: now + OTP_CFG.TTL * 1000 },
    OTP_CFG.TTL
  );
  if (!stored) {
    throw new Error('سرویس ارسال کد موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.');
  }

  await incrementRateLimit(phone);
  return code;
}

// 🔐 Verify an OTP. 3 wrong tries invalidate the code → user must request a new one.
export async function verifyOTP(phone: string, code: string): Promise<VerifyResult> {
  const stored = await getOTP(phone);

  // 🚫 No active code (never sent, already used, or wiped)
  if (!stored) {
    return { success: false, error: 'کد نامعتبر است. لطفاً کد جدید درخواست کنید.', requireResend: true };
  }

  // ⌛ Expired by time
  if (Date.now() > stored.expiresAt) {
    await deleteOTP(phone);
    return { success: false, error: 'کد منقضی شده است. لطفاً کد جدید درخواست کنید.', requireResend: true };
  }

  // ✅ Correct → consume the code and clear the rate-limit
  if (compareOTP(stored.hash, hashOTP(code))) {
    await Promise.all([deleteOTP(phone), deleteRateLimit(phone)]);
    return { success: true };
  }

  // ❌ Wrong → count the attempt; invalidate once the limit is reached
  const attempts = stored.attempts + 1;
  if (attempts >= OTP_CFG.MAX_ATTEMPTS) {
    await deleteOTP(phone);
    return {
      success: false,
      error: 'به دلیل تلاش‌های ناموفق، کد باطل شد. لطفاً کد جدید درخواست کنید.',
      requireResend: true,
    };
  }

  // 💾 Re-store with the SAME remaining TTL (never extend the code's lifetime)
  const remaining = Math.max(1, Math.ceil((stored.expiresAt - Date.now()) / 1000));
  await setOTP(phone, { ...stored, attempts }, remaining);

  return {
    success: false,
    error: 'کد وارد شده نادرست است.',
    attemptsLeft: OTP_CFG.MAX_ATTEMPTS - attempts,
  };
}
