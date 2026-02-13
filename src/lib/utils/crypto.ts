import { createHash, timingSafeEqual } from 'crypto';
import { customAlphabet } from 'nanoid';
import { OTP_CFG } from '../otp/config';

const nanoid = customAlphabet('0123456789', OTP_CFG.CODE_LENGTH);

// 🎲 Generate random numeric OTP
export function generateOTP(): string {
  return nanoid();
}

// 🔒 Hash OTP with SHA-256
export function hashOTP(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

// ⚖️ Timing-safe hash comparison
export function compareOTP(hash1: string, hash2: string): boolean {
  try {
    const buf1 = Buffer.from(hash1, 'hex');
    const buf2 = Buffer.from(hash2, 'hex');
    return buf1.length === buf2.length && timingSafeEqual(buf1, buf2);
  } catch {
    return false;
  }
}
