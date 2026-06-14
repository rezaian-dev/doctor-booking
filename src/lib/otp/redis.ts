import { OTPData, RateLimit } from '@/types/otp';
import { Redis } from '@upstash/redis';

// Guard: if env vars are absent (CI, misconfigured deploy), skip Redis entirely
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const isConfigured = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const redis = isConfigured
  ? new Redis({ url: UPSTASH_URL!, token: UPSTASH_TOKEN! })
  : null;

// Single dedup-warning — never spam logs on every request
let warnedOnce = false;
function warnMissingOnce() {
  if (warnedOnce) return;
  warnedOnce = true;
  console.warn('[OTP Redis] UPSTASH_REDIS_REST_URL / TOKEN missing — rate-limit disabled.');
}

// Safe wrapper: returns null on any Redis error instead of throwing
async function safeGet<T>(key: string): Promise<T | null> {
  if (!redis) { warnMissingOnce(); return null; }
  try {
    return await redis.get<T>(key);
  } catch (err) {
    console.error('[OTP Redis] get error →', err instanceof Error ? err.message : err);
    return null;
  }
}

// Returns true only when the value is actually persisted — callers can decide
// whether a failed write is fatal (OTP storage) or best-effort (rate-limit).
async function safeSetex(key: string, ttl: number, value: unknown): Promise<boolean> {
  if (!redis) { warnMissingOnce(); return false; }
  try {
    await redis.setex(key, ttl, value);
    return true;
  } catch (err) {
    console.error('[OTP Redis] setex error →', err instanceof Error ? err.message : err);
    return false;
  }
}

async function safeDel(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[OTP Redis] del error →', err instanceof Error ? err.message : err);
  }
}

// OTP storage operations
export const setOTP = (phone: string, data: OTPData, ttl: number) =>
  safeSetex(`otp:${phone}`, ttl, data);

export const getOTP = (phone: string) => safeGet<OTPData>(`otp:${phone}`);

export const deleteOTP = (phone: string) => safeDel(`otp:${phone}`);

// Rate-limit storage operations
export const setRateLimit = (phone: string, data: RateLimit, ttl: number) =>
  safeSetex(`rate:${phone}`, ttl, data);

export const getRateLimit = (phone: string) => safeGet<RateLimit>(`rate:${phone}`);

export const deleteRateLimit = (phone: string) => safeDel(`rate:${phone}`);
