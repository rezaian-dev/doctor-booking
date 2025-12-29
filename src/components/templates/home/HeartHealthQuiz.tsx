'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

// 🎯 Quiz data structure with all questions and options
interface QuizOption {
  label: string;
  value: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  illustration: string;
  options: QuizOption[];
}

const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۱. سن شما چقدر است؟',
    illustration: '👥',
    options: [
      { label: 'کمتر از ۴۰ سال', value: 'under40' },
      { label: '۴۰ تا ۵۰ سال', value: '40-50' },
      { label: '۵۰ تا ۶۰ سال', value: '50-60' },
      { label: '۶۰ سال یا بیشتر', value: 'over60' }
    ]
  },
  {
    id: 2,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۲. جنسیت شما چیست؟',
    illustration: '⚧️',
    options: [
      { label: 'مرد', value: 'male' },
      { label: 'زن', value: 'female' }
    ]
  },
  {
    id: 3,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۳. آیا سابقه بیماری قلبی (سکته قلبی، سکته مغزی، نارسایی قلبی در بستگان درجه یک (پدر، مادر، خواهر، برادر) زیر ۶۵ سال (برای زنان) یا زیر ۵۵ سال (برای مردان) دارید؟',
    illustration: '👨‍👩‍👧‍👦',
    options: [
      { label: 'بله دارم', value: 'yes' },
      { label: 'خبر ندارم', value: 'unknown' },
      { label: 'نمیدانم', value: 'no' }
    ]
  },
  {
    id: 4,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۴. آیا سیگار میکشید یا در گذشته سیگاری بوده‌اید؟',
    illustration: '🚬',
    options: [
      { label: 'بله، در حال حاضر سیگار میکشم', value: 'current' },
      { label: 'بله، قبلاً سیگار میکشیدم ولی ترک کردم', value: 'former' },
      { label: 'خیر، هرگز سیگار نکشیده‌ام', value: 'never' }
    ]
  },
  {
    id: 5,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۵. شاخص توده بدنی (BMI) شما چقدر است؟ (وزن به کیلوگرم تقسیم بر مجذور قد به متر)',
    illustration: '📊',
    options: [
      { label: 'کمتر از ۲۵ (وزن طبیعی)', value: 'normal' },
      { label: 'بین ۲۵ تا ۲۹.۹ (اضافه وزن)', value: 'overweight' },
      { label: '۳۰ یا بیشتر (چاق)', value: 'obese' },
      { label: 'نمی‌دانم', value: 'unknown' }
    ]
  },
  {
    id: 6,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۶. آیا به طور منظم (حداقل ۳۰ دقیقه در بیشتر روزهای هفته) فعالیت بدنی متوسط تا شدید دارید؟',
    illustration: '🏃',
    options: [
      { label: 'بله', value: 'yes' },
      { label: 'خیر', value: 'no' }
    ]
  },
  {
    id: 7,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۷. آیا فشار خون بالا دارید؟',
    illustration: '❤️',
    options: [
      { label: 'بله', value: 'yes' },
      { label: 'خیر', value: 'no' },
      { label: 'نمیدانم', value: 'unknown' }
    ]
  },
  {
    id: 8,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۸. آیا کلسترول بالا دارید؟',
    illustration: '💊',
    options: [
      { label: 'بله', value: 'yes' },
      { label: 'خیر', value: 'no' },
      { label: 'نمیدانم', value: 'unknown' }
    ]
  },
  {
    id: 9,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۹. آیا دیابت دارید؟',
    illustration: '🍎',
    options: [
      { label: 'بله', value: 'yes' },
      { label: 'خیر', value: 'no' },
      { label: 'نمیدانم', value: 'unknown' }
    ]
  },
  {
    id: 10,
    question: 'لطفاً با سوالات زیر با دقت پاسخ دهید:',
    subtitle: '۱۰. آیا در قسمت سینه خود احساس درد، فشار، سنگینی یا ناراحتی می‌کنید، به خصوص در هنگام فعالیت بدنی یا استرس؟',
    illustration: '💗',
    options: [
      { label: 'بله', value: 'yes' },
      { label: 'خیر', value: 'no' }
    ]
  }
];

interface HeartHealthQuizProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const HeartHealthQuiz: React.FC<HeartHealthQuizProps> = ({ isOpen, onOpenChange }) => {
  // 🎮 State management for quiz flow
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // 🔄 Reset quiz state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentStep(0);
      setAnswers({});
    }
    onOpenChange(open);
  };

  // 🚀 Navigate to next question
  const handleNext = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // 🎉 Quiz completed - close dialog and show toast
      console.log('Quiz completed with answers:', answers);

      // ✅ Close dialog first
      handleOpenChange(false);

      // ✨ Show success toast immediately after closing
      // Using requestAnimationFrame to ensure dialog is fully closed
      requestAnimationFrame(() => {
        toast.success('تست با موفقیت انجام شد', {
          description: 'نتیجه تست به ایمیل شما ارسال خواهد شد.',
          duration: 5000,
        });
      });
    }
  };

  // ⏮️ Navigate to previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // ✅ Handle answer selection
  const handleAnswerSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [quizData[currentStep].id]: value
    }));
  };

  // 🎨 Get current question data
  const currentQuestion = quizData[currentStep];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[550px] lg:max-w-[600px] p-0 gap-0 bg-white border-0 [&>button]:hidden"
        aria-describedby="quiz-description"
      >
        {/* 🎯 DialogTitle for accessibility (hidden visually) */}
        <DialogTitle className="sr-only">
          تست سلامت اولیه قلب و عروق
        </DialogTitle>

        {/* 📝 DialogDescription for accessibility */}
        <DialogDescription id="quiz-description" className="sr-only">
          پاسخ دهی به ۱۰ سوال برای ارزیابی سلامت قلب و عروق
        </DialogDescription>

        <div className="p-4 sm:p-5 md:p-6 lg:p-7" dir="rtl">
          {/* 📌 Header with single close button */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex-1 text-center ml-8">
              تست سلامت اولیه قلب و عروق
            </h2>
            {/* ❌ Single close button (custom) */}
            <button
              onClick={() => handleOpenChange(false)}
              className="shrink-0 rounded-full p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="بستن"
              type="button"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </button>
          </div>

          {/* 📝 Question section */}
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 text-right">
              {currentQuestion.question}
            </p>
            <p className="text-sm sm:text-base font-semibold text-gray-800 text-right leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* 🖼️ Illustration area - compact responsive size */}
          <div className="flex justify-center my-3 sm:my-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl">
              {currentQuestion.illustration}
            </div>
          </div>

          {/* ✨ Options section - compact spacing */}
          <div className="space-y-2 mb-4 sm:mb-5">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerSelect(option.value)}
                type="button"
                className={`w-full p-2.5 sm:p-3 text-right rounded-lg border-2 transition-all text-xs sm:text-sm ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-gray-700">{option.label}</span>
              </button>
            ))}
          </div>

          {/* 🎯 Navigation buttons */}
          <div className="flex gap-2 mb-3 sm:mb-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                type="button"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-medium text-xs sm:text-sm"
              >
                سوال قبل
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              type="button"
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                currentAnswer
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === quizData.length - 1 ? 'ثبت پاسخ' : 'سوال بعد'}
            </button>
          </div>

          {/* 📊 Progress indicator */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-600">
                سوال {currentStep + 1} از {quizData.length}
              </span>
              <span className="text-xs text-gray-600">
                {Math.round(((currentStep + 1) / quizData.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / quizData.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeartHealthQuiz;
