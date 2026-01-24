import * as yup from 'yup';

/**
 * 🔐 Comprehensive Profile Validation Schema
 * Supports Persian/English characters, Persian/Arabic digits,
 * and validates Iranian-specific fields (national code, birth date, mobile).
 */

// 🔄 Helper: Normalize Persian/Arabic digits to Latin digits
const normalizeDigits = (str: string): string =>
  str.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

export const profileSchema = yup.object().shape({
  // 👤 First name: Persian/English letters and spaces only
  firstName: yup
    .string()
    .required('نام الزامی است')
    .min(2, 'نام باید حداقل ۲ حرف باشد')
    .max(50, 'نام نباید بیشتر از ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'فقط حروف فارسی یا انگلیسی'),

  // 👤 Last name: Persian/English letters and spaces only
  lastName: yup
    .string()
    .required('نام خانوادگی الزامی است')
    .min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد')
    .max(50, 'نام خانوادگی نباید بیشتر از ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'فقط حروف فارسی یا انگلیسی'),

  // 🪪 National Code (Iran): 10-digit validation with algorithmic check
  nationalCode: yup
    .string()
    .required('کد ملی الزامی است')
    .matches(/^[۰-۹0-9]{10}$/, 'کد ملی باید ۱۰ رقم باشد')
    .test('valid-national-code', 'کد ملی نامعتبر است', (value) => {
      if (!value) return false;
      const code = normalizeDigits(value);
      if (code.length !== 10) return false;

      const checkDigit = parseInt(code[9], 10);
      const sum = code
        .slice(0, 9)
        .split('')
        .reduce((acc, digit, i) => acc + parseInt(digit, 10) * (10 - i), 0);

      const remainder = sum % 11;
      return (remainder < 2 && checkDigit === remainder) ||
             (remainder >= 2 && checkDigit === 11 - remainder);
    }),

  // 📅 Birth Date (Persian calendar): format YYYY/MM/DD, years 1300–1390
  birthDate: yup
    .string()
    .required('تاریخ تولد الزامی است')
    .matches(/^[۰-۹0-9]{4}\/[۰-۹0-9]{2}\/[۰-۹0-9]{2}$/, 'فرمت صحیح: ۱۳۶۷/۱۲/۲۲')
    .test('valid-persian-date', 'تاریخ تولد نامعتبر است', (value) => {
      if (!value) return false;
      const [yearStr, monthStr, dayStr] = value.split('/');
      const year = parseInt(normalizeDigits(yearStr), 10);
      const month = parseInt(normalizeDigits(monthStr), 10);
      const day = parseInt(normalizeDigits(dayStr), 10);

      return (
        year >= 1300 &&
        year <= 1390 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
      );
    }),

  // ♀️♂️ Gender: strictly 'آقا' or 'خانم'
  gender: yup
    .string()
    .required('جنسیت الزامی است')
    .oneOf(['آقا', 'خانم'], 'جنسیت باید آقا یا خانم باشد'),

  // 🏙️ City: Persian/English letters and spaces
  city: yup
    .string()
    .required('شهر الزامی است')
    .min(2, 'نام شهر باید حداقل ۲ حرف باشد')
    .max(50, 'نام شهر نباید بیشتر از ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'فقط حروف فارسی یا انگلیسی'),

  // ✉️ Email: standard RFC-compliant format
  email: yup
    .string()
    .required('ایمیل الزامی است')
    .email('فرمت ایمیل نامعتبر است')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'ایمیل باید به فرمت صحیح باشد'),

  // 📱 Mobile: Iranian number (11 digits, starts with 09), supports Persian digits
  mobile: yup
    .string()
    .required('شماره موبایل الزامی است')
    .matches(/^[۰-۹0-9]{11}$/, 'شماره موبایل باید ۱۱ رقم باشد')
    .test('starts-with-09', 'شماره باید با ۰۹ شروع شود', (value) => {
      if (!value) return false;
      const normalized = normalizeDigits(value);
      return normalized.startsWith('09');
    }),
});

// 💡 Auto-inferred TypeScript type for type-safe form handling
export type ProfileFormData = yup.InferType<typeof profileSchema>;
