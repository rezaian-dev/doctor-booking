"use client";

import { useState }               from "react";
import { useForm, Controller }    from "react-hook-form";
import { zodResolver }            from "@hookform/resolvers/zod";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button }   from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { contactSchema, type ContactFormInput } from "@/lib/validations/contact";
import { cn } from "@/lib/utils/cn";

const REQUEST_TYPES = [
  { value: "appointment",  label: "نوبت‌دهی"   },
  { value: "consultation", label: "مشاوره"     },
  { value: "support",      label: "پشتیبانی"   },
  { value: "complaint",    label: "شکایت"      },
  { value: "other",        label: "سایر موارد" },
] as const;

// ⚠️ Always-present error row (opacity transition, zero layout shift). Allows undefined
//    explicitly so callers can pass errors.field?.message under exactOptionalPropertyTypes.
function FieldError({ message }: { message?: string | undefined }) {
  return (
    <p
      role="alert"
      aria-live="polite"
      className="h-4 text-xs text-danger-500 transition-opacity duration-200"
      style={{ opacity: message ? 1 : 0 }}
    >
      {message ?? "\u200c"}
    </p>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { register, handleSubmit, formState: { errors }, reset, control } =
    useForm<ContactFormInput>({ resolver: zodResolver(contactSchema), mode: "onChange" });

  const onSubmit = async (data: ContactFormInput) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // ✅ Success screen
  if (status === "success") {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center min-h-80 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary-50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-secondary-600" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">پیام شما ارسال شد</h3>
        <p className="text-sm text-neutral-600 max-w-xs">تیم پشتیبانی دکتر رزرو در اسرع وقت پاسخ خواهد داد.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-neutral-900 mb-1">فرم تماس با ما</h2>
      <p className="text-sm text-neutral-600 mb-6">پیام خود را بنویسید — در اسرع وقت پاسخ می‌دهیم.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>

        {/* 👤 Full name */}
        <div>
          <Label htmlFor="fullName" className="mb-1.5 block">
            نام و نام خانوادگی <span className="text-danger-500">*</span>
          </Label>
          <Input
            id="fullName" dir="rtl" placeholder="مثال: علی احمدی"
            {...register("fullName")}
            className={cn(errors.fullName && "border-danger-400 focus-visible:ring-danger-200")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        {/* 📞 Phone number */}
        <div>
          <Label htmlFor="phone" className="mb-1.5 block">
            شماره تماس <span className="text-danger-500">*</span>
          </Label>
          <Input
            id="phone" dir="ltr" type="tel" placeholder="09xxxxxxxxx"
            {...register("phone")}
            className={cn(errors.phone && "border-danger-400 focus-visible:ring-danger-200")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        {/* ✉️ Email */}
        <div>
          <Label htmlFor="email" className="mb-1.5 block">
            ایمیل <span className="text-neutral-400 text-xs">(اختیاری)</span>
          </Label>
          <Input id="email" dir="ltr" type="email" placeholder="example@mail.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>

        {/* 🏷️ Request type */}
        <div>
          <Label className="mb-1.5 block">
            نوع درخواست <span className="text-danger-500">*</span>
          </Label>
          <Controller
            name="requestType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className={cn(
                    errors.requestType && "border-danger-400 ring-1 ring-danger-200 focus:ring-danger-200"
                  )}
                >
                  <SelectValue placeholder="انتخاب کنید..." />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.requestType?.message} />
        </div>

        {/* 💬 Message */}
        <div>
          <Label htmlFor="message" className="mb-1.5 block">
            متن پیام <span className="text-danger-500">*</span>
          </Label>
          <Textarea
            id="message" dir="rtl" rows={4} placeholder="پیام خود را بنویسید..."
            {...register("message")}
            className={cn(errors.message && "border-danger-400 focus-visible:ring-danger-200")}
          />
          <FieldError message={errors.message?.message} />
        </div>

        {/* ⚠️ Server error */}
        <p
          className="text-sm text-danger-500 text-center transition-opacity duration-200"
          style={{ opacity: status === "error" ? 1 : 0, minHeight: "1.25rem" }}
        >
          {status === "error" ? "خطایی رخ داد. دوباره تلاش کنید." : "\u200c"}
        </p>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm"
        >
          {status === "loading" ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "ارسال پیام"}
        </Button>
      </form>
    </div>
  );
}
