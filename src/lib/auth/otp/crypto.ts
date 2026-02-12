import crypto from "crypto";

// 🎲 Generate random OTP code
export const generateOTP = (length: number = 5): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(crypto.randomInt(min, max + 1));
};

// 🔐 Hash OTP code with SHA-256
export const hash = (code: string): string => {
  return crypto.createHash("sha256").update(code).digest("hex");
};

// ✅ Timing-safe comparison to prevent timing attacks
export const safeCompare = (storedHash: string, providedHash: string): boolean => {
  try {
    const storedBuffer = Buffer.from(storedHash, "hex");
    const providedBuffer = Buffer.from(providedHash, "hex");

    if (storedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(storedBuffer, providedBuffer);
  } catch {
    return false;
  }
};
