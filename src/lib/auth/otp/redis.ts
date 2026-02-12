import { OTPData, RateLimit } from "@/types/otp.types";
import { Redis } from "@upstash/redis";

// 🔌 Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 🔑 Key generators
const key = {
  otp: (phone: string) => `otp:${phone}`,
  rate: (phone: string) => `rate:${phone}`,
};

// 📝 OTP Redis operations
export const redisOTP = {
  async set(phone: string, hash: string, ttl: number): Promise<void> {
    const data: OTPData = {
      hash,
      attempts: 0,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl * 1000,
    };
    await redis.setex(key.otp(phone), ttl, data);
  },

  async get(phone: string): Promise<OTPData | null> {
    return redis.get<OTPData>(key.otp(phone));
  },

  async update(phone: string, data: OTPData): Promise<void> {
    const ttl = await redis.ttl(key.otp(phone));
    if (ttl > 0) {
      await redis.setex(key.otp(phone), ttl, data);
    }
  },

  async delete(phone: string): Promise<void> {
    await redis.del(key.otp(phone));
  },
};

// 🚦 Rate limit Redis operations
export const redisRate = {
  async get(phone: string): Promise<RateLimit | null> {
    return redis.get<RateLimit>(key.rate(phone));
  },

  async set(phone: string, data: RateLimit, ttl: number): Promise<void> {
    await redis.setex(key.rate(phone), ttl, data);
  },

  async delete(phone: string): Promise<void> {
    await redis.del(key.rate(phone));
  },
};
