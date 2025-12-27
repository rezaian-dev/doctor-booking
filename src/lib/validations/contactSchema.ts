import * as yup from 'yup';

export const contactSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('نام و نام خانوادگی الزامی است')
    .min(3, 'حداقل ۳ کاراکتر وارد کنید')
    .matches(/^[\u0600-\u06FF\s]+$/, 'فقط از حروف فارسی استفاده کنید'),
  requestType: yup
    .string()
    .required('لطفا نوع درخواست را انتخاب کنید')
    .notOneOf([''], 'نوع درخواست الزامی است'),
  email: yup
    .string()
    .required('ایمیل الزامی است')
    .email('فرمت ایمیل نامعتبر است'),
  phone: yup
    .string()
    .required('شماره تماس الزامی است')
    .matches(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد'),
  message: yup
    .string()
    .required('متن پیام الزامی است')
    .min(10, 'متن پیام باید حداقل ۱۰ کاراکتر باشد')
    .max(500, 'متن پیام نباید بیشتر از ۵۰۰ کاراکتر باشد')
});
