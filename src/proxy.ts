import { NextResponse }                  from "next/server";
import type { NextRequest }              from "next/server";
import { createAccessToken,
         verifyRefreshToken,
         verifyAccessToken }             from "@/lib/auth/jwt";
import { setAccessCookie,
         setSessionHintCookie,
         clearSessionHintCookie }        from "@/lib/auth/cookies";
import { SESSION_HINT_COOKIE }           from "@/lib/auth/session-hint";

// 🌐 Edge-safe proxy (Next.js 16, replaces middleware) — JWT-only via `jose`, no DB imports here
// 🔒 DB-backed role/ban checks live in the Node layer (admin layout + route handlers)

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const goTo = (req: NextRequest, path: string) =>
  NextResponse.redirect(new URL(path, req.url));

/* ── Proxy ───────────────────────────────────────────────────────────────── */
// ✅ Next.js 16: fn must be named "proxy"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken  = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // ✅ Ban page must stay reachable
  if (pathname === "/auth/banned") return NextResponse.next();

  // 🔄 Silent refresh: access expired but refresh valid → mint new access (role rides in refresh, no DB)
  if (!accessToken && refreshToken) {
    const payload = await verifyRefreshToken(refreshToken).catch(() => null);

    if (payload?.userId) {
      const role = typeof payload.role === "string" ? payload.role : "user";

      // 🛡️ Non-admins cannot access /admin
      if (pathname.startsWith("/admin") && role !== "admin") return goTo(req, "/");

      const newToken = await createAccessToken(String(payload.userId), role);

      // 🩹 Forward fresh token on the request cookie too, so /api/auth/me & SSR read it instantly ✨
      const forwardedCookie = req.cookies
        .getAll()
        .filter((c) => c.name !== "accessToken")     // drop stale one
        .map((c) => `${c.name}=${c.value}`)
        .concat(`accessToken=${newToken}`)            // 🍪 inject fresh token
        .join("; ");

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("cookie", forwardedCookie);

      const res = NextResponse.next({ request: { headers: requestHeaders } });
      setAccessCookie(res, newToken);    // 🍪 persist for next requests
      setSessionHintCookie(res);         // 🪪 ensure header hint exists
      return res;
    }

    // 🚫 Invalid refresh + hitting /admin → login
    if (pathname.startsWith("/admin")) return goTo(req, "/auth/login");
  }

  // 🔒 Admin guard — optimistic JWT check (live role re-verified in admin layout via DB)
  if (pathname.startsWith("/admin")) {
    if (!accessToken) return goTo(req, "/auth/login");

    const payload = await verifyAccessToken(accessToken).catch(() => null);
    if (!payload?.userId) return goTo(req, "/auth/login");
    if (payload.role !== "admin") return goTo(req, "/");
  }

  // 👤 Profile requires auth; ban enforced in the Node data layer
  if (pathname.startsWith("/profile")) {
    if (!accessToken && !refreshToken) return goTo(req, "/auth/login");
  }

  // 🏠 Logged-in guard for /auth/* lives in a client component (RedirectIfAuthenticated):
  //    a proxy redirect would force a full document reload, so we soft-nav there instead 🧠

  // 🪪 Keep the client-readable session hint in sync each navigation (no flash, no extra verify):
  //    token but no hint → backfill • no token but stale hint → clear (self-heal)
  const hasToken = Boolean(accessToken || refreshToken);
  const hasHint  = Boolean(req.cookies.get(SESSION_HINT_COOKIE)?.value);
  if (hasToken === hasHint) return NextResponse.next(); // ✅ already consistent

  const res = NextResponse.next();
  if (hasToken) setSessionHintCookie(res);
  else          clearSessionHintCookie(res);
  return res;
}

/* ── Matcher ─────────────────────────────────────────────────────────────── */
// 🧱 Skip static files, images & favicon

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
