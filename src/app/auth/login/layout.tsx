import type { Metadata } from "next";
import type { ReactNode } from "react";

// 🏷️ Login is a client component (no metadata export), so the <title> is owned here.
//    absolute skips the parent %s | دکتر رزرو template → exactly one brand. 🧠✨
export const metadata: Metadata = {
  title: { absolute: "ورود | دکتر رزرو" },
  description: "ورود به سامانه نوبت‌دهی آنلاین دکتر رزرو.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
