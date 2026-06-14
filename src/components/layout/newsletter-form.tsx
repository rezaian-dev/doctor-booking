"use client";

import { useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/** 📧 Newsletter subscription form — built entirely on shadcn/ui primitives */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState(""); // ✉️ controlled email value
  const [loading, setLoading] = useState(false); // ⏳ in-flight flag

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ✅ Lazy-load validation + toast on submit → keeps zod (~288KB) and sonner out of the
    //    initial bundle (the footer renders on the form-less homepage). Paid only on submit.
    const [{ newsletterSchema }, { toast }] = await Promise.all([
      import("@/lib/validations/newsletter"),
      import("sonner"),
    ]);
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error("آدرس ایمیل معتبر وارد کنید");
      return;
    }

    setLoading(true);
    try {
      // 🚀 Submit to the newsletter endpoint
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        // ⚠️ Already-subscribed → warning toast (⚠️ icon); brand-new → success toast
        if (data.code === "ALREADY_SUBSCRIBED") {
          toast.warning(data.message ?? "این ایمیل قبلاً ثبت شده است");
        } else {
          toast.success(data.message ?? "ایمیل شما با موفقیت ثبت شد");
        }
        setEmail(""); // 🧹 reset field either way
      } else {
        toast.error(data.error ?? "خطا در ثبت ایمیل، دوباره تلاش کنید");
      }
    } catch {
      // 🔌 Network / server unreachable
      toast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "bg-custom-blue/8 rounded-[12px] flex flex-col gap-y-2.5",
        compact ? "mt-6 max-w-92.5 p-4" : "max-w-92.5 px-8 py-6",
      )}
    >
      <h4 className="text-base/7 text-dark-blue">مشترک شوید</h4>

      <form
        onSubmit={handleSubmit}
        className="flex items-center border-[1.5px] border-light-gray bg-white rounded-[6px] h-11 overflow-hidden"
      >
        {/* 📨 shadcn Input — neutralized chrome so it blends into the pill wrapper */}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="آدرس ایمیل"
          aria-label="آدرس ایمیل"
          disabled={loading}
          className="h-full flex-1 rounded-none border-0 bg-transparent px-3 text-sm text-dark-blue shadow-none placeholder:text-medium-gray focus-visible:ring-0 focus-visible:border-0 disabled:opacity-60"
        />

        {/* 🔘 shadcn Button — default variant already matches primary-500 → 600 */}
        <Button
          type="submit"
          disabled={loading}
          aria-label="ثبت ایمیل"
          className="h-11 w-13 shrink-0 cursor-pointer rounded-l-[10px] rounded-r-none"
        >
          {/* 🔄 Spinner while submitting, arrow otherwise */}
          {loading ? (
            <LoaderCircle size={20} color="#fff" className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowLeft size={24} color="#fff" aria-hidden="true" />
          )}
        </Button>
      </form>

      <p className={cn("text-medium-gray mt-2", compact ? "text-[13px]" : "text-sm/7")}>
        اپلیکیشن رزرو نوبت برای گرفتن نوبت سریع و غیرحضوری و بهترین دکترهای متخصص با دکتر رزرو.
      </p>
    </div>
  );
}
