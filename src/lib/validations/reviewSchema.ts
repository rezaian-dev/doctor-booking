import * as yup from 'yup';

/**
 * 📝 Schema for doctor review form validation with Persian error messages.
 * ✅ Used in the DoctorReview component to validate user feedback.
 */
const reviewSchema = yup.object({
  // ⭐ Rating: required, min 1
  rating: yup
    .number()
    .min(1, 'لطفاً امتیاز خود را انتخاب کنید')
    .required('لطفاً امتیاز خود را انتخاب کنید'),

  // 💬 Recommendation: must be one of two options
  recommendation: yup
    .string()
    .oneOf(['recommend', 'not-recommend'] as const, 'لطفاً نظر خود را انتخاب کنید')
    .required('لطفاً نظر خود را انتخاب کنید'),

  // 📝 Optional comment with length limit
  comment: yup
    .string()
    .max(1000, 'حداکثر ۱۰۰۰ کاراکتر')
    .optional(),
});

export default reviewSchema;
