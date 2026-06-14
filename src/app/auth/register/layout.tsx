import type { Metadata } from "next";
import type { ReactNode } from "react";

// 🏷️ Same as login — this client page owns its <title>. `absolute` = a single brand,
//    and the correct word ("ثبت‌نام", not the inherited "ورود"). 🧠✨
export const metadata: Metadata = {
  title: { absolute: "ثبت‌نام | دکتر رزرو" },
  description: "ثبت‌نام در سامانه نوبت‌دهی آنلاین دکتر رزرو.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
