import { RateLimit } from '@/types/otp';
import { OTP_CFG } from './config';
import { getRateLimit, setRateLimit } from './redis';

// 🚦 Check rate-limit before sending
export async function checkRateLimit(phone: string) {
  const now = Date.now();
  const state = await getRateLimit(phone);

  // 🆕 First request allowed
  if (!state) return { allowed: true, remaining: OTP_CFG.MAX_SENDS - 1 };

  // ⏱️ Enforce throttle window
  const timeSinceLastSent = now - state.lastSent;
  if (timeSinceLastSent < OTP_CFG.THROTTLE) {
    return {
      allowed: false,
      reason: 'throttle' as const,
      waitTime: Math.ceil((OTP_CFG.THROTTLE - timeSinceLastSent) / 1000),
    };
  }

  // 🔄 Reset if window expired
  const windowElapsed = now - state.windowStart;
  if (windowElapsed >= OTP_CFG.WINDOW) {
    return { allowed: true, remaining: OTP_CFG.MAX_SENDS - 1 };
  }

  // 📊 Check burst limit
  if (state.count >= OTP_CFG.MAX_SENDS) {
    return { allowed: false, reason: 'max_sends' as const };
  }

  return { allowed: true, remaining: OTP_CFG.MAX_SENDS - state.count - 1 };
}

// ➕ Increment counter after send
export async function incrementRateLimit(phone: string) {
  const now = Date.now();
  const state = await getRateLimit(phone);

  const newState: RateLimit =
    !state || now - state.windowStart >= OTP_CFG.WINDOW
      ? { count: 1, windowStart: now, lastSent: now }
      : { ...state, count: state.count + 1, lastSent: now };

  await setRateLimit(phone, newState, Math.ceil(OTP_CFG.WINDOW / 1000));
}
