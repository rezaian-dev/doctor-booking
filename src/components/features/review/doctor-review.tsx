'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, BadgeCheck, AlertCircle } from 'lucide-react';
import DoctorHeader    from '@/components/features/review/doctor-header';
import StarRatingInput from '@/components/features/review/star-rating-input';
import RecommendButton from '@/components/features/review/recommend-button';
import { Textarea } from '@/components/ui/textarea';
import { Button, ButtonLink } from '@/components/ui/button';
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

const MAX = 1000;

// 🔢 Numbered section header — gives the form a clear, guided, "stepped" structure
function SectionHeader({ step, title, tag, tone = 'required' }: {
  step: string; title: string; tag: string; tone?: 'required' | 'optional';
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
        {step}
      </span>
      <h3 className="text-sm sm:text-base font-bold text-neutral-900">{title}</h3>
      <span className={cn(
        'rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-medium',
        tone === 'required' ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-500',
      )}>
        {tag}
      </span>
    </div>
  );
}

const DoctorReview = ({ doctorData, onSubmitReview, isLoggedIn, alreadyReviewed = false, backHref = '/doctors' }: Props) => {
  const router = useRouter();
  const [loading,     setLoading]     = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 🔒 Prevent unauthorized submission
  const { guard } = useAuthGuard(isLoggedIn);

  const { handleSubmit, watch, setValue, formState: { errors } } =
    useForm<ReviewFormData>({
      resolver: zodResolver(reviewSchema),
      mode: 'onChange',
      defaultValues: { rating: 0, recommendation: '' as ReviewFormData['recommendation'], comment: '' },
    });

  const { rating, recommendation, comment } = watch();
  const commentLen = comment?.length ?? 0;
  const busy = loading || redirecting;

  const onSubmit = async (data: ReviewFormData) => {
    // 🔒 Guard: show Sonner toast if not logged in
    guard(async () => {
      setLoading(true);
      setSubmitError(null);
      try {
        await (onSubmitReview?.(data) ?? new Promise(r => setTimeout(r, 1500)));
        // ✅ Submitted → confirm + go back to the doctor profile (its own skeleton covers the load). 🔙
        setRedirecting(true); // 🔁 button reads «در حال انتقال…», never a stuck «در حال ارسال»
        toast.success('نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود.');
        router.push(backHref);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'مشکلی پیش آمد، دوباره تلاش کنید');
        setLoading(false); // 🔁 re-enable only on failure
      }
    });
  };

  // 🔒 Already reviewed → never show a blank form; the server enforces this too
  if (alreadyReviewed) return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6" dir="rtl">
      <div className="bg-neutral-30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary-200/50 ring-1 ring-primary-100/60 overflow-hidden animate-fade-in">
        <DoctorHeader data={doctorData} />
        <div className="p-8 sm:p-10 md:p-12 text-center space-y-4">
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

  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6" dir="rtl">
      <div className="bg-neutral-30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary-200/50 ring-1 ring-primary-100/60 overflow-hidden animate-fade-in">
        <DoctorHeader data={doctorData} />

        <div className="p-4 sm:p-6 md:p-7 space-y-5 sm:space-y-6">

          {/* 💬 Warm intro */}
          <p className="text-center text-xs sm:text-sm text-neutral-500 leading-6">
            تجربه‌تان را صادقانه به اشتراک بگذارید؛ نظر شما به دیگران در انتخابی بهتر کمک می‌کند. 🌿
          </p>

          {/* ① Rating */}
          <section className="rounded-2xl border border-neutral-100 bg-linear-to-b from-amber-50/40 to-transparent p-4 sm:p-5 space-y-2">
            <SectionHeader step="۱" title="امتیاز شما" tag="الزامی" />
            <StarRatingInput
              value={rating}
              onRate={s => setValue('rating', s, { shouldValidate: true })}
              error={errors.rating?.message}
            />
          </section>

          {/* ② Recommendation */}
          <section className="rounded-2xl border border-neutral-100 bg-neutral-50/40 p-4 sm:p-5 space-y-3.5">
            <SectionHeader step="۲" title="آیا توصیه می‌کنید؟" tag="الزامی" />
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
            <p
              role="alert"
              aria-live="polite"
              className="h-4 text-xs text-danger-500 text-center transition-opacity duration-200"
              style={{ opacity: errors.recommendation ? 1 : 0 }}
            >
              {errors.recommendation?.message ?? '‌'}
            </p>
          </section>

          {/* ③ Comment */}
          <section className="rounded-2xl border border-neutral-100 bg-neutral-50/40 p-4 sm:p-5 space-y-3">
            <SectionHeader step="۳" title="نظر شما" tag="اختیاری" tone="optional" />

            <div className="space-y-2">
              <Textarea
                value={comment ?? ''}
                onChange={e => setValue('comment', e.target.value.slice(0, MAX), { shouldValidate: true })}
                rows={4}
                maxLength={MAX}
                placeholder="تجربه خود را بنویسید…"
                className="min-h-28 resize-none rounded-xl border-neutral-200 bg-neutral-30 text-sm sm:text-base focus-visible:border-primary-400 focus-visible:ring-primary-400/30"
              />

              {/* 📊 Subtle length progress */}
              <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={cn('h-full rounded-full transition-all duration-300',
                    commentLen > 900 ? 'bg-danger-400' : 'bg-primary-400')}
                  style={{ width: `${Math.min(100, (commentLen / MAX) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <span className="text-neutral-400">از ذکر اطلاعات شخصی خودداری کنید</span>
                <span className={cn('font-semibold tabular-nums transition-colors',
                  commentLen > 900 ? 'text-danger-500' : 'text-neutral-400')}>
                  {commentLen} / {MAX}
                </span>
              </div>
            </div>
          </section>

          {/* ⚠️ Submit error */}
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-danger-100 bg-danger-50 px-3 py-2.5 text-sm text-danger-600 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* 🚀 Submit */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={busy}
            size="lg"
            className="w-full cursor-pointer h-12 sm:h-14 md:h-15 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-60 shadow-lg shadow-primary-300/40 hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            {busy ? (
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-neutral-30 border-t-transparent rounded-full animate-spin" />
                {redirecting ? 'در حال انتقال…' : 'در حال ارسال…'}
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
