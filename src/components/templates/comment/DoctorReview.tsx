"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DoctorHeader from '@/components/templates/comment/DoctorHeader';
import StarRatingInput from '@/components/templates/comment/StarRatingInput';
import RecommendButton from '@/components/templates/comment/RecommendButton';
import Success from '@/components/templates/comment/Success';
import { yupResolver } from '@hookform/resolvers/yup';
import reviewSchema from '@/lib/validations/reviewSchema';
import { DoctorData, ReviewFormData } from '@/types/doctorReview';

// 📝 Main review component
const DoctorReview = ({ doctorData, onSubmitReview }: { doctorData: DoctorData; onSubmitReview?: (data: ReviewFormData) => Promise<void> }) => {
  const [mode, setMode] = useState<'review' | 'submitted'>('review');
  const [loading, setLoading] = useState(false);

  const { handleSubmit, watch, setValue, reset, formState: { errors, isValid } } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema) as any,
    mode: 'onChange',
    defaultValues: { rating: 0, recommendation: '' as any, comment: '' },
  });

  const { rating, recommendation, comment } = watch();

  // 🚀 Submit handler with loading state
  const onSubmit = async (data: ReviewFormData) => {
    setLoading(true);
    try {
      onSubmitReview ? await onSubmitReview(data) : await new Promise(r => setTimeout(r, 1500));
      setMode('submitted');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6" dir="rtl">
      {mode === 'submitted' ? (
        <Success onReset={() => { reset(); setMode('review'); }} />
      ) : (
        <div className="bg-neutral-30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary-200/50 overflow-hidden animate-fade-in">
          <DoctorHeader data={doctorData} />

          <div className="p-4 sm:p-6 md:p-8 ">
            {/* ⭐ Using StarRatingInput instead of StarRating */}
            <StarRatingInput
              value={rating}
              onRate={(s: number) => setValue('rating', s, { shouldValidate: true })}
              error={errors.rating?.message}
            />

            {/* 🔒 Fixed height container for recommendation section */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-sm sm:text-base font-bold text-neutral-900">
                آیا توصیه می‌کنید؟ <span className="text-primary-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <RecommendButton
                  type="recommend"
                  selected={recommendation === 'recommend'}
                  onClick={() => setValue('recommendation', 'recommend', { shouldValidate: true })}
                />
                <RecommendButton
                  type="not-recommend"
                  selected={recommendation === 'not-recommend'}
                  onClick={() => setValue('recommendation', 'not-recommend', { shouldValidate: true })}
                />
              </div>
              {/* ⚠️ Fixed height error container */}
              <div className="h-5 sm:h-6">
                {errors.recommendation && (
                  <p className="text-xs sm:text-sm text-danger-500 text-center animate-pulse">
                    {errors.recommendation.message}
                  </p>
                )}
              </div>
            </div>

            {/* 💬 Comment textarea section */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-sm sm:text-base font-bold text-neutral-900">
                نظر شما <span className="text-xs sm:text-sm text-neutral-500 font-normal">(اختیاری)</span>
              </Label>
              <Textarea
                value={comment || ''}
                onChange={(e) => setValue('comment', e.target.value, { shouldValidate: true })}
                rows={4}
                placeholder="تجربه خود را بنویسید..."
                className="text-sm sm:text-base resize-none"
              />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                <span className="text-neutral-500">از ذکر اطلاعات شخصی خودداری کنید</span>
                <span className={clsx(
                  'font-semibold transition-colors',
                  (comment?.length ?? 0) > 900 ? 'text-danger-500' : 'text-neutral-500'
                )}>
                  {comment?.length ?? 0} / 1000
                </span>
              </div>
              {/* ⚠️ Fixed height error container */}
              <div className="h-5 sm:h-6">
                {errors.comment && (
                  <p className="text-xs sm:text-sm text-danger-500 animate-pulse">
                    {errors.comment.message}
                  </p>
                )}
              </div>
            </div>

            {/* 🎯 Submit button using shadcn Button with size prop */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              size="lg"
              className="w-full cursor-pointer h-12 sm:h-14 md:h-16 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-neutral-30 border-t-transparent rounded-full animate-spin" />
                  در حال ارسال...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  ثبت نظر
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReview;
