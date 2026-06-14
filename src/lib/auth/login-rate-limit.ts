// 🛡️ Brute-force protection for /api/auth/login. Reuses the existing Upstash Redis +
//    @upstash/ratelimit — no new dependency, no new infra.
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

// ⚙️ Read Upstash creds without non-null assertions; when absent (local dev, deleted DB, CI)
//    we skip rate limiting instead of building a client that throws on every login. 🤫
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const isConfigured = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

// 🚦 8 attempts / 5 min per IP — stops brute-force & credential stuffing while staying fine
//    for a human mistyping. null when Upstash isn't configured → the check short-circuits. 🔌
const loginRateLimit = isConfigured
  ? new Ratelimit({
      redis: new Redis({ url: UPSTASH_URL!, token: UPSTASH_TOKEN! }),
      limiter: Ratelimit.slidingWindow(8, "5 m"),
      prefix: "rl:login",
      analytics: false,
    })
  : null;

// 🔇 Warn at most ONCE per process. A dead Upstash host must not spit a full stack
//    trace into the server console on every single login attempt. ✨
let warnedDegraded = false;
function warnDegradedOnce(err: unknown) {
  if (warnedDegraded) return;
  warnedDegraded = true;
  const reason = err instanceof Error ? err.message : String(err);
  console.warn(`⚠️ [loginRateLimit] disabled (fail-open) — Upstash unreachable: ${reason}`);
}

// 🌐 Best-effort client IP — x-forwarded-for is set by Vercel/most proxies (first hop = client)
export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// ✅ Returns { ok:true } when allowed or { ok:false, retryAfter } when throttled. 🛟 Fails OPEN
//    when Upstash is missing/errors — an outage must never lock users out (password is the gate).
export async function checkLoginRateLimit(
  ip: string,
): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  // ⚙️ Not configured → no network call, no noise. Password check still guards login.
  if (!loginRateLimit) return { ok: true };

  try {
    const { success, reset } = await loginRateLimit.limit(ip);
    if (success) return { ok: true };
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return { ok: false, retryAfter };
  } catch (err) {
    warnDegradedOnce(err); // 🔇 one clean line, not a repeated stack trace
    return { ok: true }; // 🛟 availability over strictness on infra failure
  }
}
