import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

/**
 * 🎯 Centralized Toast Notification Handlers
 * Ensures consistent, accessible, and user-friendly feedback across the app.
 * All messages are localized in Persian for end-users.
 */

// ✅ Success: OTP sent
export const showOtpSentSuccess = (phone: string) => {
  toast.success('کد تأیید ارسال شد', {
    description: `کد به شماره ${phone} پیامک شد`,
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    duration: 4000,
  });
};

// 🔁 Success: OTP resent
export const showOtpResendSuccess = () => {
  toast.success('کد مجدداً ارسال شد', {
    description: 'کد جدید به شماره شما پیامک شد',
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    duration: 3000,
  });
};

// 🎉 Success: Signup completed
export const showSignupSuccess = (firstName: string) => {
  toast.success('ثبت‌نام موفقیت‌آمیز', {
    description: `${firstName} عزیز، به دکتر رزرو خوش آمدید! 🎉`,
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    duration: 3000,
  });
};

// 🚪 Success: Login completed
export const showLoginSuccess = () => {
  toast.success('ورود موفقیت‌آمیز', {
    description: 'به دکتر رزرو خوش آمدید! 🎉',
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    duration: 3000,
  });
};

// ❌ Error: OTP invalid
export const showInvalidOtpError = () => {
  toast.error('کد نامعتبر است', {
    description: 'کد وارد شده اشتباه است. دوباره تلاش کنید',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    duration: 4000,
  });
};

// ❌ Error: Failed to send OTP
export const showOtpSentError = () => {
  toast.error('خطا در ارسال کد', {
    description: 'لطفاً دوباره تلاش کنید',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    duration: 4000,
  });
};

// ❌ Error: Failed to resend OTP
export const showOtpResendError = () => {
  toast.error('خطا در ارسال مجدد', {
    description: 'لطفاً چند لحظه دیگر تلاش کنید',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  });
};

// ⚠️ Critical: System/server error
export const showSystemError = () => {
  toast.error('خطای سیستمی', {
    description: 'مشکلی در سرور رخ داده است',
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    duration: 5000,
  });
};
