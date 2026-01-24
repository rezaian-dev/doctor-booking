import * as yup from 'yup';

/**
 * 📬 Contact Form Validation Schema
 * Enforces Persian-only full name, valid email, Iranian mobile number,
 * required request type, and a message with length constraints.
 */
export const contactSchema = yup.object().shape({
  // 👤 Full name: Persian letters and spaces only, min 3 characters
  fullName: yup
    .string()
    .required('نام و نام خانوادگی الزامی است')
    .min(3, 'حداقل ۳ کاراکتر وارد کنید')
    .matches(/^[\u0600-\u06FF\s]+$/, 'فقط از حروف فارسی استفاده کنید'),

  // 🗂️ Request type: must be selected (non-empty string)
  requestType: yup
    .string()
    .required('لطفا نوع درخواست را انتخاب کنید')
    .notOneOf([''], 'نوع درخواست الزامی است'),

  // ✉️ Email: standard format validation
  email: yup
    .string()
    .required('ایمیل الزامی است')
    .email('فرمت ایمیل نامعتبر است'),

  // 📱 Phone: Iranian mobile number (starts with 09, exactly 11 digits)
  phone: yup
    .string()
    .required('شماره تماس الزامی است')
    .matches(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد'),

  // 💬 Message: between 10–500 characters
  message: yup
    .string()
    .required('متن پیام الزامی است')
    .min(10, 'متن پیام باید حداقل ۱۰ کاراکتر باشد')
    .max(500, 'متن پیام نباید بیشتر از ۵۰۰ کاراکتر باشد'),
});

// 💡 Auto-inferred TypeScript type for type-safe form handling
export type ContactFormInput = yup.InferType<typeof contactSchema>;
