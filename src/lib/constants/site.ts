// 🌐 Single source of truth for the site's absolute base URL. Resolution order (first wins) so
//    production never leaks localhost: 1) NEXT_PUBLIC_BASE_URL (explicit canonical domain, e.g.
//    https://doctorrezro.ir ⭐) 2) VERCEL_PROJECT_PRODUCTION_URL 3) VERCEL_URL 4) http://localhost:3000.
// 🧠 Consumed by metadataBase, canonical/OG, robots & sitemap → consistent absolute URLs everywhere.
// ⚠️ VERCEL_* fallbacks are server-only (no NEXT_PUBLIC_); for client use, set NEXT_PUBLIC_BASE_URL.

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  const onVercel = Boolean(process.env.VERCEL); // 🔺 set on every Vercel build & runtime
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelUrl = process.env.VERCEL_URL;

  // ⭐ Explicit override wins — except a localhost value while on Vercel (a stray
  //    NEXT_PUBLIC_BASE_URL=http://localhost:3000 must never leak into production canonical/OG tags). 🧠
  const explicitIsLocal = !explicit || /localhost|127\.0\.0\.1/.test(explicit);
  if (explicit && !(onVercel && explicitIsLocal)) return explicit;

  if (vercelProd) return `https://${vercelProd}`; // 🌍 stable production alias
  if (vercelUrl) return `https://${vercelUrl}`; // 🔁 per-deployment (preview)
  return explicit || "http://localhost:3000"; // 🖥️ local dev
}

export const SITE_URL = resolveSiteUrl();
