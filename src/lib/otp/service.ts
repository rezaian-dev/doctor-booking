import { OTP_CFG } from './config';
import { generateOTP, hashOTP, compareOTP } from '../utils/crypto';
import { getOTP, setOTP, deleteOTP, deleteRateLimit } from './redis';
import { checkRateLimit, incrementRateLimit } from './limiter';
import { VerifyResult } from '@/types/otp';

// 🎲 Generate and store OTP
export async function createOTP(phone: string): Promise<string> {
  const check = await checkRateLimit(phone);

  if (!check.allowed) {
    throw new Error(
      check.reason === 'throttle'
        ? `لطفاً ${check.waitTime} ثانیه صبر کنید.`
        : 'درخواست بیش از حد.'
    );
  }

  const code = generateOTP();
  const now = Date.now();

  await setOTP(
    phone,
    { hash: hashOTP(code), attempts: 0, createdAt: now, expiresAt: now + OTP_CFG.TTL * 1000 },
    OTP_CFG.TTL
  );

  await incrementRateLimit(phone);
  return code;
}

// ✅ Verify OTP with attempts tracking
export async function verifyOTP(phone: string, code: string): Promise<VerifyResult> {
  const stored = await getOTP(phone);
  if (!stored) return { success: false, error: 'کد منقضی یا نامعتبر' };

  // ⏰ Check expiration
  if (Date.now() > stored.expiresAt) {
    await deleteOTP(phone);
    return { success: false, error: 'کد منقضی شده' };
  }

  // 🔒 Check max attempts
  if (stored.attempts >= OTP_CFG.MAX_ATTEMPTS) {
    await deleteOTP(phone);
    return { success: false, error: 'تلاش بیش از حد' };
  }

  // 🔐 Timing-safe comparison
  if (!compareOTP(stored.hash, hashOTP(code))) {
    stored.attempts += 1;
    await setOTP(phone, stored, OTP_CFG.TTL);
    return {
      success: false,
      error: 'کد نادرست',
      attemptsLeft: OTP_CFG.MAX_ATTEMPTS - stored.attempts,
    };
  }

  // 🧹 Cleanup on success
  await Promise.all([deleteOTP(phone), deleteRateLimit(phone)]);
  return { success: true };
}
