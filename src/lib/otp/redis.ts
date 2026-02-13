import { OTPData, RateLimit } from '@/types/otp';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 💾 OTP storage operations
export const setOTP = (phone: string, data: OTPData, ttl: number) =>
  redis.setex(`otp:${phone}`, ttl, data);

export const getOTP = (phone: string) => redis.get<OTPData>(`otp:${phone}`);

export const deleteOTP = (phone: string) => redis.del(`otp:${phone}`);

// 🚦 Rate-limit storage operations
export const setRateLimit = (phone: string, data: RateLimit, ttl: number) =>
  redis.setex(`rate:${phone}`, ttl, data);

export const getRateLimit = (phone: string) => redis.get<RateLimit>(`rate:${phone}`);

export const deleteRateLimit = (phone: string) => redis.del(`rate:${phone}`);
