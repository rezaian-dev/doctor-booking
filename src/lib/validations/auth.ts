import * as yup from 'yup';

// 📱 Iranian mobile number: must start with '09' and be exactly 11 digits
const phoneRegex = /^09\d{9}$/;

// 🇮🇷 Persian name: only Persian letters and spaces allowed
const persianNameRegex = /^[\u0600-\u06FF\s]+$/;

// ✉️ Basic email format validator (complements Yup’s built-in `.email()`)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 🔑 Login Schema (Phone-only)
 * Validates the user's Iranian mobile number for OTP-based login.
 */
export const loginPhoneSchema = yup.object().shape({
  phone: yup
    .string()
    .required('شماره موبایل الزامی است')
    .matches(phoneRegex, 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود')
    .length(11, 'شماره موبایل باید ۱۱ رقم باشد'),
});

/**
 * 📝 Signup Schema
 * Validates full name (Persian only), Iranian phone number, and standard email format.
 */
export const signupSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('نام الزامی است')
    .matches(persianNameRegex, 'نام باید فقط شامل حروف فارسی باشد')
    .min(2, 'نام باید حداقل ۲ حرف باشد')
    .max(50, 'نام نباید بیشتر از ۵۰ حرف باشد'),
  lastName: yup
    .string()
    .required('نام خانوادگی الزامی است')
    .matches(persianNameRegex, 'نام خانوادگی باید فقط شامل حروف فارسی باشد')
    .min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد')
    .max(50, 'نام خانوادگی نباید بیشتر از ۵۰ حرف باشد'),
  phone: yup
    .string()
    .required('شماره موبایل الزامی است')
    .matches(phoneRegex, 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود')
    .length(11, 'شماره موبایل باید ۱۱ رقم باشد'),
  email: yup
    .string()
    .required('ایمیل الزامی است')
    .matches(emailRegex, 'فرمت ایمیل صحیح نیست')
    .email('فرمت ایمیل صحیح نیست'),
});

/**
 * 🔐 OTP Verification Schema
 * Ensures the input is a 5-digit numeric code.
 */
export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required('کد تأیید الزامی است')
    .length(5, 'کد تأیید باید ۵ رقم باشد')
    .matches(/^\d{5}$/, 'کد تأیید باید فقط شامل اعداد باشد'),
});

// 💡 Auto-inferred TypeScript types for type-safe form handling
export type LoginPhoneInput = yup.InferType<typeof loginPhoneSchema>;
export type SignupInput = yup.InferType<typeof signupSchema>;
export type OtpInput = yup.InferType<typeof otpSchema>;
