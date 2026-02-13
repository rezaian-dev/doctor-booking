// 🔑 Stored OTP data structure
export interface OTPData {
  hash: string;
  attempts: number;
  createdAt: number;
  expiresAt: number;
}

// 🚦 Rate-limit tracking per phone
export interface RateLimit {
  count: number;
  windowStart: number;
  lastSent: number;
}

// ✅ Rate-limit check result
export interface RateLimitCheck {
  allowed: boolean;
  reason?: 'throttle' | 'max_sends';
  waitTime?: number;
  remaining?: number;
}

// ✅ OTP verification result
export interface VerifyResult {
  success: boolean;
  error?: string;
  attemptsLeft?: number;
}
