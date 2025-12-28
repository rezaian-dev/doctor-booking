import * as yup from 'yup';
// 🔐 Comprehensive validation schema
export const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('نام الزامی است')
    .min(2, 'نام باید حداقل ۲ حرف باشد')
    .max(50, 'نام نباید بیشتر از ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'فقط حروف فارسی یا انگلیسی'),

  lastName: yup
    .string()
    .required('نام خانوادگی الزامی است')
    .min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد')
    .max(50, 'نام خانوادگی نباید بیشتر از ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'فقط حروف فارسی یا انگلیسی'),

  nationalCode: yup
    .string()
    .required('کد ملی الزامی است')
    .matches(/^[۰-۹0-9]{10}$/, 'کد ملی باید ۱۰ رقم باشد')
    .test('valid-code', 'کد ملی نامعتبر است', (value) => {
      if (!value) return false;
      const code = value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
      if (code.length !== 10) return false;
      const check = parseInt(code[9]);
      const sum = code.split('').slice(0, 9).reduce((acc, digit, i) => acc + parseInt(digit) * (10 - i), 0);
      const remainder = sum % 11;
      return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
    }),

  birthDate: yup
    .string()
    .required('تاریخ تولد الزامی است')
    .matches(/^[۰-۹0-9]{4}\/[۰-۹0-9]{2}\/[۰-۹0-9]{2}$/, 'فرمت صحیح: ۱۳۶۷/۱۲/۲۲')
    .test('valid-date', 'تاریخ تولد نامعتبر است', (value) => {
      if (!value) return false;
      const parts = value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).split('/');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      return year >= 1300 && year <= 1390 && month >= 1 && month <= 12 && day >= 1 && day <= 31;
    }),

  gender: yup
    .string()
    .required('جنسیت الزامی است')
    .oneOf(['آقا', 'خانم'], 'جنسیت باید آقا یا خانم باشد'),

  city: yup
    .string()
    .required('شهر الزامی است')
    .min(2, 'نام شهر باید حداقل ۲ حرف باشد')
    .max(50, 'نام شهر نباید بیشتر از ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'فقط حروف فارسی یا انگلیسی'),

  email: yup
    .string()
    .required('ایمیل الزامی است')
    .email('فرمت ایمیل نامعتبر است')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'ایمیل باید به فرمت صحیح باشد'),

  mobile: yup
    .string()
    .required('شماره موبایل الزامی است')
    .matches(/^[۰-۹0-9]{11}$/, 'شماره موبایل باید ۱۱ رقم باشد')
    .test('starts-with-09', 'شماره باید با ۰۹ شروع شود', (value) => {
      if (!value) return false;
      const mobile = value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
      return mobile.startsWith('09');
    })
});
