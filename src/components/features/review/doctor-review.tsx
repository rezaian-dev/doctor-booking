'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, BadgeCheck } from 'lucide-react';
import Success         from '@/components/features/review/success';
import DoctorHeader    from '@/components/features/review/doctor-header';
import StarRatingInput from '@/components/features/review/star-rating-input';
import RecommendButton from '@/components/features/review/recommend-button';
import { Label }    from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button, ButtonLink }   from '@/components/ui/button';
import { reviewSchema }   from '@/lib/validations/review';
import { DoctorData }     from '@/types/doctor';
import { ReviewFormData } from '@/types/review';
import { useAuthGuard }   from '@/hooks/use-auth-guard';

type Props = {
  doctorData:      DoctorData;
  onSubmitReview?: (data: ReviewFormData) => Promise<void>;
  /** Pass from server when auth state is known — avoids extra client fetch */
  isLoggedIn?:     boolean;
  /** 🔒 User already reviewed this doctor → lock the form (one review per doctor) */
  alreadyReviewed?: boolean;
  /** 🔙 Where the "back" button points (e.g. the doctor profile) */
  backHref?:        string;
};

const DoctorReview = ({ doctorData, onSubmitReview, isLoggedIn, alreadyReviewed = false, backHref = '/doctors' }: Props) => {
  const [submitted,   setSubmitted]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 🔒 Prevent unauthorized submission
  const { guard } = useAuthGuard(isLoggedIn);

  const { handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<ReviewFormData>({
      resolver: zodResolver(reviewSchema),
      mode: 'onChange',
      defaultValues: { rating: 0, recommendation: '' as ReviewFormData['recommendation'], comment: '' },
    });

  const { rating, recommendation, comment } = watch();

  const onSubmit = async (data: ReviewFormData) => {
    // 🔒 Guard: show Sonner toast if not logged in
    guard(async () => {
      setLoading(true);
      setSubmitError(null);
      try {
        await (onSubmitReview?.(data) ?? new Promise(r => setTimeout(r, 1500)));
        setSubmitted(true);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'مشکلی پیش آمد، دوباره تلاش کنید');
      } finally {
        setLoading(false);
      }
    });
  };

  const handleReset = () => { reset(); setSubmitted(false); };

  // 🔒 Already reviewed → never show a blank form; the server enforces this too
  if (alreadyReviewed && !submitted) return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6" dir="rtl">
      <div className="bg-neutral-30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary-200/50 overflow-hidden animate-fade-in">
        <DoctorHeader data={doctorData} />
        <div className="p-8 sm:p-10 md:p-12 text-center space-y-4">
          {/* ✅ Confirmation icon */}
          <div className="inline-flex w-16 h-16 sm:w-18 sm:h-18 bg-secondary-500 rounded-full items-center justify-center">
            <BadgeCheck className="w-8 h-8 sm:w-9 sm:h-9 text-neutral-30" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">شما قبلاً نظر داده‌اید</h2>
          <p className="text-sm sm:text-base text-neutral-600">
            برای هر پزشک تنها یک‌بار می‌توانید نظر ثبت کنید.
          </p>
          <ButtonLink
            href={backHref}
            size="lg"
            className="bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-neutral-30 px-6 sm:px-8 h-12 sm:h-14 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            بازگشت به پروفایل پزشک
          </ButtonLink>
        </div>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6" dir="rtl">
      <Success onReset={handleReset} />
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6" dir="rtl">
      <div className="bg-neutral-30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary-200/50 overflow-hidden animate-fade-in">
        <DoctorHeader data={doctorData} />

        <div className="p-4 sm:p-6 md:p-8 space-y-6">

          {/* ⭐ Rating */}
          <StarRatingInput
            value={rating}
            onRate={s => setValue('rating', s, { shouldValidate: true })}
            error={errors.rating?.message}
          />

          {/* 👍 Recommendation */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-sm sm:text-base font-bold text-neutral-900">
              آیا توصیه می‌کنید؟ <span className="text-primary-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {(['recommend', 'not-recommend'] as const).map(type => (
                <RecommendButton
                  key={type}
                  type={type}
                  selected={recommendation === type}
                  onClick={() => setValue('recommendation', type, { shouldValidate: true })}
                />
              ))}
            </div>
            {/* ⚠️ Reserved slot — opacity, no layout shift */}
            <p
              role="alert"
              aria-live="polite"
              className="h-5 text-xs text-danger-500 text-center transition-opacity duration-200"
              style={{ opacity: errors.recommendation ? 1 : 0 }}
            >
              {errors.recommendation?.message ?? '‌'}
            </p>
          </div>

          {/* 💬 Comment */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base font-bold text-neutral-900">
              نظر شما{' '}
              <span className="text-xs sm:text-sm text-neutral-500 font-normal">(اختیاری)</span>
            </Label>
            <Textarea
              value={comment ?? ''}
              onChange={e => setValue('comment', e.target.value, { shouldValidate: true })}
              rows={4}
              placeholder="تجربه خود را بنویسید..."
              className="text-sm sm:text-base resize-none"
            />
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
              <span className="text-neutral-500">از ذکر اطلاعات شخصی خودداری کنید</span>
              {/* 🔴 Warn when approaching limit */}
              <span className={cn('font-semibold transition-colors', (comment?.length ?? 0) > 900 ? 'text-danger-500' : 'text-neutral-500')}>
                {comment?.length ?? 0} / 1000
              </span>
            </div>
            {/* ⚠️ Reserved slot — opacity, no layout shift */}
            <p
              role="alert"
              aria-live="polite"
              className="h-5 text-xs text-danger-500 transition-opacity duration-200"
              style={{ opacity: errors.comment ? 1 : 0 }}
            >
              {errors.comment?.message ?? '‌'}
            </p>
          </div>

          {/* ⚠️ Submit error */}
          {submitError && (
            <p className="text-sm text-danger-500 text-center bg-danger-50 rounded-xl py-2 px-4">
              {submitError}
            </p>
          )}

          {/* 🚀 Submit button */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            size="lg"
            className="w-full cursor-pointer h-12 sm:h-14 md:h-16 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-neutral-30 border-t-transparent rounded-full animate-spin" />
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
    </div>
  );
};

export default DoctorReview;
